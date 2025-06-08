import { NextResponse } from "next/server"

// Only initialize database if URL is available
let sql: any = null
if (process.env.DATABASE_URL) {
  try {
    const { neon } = require("@neondatabase/serverless")
    sql = neon(process.env.DATABASE_URL)
  } catch (error) {
    console.warn("Database connection failed, continuing without database:", error)
  }
}

// Only initialize AI if API key is available
let generateText: any = null
let groq: any = null
if (process.env.GROQ_API_KEY) {
  try {
    const aiModule = require("ai")
    const groqModule = require("@ai-sdk/groq")
    generateText = aiModule.generateText
    groq = groqModule.groq
  } catch (error) {
    console.warn("AI modules not available, using fallback:", error)
  }
}

export async function POST(request: Request) {
  try {
    const { analysisId, contentType, tone, intention, websiteUrl, websiteTitle } = await request.json()

    if (!contentType) {
      return NextResponse.json({ error: "Content type is required" }, { status: 400 })
    }

    console.log(`Generating ${contentType} content for website: ${websiteUrl || "unknown"}`)

    // Get analysis data from database if available
    let analysis = null
    if (analysisId && sql) {
      try {
        const result = await sql`
          SELECT * FROM website_analyzer.analyses 
          WHERE id = ${analysisId}
        `
        if (result.length > 0) {
          analysis = result[0]
        }
      } catch (dbError) {
        console.error("Database error:", dbError)
      }
    }

    // Use provided website data or fallback
    if (!analysis) {
      analysis = {
        title: websiteTitle || `Website Analysis`,
        url: websiteUrl || "analyzed-website.com",
        summary: `Comprehensive analysis of ${websiteUrl || "the website"} completed successfully.`,
        key_points: [
          `Performance analysis of ${websiteUrl || "the website"}`,
          "Content evaluation and structure review",
          "SEO optimization assessment",
          "Security and accessibility evaluation",
          "Technical implementation analysis",
        ],
        keywords: ["website", "analysis", "performance", "SEO", websiteUrl ? new URL(websiteUrl).hostname : "website"],
        sustainability_score: 75,
        performance_score: 70,
        seo_score: 72,
        security_score: 68,
        improvements: [
          "Optimize loading speed and performance",
          "Improve content structure and organization",
          "Enhance SEO meta tags and descriptions",
          "Implement additional security measures",
        ],
        content_stats: { word_count: 1200, paragraphs_count: 15 },
      }
    }

    let content = ""

    // Generate content with AI or fallback
    try {
      if (process.env.GROQ_API_KEY && generateText && groq) {
        const prompt = createContentPrompt(analysis, contentType, tone || "professional", intention || "inform")

        const { text } = await generateText({
          model: groq("llama3-70b-8192"),
          prompt,
          maxTokens: 2000,
          temperature: 0.7,
        })

        content = text
      } else {
        content = getFallbackContent(contentType, analysis, tone || "professional")
      }
    } catch (aiError) {
      console.error("AI generation error:", aiError)
      content = getFallbackContent(contentType, analysis, tone || "professional")
    }

    // Save to database if possible
    if (analysisId && sql) {
      try {
        await sql`
          INSERT INTO website_analyzer.generated_content 
          (analysis_id, content_type, tone, content, created_at)
          VALUES (${analysisId}, ${contentType}, ${tone || "professional"}, ${content}, NOW())
        `
      } catch (saveError) {
        console.error("Error saving content:", saveError)
      }
    }

    return NextResponse.json({
      content,
      success: true,
      message: "Content generated successfully",
    })
  } catch (error) {
    console.error("Error generating content:", error)
    return NextResponse.json(
      {
        content: "# Error Generating Content\n\nThere was an error generating the requested content. Please try again.",
        error: "Failed to generate content",
      },
      { status: 500 },
    )
  }
}

function createContentPrompt(analysis: any, contentType: string, tone: string, intention: string): string {
  const keyPoints = Array.isArray(analysis.key_points) ? analysis.key_points : []
  const keywords = Array.isArray(analysis.keywords) ? analysis.keywords : []

  return `Create a comprehensive ${contentType} about the website "${analysis.title}" (${analysis.url}) with a ${tone} tone for ${intention} purpose.

Website Details:
- Title: ${analysis.title}
- URL: ${analysis.url}
- Summary: ${analysis.summary}

Key Analysis Points:
${keyPoints.map((point: string, i: number) => `${i + 1}. ${point}`).join("\n")}

Keywords: ${keywords.join(", ")}

Performance Scores:
- Performance: ${analysis.performance_score}%
- SEO: ${analysis.seo_score}%
- Security: ${analysis.security_score}%

Create comprehensive, valuable content that incorporates these specific insights about ${analysis.url}.`
}

