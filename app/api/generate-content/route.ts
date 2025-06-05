import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { randomBytes } from "crypto"
import { structureProfessionalContent } from "@/lib/content-structure"
import { safeJsonParse } from "@/lib/safe-json"
import { safeAsyncOperation, validateRequired } from "@/lib/error-boundary"

export async function POST(request: NextRequest) {
  try {
    console.log("Starting content generation request")

    let requestData
    try {
      const body = await request.text()
      if (!body || !body.trim()) {
        return NextResponse.json({ error: "Request body is empty" }, { status: 400 })
      }

      requestData = safeJsonParse(body, null)
      if (!requestData) {
        return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
      }
    } catch (error) {
      console.error("Request parsing error:", error)
      return NextResponse.json({ error: "Failed to parse request body" }, { status: 400 })
    }

    try {
      validateRequired(requestData.contentType, "contentType")
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const { contentType, websiteData, customPrompt, tone = "professional" } = requestData

    if (!process.env.XAI_API_KEY) {
      console.error("XAI_API_KEY not configured")
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 })
    }

    const contentResult = await safeAsyncOperation(
      async () => {
        let prompt = ""

        switch (contentType) {
          case "blog-post":
            prompt = `Write a comprehensive blog post about the website analysis for ${websiteData?.url || "the analyzed website"}. 
            
Website Details:
- Title: ${websiteData?.title || "Website"}
- Summary: ${websiteData?.summary || "Analysis completed"}
- Key Points: ${websiteData?.keyPoints?.join(", ") || "No key points"}
- Performance Score: ${websiteData?.performance_score || 0}
- Sustainability Score: ${websiteData?.sustainability_score || 0}

Create an engaging blog post with proper headings, introduction, main content, and conclusion.`
            break

          case "social-media":
            prompt = `Create engaging social media posts about the website analysis for ${websiteData?.url || "the analyzed website"}.

Website Details:
- Title: ${websiteData?.title || "Website"}
- Summary: ${websiteData?.summary || "Analysis completed"}
- Performance Score: ${websiteData?.performance_score || 0}

Create 3 different social media posts for different platforms (Twitter, LinkedIn, Facebook).`
            break

          case "email-campaign":
            prompt = `Create an email campaign about the website analysis for ${websiteData?.url || "the analyzed website"}.

Website Details:
- Title: ${websiteData?.title || "Website"}
- Summary: ${websiteData?.summary || "Analysis completed"}
- Key Improvements: ${websiteData?.improvements?.join(", ") || "No improvements"}

Create a professional email with subject line and body content.`
            break

          case "custom":
            prompt = customPrompt || "Generate content based on the website analysis data."
            break

          default:
            prompt = `Generate content about the website analysis for ${websiteData?.url || "the analyzed website"}.`
        }

        const result = await generateText({
          model: xai("grok-beta"),
          prompt,
          maxTokens: 1500,
          temperature: 0.3,
        })

        return result.text
      },
      null,
      "Failed to generate content",
    )

    if (!contentResult) {
      return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
    }

    const contentId = randomBytes(16).toString("hex")
    const structuredContent = structureProfessionalContent(contentResult.trim(), contentType)

    const responseData = {
      success: true,
      content: {
        id: contentId,
        title: `Generated ${contentType} Content`,
        content: structuredContent.content,
        markdown: structuredContent.markdown,
        summary: structuredContent.summary,
        keyPoints: structuredContent.keyPoints,
        contentType,
        tone,
        createdAt: new Date().toISOString(),
        websiteUrl: websiteData?.url || null,
        wordCount: structuredContent.wordCount,
        readingTime: structuredContent.readingTime,
      },
    }

    console.log("Content generation completed successfully")
    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error("Content generation error:", error)
    return NextResponse.json({ error: "Internal server error during content generation" }, { status: 500 })
  }
}
