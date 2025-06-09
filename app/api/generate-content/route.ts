import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai" // Using xAI for content generation
import { sql, safeDbOperation, isNeonAvailable } from "@/lib/neon-db"
import { createErrorResponse, validateJsonInput, SafeError } from "@/lib/error-handler"
import { structureProfessionalContent } from "@/lib/content-structure"
import type { WebsiteData } from "@/types/website-data"

function createXaiPrompt(
  contentType: string,
  tone: string,
  customPrompt?: string,
  websiteData?: WebsiteData | null,
): string {
  let context = "You are an expert content creator and sustainability analyst.\n"
  if (websiteData) {
    context += `
        Based on the analysis of the website: ${websiteData.url} (Title: ${websiteData.title})
        Key Metrics:
        - Sustainability Score: ${websiteData.sustainability_score || websiteData.sustainability?.score}%
        - Performance Score: ${websiteData.performance_score}%
        - Security Score: ${websiteData.security_score}%
        - Content Quality: ${websiteData.content_quality_score}%
        Summary: ${websiteData.summary}
        Key Findings: ${websiteData.keyPoints?.join(", ")}
        Keywords: ${websiteData.keywords?.join(", ")}
        Recommended Improvements: ${websiteData.improvements?.join(", ")}
        `
  }

  context += `\nGenerate content for the following request:
    Content Type: "${contentType}"
    Tone: "${tone}"
    `

  if (customPrompt) {
    context += `Custom Instructions: "${customPrompt}"\n`
  }

  context += `\nPlease provide a comprehensive and well-structured response. If the request implies a document structure (e.g., report, audit), use appropriate headings (Markdown H2, H3). Ensure the output is engaging and directly addresses the request.`

  // Specific instructions for certain content types
  if (contentType === "sustainability-report") {
    context +=
      "\nThe sustainability report should include sections like Introduction, Current Impact Assessment, Key Metrics Analysis, Recommendations for Improvement, and Conclusion."
  } else if (contentType === "seo-strategy") {
    context += "\nThe SEO strategy should cover on-page, off-page, and technical SEO aspects, with actionable steps."
  }

  context += "\nBegin the content directly without any preamble like 'Here is the content you requested:'."
  return context
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    validateJsonInput(body, ["contentType", "tone"])
    const {
      analysisId, // Optional: ID of the analysis this content is based on
      contentType,
      tone,
      customPrompt,
      websiteData, // Full WebsiteData object can be passed
    } = body as {
      analysisId?: string
      contentType: string
      tone: string
      customPrompt?: string
      websiteData?: WebsiteData | null
    }

    if (!process.env.XAI_API_KEY) {
      throw new SafeError("AI service (xAI) is not configured.", "AI_CONFIG_ERROR", 503)
    }

    const xaiPrompt = createXaiPrompt(contentType, tone, customPrompt, websiteData)

    let aiRawResponse: string
    try {
      const { text } = await generateText({
        model: xai("grok-1.5-flash"), // Using Grok Flash for speed and capability
        prompt: xaiPrompt,
        maxTokens: 3500, // Adjust as needed
        temperature: 0.5, // Balanced temperature
      })
      aiRawResponse = text
    } catch (aiError: any) {
      console.error("xAI API Error:", aiError)
      throw new SafeError(`AI content generation failed: ${aiError.message}`, "AI_GENERATION_ERROR", 503)
    }

    if (!aiRawResponse || aiRawResponse.trim() === "") {
      throw new SafeError("AI returned an empty response.", "AI_EMPTY_RESPONSE", 500)
    }

    const structuredAiContent = structureProfessionalContent(aiRawResponse, contentType, tone, websiteData)

    // Optionally save to DB if analysisId is present
    if (isNeonAvailable() && analysisId && structuredAiContent.id) {
      await safeDbOperation(
        () => sql`
                    INSERT INTO generated_content (id, analysis_id, content_type, tone, title, summary, markdown_content, data_json, created_at)
                    VALUES (${structuredAiContent.id}, ${analysisId}, ${contentType}, ${tone}, ${structuredAiContent.title}, ${structuredAiContent.summary}, ${structuredAiContent.markdown}, ${JSON.stringify(structuredAiContent)}, NOW())
                `,
        null,
        "Failed to save generated content to DB",
      )
    }

    return NextResponse.json({ success: true, content: structuredAiContent })
  } catch (error) {
    return createErrorResponse(error, "Failed to generate AI content")
  }
}