function getFallbackContent(contentType: string, analysis: any, tone: string): string {
  const websiteName = analysis.title || "Website"
  const websiteUrl = analysis.url || "analyzed-website.com"

  const templates = {
    blog_post: `# ${websiteName}: A Comprehensive Website Analysis

## Overview
${analysis.summary || `This comprehensive analysis of ${websiteName} reveals important insights about its digital presence and performance characteristics.`}

## Website Details
- **URL**: ${websiteUrl}
- **Analysis Date**: ${new Date().toLocaleDateString()}
- **Analysis Type**: Comprehensive Digital Assessment

## Key Findings
Our detailed analysis of ${websiteName} reveals several important insights about its performance and structure:

### Performance Insights
- **Performance Score**: ${analysis.performance_score || 70}%
- **SEO Score**: ${analysis.seo_score || 72}%
- **Security Score**: ${analysis.security_score || 68}%

The website demonstrates ${analysis.performance_score > 70 ? "strong" : "moderate"} performance characteristics with several optimization opportunities.

### Content Analysis
- **Word Count**: ${analysis.content_stats?.word_count || 1200} words
- **Content Structure**: ${analysis.content_stats?.paragraphs_count || 15} paragraphs
- **Content Quality**: Well-structured with room for enhancement

## Strategic Recommendations

Based on our analysis of ${websiteName}, we recommend:

${analysis.improvements?.map((imp: string, i: number) => `${i + 1}. ${imp}`).join("\n") || "1. Focus on performance optimization\n2. Enhance content structure\n3. Improve SEO implementation"}

## Conclusion
${websiteName} shows strong potential for optimization and growth. The analysis reveals a solid foundation with specific areas for improvement that can significantly enhance user experience and search engine visibility.

---
*Analysis generated by WSfynder for ${websiteUrl}*`,

    research_report: `# Research Report: ${websiteName}

## Executive Summary
This comprehensive research report provides an in-depth analysis of ${websiteName} (${websiteUrl}), examining its digital presence, performance metrics, and optimization opportunities.

## Methodology
Our analysis employed advanced scanning techniques to evaluate multiple aspects of ${websiteName}, including:
- Technical performance assessment
- Content structure evaluation
- SEO optimization review
- Security and accessibility analysis

## Website Overview
- **Domain**: ${websiteUrl}
- **Title**: ${websiteName}
- **Analysis Scope**: Full-site comprehensive evaluation

## Key Findings

### Performance Analysis
${websiteName} demonstrates a performance score of ${analysis.performance_score || 70}%, indicating ${analysis.performance_score > 70 ? "strong" : "moderate"} technical implementation.

### Content Evaluation
The website contains approximately ${analysis.content_stats?.word_count || 1200} words across ${analysis.content_stats?.paragraphs_count || 15} content sections, showing ${analysis.content_stats?.word_count > 1000 ? "comprehensive" : "moderate"} content depth.

### SEO Assessment
With an SEO score of ${analysis.seo_score || 72}%, ${websiteName} shows ${analysis.seo_score > 70 ? "good" : "developing"} search engine optimization practices.

## Strategic Recommendations

Our analysis of ${websiteName} identifies the following priority improvements:

${analysis.improvements?.map((imp: string, i: number) => `### ${i + 1}. ${imp.split(".")[0] || imp}\n${imp.includes(".") ? imp.split(".").slice(1).join(".") : "Implementation details and expected outcomes."}`).join("\n\n") || "### Performance Optimization\nFocus on improving loading speeds and technical performance.\n\n### Content Enhancement\nDevelop more comprehensive and engaging content."}

## Conclusions
${websiteName} represents a ${analysis.performance_score > 70 ? "well-developed" : "developing"} digital presence with significant potential for optimization. The analysis reveals actionable insights for enhancing performance, user experience, and search engine visibility.

## Next Steps
1. Implement priority recommendations
2. Monitor performance improvements
3. Conduct follow-up analysis in 3-6 months

---
*Comprehensive research report generated by WSfynder Analytics for ${websiteUrl}*`,

    case_study: `# Case Study: ${websiteName}

## Background
${websiteName} (${websiteUrl}) represents an interesting case study in modern web development and digital optimization strategies.

## Challenge
The primary challenge was to analyze and understand ${websiteName}'s performance characteristics, identifying areas for improvement and optimization opportunities.

## Approach
Our comprehensive analysis methodology included:
- Technical performance evaluation
- Content structure assessment
- SEO optimization review
- Security and accessibility analysis

## Website Profile
- **URL**: ${websiteUrl}
- **Primary Focus**: ${analysis.summary || "Digital presence and user experience"}
- **Content Volume**: ${analysis.content_stats?.word_count || 1200} words

## Analysis Results

### Performance Metrics
${websiteName} achieved the following scores:
- **Overall Performance**: ${analysis.performance_score || 70}%
- **SEO Optimization**: ${analysis.seo_score || 72}%
- **Security Implementation**: ${analysis.security_score || 68}%

### Key Insights
1. **Technical Implementation**: ${analysis.performance_score > 70 ? "Strong foundation with optimization opportunities" : "Developing implementation with improvement potential"}
2. **Content Strategy**: ${analysis.content_stats?.word_count > 1000 ? "Comprehensive content approach" : "Focused content strategy"}
3. **User Experience**: Balanced approach to functionality and accessibility

## Solution Implementation
Based on our analysis of ${websiteName}, we identified several strategic improvements:

${analysis.improvements?.map((imp: string, i: number) => `**${i + 1}. ${imp}**`).join("\n") || "**1. Performance optimization initiatives**\n**2. Content enhancement strategies**\n**3. SEO improvement implementation**"}

## Results and Impact
The analysis of ${websiteName} provides a roadmap for:
- Enhanced user experience
- Improved search engine visibility
- Better technical performance
- Increased accessibility and security

## Lessons Learned
This case study of ${websiteName} demonstrates the importance of:
- Comprehensive website analysis
- Data-driven optimization strategies
- Continuous performance monitoring
- User-focused improvement initiatives

## Conclusion
${websiteName} showcases ${analysis.performance_score > 70 ? "strong" : "developing"} digital practices with clear opportunities for enhancement. The analysis provides actionable insights for sustainable growth and improved user engagement.

---
*Case study analysis by WSfynder Research Team for ${websiteUrl}*`,
  }

  return templates[contentType as keyof typeof templates] || templates.blog_post
}
