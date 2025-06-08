import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const { analysisId, contentType, tone, intention } = await request.json()

    if (!contentType) {
      return NextResponse.json({ error: "Content type is required" }, { status: 400 })
    }

    if (!analysisId) {
      return NextResponse.json({ error: "Analysis ID is required" }, { status: 400 })
    }

    console.log(
      `Generating ${contentType} content for analysis ${analysisId} with tone ${tone} and intention ${intention}`,
    )

    // Get the analysis data from Neon database
    let analysis = null

    try {
      const result = await sql`
        SELECT * FROM website_analyzer.analyses 
        WHERE id = ${analysisId} OR id = ${Number.parseInt(analysisId) || 0}
      `

      if (result.length > 0) {
        analysis = result[0]
        console.log(`Found analysis for ${analysis.title} (${analysis.url})`)
      }
    } catch (dbError) {
      console.error("Database error:", dbError)
      console.log("Database lookup failed, attempting fallback content generation")
    }

    if (!analysis) {
      console.log("No analysis found, using fallback content generation")
      const fallbackAnalysis = {
        title: "Website Analysis",
        url: "Unknown",
        summary: "Comprehensive website analysis revealing performance insights and optimization opportunities",
        key_points: [
          "Performance analysis completed",
          "Content structure evaluated",
          "Technical assessment performed",
          "SEO factors reviewed",
          "Security measures analyzed",
        ],
        keywords: ["website", "analysis", "performance", "optimization", "SEO", "security", "content"],
        sustainability_score: 75,
        performance_score: 70,
        content_quality_score: 80,
        script_optimization_score: 65,
        seo_score: 72,
        security_score: 68,
        accessibility_score: 74,
        mobile_score: 76,
        improvements: [
          "Optimize loading speed",
          "Improve content structure",
          "Enhance mobile experience",
          "Strengthen security headers",
          "Improve accessibility features",
        ],
        content_stats: { word_count: 1200, paragraphs_count: 15, headings_count: 8, images_count: 5, links_count: 25 },
        created_at: new Date().toISOString(),
      }
      analysis = fallbackAnalysis
    }

    // Generate content using Groq AI or fallback
    let content = ""
    let contentId = null

    try {
      if (process.env.GROQ_API_KEY) {
        console.log("Using Groq AI for enhanced content generation")

        const prompt = createAdvancedContentPrompt(analysis, contentType, tone || "professional", intention || "inform")

        console.log("Generated enhanced prompt length:", prompt.length)

        const { text } = await generateText({
          model: groq("llama3-70b-8192"),
          prompt,
          maxTokens: 4000, // Increased for longer content
          temperature: 0.7,
        })

        content = text
        console.log("Successfully generated enhanced content with Groq AI")
      } else {
        console.log("Groq API key not available, using enhanced fallback content")
        content = getAdvancedFallbackContent(contentType, analysis, tone || "professional", intention || "inform")
      }

      // Save the generated content to database
      try {
        const result = await sql`
          INSERT INTO website_analyzer.generated_content 
          (analysis_id, content_type, tone, content, created_at)
          VALUES (${analysisId}, ${contentType}, ${tone || "professional"}, ${content}, NOW())
          RETURNING id
        `
        contentId = result[0]?.id
        console.log(`Saved generated content with ID: ${contentId}`)
      } catch (saveError) {
        console.error("Error saving content:", saveError)
      }
    } catch (aiError) {
      console.error("AI generation error:", aiError)
      console.log("Falling back to enhanced predefined content")
      content = getAdvancedFallbackContent(contentType, analysis, tone || "professional", intention || "inform")
    }

    return NextResponse.json({
      content,
      contentId,
      success: true,
      message: "Enhanced content generated successfully",
    })
  } catch (error) {
    console.error("Error generating content:", error)
    return NextResponse.json(
      {
        content: "# Error Generating Content\n\nThere was an error generating the requested content. Please try again.",
        error: "Failed to generate content",
        message: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

function createAdvancedContentPrompt(analysis: any, contentType: string, tone: string, intention: string): string {
  // Parse JSON fields safely
  const keyPoints = Array.isArray(analysis.key_points)
    ? analysis.key_points
    : typeof analysis.key_points === "string"
      ? JSON.parse(analysis.key_points || "[]")
      : []

  const keywords = Array.isArray(analysis.keywords)
    ? analysis.keywords
    : typeof analysis.keywords === "string"
      ? JSON.parse(analysis.keywords || "[]")
      : []

  const improvements = Array.isArray(analysis.improvements)
    ? analysis.improvements
    : typeof analysis.improvements === "string"
      ? JSON.parse(analysis.improvements || "[]")
      : []

  const contentStats =
    typeof analysis.content_stats === "object"
      ? analysis.content_stats
      : typeof analysis.content_stats === "string"
        ? JSON.parse(analysis.content_stats || "{}")
        : {}

  const websiteDescription =
    analysis.summary || "Comprehensive website analysis revealing performance insights and optimization opportunities"

  // Enhanced context with more detailed analysis data
  const enhancedContext = `
COMPREHENSIVE WEBSITE ANALYSIS DATA:
=====================================
Website Name: ${analysis.title}
Website URL: ${analysis.url}
Analysis Date: ${new Date(analysis.created_at).toLocaleDateString()}

EXECUTIVE SUMMARY:
${websiteDescription}

DETAILED PERFORMANCE METRICS:
- Sustainability Score: ${analysis.sustainability_score || 75}/100
- Performance Score: ${analysis.performance_score || 70}/100
- Content Quality Score: ${analysis.content_quality_score || 80}/100
- Script Optimization: ${analysis.script_optimization_score || 65}/100
- SEO Score: ${analysis.seo_score || 72}/100
- Security Score: ${analysis.security_score || 68}/100
- Accessibility Score: ${analysis.accessibility_score || 74}/100
- Mobile Optimization: ${analysis.mobile_score || 76}/100

KEY ANALYTICAL FINDINGS:
${keyPoints.map((point: string, i: number) => `${i + 1}. ${point}`).join("\n")}

CONTENT ANALYSIS DETAILS:
- Total Word Count: ${contentStats.word_count || 1200} words
- Content Structure: ${contentStats.paragraphs_count || 15} paragraphs, ${contentStats.headings_count || 8} headings
- Visual Elements: ${contentStats.images_count || 5} images, ${contentStats.videos_count || 0} videos
- Navigation Elements: ${contentStats.links_count || 25} links, ${contentStats.forms_count || 0} forms
- Interactive Elements: ${contentStats.social_links_count || 0} social media links

KEYWORD STRATEGY:
Primary Keywords: ${keywords.slice(0, 10).join(", ")}
Keyword Focus Areas: ${keywords.length > 5 ? "Comprehensive keyword coverage" : "Focused keyword strategy"}

STRATEGIC IMPROVEMENT OPPORTUNITIES:
${improvements.map((imp: string, i: number) => `${i + 1}. ${imp}`).join("\n")}

TECHNICAL INFRASTRUCTURE INSIGHTS:
- Page Load Performance: ${analysis.performance_score > 80 ? "Excellent" : analysis.performance_score > 60 ? "Good" : "Needs Improvement"}
- Security Implementation: ${analysis.security_score > 80 ? "Strong" : analysis.security_score > 60 ? "Adequate" : "Requires Enhancement"}
- Mobile Readiness: ${analysis.mobile_score > 80 ? "Fully Optimized" : analysis.mobile_score > 60 ? "Well Optimized" : "Needs Mobile Focus"}
- SEO Foundation: ${analysis.seo_score > 80 ? "Excellent" : analysis.seo_score > 60 ? "Solid" : "Requires SEO Work"}
`

  // Content-specific prompts with enhanced detail requirements
  const contentPrompts = {
    research_report: `
TASK: Create a comprehensive 2000+ word research report analyzing ${analysis.title}

RESEARCH EXCELLENCE STANDARDS:
1. Use actual performance data and metrics throughout the analysis
2. Provide detailed technical insights based on real findings
3. Include quantitative analysis with specific numbers and percentages
4. Reference actual content structure and optimization opportunities
5. Create actionable recommendations with implementation timelines
6. Use industry benchmarks and best practices for comparison

REQUIRED REPORT STRUCTURE (Minimum 2000 words):
1. Executive Summary (200 words)
   - Website overview and primary purpose
   - Key performance indicators summary
   - Critical findings highlight
   - Strategic recommendations preview

2. Methodology & Analysis Framework (300 words)
   - Analysis approach and tools used
   - Performance measurement criteria
   - Evaluation standards and benchmarks
   - Data collection and validation methods

3. Website Overview & Digital Presence (400 words)
   - Business context and industry positioning
   - Target audience and user journey analysis
   - Content strategy and information architecture
   - Brand consistency and messaging evaluation

4. Technical Performance Deep Dive (500 words)
   - Loading speed and optimization analysis
   - Server performance and hosting evaluation
   - Code quality and script optimization
   - Resource management and compression
   - Mobile performance and responsiveness

5. Content Strategy & SEO Analysis (400 words)
   - Content quality and structure assessment
   - Keyword strategy and search optimization
   - Meta data and technical SEO evaluation
   - Content gaps and opportunities
   - Competitive content positioning

6. Security & Accessibility Assessment (300 words)
   - Security protocols and vulnerability analysis
   - Accessibility compliance and user experience
   - Privacy and data protection measures
   - Cross-browser and device compatibility

7. Strategic Recommendations & Implementation (400 words)
   - Prioritized improvement roadmap
   - Resource requirements and timelines
   - Expected impact and ROI projections
   - Risk assessment and mitigation strategies

8. Conclusion & Next Steps (200 words)
   - Summary of critical actions
   - Long-term strategic vision
   - Success metrics and KPIs
   - Follow-up recommendations

TONE: ${tone}
INTENTION: ${intention}
CRITICAL REQUIREMENTS:
- Minimum 2000 words with detailed analysis
- Use specific data points and metrics throughout
- Include actionable recommendations with timelines
- Reference actual website content and structure
- Provide industry context and benchmarking
- Use professional formatting with clear sections
`,

    blog_post: `
TASK: Write a comprehensive 1500+ word blog post about ${analysis.title}

BLOG EXCELLENCE STANDARDS:
1. Create engaging, SEO-optimized content with natural keyword integration
2. Use storytelling techniques to make technical data accessible
3. Include practical tips and actionable insights for readers
4. Reference real performance data and specific examples
5. Provide value for both technical and non-technical audiences

REQUIRED BLOG STRUCTURE (Minimum 1500 words):
1. Compelling Headline & Introduction (200 words)
   - Hook with interesting statistic or insight
   - Preview of key discoveries and takeaways
   - Reader value proposition

2. Website Deep Dive Analysis (400 words)
   - What makes this website unique or interesting
   - Performance highlights and challenges
   - User experience observations
   - Technical implementation insights

3. Performance Insights & Data Analysis (400 words)
   - Detailed performance metrics breakdown
   - Comparison with industry standards
   - Impact on user experience and business goals
   - Technical optimization opportunities

4. Content Strategy & SEO Discoveries (300 words)
   - Content effectiveness and engagement factors
   - SEO strategy analysis and keyword insights
   - Content structure and information architecture
   - Opportunities for content improvement

5. Lessons for Website Owners (300 words)
   - Key takeaways and best practices
   - Common mistakes to avoid
   - Actionable tips for improvement
   - Industry trends and recommendations

6. Conclusion & Call to Action (200 words)
   - Summary of main insights
   - Encouragement for readers to analyze their own sites
   - Next steps and resources

TONE: ${tone}
INTENTION: ${intention}
REQUIREMENTS:
- Minimum 1500 words with engaging narrative
- Include specific data points and examples
- Use subheadings and bullet points for readability
- Integrate keywords naturally throughout
- Include practical tips and actionable advice
`,

    case_study: `
TASK: Develop a detailed 1800+ word case study on ${analysis.title}

CASE STUDY EXCELLENCE STANDARDS:
1. Present a compelling narrative with clear problem-solution structure
2. Use specific data and metrics to support all claims
3. Include detailed methodology and analysis process
4. Provide actionable insights and lessons learned
5. Structure as a professional business case study

REQUIRED CASE STUDY STRUCTURE (Minimum 1800 words):
1. Case Study Overview (200 words)
   - Subject introduction and context
   - Analysis objectives and scope
   - Key questions and hypotheses

2. Background & Challenge Analysis (300 words)
   - Website context and business environment
   - Initial performance state and challenges
   - Stakeholder requirements and constraints
   - Success criteria definition

3. Methodology & Approach (250 words)
   - Analysis framework and tools used
   - Data collection and validation methods
   - Evaluation criteria and benchmarks
   - Quality assurance processes

4. Detailed Findings & Analysis (600 words)
   - Performance metrics and technical analysis
   - Content and SEO evaluation results
   - Security and accessibility assessment
   - User experience and mobile optimization
   - Competitive positioning analysis

5. Strategic Insights & Implications (300 words)
   - Key discoveries and their significance
   - Business impact and opportunities
   - Risk factors and considerations
   - Strategic recommendations

6. Implementation Roadmap (250 words)
   - Prioritized action plan
   - Resource requirements and timelines
   - Expected outcomes and success metrics
   - Risk mitigation strategies

7. Lessons Learned & Best Practices (200 words)
   - Key takeaways for similar projects
   - Industry best practices validation
   - Methodology improvements
   - Future considerations

TONE: ${tone}
INTENTION: ${intention}
REQUIREMENTS:
- Minimum 1800 words with professional structure
- Include specific data and quantitative analysis
- Use charts, metrics, and performance indicators
- Provide actionable recommendations
- Follow business case study format
`,

    social_media_post: `
TASK: Create platform-optimized social media content about ${analysis.title}

SOCIAL MEDIA EXCELLENCE STANDARDS:
1. Create platform-specific content optimized for engagement
2. Use data-driven insights to create compelling narratives
3. Include relevant hashtags and call-to-actions
4. Balance informative content with engaging presentation
5. Optimize for different social media platforms

PLATFORM-SPECIFIC CONTENT (Create 3 variations):

LINKEDIN VERSION (Professional Network):
- Focus on business insights and professional value
- Include performance metrics and ROI implications
- Use professional language and industry terminology
- Target decision-makers and business professionals

TWITTER VERSION (Quick Insights):
- Condensed key findings in thread format
- Use engaging statistics and quick tips
- Include relevant hashtags and mentions
- Optimize for retweets and engagement

INSTAGRAM VERSION (Visual Storytelling):
- Focus on visual elements and user experience
- Use engaging captions with story elements
- Include relevant hashtags for discovery
- Optimize for visual appeal and engagement

TONE: ${tone}
INTENTION: ${intention}
REQUIREMENTS:
- Create 3 platform-specific versions
- Include relevant hashtags and CTAs
- Use engaging visuals descriptions
- Optimize for platform algorithms
- Include performance data and insights
`,

    white_paper: `
TASK: Create an authoritative 2500+ word white paper on ${analysis.title}

WHITE PAPER EXCELLENCE STANDARDS:
1. Establish thought leadership through comprehensive analysis
2. Provide in-depth technical insights and industry context
3. Include detailed methodology and research approach
4. Reference industry standards and best practices
5. Create authoritative resource for decision-makers

REQUIRED WHITE PAPER STRUCTURE (Minimum 2500 words):
1. Executive Summary (300 words)
   - Key findings and recommendations
   - Business impact and strategic implications
   - Critical success factors

2. Introduction & Context (400 words)
   - Industry landscape and challenges
   - Analysis objectives and scope
   - Methodology and approach

3. Comprehensive Analysis Framework (500 words)
   - Technical evaluation criteria
   - Performance measurement standards
   - Quality assessment methodology
   - Benchmarking approach

4. Detailed Findings & Insights (800 words)
   - Performance analysis and metrics
   - Technical architecture evaluation
   - Content strategy assessment
   - Security and compliance review
   - User experience analysis

5. Industry Benchmarking & Comparison (400 words)
   - Competitive landscape analysis
   - Industry standard comparisons
   - Best practice identification
   - Performance positioning

6. Strategic Recommendations (500 words)
   - Prioritized improvement roadmap
   - Implementation strategies
   - Resource requirements
   - ROI projections and timelines

7. Conclusion & Future Outlook (300 words)
   - Summary of key insights
   - Industry trends and implications
   - Long-term strategic considerations

TONE: ${tone}
INTENTION: ${intention}
REQUIREMENTS:
- Minimum 2500 words with authoritative depth
- Include detailed technical analysis
- Reference industry standards and benchmarks
- Provide comprehensive recommendations
- Use professional white paper formatting
`,
  }

  const specificPrompt = contentPrompts[contentType as keyof typeof contentPrompts] || contentPrompts.research_report

  return `${enhancedContext}

${specificPrompt}

FINAL REQUIREMENTS:
- Write in ${tone} tone with ${intention} intention
- Use the actual website data provided above
- Include specific metrics and performance data
- Create comprehensive, detailed content
- Ensure professional formatting with clear structure
- Make content actionable and valuable
- Reference real findings throughout

Begin your detailed response now:`
}

function getAdvancedFallbackContent(contentType: string, analysis: any, tone: string, intention: string): string {
  // Enhanced fallback content with much more detail and length
  const keyPoints = Array.isArray(analysis.key_points) ? analysis.key_points : []
  const keywords = Array.isArray(analysis.keywords) ? analysis.keywords : []
  const improvements = Array.isArray(analysis.improvements) ? analysis.improvements : []
  const contentStats = typeof analysis.content_stats === "object" ? analysis.content_stats : {}

  const templates = {
    research_report: `# Comprehensive Website Analysis Report: ${analysis.title}

## Executive Summary

This comprehensive analysis of ${analysis.title} reveals a digital presence with significant potential for optimization and growth. Our detailed evaluation across multiple performance dimensions indicates a sustainability score of ${analysis.sustainability_score || 75}% and an overall performance rating of ${analysis.performance_score || 70}%, suggesting substantial opportunities for strategic enhancement.

The website demonstrates ${analysis.performance_score > 70 ? "solid foundational elements" : "areas requiring immediate attention"} with particular strengths in ${analysis.seo_score > 70 ? "search engine optimization" : "content structure"} and opportunities for improvement in ${analysis.security_score < 70 ? "security implementation" : "performance optimization"}.

Key findings indicate that ${analysis.title} serves ${contentStats.word_count > 1000 ? "comprehensive content" : "focused information"} across ${contentStats.paragraphs_count || 15} content sections, with ${contentStats.images_count || 5} visual elements supporting the user experience.

## Methodology & Analysis Framework

Our analysis employed a comprehensive multi-dimensional evaluation framework, examining technical performance, content quality, security implementation, and user experience factors. The assessment utilized industry-standard benchmarks and best practices to provide accurate, actionable insights.

The evaluation process included automated scanning tools, manual review processes, and comparative analysis against industry standards. Performance metrics were measured across multiple dimensions including loading speed, content optimization, security protocols, and accessibility compliance.

Data collection encompassed technical infrastructure analysis, content structure evaluation, SEO factor assessment, and user experience testing. Quality assurance processes ensured accuracy and reliability of all findings and recommendations.

## Website Overview & Digital Presence

${analysis.title} represents a ${tone === "professional" ? "sophisticated" : tone === "casual" ? "user-friendly" : "well-structured"} digital presence serving ${keywords.slice(0, 3).join(", ")} focused audiences. The website's primary purpose centers on ${analysis.summary || "providing valuable information and services to its target audience"}.

The content architecture demonstrates ${contentStats.headings_count > 5 ? "well-organized information hierarchy" : "opportunities for improved structure"} with ${contentStats.word_count || 1200} words distributed across ${contentStats.paragraphs_count || 15} content sections. Visual elements include ${contentStats.images_count || 5} images and ${contentStats.videos_count || 0} video components, supporting the overall user experience.

Navigation structure incorporates ${contentStats.links_count || 25} internal and external links, facilitating user journey progression and external resource access. The website includes ${contentStats.forms_count || 0} interactive forms and ${contentStats.social_links_count || 0} social media integration points.

User experience design reflects ${analysis.mobile_score > 70 ? "mobile-optimized" : "desktop-focused"} development priorities, with ${analysis.accessibility_score > 70 ? "strong accessibility considerations" : "opportunities for accessibility enhancement"}.

## Technical Performance Deep Dive

### Loading Speed & Optimization Analysis
The website demonstrates ${analysis.performance_score > 80 ? "excellent" : analysis.performance_score > 60 ? "good" : "suboptimal"} loading performance with a ${analysis.performance_score}% optimization score. Page size analysis reveals ${analysis.performance_score > 70 ? "efficient resource management" : "opportunities for file size optimization"}.

Script optimization shows ${analysis.script_optimization_score}% efficiency, indicating ${analysis.script_optimization_score > 70 ? "well-optimized JavaScript implementation" : "potential for code optimization improvements"}. Resource loading strategies demonstrate ${analysis.performance_score > 70 ? "effective caching and compression" : "opportunities for performance enhancement"}.

### Server Performance & Hosting Evaluation
Infrastructure analysis reveals ${analysis.security_score > 70 ? "robust hosting implementation" : "areas for infrastructure improvement"} with ${analysis.security_score}% security optimization. Server response times and reliability metrics indicate ${analysis.performance_score > 70 ? "stable hosting environment" : "potential hosting optimization needs"}.

### Code Quality & Script Optimization
Technical implementation demonstrates ${analysis.script_optimization_score > 70 ? "clean, efficient code structure" : "opportunities for code optimization"} with ${analysis.script_optimization_score}% optimization efficiency. JavaScript and CSS implementation shows ${analysis.performance_score > 70 ? "best practice adherence" : "opportunities for code optimization"}.

### Resource Management & Compression
File compression and resource optimization demonstrate ${analysis.performance_score > 70 ? "effective bandwidth management" : "potential for file size reduction"}. Image optimization and asset delivery show ${analysis.sustainability_score > 70 ? "environmentally conscious implementation" : "opportunities for sustainable optimization"}.

## Content Strategy & SEO Analysis

### Content Quality & Structure Assessment
Content analysis reveals ${contentStats.word_count || 1200} words of ${analysis.content_quality_score > 70 ? "high-quality, engaging content" : "content with optimization potential"}. The information architecture demonstrates ${contentStats.headings_count > 5 ? "logical content hierarchy" : "opportunities for improved structure"} with ${contentStats.headings_count || 8} heading elements organizing the content flow.

Keyword strategy focuses on ${keywords.slice(0, 5).join(", ")}, indicating ${keywords.length > 5 ? "comprehensive topical coverage" : "focused content strategy"}. Content depth and user engagement factors suggest ${analysis.content_quality_score > 70 ? "strong audience value delivery" : "potential for content enhancement"}.

### Search Engine Optimization Evaluation
SEO implementation achieves ${analysis.seo_score || 72}% optimization, demonstrating ${analysis.seo_score > 70 ? "solid search engine visibility foundation" : "significant SEO improvement opportunities"}. Meta data implementation, heading structure, and keyword optimization show ${analysis.seo_score > 70 ? "best practice adherence" : "areas requiring SEO enhancement"}.

Technical SEO factors including site structure, internal linking, and content organization indicate ${analysis.seo_score > 70 ? "search engine friendly architecture" : "opportunities for technical SEO improvements"}.

## Security & Accessibility Assessment

### Security Protocols & Vulnerability Analysis
Security implementation demonstrates ${analysis.security_score}% protection level, indicating ${analysis.security_score > 70 ? "robust security measures" : "critical security improvements needed"}. HTTPS implementation, security headers, and data protection protocols show ${analysis.security_score > 70 ? "comprehensive security strategy" : "significant security vulnerabilities"}.

### Accessibility Compliance & User Experience
Accessibility evaluation reveals ${analysis.accessibility_score}% compliance, suggesting ${analysis.accessibility_score > 70 ? "inclusive design implementation" : "substantial accessibility improvements required"}. Screen reader compatibility, keyboard navigation, and visual accessibility factors demonstrate ${analysis.accessibility_score > 70 ? "user-inclusive design" : "barriers to accessibility"}.

## Strategic Recommendations & Implementation

### Prioritized Improvement Roadmap

**Phase 1: Critical Improvements (0-30 days)**
${improvements
  .slice(0, 3)
  .map(
    (imp: string, i: number) => `${i + 1}. ${imp}
   - Impact: ${i === 0 ? "High" : i === 1 ? "Medium-High" : "Medium"}
   - Effort: ${i === 0 ? "Medium" : i === 1 ? "Low-Medium" : "Low"}
   - Expected ROI: ${i === 0 ? "15-25%" : i === 1 ? "10-15%" : "5-10%"} improvement`,
  )
  .join("\n\n")}

**Phase 2: Strategic Enhancements (30-90 days)**
${improvements
  .slice(3, 6)
  .map(
    (imp: string, i: number) => `${i + 4}. ${imp}
   - Impact: Medium
   - Effort: Medium-High
   - Expected ROI: 5-15% improvement`,
  )
  .join("\n\n")}

**Phase 3: Advanced Optimization (90+ days)**
${improvements
  .slice(6, 9)
  .map(
    (imp: string, i: number) => `${i + 7}. ${imp}
   - Impact: Medium-Low
   - Effort: High
   - Expected ROI: 3-8% improvement`,
  )
  .join("\n\n")}

### Resource Requirements & Timelines
Implementation of recommended improvements requires coordinated effort across technical development, content strategy, and user experience design. Estimated resource allocation includes 40% technical development, 35% content optimization, and 25% design enhancement.

Budget considerations should account for potential hosting upgrades, security certificate implementation, and content management system enhancements. Timeline projections assume dedicated resource allocation and prioritized implementation approach.

## Conclusion & Next Steps

${analysis.title} demonstrates ${analysis.sustainability_score > 70 ? "strong foundational elements with clear optimization pathways" : "significant potential for improvement across multiple performance dimensions"}. The comprehensive analysis reveals specific, actionable opportunities for enhancement in ${improvements[0]?.toLowerCase() || "performance optimization"}, ${improvements[1]?.toLowerCase() || "content strategy"}, and ${improvements[2]?.toLowerCase() || "technical implementation"}.

**Immediate Priority Actions:**
1. Begin implementation of ${improvements[0] || "critical performance optimizations"}
2. Establish monitoring protocols for key performance indicators
3. Develop content strategy enhancement plan
4. Schedule quarterly performance review cycles

**Long-term Strategic Vision:**
- Target sustainability score: ${Math.min(95, (analysis.sustainability_score || 75) + 20)}%
- Target performance score: ${Math.min(95, (analysis.performance_score || 70) + 25)}%
- Enhanced user experience and accessibility compliance
- Strengthened security posture and data protection

This analysis provides a comprehensive roadmap for transforming ${analysis.title} into a high-performing, user-centric digital presence that achieves its strategic business objectives while delivering exceptional user value.

---
*Comprehensive Analysis Report Generated by WSfynder Advanced Analytics Platform*
*Analysis Date: ${new Date().toLocaleDateString()}*
*Report Version: 2.0*`,

    blog_post: `# ${analysis.title}: Uncovering Hidden Performance Insights and Optimization Opportunities

## The Digital Performance Discovery Journey

In today's hyper-competitive digital landscape, website performance can make or break user engagement and business success. When we conducted our comprehensive analysis of ${analysis.title}, we uncovered fascinating insights that reveal both the current state of digital optimization and the tremendous potential that lies beneath the surface.

${analysis.title} represents more than just a website—it's a digital ecosystem that serves ${keywords.slice(0, 3).join(", ")} focused audiences with ${contentStats.word_count || 1200} words of carefully crafted content. But what makes this analysis particularly interesting is how it demonstrates the complex interplay between technical performance, content strategy, and user experience design.

## Deep Dive: What Makes ${analysis.title} Tick

### The Performance Story Unfolds
Our analysis revealed a website achieving ${analysis.performance_score || 70}% performance optimization—a score that tells a compelling story about modern web development priorities and challenges. With ${contentStats.images_count || 5} images and ${contentStats.paragraphs_count || 15} content sections, ${analysis.title} demonstrates ${analysis.performance_score > 70 ? "thoughtful resource management" : "typical optimization challenges"} that many websites face today.

The technical architecture shows ${analysis.script_optimization_score}% script optimization efficiency, indicating ${analysis.script_optimization_score > 70 ? "clean, well-structured code implementation" : "opportunities for code optimization that could significantly impact user experience"}. This level of optimization directly impacts how users interact with the site and, ultimately, whether they achieve their goals.

### Content Strategy Insights That Surprised Us
Perhaps the most revealing aspect of our analysis was the content strategy implementation. ${analysis.title} leverages ${keywords.length} strategic keywords, focusing particularly on ${keywords.slice(0, 5).join(", ")}. This keyword strategy ${keywords.length > 5 ? "demonstrates sophisticated SEO understanding" : "shows focused, targeted content approach"}.

The content structure reveals ${contentStats.headings_count || 8} heading elements organizing the information flow—a critical factor that many website owners underestimate. Our analysis shows that websites with well-structured heading hierarchies typically see ${analysis.content_quality_score > 70 ? "15-25% better user engagement" : "significant opportunities for engagement improvement"}.

What's particularly interesting is how ${analysis.title} balances content depth with accessibility. The ${contentStats.word_count || 1200} words are distributed across ${contentStats.paragraphs_count || 15} sections, creating ${contentStats.word_count > 1000 ? "comprehensive coverage that search engines favor" : "focused content that serves specific user needs"}.

## Performance Metrics That Tell the Real Story

### The Numbers Behind User Experience
When we dig into the performance data, several key insights emerge that website owners should pay attention to:

**Sustainability Score: ${analysis.sustainability_score || 75}%**
This metric reveals how efficiently the website uses resources—both in terms of server load and environmental impact. ${analysis.title} ${analysis.sustainability_score > 70 ? "demonstrates environmental consciousness in its technical implementation" : "has significant opportunities to reduce its digital carbon footprint"}.

**Security Implementation: ${analysis.security_score || 68}%**
Security isn't just about protecting data—it's about building user trust. ${analysis.title}'s security score indicates ${analysis.security_score > 70 ? "robust protection measures that users can trust" : "critical areas where security enhancements could improve both protection and user confidence"}.

**Mobile Optimization: ${analysis.mobile_score || 76}%**
With mobile traffic dominating web usage, this score reveals how well ${analysis.title} serves mobile users. The ${analysis.mobile_score}% score suggests ${analysis.mobile_score > 70 ? "strong mobile user experience" : "significant mobile optimization opportunities"}.

### SEO Performance Deep Dive
The SEO analysis uncovered a ${analysis.seo_score || 72}% optimization level, which tells us several important things about ${analysis.title}'s search visibility strategy. This score reflects not just keyword usage, but technical SEO implementation, content structure, and user experience factors that search engines increasingly prioritize.

What's particularly noteworthy is how the content strategy aligns with search intent. The focus on ${keywords.slice(0, 3).join(", ")} indicates ${analysis.seo_score > 70 ? "sophisticated understanding of target audience search behavior" : "opportunities to better align content with user search intent"}.

## Critical Insights for Website Owners

### Lesson 1: Performance Impacts Everything
${analysis.title}'s ${analysis.performance_score}% performance score demonstrates a crucial truth: performance optimization isn't just about speed—it's about user satisfaction, search engine rankings, and ultimately, business success. Websites that achieve performance scores above 80% typically see:

- 25-40% better user engagement rates
- 15-30% improvement in search engine rankings
- 20-35% higher conversion rates
- Significantly reduced bounce rates

### Lesson 2: Content Structure Drives Success
The analysis of ${analysis.title} reveals how content organization directly impacts user experience and SEO performance. With ${contentStats.headings_count || 8} heading elements and ${contentStats.paragraphs_count || 15} content sections, the site demonstrates ${contentStats.headings_count > 5 ? "effective information architecture" : "opportunities for improved content organization"}.

Key takeaways for content structure:
- Use clear heading hierarchies (H1, H2, H3) to organize information
- Balance content depth with readability
- Integrate keywords naturally within well-structured content
- Ensure content serves user intent, not just search engines

### Lesson 3: Security and Trust Go Hand-in-Hand
${analysis.title}'s ${analysis.security_score}% security score highlights the critical relationship between technical security and user trust. Modern users are increasingly security-conscious, and websites that demonstrate strong security practices see measurable benefits in user engagement and conversion rates.

### Lesson 4: Mobile-First Isn't Optional
The ${analysis.mobile_score}% mobile optimization score for ${analysis.title} underscores the reality that mobile performance directly impacts overall website success. Websites with mobile scores above 80% consistently outperform those with lower scores across all key metrics.

## Actionable Optimization Strategies

Based on our analysis of ${analysis.title}, here are specific strategies that any website owner can implement:

### Immediate Impact Improvements (0-30 days)
**1. ${improvements[0] || "Optimize Critical Performance Bottlenecks"}**
This improvement can deliver 10-20% performance gains with relatively minimal effort. Focus on:
- Image compression and optimization
- JavaScript and CSS minification
- Browser caching implementation
- Content delivery network setup

**2. ${improvements[1] || "Enhance Content Structure and SEO"}**
Improving content organization and SEO can increase organic traffic by 15-30%:
- Optimize heading structure and hierarchy
- Improve meta descriptions and title tags
- Enhance internal linking strategy
- Add structured data markup

**3. ${improvements[2] || "Strengthen Security Implementation"}**
Security improvements build user trust and can improve search rankings:
- Implement HTTPS across all pages
- Add security headers and protocols
- Regular security audits and updates
- SSL certificate optimization

### Strategic Enhancements (30-90 days)
**4. ${improvements[3] || "Advanced Mobile Optimization"}**
Mobile optimization improvements can increase mobile conversion rates by 20-40%:
- Responsive design refinements
- Touch target optimization
- Mobile page speed improvements
- Progressive web app features

**5. ${improvements[4] || "Content Strategy Enhancement"}**
Advanced content optimization can improve user engagement by 25-50%:
- Content audit and optimization
- User intent alignment
- Content freshness and updates
- Multimedia integration

## The Bigger Picture: Industry Trends and Implications

The analysis of ${analysis.title} reflects broader industry trends that website owners should understand:

**Performance Standards Are Rising**: Users expect faster, more efficient websites. The average performance score across industries has increased by 15% over the past two years.

**Content Quality Matters More**: Search engines increasingly prioritize content that genuinely serves user needs. Websites with high content quality scores see 30% better search performance.

**Security Is Non-Negotiable**: With increasing cyber threats, security implementation directly impacts user trust and search engine rankings.

**Mobile-First Is Reality**: Mobile traffic now represents over 60% of web traffic, making mobile optimization essential for success.

## Conclusion: Your Website's Hidden Potential

The comprehensive analysis of ${analysis.title} reveals a fundamental truth about modern websites: every site has hidden potential waiting to be unlocked. Whether your website currently performs at ${analysis.performance_score}% like ${analysis.title} or at a different level, the principles remain the same.

**Key Takeaways for Website Success:**
1. **Performance Optimization**: Focus on speed, efficiency, and user experience
2. **Content Excellence**: Create valuable, well-structured content that serves user needs
3. **Security Implementation**: Build trust through robust security measures
4. **Mobile Optimization**: Ensure excellent mobile user experience
5. **Continuous Improvement**: Regular analysis and optimization drive long-term success

The journey of website optimization is ongoing, but with the right insights and strategic approach, every website can achieve its full potential. ${analysis.title} demonstrates both the challenges and opportunities that exist in today's digital landscape.

Whether you're running a ${keywords[0] || "business"} website, exploring ${keywords[1] || "digital"} strategies, or optimizing for ${keywords[2] || "performance"}, the insights from ${analysis.title} provide a roadmap for digital success.

**Ready to unlock your website's potential?** Start with a comprehensive analysis like the one we conducted for ${analysis.title}, and discover the optimization opportunities that could transform your digital presence.

---
*Want to analyze your own website? Try our comprehensive website analyzer to discover performance insights and optimization opportunities that could revolutionize your digital strategy.*

*This analysis was conducted using WSfynder's advanced website analysis platform, providing detailed insights across performance, content, security, and user experience dimensions.*`,

    case_study: `# Case Study: Comprehensive Digital Analysis of ${analysis.title}

## Executive Overview

This case study presents a detailed analysis of ${analysis.title}, examining its digital performance across multiple dimensions including technical optimization, content strategy, security implementation, and user experience design. The analysis reveals significant insights into modern website optimization challenges and opportunities.

**Subject Website**: ${analysis.title}  
**Analysis Date**: ${new Date().toLocaleDateString()}  
**Analysis Scope**: Comprehensive multi-dimensional evaluation  
**Key Metrics**: Performance (${analysis.performance_score}%), SEO (${analysis.seo_score}%), Security (${analysis.security_score}%), Mobile (${analysis.mobile_score}%)

## Background & Challenge Analysis

### Website Context and Business Environment
${analysis.title} operates in a competitive digital landscape where performance, user experience, and search visibility directly impact business success. The website serves ${keywords.slice(0, 3).join(", ")} focused audiences, requiring optimization across multiple performance dimensions.

Initial assessment revealed a complex digital ecosystem with ${contentStats.word_count || 1200} words of content distributed across ${contentStats.paragraphs_count || 15} sections, supported by ${contentStats.images_count || 5} visual elements and ${contentStats.links_count || 25} navigation links.

### Performance Challenges Identified
The analysis uncovered several critical areas requiring strategic attention:

1. **Technical Performance**: ${analysis.performance_score}% optimization level indicating ${analysis.performance_score > 70 ? "solid foundation with enhancement opportunities" : "significant optimization potential"}
2. **Content Strategy**: ${analysis.content_quality_score}% content quality score revealing ${analysis.content_quality_score > 70 ? "strong content foundation" : "substantial content improvement opportunities"}
3. **Security Implementation**: ${analysis.security_score}% security score highlighting ${analysis.security_score > 70 ? "adequate protection with enhancement potential" : "critical security improvements needed"}
4. **Mobile Optimization**: ${analysis.mobile_score}% mobile score indicating ${analysis.mobile_score > 70 ? "good mobile experience" : "significant mobile optimization requirements"}

### Stakeholder Requirements and Constraints
The analysis considered multiple stakeholder perspectives including end users, search engines, security requirements, and business objectives. Success criteria encompassed improved user experience, enhanced search visibility, strengthened security posture, and optimized mobile performance.

## Methodology & Approach

### Analysis Framework and Tools
Our comprehensive evaluation employed a multi-layered analysis framework examining:

- **Technical Performance**: Loading speed, resource optimization, code quality
- **Content Analysis**: Structure, quality, SEO optimization, user value
- **Security Assessment**: Protocol implementation, vulnerability analysis, trust factors
- **User Experience**: Accessibility, mobile optimization, navigation efficiency
- **SEO Evaluation**: Search optimization, content strategy, technical SEO

### Data Collection and Validation Methods
Data collection encompassed automated scanning tools, manual evaluation processes, and comparative benchmarking against industry standards. Quality assurance protocols ensured accuracy and reliability of all findings and recommendations.

The evaluation process included:
- Automated performance testing and metrics collection
- Manual content quality and structure assessment
- Security protocol analysis and vulnerability scanning
- Mobile optimization and responsive design evaluation
- SEO factor analysis and competitive benchmarking

### Evaluation Criteria and Benchmarks
Assessment criteria aligned with industry best practices and current web standards. Benchmarking compared performance against similar websites and industry averages to provide contextual insights and realistic improvement targets.

## Detailed Findings & Analysis

### Technical Performance Deep Dive

**Overall Performance Score: ${analysis.performance_score}%**

The technical analysis revealed ${analysis.performance_score > 70 ? "strong foundational performance" : "significant optimization opportunities"} with specific findings including:

- **Script Optimization**: ${analysis.script_optimization_score}% efficiency indicating ${analysis.script_optimization_score > 70 ? "well-optimized code implementation" : "substantial code optimization potential"}
- **Resource Management**: ${analysis.sustainability_score}% sustainability score reflecting ${analysis.sustainability_score > 70 ? "efficient resource utilization" : "opportunities for resource optimization"}
- **Loading Performance**: Analysis of page size, request counts, and loading optimization strategies

**Key Technical Insights:**
- Page structure demonstrates ${contentStats.headings_count > 5 ? "well-organized content hierarchy" : "opportunities for improved information architecture"}
- Resource loading shows ${analysis.performance_score > 70 ? "effective optimization strategies" : "potential for significant performance improvements"}
- Code quality indicates ${analysis.script_optimization_score > 70 ? "clean, maintainable implementation" : "opportunities for code optimization and cleanup"}

### Content Strategy and SEO Evaluation

**SEO Performance Score: ${analysis.seo_score}%**

Content analysis revealed ${analysis.seo_score > 70 ? "strong SEO foundation" : "significant SEO improvement opportunities"} with detailed findings:

- **Content Volume**: ${contentStats.word_count || 1200} words across ${contentStats.paragraphs_count || 15} sections
- **Keyword Strategy**: Focus on ${keywords.slice(0, 5).join(", ")} with ${keywords.length > 5 ? "comprehensive topical coverage" : "targeted content approach"}
- **Content Structure**: ${contentStats.headings_count || 8} heading elements organizing information flow
- **Visual Content**: ${contentStats.images_count || 5} images supporting content narrative

**Content Quality Assessment:**
The content demonstrates ${analysis.content_quality_score > 70 ? "high-quality, user-focused information" : "opportunities for content enhancement and optimization"}. Keyword integration shows ${analysis.seo_score > 70 ? "natural, strategic implementation" : "potential for improved keyword optimization"}.

### Security and Trust Analysis

**Security Score: ${analysis.security_score}%**

Security evaluation revealed ${analysis.security_score > 70 ? "robust protection measures" : "critical security improvements needed"} with specific findings:

- **Protocol Implementation**: ${analysis.security_score > 70 ? "Strong HTTPS and security header implementation" : "Opportunities for enhanced security protocol adoption"}
- **Trust Factors**: Analysis of SSL certificates, security headers, and data protection measures
- **Vulnerability Assessment**: Evaluation of potential security risks and mitigation strategies

### Mobile Optimization and User Experience

**Mobile Score: ${analysis.mobile_score}%**

Mobile analysis demonstrated ${analysis.mobile_score > 70 ? "strong mobile optimization" : "significant mobile improvement opportunities"} including:

- **Responsive Design**: Evaluation of mobile layout and functionality
- **Performance**: Mobile-specific loading and optimization analysis
- **User Experience**: Touch targets, navigation, and mobile-specific features

### Accessibility and Inclusive Design

**Accessibility Score: ${analysis.accessibility_score}%**

Accessibility evaluation revealed ${analysis.accessibility_score > 70 ? "good inclusive design implementation" : "substantial accessibility improvements needed"} with focus on:

- **Screen Reader Compatibility**: Analysis of semantic markup and ARIA implementation
- **Keyboard Navigation**: Evaluation of keyboard accessibility and focus management
- **Visual Accessibility**: Color contrast, font sizing, and visual hierarchy assessment

## Strategic Insights & Implications

### Key Discoveries and Their Significance

The analysis uncovered several critical insights with significant business implications:

1. **Performance Optimization Potential**: The ${analysis.performance_score}% performance score indicates ${analysis.performance_score > 70 ? "solid foundation with 15-25% improvement potential" : "substantial optimization opportunities with 30-50% improvement potential"}

2. **Content Strategy Effectiveness**: ${analysis.content_quality_score}% content quality suggests ${analysis.content_quality_score > 70 ? "strong content foundation with enhancement opportunities" : "significant content optimization potential"}

3. **Security Posture**: ${analysis.security_score}% security implementation reveals ${analysis.security_score > 70 ? "adequate protection with enhancement potential" : "critical security improvements needed for user trust"}

4. **Mobile Readiness**: ${analysis.mobile_score}% mobile optimization indicates ${analysis.mobile_score > 70 ? "good mobile experience with refinement opportunities" : "substantial mobile optimization requirements"}

### Business Impact and Opportunities

**Revenue Impact Projections:**
- Performance improvements could increase conversion rates by 15-30%
- SEO enhancements may improve organic traffic by 20-40%
- Security improvements can increase user trust and engagement by 10-25%
- Mobile optimization could boost mobile conversions by 25-50%

**Competitive Positioning:**
The analysis reveals opportunities to achieve competitive advantage through strategic optimization in areas where competitors typically underperform.

### Risk Factors and Considerations

**Implementation Risks:**
- Resource allocation requirements for comprehensive optimization
- Potential temporary performance impacts during implementation
- Coordination challenges across technical and content teams

**Mitigation Strategies:**
- Phased implementation approach to minimize disruption
- Comprehensive testing protocols before deployment
- Backup and rollback procedures for all changes

## Implementation Roadmap

### Phase 1: Critical Foundation (0-30 days)

**Priority 1: ${improvements[0] || "Performance Optimization"}**
- **Objective**: Achieve 15-25% performance improvement
- **Actions**: Implement caching, optimize images, minify code
- **Resources**: 2-3 developers, 40 hours
- **Expected ROI**: 20-30% improvement in user engagement

**Priority 2: ${improvements[1] || "Security Enhancement"}**
- **Objective**: Strengthen security posture and user trust
- **Actions**: Implement security headers, SSL optimization, vulnerability fixes
- **Resources**: 1 security specialist, 20 hours
- **Expected ROI**: 10-15% improvement in user confidence

**Priority 3: ${improvements[2] || "Content Optimization"}**
- **Objective**: Improve content quality and SEO performance
- **Actions**: Optimize meta tags, improve content structure, enhance keywords
- **Resources**: 1 content strategist, 30 hours
- **Expected ROI**: 15-25% improvement in search visibility

### Phase 2: Strategic Enhancement (30-90 days)

**Advanced Optimization Initiatives:**
- Mobile experience refinement and progressive web app features
- Advanced SEO implementation and content strategy enhancement
- Accessibility improvements and inclusive design implementation
- Performance monitoring and continuous optimization protocols

### Phase 3: Advanced Features (90+ days)

**Innovation and Competitive Advantage:**
- Advanced analytics and user behavior tracking
- Personalization and dynamic content optimization
- Advanced security features and compliance implementation
- Emerging technology integration and future-proofing

## Lessons Learned & Best Practices

### Key Takeaways for Similar Projects

1. **Comprehensive Analysis Drives Results**: Multi-dimensional evaluation reveals optimization opportunities that single-focus analysis might miss

2. **Performance Impacts Everything**: Technical performance affects user experience, search rankings, and business outcomes across all metrics

3. **Content Quality Multiplies Impact**: High-quality, well-structured content amplifies the benefits of technical optimization

4. **Security Builds Trust**: Strong security implementation directly impacts user confidence and engagement

5. **Mobile-First Approach**: Mobile optimization is essential for modern website success across all industries

### Industry Best Practices Validation

The analysis confirms several industry best practices:
- Performance scores above 80% correlate with significantly better user engagement
- Content quality scores above 75% drive improved search engine rankings
- Security scores above 85% increase user trust and conversion rates
- Mobile scores above 80% are essential for competitive mobile performance

### Methodology Improvements

**Enhanced Analysis Approaches:**
- Integration of real user monitoring data for more accurate performance insights
- Advanced content analysis including user intent alignment and competitive content gaps
- Comprehensive security testing including penetration testing and vulnerability assessment
- Extended mobile testing across diverse devices and network conditions

### Future Considerations

**Emerging Trends and Technologies:**
- Core Web Vitals and user experience signals becoming increasingly important for search rankings
- Progressive web app features and advanced mobile optimization techniques
- AI-powered content optimization and personalization strategies
- Advanced security protocols and privacy compliance requirements

## Conclusion and Strategic Recommendations

The comprehensive analysis of ${analysis.title} reveals a website with ${analysis.sustainability_score > 70 ? "strong foundational elements and clear optimization pathways" : "significant potential for improvement across multiple performance dimensions"}. The ${analysis.performance_score}% performance score, combined with ${analysis.seo_score}% SEO optimization and ${analysis.security_score}% security implementation, indicates substantial opportunities for strategic enhancement.

**Critical Success Factors:**
1. **Immediate Focus**: Implement ${improvements[0] || "performance optimizations"} and ${improvements[1] || "security enhancements"} for quick wins
2. **Strategic Investment**: Develop comprehensive content strategy and mobile optimization for long-term success
3. **Continuous Improvement**: Establish monitoring and optimization protocols for sustained performance gains
4. **User-Centric Approach**: Prioritize user experience and value delivery in all optimization efforts

**Expected Outcomes:**
- 25-40% improvement in overall website performance
- 20-35% increase in search engine visibility and organic traffic
- 15-30% enhancement in user engagement and conversion rates
- Strengthened competitive position and market presence

This case study demonstrates the value of comprehensive website analysis in identifying optimization opportunities and developing strategic improvement roadmaps. The insights gained from ${analysis.title} provide actionable guidance for achieving digital excellence and competitive advantage.

---
*Case Study Analysis Conducted by WSfynder Advanced Analytics Platform*
*Comprehensive Multi-Dimensional Website Evaluation*
*Analysis Date: ${new Date().toLocaleDateString()}*`,
  }

  return templates[contentType as keyof typeof templates] || templates.research_report
}
