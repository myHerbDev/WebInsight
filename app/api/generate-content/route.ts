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

function generateComprehensivePrompt(contentType: string, websiteData: any, customPrompt: string, tone: string) {
  const websiteUrl = websiteData?.url || "the analyzed website"
  const websiteTitle = websiteData?.title || "Website"
  const websiteSummary = websiteData?.summary || "Analysis completed"
  const performanceScore = websiteData?.performance_score || websiteData?.sustainability?.performance || 0
  const sustainabilityScore = websiteData?.sustainability_score || websiteData?.sustainability?.score || 0
  const securityScore = websiteData?.security_score || 85
  const contentQualityScore = websiteData?.content_quality_score || 75

  // Enhanced data context
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

  // Use custom prompt if provided
  if (customPrompt && customPrompt.trim()) {
    return `${customPrompt}

${dataContext}

INSTRUCTIONS:
- Write in a ${tone} tone
- Create comprehensive, well-structured content
- Use all available data points effectively
- Follow document structure best practices
- Include executive summary, detailed analysis, and actionable recommendations
- Ensure content is detailed and professional
- Structure content with clear headings and sections
- Provide specific, data-driven insights`
  }

  // Enhanced content type templates
  const comprehensivePrompts = {
    "sustainability-research": `Create a comprehensive sustainability research report using the following structure:

${dataContext}

# Comprehensive Sustainability Research Report

## Executive Summary
Provide a detailed 200-word executive summary highlighting key findings, environmental impact assessment, and strategic recommendations.

## 1. Introduction and Methodology
- Research objectives and scope
- Evaluation framework and criteria
- Data collection methodology
- Analysis tools and techniques used

## 2. Website Overview and Context
- Technical specifications: ${websiteTitle} (${websiteUrl})
- Current performance baseline: ${performanceScore}/100
- Sustainability baseline: ${sustainabilityScore}/100
- Security and quality metrics: ${securityScore}/100, ${contentQualityScore}/100

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

Write in a ${tone} academic style with scientific rigor, data-driven insights, and comprehensive analysis. Include specific metrics, calculations, and actionable recommendations throughout.`,

    "technical-audit": `Generate a comprehensive technical audit report with the following detailed structure:

${dataContext}

# Comprehensive Technical Audit Report

## Executive Summary
Provide a strategic overview of technical findings, critical issues, and optimization opportunities with quantified impact assessments.

## 1. Audit Scope and Methodology
### 1.1 Assessment Framework
- Technical evaluation criteria and standards
- Tools and technologies used for analysis
- Testing environments and conditions

### 1.2 Website Profile
- Target: ${websiteTitle} (${websiteUrl})
- Current performance baseline: ${performanceScore}/100
- Security posture: ${securityScore}/100
- Overall technical health assessment

## 2. Performance Analysis
### 2.1 Core Web Vitals Assessment
- Largest Contentful Paint (LCP) analysis
- First Input Delay (FID) measurement
- Cumulative Layout Shift (CLS) evaluation
- Performance score breakdown and contributing factors

### 2.2 Resource Optimization Analysis
- Asset loading and delivery optimization
- Image compression and format analysis
- CSS and JavaScript optimization opportunities
- Caching strategy evaluation

### 2.3 Network and Infrastructure
- Server response time analysis
- CDN implementation and effectiveness
- DNS resolution performance
- SSL/TLS configuration assessment

## 3. Security Assessment
### 3.1 Security Headers Analysis
- Content Security Policy (CSP) implementation
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options and clickjacking protection
- Security score: ${securityScore}/100 breakdown

### 3.2 Vulnerability Assessment
- Common security vulnerabilities scan
- SSL certificate validation and configuration
- Input validation and sanitization review

## 4. Accessibility and Compliance
### 4.1 WCAG Compliance Assessment
- Accessibility standards evaluation
- Screen reader compatibility
- Keyboard navigation testing

### 4.2 Mobile Optimization
- Responsive design implementation
- Mobile performance metrics
- Touch interface usability

## 5. SEO and Content Analysis
### 5.1 Technical SEO Audit
- Meta tags and structured data
- URL structure and canonicalization
- Sitemap and robots.txt analysis

### 5.2 Content Quality Assessment
- Content structure and organization
- Readability and user experience
- Content quality score: ${contentQualityScore}/100 analysis

## 6. Sustainability and Environmental Impact
### 6.1 Green Performance Metrics
- Energy efficiency assessment
- Carbon footprint estimation
- Sustainability score: ${sustainabilityScore}/100 breakdown

### 6.2 Optimization for Sustainability
- Resource usage optimization
- Green hosting recommendations
- Environmental impact reduction strategies

## 7. Prioritized Recommendations
### 7.1 Critical Issues (Immediate Action Required)
- Security vulnerabilities and fixes
- Performance bottlenecks with high impact

### 7.2 High-Impact Optimizations
- Performance improvements with significant ROI
- User experience enhancements

### 7.3 Long-term Strategic Improvements
- Architecture modernization opportunities
- Scalability and future-proofing recommendations

## 8. Implementation Roadmap
### 8.1 Phase 1: Critical Fixes (0-2 weeks)
- Security patches and urgent performance fixes
- Resource allocation and timeline

### 8.2 Phase 2: Performance Optimization (2-8 weeks)
- Systematic performance improvements
- Testing and validation procedures

### 8.3 Phase 3: Strategic Enhancements (2-6 months)
- Long-term architectural improvements
- Advanced optimization implementation

## 9. Monitoring and Maintenance
### 9.1 Continuous Monitoring Setup
- Performance monitoring tools and alerts
- Security monitoring and incident response

### 9.2 Regular Audit Schedule
- Quarterly performance reviews
- Annual comprehensive audits

## 10. Conclusion and Next Steps
- Summary of critical findings and recommendations
- Expected outcomes and success metrics
- Support and consultation recommendations

Write in a ${tone} technical style with specific metrics, detailed analysis, and actionable recommendations. Include code examples, configuration snippets, and implementation guidance where appropriate.`,

    "executive-summary": `Create a comprehensive executive summary with strategic focus:

${dataContext}

# Executive Summary: Strategic Website Performance Analysis

## Strategic Overview
Provide a high-level assessment of ${websiteTitle}'s digital performance and strategic positioning, focusing on business impact and competitive advantage.

## Key Performance Indicators
### Current State Assessment
- Overall Performance Score: ${performanceScore}/100
- Sustainability Rating: ${sustainabilityScore}/100
- Security Posture: ${securityScore}/100
- Content Quality Index: ${contentQualityScore}/100

### Business Impact Analysis
- User experience implications and conversion impact
- Brand reputation and competitive positioning
- Operational efficiency and cost considerations

## Strategic Findings
### Performance Analysis
- Critical performance gaps and their business impact
- User experience bottlenecks affecting conversion rates
- Technical debt and infrastructure limitations

### Sustainability Assessment
- Environmental impact and corporate responsibility alignment
- Cost implications of current sustainability practices
- Competitive advantage opportunities in green technology

### Security and Compliance
- Risk assessment and mitigation priorities
- Compliance requirements and regulatory considerations
- Brand protection and trust implications

## Investment Priorities
### Immediate Actions (0-30 days) - Budget: $X,XXX
- Critical security fixes and performance optimizations
- Quick wins with immediate ROI
- Risk mitigation priorities

### Strategic Initiatives (1-6 months) - Budget: $XX,XXX
- Infrastructure modernization and optimization
- Sustainability improvements and green hosting migration
- User experience enhancements and conversion optimization

### Long-term Vision (6-24 months) - Budget: $XXX,XXX
- Digital transformation and competitive positioning
- Advanced sustainability and performance leadership
- Innovation and future-proofing investments

## Expected Returns
### Performance Improvements
- Projected conversion rate increase: X%
- User engagement enhancement: X%
- Operational cost reduction: $X,XXX annually

### Sustainability Benefits
- Carbon footprint reduction: X%
- Energy cost savings: $X,XXX annually
- Brand value enhancement and ESG compliance

### Competitive Advantage
- Market positioning improvement
- Customer satisfaction and retention benefits
- Innovation leadership and thought leadership opportunities

## Risk Assessment
### Current Risks
- Performance-related conversion losses
- Security vulnerabilities and compliance gaps
- Sustainability and ESG reporting requirements

### Mitigation Strategies
- Prioritized risk reduction roadmap
- Investment allocation for maximum risk mitigation
- Monitoring and early warning systems

## Recommendations for Leadership
### Immediate Decisions Required
- Budget approval for critical fixes: $X,XXX
- Resource allocation and team assignments
- Vendor selection and procurement decisions

### Strategic Considerations
- Long-term digital strategy alignment
- Sustainability and ESG goal integration
- Competitive positioning and market leadership

## Success Metrics and KPIs
### Performance Targets
- Target performance score: 90+/100 (current: ${performanceScore}/100)
- Target sustainability rating: 85+/100 (current: ${sustainabilityScore}/100)
- User experience improvement metrics

### Business Outcomes
- Conversion rate improvement targets
- Cost reduction and efficiency gains
- Brand value and market position enhancement

## Next Steps and Approval Process
### Immediate Actions
- Executive approval for Phase 1 investments
- Team formation and project initiation
- Vendor engagement and contract negotiation

### Governance and Oversight
- Project steering committee establishment
- Regular progress reporting and review cycles
- Success measurement and adjustment protocols

Write in a ${tone} executive style suitable for C-level stakeholders, focusing on strategic value, ROI, and business impact. Include specific financial projections, risk assessments, and clear action items for leadership decision-making.`,

    default: `Generate comprehensive ${contentType} content with the following structure:

${dataContext}

Create detailed, well-structured content that:
1. Uses all available website data effectively
2. Provides comprehensive analysis and insights
3. Includes executive summary, detailed findings, and recommendations
4. Follows professional document structure best practices
5. Incorporates specific metrics and data points
6. Offers actionable, prioritized recommendations
7. Maintains ${tone} tone throughout

Structure the content with clear headings, subheadings, and logical flow. Include specific data points, metrics, and actionable insights based on the website analysis results.`,
  }

  return comprehensivePrompts[contentType as keyof typeof comprehensivePrompts] || comprehensivePrompts.default
}

