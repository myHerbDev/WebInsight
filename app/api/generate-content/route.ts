import { NextResponse } from "next/server"
import { supabaseAdmin, safeDbOperation, isSupabaseAvailable } from "@/lib/supabase-db"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: Request) {
  try {
    const { analysisId, contentType, tone, customPrompt, websiteData } = await request.json()

    if (!contentType || !tone) {
      return NextResponse.json({ error: "Content type and tone are required" }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 503 })
    }

    console.log(`Generating ${contentType} content with ${tone} tone`)

    // Create content generation prompt
    const prompt = createContentPrompt(contentType, tone, customPrompt, websiteData)

    // Generate content using Groq
    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt,
      maxTokens: 2000,
      temperature: 0.7,
    })

    // Parse and format the generated content
    const generatedContent = {
      content: text.trim(),
      markdown: formatAsMarkdown(text.trim(), contentType),
      contentType,
      tone,
      analysisId: analysisId || null,
      createdAt: new Date().toISOString(),
    }

    // Save to Supabase (only if available)
    let savedContent = { id: Date.now().toString(), ...generatedContent }
    if (isSupabaseAvailable() && analysisId) {
      savedContent = await safeDbOperation(
        async () => {
          const { data, error } = await supabaseAdmin
            .from("generated_content")
            .insert([
              {
                analysis_id: analysisId,
                content_type: contentType,
                tone,
                content: generatedContent.content,
                markdown: generatedContent.markdown,
                created_at: generatedContent.createdAt,
              },
            ])
            .select()
            .single()

          if (error) throw error
          return data
        },
        { id: Date.now().toString(), ...generatedContent },
        "Error saving generated content to database",
      )
    } else {
      console.log("Supabase not available or no analysis ID - content not saved to database")
    }

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
  // Add markdown formatting based on content type
  const lines = content.split("\n")
  let markdown = ""

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) {
      markdown += "\n"
      continue
    }

    // Detect and format headings
    if (line.match(/^(Introduction|Conclusion|Summary|Overview|Key Features|Benefits|Analysis)/i)) {
      markdown += `## ${line}\n\n`
    } else if (line.match(/^\d+\./)) {
      // Numbered lists
      markdown += `${line}\n`
    } else if (line.match(/^[-•]/)) {
      // Bullet points
      markdown += `- ${line.replace(/^[-•]\s*/, "")}\n`
    } else {
      // Regular paragraphs
      markdown += `${line}\n\n`
    }
  }

  return markdown.trim()
}
