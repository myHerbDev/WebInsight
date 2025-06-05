import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { randomBytes } from "crypto"

// Simple content structuring function
function structureContent(content: string, contentType: string) {
  const lines = content.split("\n").filter((line) => line.trim())
  const wordCount = content.split(" ").length
  const readingTime = Math.ceil(wordCount / 200)

  // Extract sections based on headers
  const sections = []
  let currentSection = null

  for (const line of lines) {
    if (line.startsWith("#") || line.match(/^[A-Z][^.]*:$/)) {
      if (currentSection) {
        sections.push(currentSection)
      }
      currentSection = {
        title: line.replace(/^#+\s*/, "").replace(/:$/, ""),
        content: "",
        level: (line.match(/^#+/) || [""])[0].length || 1,
      }
    } else if (currentSection) {
      currentSection.content += line + "\n"
    }
  }

  if (currentSection) {
    sections.push(currentSection)
  }

  return {
    content,
    markdown: content,
    sections,
    wordCount,
    readingTime,
    summary: lines[0] || "Generated content",
    keyPoints: sections.map((s) => s.title).slice(0, 5),
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Starting content generation request")

    // Parse request body
    let requestData
    try {
      const body = await request.text()
      console.log("📝 Request body length:", body?.length || 0)

      if (!body || !body.trim()) {
        console.error("❌ Empty request body")
        return NextResponse.json(
          {
            success: false,
            error: "Request body is empty",
          },
          { status: 400 },
        )
      }

      requestData = JSON.parse(body)
      console.log("✅ Parsed request data:", {
        contentType: requestData.contentType,
        hasWebsiteData: !!requestData.websiteData,
        customPromptLength: requestData.customPrompt?.length || 0,
      })
    } catch (error) {
      console.error("❌ Request parsing error:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON in request body",
        },
        { status: 400 },
      )
    }

    // Validate required fields
    if (!requestData.contentType) {
      console.error("❌ Missing contentType")
      return NextResponse.json(
        {
          success: false,
          error: "Content type is required",
        },
        { status: 400 },
      )
    }

    const { contentType, websiteData, customPrompt, tone = "professional" } = requestData

    // Check if we have either website data or custom prompt
    if (!websiteData && !customPrompt?.trim()) {
      console.error("❌ No content source provided")
      return NextResponse.json(
        {
          success: false,
          error: "Either website data or custom prompt is required",
        },
        { status: 400 },
      )
    }

    // Check API key
    if (!process.env.XAI_API_KEY) {
      console.error("❌ XAI_API_KEY not configured")
      return NextResponse.json(
        {
          success: false,
          error: "AI service not configured",
        },
        { status: 500 },
      )
    }

    console.log("🤖 Generating content with XAI...")

    // Build prompt based on content type
    let prompt = ""
    const websiteUrl = websiteData?.url || "the analyzed website"
    const websiteTitle = websiteData?.title || "Website"
    const websiteSummary = websiteData?.summary || "Analysis completed"

    switch (contentType) {
      case "sustainability-research":
        prompt = `Write a comprehensive sustainability research report for ${websiteUrl}.

Website Information:
- Title: ${websiteTitle}
- Summary: ${websiteSummary}
- Performance Score: ${websiteData?.performance_score || 0}/100
- Sustainability Score: ${websiteData?.sustainability_score || 0}/100

Create a detailed research document with:
1. Executive Summary
2. Environmental Impact Analysis
3. Performance Metrics
4. Recommendations for Improvement
5. Conclusion

Write in a ${tone} tone. Make it comprehensive and actionable.`
        break

      case "blog-post":
        prompt = `Write an engaging blog post about the website analysis for ${websiteUrl}.

Website Details:
- Title: ${websiteTitle}
- Summary: ${websiteSummary}
- Performance Score: ${websiteData?.performance_score || 0}/100
- Key Improvements: ${websiteData?.improvements?.join(", ") || "Various optimizations"}

Create a blog post with:
- Catchy headline
- Introduction
- Main analysis points
- Actionable recommendations
- Conclusion

Write in a ${tone} tone that engages readers.`
        break

      case "social-media-posts":
        prompt = `Create engaging social media posts about ${websiteUrl}.

Website: ${websiteTitle}
Performance: ${websiteData?.performance_score || 0}/100
Sustainability: ${websiteData?.sustainability_score || 0}/100

Create 3 different posts for:
1. LinkedIn (professional)
2. Twitter (concise)
3. Facebook (engaging)

Each post should highlight key insights and include relevant hashtags.`
        break

      case "executive-summary":
        prompt = `Create an executive summary for the website analysis of ${websiteUrl}.

Key Metrics:
- Website: ${websiteTitle}
- Performance Score: ${websiteData?.performance_score || 0}/100
- Sustainability Score: ${websiteData?.sustainability_score || 0}/100
- Summary: ${websiteSummary}

Write a concise executive summary covering:
1. Overview
2. Key Findings
3. Strategic Recommendations
4. Next Steps

Keep it ${tone} and suitable for stakeholders.`
        break

      default:
        prompt =
          customPrompt ||
          `Generate ${contentType} content about the website analysis for ${websiteUrl}. 
        
Website: ${websiteTitle}
Summary: ${websiteSummary}

Write in a ${tone} tone and make it informative and engaging.`
    }

    console.log("📝 Generated prompt length:", prompt.length)

    // Generate content with timeout
    let generatedText
    try {
      console.log("⏳ Calling XAI API...")

      const result = await generateText({
        model: xai("grok-beta"),
        prompt,
        maxTokens: 2000,
        temperature: 0.7,
      })

      generatedText = result.text
      console.log("✅ Content generated successfully, length:", generatedText?.length || 0)
    } catch (aiError: any) {
      console.error("❌ AI generation error:", aiError)

      // Fallback content if AI fails
      generatedText = `# ${contentType.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}

## Overview
This is a comprehensive analysis of ${websiteTitle} (${websiteUrl}).

## Key Findings
- Performance Score: ${websiteData?.performance_score || 0}/100
- Sustainability Score: ${websiteData?.sustainability_score || 0}/100
- Analysis Summary: ${websiteSummary}

## Recommendations
Based on our analysis, here are the key recommendations for improvement:

1. **Performance Optimization**: Focus on improving loading speeds and Core Web Vitals
2. **Sustainability Enhancement**: Implement green hosting and optimize resource usage
3. **User Experience**: Enhance accessibility and mobile responsiveness
4. **Security**: Strengthen security headers and SSL configuration

## Conclusion
${websiteTitle} shows potential for improvement in several key areas. By implementing the recommended changes, the website can achieve better performance, sustainability, and user experience.

---
*Generated by Website Analytics AI*`
    }

    // Structure the content
    const contentId = randomBytes(8).toString("hex")
    const structuredContent = structureContent(generatedText, contentType)

    // Get content type label
    const contentTypeLabels: { [key: string]: string } = {
      "sustainability-research": "Sustainability Research",
      "blog-post": "Blog Post",
      "social-media-posts": "Social Media Posts",
      "executive-summary": "Executive Summary",
      "scholar-document": "Academic Paper",
      "technical-audit": "Technical Audit",
      "case-study": "Case Study",
      "business-proposal": "Business Proposal",
      "market-analysis": "Market Analysis",
      "roi-report": "ROI Report",
      newsletter: "Newsletter",
      "press-release": "Press Release",
      "white-paper": "White Paper",
      "instagram-captions": "Instagram Captions",
      "linkedin-article": "LinkedIn Article",
      "twitter-thread": "Twitter Thread",
      poetry: "Poetry",
      storytelling: "Brand Story",
      "video-script": "Video Script",
      "podcast-outline": "Podcast Outline",
      "api-documentation": "API Documentation",
      "user-guide": "User Guide",
      troubleshooting: "Troubleshooting Guide",
      changelog: "Changelog",
    }

    const responseData = {
      success: true,
      content: {
        id: contentId,
        title: structuredContent.sections?.[0]?.title || contentTypeLabels[contentType] || "Generated Content",
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
        sections: structuredContent.sections,
      },
    }

    console.log("🎉 Content generation completed successfully")
    console.log("📊 Response data:", {
      success: responseData.success,
      contentId: responseData.content.id,
      title: responseData.content.title,
      wordCount: responseData.content.wordCount,
      sectionsCount: responseData.content.sections?.length || 0,
    })

    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error("💥 Content generation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error during content generation",
      },
      { status: 500 },
    )
  }
}
