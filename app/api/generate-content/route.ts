import { NextResponse } from "next/server"
import { sql, safeDbOperation, isNeonAvailable } from "@/lib/neon-db"
import { redis, safeRedisOperation, CACHE_KEYS, CACHE_TTL } from "@/lib/upstash-redis"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { randomBytes } from "crypto"

export async function POST(request: Request) {
  try {
    // Enhanced request body parsing
    let requestBody
    try {
      const bodyText = await request.text()
      console.log("Content generation request body length:", bodyText.length)

      if (!bodyText || !bodyText.trim()) {
        return NextResponse.json({ error: "Request body is required" }, { status: 400 })
      }

      // Validate JSON structure
      if (!bodyText.trim().startsWith("{")) {
        return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 })
      }

      requestBody = JSON.parse(bodyText)

      // Validate required fields
      if (!requestBody.contentType || !requestBody.tone) {
        return NextResponse.json(
          {
            error: "Missing required fields: contentType and tone",
          },
          { status: 400 },
        )
      }
    } catch (parseError: any) {
      console.error("JSON parsing error in content generation:", parseError)
      return NextResponse.json(
        {
          error: "Invalid JSON in request body",
          details: parseError.message,
        },
        { status: 400 },
      )
    }

    const { analysisId, contentType, tone, customPrompt, websiteData } = requestBody

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 503 })
    }

    // Check cache first
    const cacheKey = CACHE_KEYS.GENERATED_CONTENT(`${analysisId}-${contentType}-${tone}`)
    const cachedContent = await safeRedisOperation(
      async () => {
        const cached = await redis!.get(cacheKey)
        return cached ? JSON.parse(cached as string) : null
      },
      null,
      "Error checking content cache",
    )

    if (cachedContent) {
      return NextResponse.json({
        success: true,
        content: cachedContent,
      })
    }

    // Enhanced AI content generation with validation
    let aiResponse
    try {
      console.log(`Generating ${contentType} content with ${tone} tone`)

      const prompt = createContentPrompt(contentType, tone, customPrompt, websiteData)

      const result = await generateText({
        model: groq("llama3-70b-8192"),
        prompt,
        maxTokens: 2000,
        temperature: 0.7,
      })

      aiResponse = result.text

      // Validate AI response
      if (!aiResponse || typeof aiResponse !== "string" || aiResponse.trim().length === 0) {
        throw new Error("Empty or invalid AI response")
      }

      console.log("AI content generated successfully, length:", aiResponse.length)
    } catch (aiError: any) {
      console.error("AI generation error:", aiError)
      return NextResponse.json(
        {
          error: "Failed to generate content",
          message: "AI service temporarily unavailable",
        },
        { status: 503 },
      )
    }

    // Parse and format the generated content
    const contentId = randomBytes(16).toString("hex")
    const generatedContent = {
      id: contentId,
      content: aiResponse.trim(),
      markdown: formatAsMarkdown(aiResponse.trim(), contentType),
      contentType,
      tone,
      analysisId: analysisId || null,
      createdAt: new Date().toISOString(),
    }

    // Save to Neon database (only if available and analysisId exists)
    let savedContent = generatedContent
    if (isNeonAvailable() && analysisId) {
      savedContent = await safeDbOperation(
        async () => {
          await sql`
            INSERT INTO generated_content (
              id, analysis_id, content_type, tone, content, markdown, created_at
            ) VALUES (
              ${contentId}, ${analysisId}, ${contentType}, ${tone}, 
              ${generatedContent.content}, ${generatedContent.markdown}, 
              ${generatedContent.createdAt}
            )
          `
          return generatedContent
        },
        generatedContent,
        "Error saving generated content to database",
      )
    }

    // Cache the result
    await safeRedisOperation(
      async () => {
        await redis!.setex(cacheKey, CACHE_TTL.GENERATED_CONTENT, JSON.stringify(savedContent))
      },
      undefined,
      "Error caching generated content",
    )

    return NextResponse.json({
      success: true,
      content: savedContent,
    })
  } catch (error: any) {
    console.error("Content generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate content",
        message: error.message || "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

function createContentPrompt(contentType: string, tone: string, customPrompt?: string, websiteData?: any): string {
  const baseContext = websiteData
    ? `
Website: ${websiteData.title || "Unknown"}
Summary: ${websiteData.summary || "No summary available"}
Key Points: ${websiteData.keyPoints?.join(", ") || "None"}
Keywords: ${websiteData.keywords?.join(", ") || "None"}
`
    : ""

  const contentPrompts = {
    "blog-post": `Write a comprehensive blog post about this website. Include an engaging introduction, detailed analysis, and actionable insights.`,
    "social-media": `Create engaging social media posts (Twitter, LinkedIn, Facebook) highlighting the key features and benefits.`,
    newsletter: `Write a newsletter section featuring this website, including why it's noteworthy and what readers can learn from it.`,
    "press-release": `Create a professional press release announcing or featuring this website and its unique value proposition.`,
    summary: `Provide a concise executive summary of this website's purpose, features, and target audience.`,
    review: `Write a detailed review of this website, covering usability, design, content quality, and overall user experience.`,
    comparison: `Create a comparative analysis highlighting this website's strengths and areas for improvement.`,
    "seo-content": `Generate SEO-optimized content about this website, including meta descriptions, headings, and keyword-rich paragraphs.`,
  }

  const toneInstructions = {
    professional: "Use a professional, business-appropriate tone with industry terminology.",
    casual: "Write in a conversational, friendly tone that's easy to understand.",
    technical: "Use technical language and detailed explanations suitable for experts.",
    creative: "Be creative and engaging with vivid descriptions and storytelling elements.",
    persuasive: "Focus on convincing the reader of the website's value and benefits.",
    informative: "Provide clear, factual information in an educational manner.",
  }

  return `${baseContext}

${customPrompt || contentPrompts[contentType as keyof typeof contentPrompts] || contentPrompts.summary}

Tone: ${toneInstructions[tone as keyof typeof toneInstructions] || toneInstructions.professional}

Please provide well-structured, high-quality content that is engaging and valuable to the reader.`
}

function formatAsMarkdown(content: string, contentType: string): string {
  const lines = content.split("\n")
  let markdown = ""

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) {
      markdown += "\n"
      continue
    }

    if (line.match(/^(Introduction|Conclusion|Summary|Overview|Key Features|Benefits|Analysis)/i)) {
      markdown += `## ${line}\n\n`
    } else if (line.match(/^\d+\./)) {
      markdown += `${line}\n`
    } else if (line.match(/^[-•]/)) {
      markdown += `- ${line.replace(/^[-•]\s*/, "")}\n`
    } else {
      markdown += `${line}\n\n`
    }
  }

  return markdown.trim()
}
