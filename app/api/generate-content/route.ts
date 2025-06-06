import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { randomBytes } from "crypto"
import { saveGeneratedContent } from "@/lib/supabase-db"
import { structureProfessionalContent } from "@/lib/content-structure"

// Simple content structuring function
function structureContent(content: string, contentType: string, websiteData?: any) {
  const lines = content.split("\n").filter((line) => line.trim())
  const wordCount = content.split(" ").length
  const readingTime = Math.ceil(wordCount / 200)

  // Enhanced section extraction
  const sections = []
  let currentSection = null

  for (const line of lines) {
    if (line.match(/^#{1,6}\s+/)) {
      if (currentSection) {
        sections.push(currentSection)
      }
      const level = (line.match(/^#+/) || [""])[0].length
      currentSection = {
        title: line.replace(/^#+\s*/, ""),
        content: "",
        level: level,
      }
    } else if (currentSection) {
      currentSection.content += line + "\n"
    }
  }

  if (currentSection) {
    sections.push(currentSection)
  }

  // Extract key points from content
  const keyPoints = []
  for (const line of lines) {
    if (line.match(/^[-*•]\s+/) || line.match(/^\d+\.\s+/)) {
      const point = line
        .replace(/^[-*•]\s+/, "")
        .replace(/^\d+\.\s+/, "")
        .trim()
      if (point.length > 10) {
        keyPoints.push(point)
      }
    }
  }

  // Generate summary from first paragraph or section
  const summary =
    sections.length > 0 && sections[0].content
      ? sections[0].content.substring(0, 300) + "..."
      : "Comprehensive analysis completed with detailed insights and recommendations."

  return {
    content,
    markdown: content,
    sections,
    wordCount,
    readingTime,
    summary,
    keyPoints: keyPoints.slice(0, 8),
  }
}

function generateComprehensivePrompt(
  contentType: string,
  websiteData: any,
  customPrompt: string,
  contentStructure: string,
  tone: string,
  writingStyle: string,
) {
  const websiteUrl = websiteData?.url || "the analyzed website"
  const websiteTitle = websiteData?.title || "Website"
  const websiteSummary = websiteData?.summary || "Analysis completed"
  const performanceScore = Math.round(websiteData?.performance_score || websiteData?.sustainability?.performance || 0)
  const sustainabilityScore = Math.round(websiteData?.sustainability_score || websiteData?.sustainability?.score || 0)
  const securityScore = Math.round(websiteData?.security_score || 85)
  const contentQualityScore = Math.round(websiteData?.content_quality_score || 75)

  // Enhanced data context with properly formatted numbers
  const dataContext = `
WEBSITE ANALYSIS DATA:
- Title: ${websiteTitle}
- URL: ${websiteUrl}
- Performance Score: ${performanceScore}/100
- Sustainability Score: ${sustainabilityScore}/100
- Security Score: ${securityScore}/100
- Content Quality: ${contentQualityScore}/100
- Summary: ${websiteSummary}
- Content Stats: ${websiteData?.contentStats ? JSON.stringify(websiteData.contentStats) : "Not available"}
- Key Points: ${websiteData?.keyPoints ? websiteData.keyPoints.join(", ") : "Not available"}
- Improvements: ${websiteData?.sustainability?.improvements ? websiteData.sustainability.improvements.join(", ") : "Not available"}
`

  // Enhanced tone and style instructions
  const styleInstructions = `
TONE & STYLE REQUIREMENTS:
- Tone: ${tone} (maintain this tone consistently throughout)
- Writing Style: ${writingStyle} (use this structural approach)
- Ensure the content reflects both the ${tone} tone and ${writingStyle} writing style
- Adapt vocabulary, sentence structure, and presentation to match these requirements
`

  // If content structure is provided, use it as the primary template
  if (contentStructure && contentStructure.trim()) {
    return `Follow this EXACT content structure and fill it with relevant, detailed content:

${contentStructure}

${dataContext}

${styleInstructions}

INSTRUCTIONS:
- Follow the provided structure EXACTLY as specified
- Fill each section with comprehensive, relevant content
- Write in a ${tone} tone using ${writingStyle} writing style
- Use all available website data effectively
- Ensure content is detailed and professional (minimum 1500 words)
- Include specific metrics and data points where relevant
- Make each section substantial and informative
- Do not deviate from the provided structure
- Replace placeholder text with actual content
- Maintain consistency in tone and style throughout`
  }

  // Use custom prompt if provided (and no structure)
  if (customPrompt && customPrompt.trim()) {
    return `${customPrompt}

${dataContext}

${styleInstructions}

INSTRUCTIONS:
- Write in a ${tone} tone using ${writingStyle} writing style
- Create comprehensive, well-structured content
- Use all available data points effectively
- Follow document structure best practices
- Include executive summary, detailed analysis, and actionable recommendations
- Ensure content is detailed and professional
- Structure content with clear headings and sections
- Provide specific, data-driven insights
- Maintain consistency in tone and style throughout`
  }

  // Enhanced content type templates with tone and style integration
  const comprehensivePrompts = {
    "sustainability-research": `Create a comprehensive sustainability research report using the following structure:

${dataContext}

${styleInstructions}

# Comprehensive Sustainability Research Report

## Executive Summary
Provide a detailed 200-word executive summary highlighting key findings, environmental impact assessment, and strategic recommendations. Write in ${tone} tone with ${writingStyle} approach.

## 1. Introduction and Methodology
- Research objectives and scope
- Evaluation framework and criteria
- Data collection methodology
- Analysis tools and techniques used

## 2. Website Overview and Context
- Technical specifications: ${websiteTitle} (${websiteUrl})
- Current performance baseline: ${Math.round(performanceScore)}/100
- Sustainability baseline: ${Math.round(sustainabilityScore)}/100
- Security and quality metrics: ${Math.round(securityScore)}/100, ${Math.round(contentQualityScore)}/100

## 3. Environmental Impact Analysis
### 3.1 Carbon Footprint Assessment
- Data transfer analysis and energy consumption
- Server efficiency and hosting infrastructure
- Resource optimization opportunities

### 3.2 Sustainability Metrics Deep Dive
- Performance impact on energy usage
- Resource efficiency analysis
- Green hosting and renewable energy considerations

## 4. Performance and Sustainability Correlation
- How performance improvements reduce environmental impact
- Optimization strategies with dual benefits
- Cost-benefit analysis of green improvements

## 5. Industry Benchmarking
- Comparison with industry standards
- Best practices from leading sustainable websites
- Competitive analysis and positioning

## 6. Strategic Recommendations
### 6.1 Immediate Actions (0-30 days)
- Quick wins for sustainability improvement
- Low-cost, high-impact optimizations

### 6.2 Medium-term Initiatives (1-6 months)
- Infrastructure improvements
- Hosting and architecture changes

### 6.3 Long-term Strategy (6-24 months)
- Comprehensive sustainability transformation
- Advanced optimization techniques

## 7. Implementation Roadmap
- Detailed timeline and milestones
- Resource requirements and budget considerations
- Success metrics and KPIs

## 8. Conclusion and Future Outlook
- Summary of key findings and recommendations
- Long-term sustainability vision
- Continuous improvement framework

Write in a ${tone} tone using ${writingStyle} style with scientific rigor, data-driven insights, and comprehensive analysis. Include specific metrics, calculations, and actionable recommendations throughout.`,

    default: `Generate comprehensive ${contentType} content with the following structure:

${dataContext}

${styleInstructions}

Create detailed, well-structured content that:
1. Uses all available website data effectively
2. Provides comprehensive analysis and insights
3. Includes executive summary, detailed findings, and recommendations
4. Follows professional document structure best practices
5. Incorporates specific metrics and data points
6. Offers actionable, prioritized recommendations
7. Maintains ${tone} tone and ${writingStyle} writing style throughout

Structure the content with clear headings, subheadings, and logical flow. Include specific data points, metrics, and actionable insights based on the website analysis results.`,
  }

  return comprehensivePrompts[contentType as keyof typeof comprehensivePrompts] || comprehensivePrompts.default
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
        tone: requestData.tone,
        writingStyle: requestData.writingStyle,
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
    if (!requestData.contentType && !requestData.customPrompt) {
      console.error("❌ Missing contentType or customPrompt")
      return NextResponse.json(
        {
          success: false,
          error: "Either content type or custom prompt is required",
        },
        { status: 400 },
      )
    }

    const {
      contentType,
      websiteData,
      customPrompt,
      contentStructure,
      tone = "professional",
      writingStyle = "analytical",
    } = requestData

    // Check if we have either website data, custom prompt, or content structure
    if (!websiteData && !customPrompt?.trim() && !contentStructure?.trim()) {
      console.error("❌ No content source provided")
      return NextResponse.json(
        {
          success: false,
          error: "Either website data, custom prompt, or content structure is required",
        },
        { status: 400 },
      )
    }

    console.log("🤖 Generating content...")

    // Build prompt based on content type
    let prompt
    if (contentType === "seo-optimized-content") {
      // Use the custom prompt directly for SEO content
      prompt = customPrompt
    } else {
      // Generate prompt based on content type with tone and writing style
      prompt = generateComprehensivePrompt(contentType, websiteData, customPrompt, contentStructure, tone, writingStyle)
    }

    console.log("📝 Generated prompt length:", prompt.length)

    // Generate content with AI or fallback
    let generatedText
    try {
      if (process.env.XAI_API_KEY) {
        console.log("⏳ Calling XAI API...")
        const result = await generateText({
          model: xai("grok-beta"),
          prompt,
          maxTokens: contentType === "seo-optimized-content" ? 4000 : 2000,
          temperature: 0.7,
        })
        generatedText = result.text
        console.log("✅ Content generated successfully, length:", generatedText?.length || 0)
      } else {
        throw new Error("XAI_API_KEY not configured")
      }
    } catch (aiError) {
      console.error("❌ AI generation error:", aiError)

      // Fallback content with tone and style
      generatedText = `# ${contentType === "seo-optimized-content" ? "SEO-Optimized Content" : contentType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}

## Introduction
This is a comprehensive analysis of ${websiteData?.title || websiteData?.url || "the website"} written in ${tone} tone with ${writingStyle} style.

## Key Points
- Website: ${websiteData?.title || websiteData?.url || "Not specified"}
- Industry: ${websiteData?.category || "Not specified"}
- Performance Score: ${websiteData?.performance_score || 0}/100
- Sustainability Score: ${websiteData?.sustainability_score || 0}/100
- Tone: ${tone}
- Writing Style: ${writingStyle}

## Analysis
The website shows potential for improvement in several key areas. By implementing the recommended changes, the website can achieve better performance, sustainability, and user experience.

## Recommendations
1. **Performance Optimization**: Focus on improving loading speeds and Core Web Vitals
2. **Sustainability Enhancement**: Implement green hosting and optimize resource usage
3. **User Experience**: Enhance accessibility and mobile responsiveness
4. **Security**: Strengthen security headers and SSL configuration

## Conclusion
With targeted improvements, the website can significantly enhance its online presence and user experience.

---
SEO Title: Comprehensive Analysis and Optimization Guide for ${websiteData?.title || "Your Website"}
Meta Description: Discover key insights and actionable recommendations to improve performance, sustainability, and user experience for ${websiteData?.title || "your website"}.`
      console.log("🔄 Using fallback content")
    }

    // Structure the content
    const contentId = randomBytes(8).toString("hex")
    let structuredContent

    if (contentType === "seo-optimized-content") {
      structuredContent = structureContent(generatedText, contentType, websiteData)
    } else {
      structuredContent = structureProfessionalContent(generatedText, contentType, websiteData)
    }

    // Get content type label
    const contentTypeLabels: { [key: string]: string } = {
      "seo-optimized-content": "SEO-Optimized Content",
      "sustainability-research": "Sustainability Research Report",
      "scholar-document": "Academic Research Paper",
      "technical-audit": "Technical Audit Report",
      "case-study": "Case Study Analysis",
      "executive-summary": "Executive Summary",
      "business-proposal": "Business Proposal",
      "market-analysis": "Market Analysis Report",
      "roi-report": "ROI Analysis Report",
      "blog-post": "Blog Post",
      newsletter: "Newsletter Content Pack",
      "press-release": "Press Release",
      "white-paper": "White Paper",
      "social-media-posts": "Social Media Content Pack",
      "instagram-captions": "Instagram Caption Pack",
      "linkedin-article": "LinkedIn Article",
      "twitter-thread": "Twitter Thread",
      poetry: "Digital Poetry",
      storytelling: "Brand Story",
      "video-script": "Video Script",
      "podcast-outline": "Podcast Episode Outline",
      "api-documentation": "API Documentation",
      "user-guide": "User Guide",
      troubleshooting: "Troubleshooting Guide",
      changelog: "Changelog",
    }

    const contentData = {
      id: contentId,
      title:
        structuredContent.metaTitle ||
        structuredContent.sections?.[0]?.title ||
        contentTypeLabels[contentType] ||
        "Generated Content",
      content: structuredContent.content,
      markdown: structuredContent.markdown,
      summary: structuredContent.summary,
      keyPoints: structuredContent.keyPoints,
      contentType,
      tone,
      writingStyle,
      createdAt: new Date().toISOString(),
      websiteUrl: websiteData?.url || null,
      wordCount: structuredContent.wordCount,
      readingTime: structuredContent.readingTime,
      sections: structuredContent.sections,
      metaTitle: structuredContent.metaTitle,
      metaDescription: structuredContent.metaDescription,
    }

    // Save to database (optional, won't fail if Supabase is not configured)
    const savedId = await saveGeneratedContent({
      analysisId: websiteData?._id,
      contentType,
      title: contentData.title,
      content: contentData.content,
      markdown: contentData.markdown,
      summary: contentData.summary,
      keyPoints: contentData.keyPoints,
      tone,
      writingStyle,
      wordCount: contentData.wordCount,
      readingTime: contentData.readingTime,
      sections: contentData.sections,
      websiteUrl: websiteData?.url,
      metaTitle: contentData.metaTitle,
      metaDescription: contentData.metaDescription,
    })

    if (savedId) {
      console.log("💾 Generated content saved to database with ID:", savedId)
      contentData.id = savedId
    }

    const responseData = {
      success: true,
      content: contentData,
    }

    console.log("🎉 Content generation completed successfully")
    console.log("📊 Response data:", {
      success: responseData.success,
      contentId: responseData.content.id,
      title: responseData.content.title,
      wordCount: responseData.content.wordCount,
      sectionsCount: responseData.content.sections?.length || 0,
      tone: responseData.content.tone,
      writingStyle: responseData.content.writingStyle,
    })

    return NextResponse.json(responseData)
  } catch (error) {
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