// Enhanced prompt generation for better SEO content
function generateSEOPrompt(contentType: string, websiteData: any, customPrompt: string, tone: string) {
  // If custom prompt is provided, use it
  if (customPrompt && customPrompt.trim()) {
    return customPrompt
  }

  const websiteUrl = websiteData?.url || "the analyzed website"
  const websiteTitle = websiteData?.title || "Website"
  const websiteSummary = websiteData?.description || websiteData?.summary || "Analysis completed"
  const performanceScore = websiteData?.performance_score || websiteData?.sustainability?.performance || 0
  const sustainabilityScore = websiteData?.sustainability_score || websiteData?.sustainability?.score || 0
  const category = websiteData?.category || "business"

  // Extract potential keywords
  const keywords = []
  if (websiteData?.meta_keywords) {
    keywords.push(...websiteData.meta_keywords.split(/,\s*/))
  }
  if (websiteData?.title) {
    const titleWords = websiteData.title.split(/\s+/).filter((word: string) => word.length > 3)
    keywords.push(...titleWords)
  }

  // Get unique keywords
  const uniqueKeywords = [...new Set(keywords)].slice(0, 5).join(", ")

  // Default SEO content prompt
  return `
Create comprehensive, SEO-optimized content for ${websiteTitle} (${websiteUrl}).

WEBSITE INFORMATION:
- Website Name: ${websiteTitle}
- URL: ${websiteUrl}
- Description: ${websiteSummary}
- Industry/Category: ${category}
- Performance Score: ${performanceScore}/100
- Sustainability Score: ${sustainabilityScore}/100
- Target Keywords: ${uniqueKeywords}

CONTENT REQUIREMENTS:
- Content Type: ${contentType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
- Target Length: 1500+ words
- SEO Optimization: High priority
- Tone: ${tone}

CONTENT GUIDELINES:
1. Create highly detailed, comprehensive content optimized for search engines
2. Use the website's SEO name "${websiteTitle}" consistently throughout
3. Incorporate target keywords naturally: ${uniqueKeywords}
4. Structure with clear H2 and H3 headings for each major section
5. Include relevant statistics, examples, and specific details
6. Write in a ${tone} tone
7. Add meta description and SEO title suggestions at the end
8. Format with proper paragraph breaks, bullet points, and numbered lists where appropriate
9. Include a strong call-to-action
10. Ensure content is original, valuable, and engaging for readers

The content should be significantly longer and more detailed than typical web content, with comprehensive coverage of each section.
`
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

    console.log("🤖 Generating content...")

    // Build prompt based on content type
    let prompt
    if (contentType === "seo-optimized-content") {
      // Use the custom prompt directly for SEO content
      prompt = customPrompt
    } else {
      // Generate prompt based on content type
      prompt = generateComprehensivePrompt(contentType, websiteData, customPrompt, tone)
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
    } catch (aiError: any) {
      console.error("❌ AI generation error:", aiError)

      // Fallback content
      generatedText = `# ${contentType === "seo-optimized-content" ? "SEO-Optimized Content" : contentType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}

## Introduction
This is a comprehensive analysis of ${websiteData?.title || websiteData?.url || "the website"}.

## Key Points
- Website: ${websiteData?.title || websiteData?.url || "Not specified"}
- Industry: ${websiteData?.category || "Not specified"}
- Performance Score: ${websiteData?.performance_score || 0}/100
- Sustainability Score: ${websiteData?.sustainability_score || 0}/100

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
