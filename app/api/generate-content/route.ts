import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const { analysisId, contentType, tone } = await request.json()

    if (!contentType) {
      return NextResponse.json({ error: "Content type is required" }, { status: 400 })
    }

    if (!analysisId) {
      return NextResponse.json({ error: "Analysis ID is required" }, { status: 400 })
    }

    console.log(`Generating ${contentType} content for analysis ${analysisId} with tone ${tone}`)

    // Get the analysis data from Neon database
    let analysis = null

    try {
      const result = await sql`
        SELECT * FROM website_analyzer.analyses 
        WHERE id = ${analysisId}
      `

      if (result.length > 0) {
        analysis = result[0]
        console.log(`Found analysis for ${analysis.title} (${analysis.url})`)
      }
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Analysis not found in database" }, { status: 404 })
    }

    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 })
    }

    // Generate content using Groq AI or fallback
    let content = ""
    let contentId = null

    try {
      if (process.env.GROQ_API_KEY) {
        console.log("Using Groq AI for content generation")

        // Create an enhanced prompt with the website's description and best practices
        const prompt = createEnhancedResearchPrompt(analysis, contentType, tone || "professional")

        console.log("Generated prompt length:", prompt.length)

        const { text } = await generateText({
          model: groq("llama3-70b-8192"),
          prompt,
          maxTokens: 3000,
          temperature: 0.7,
        })

        content = text
        console.log("Successfully generated content with Groq AI")
      } else {
        console.log("Groq API key not available, using enhanced fallback content")
        content = getEnhancedFallbackContent(contentType, analysis, tone || "professional")
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
        // Continue even if saving fails
      }
    } catch (aiError) {
      console.error("AI generation error:", aiError)
      // Fallback to enhanced predefined content
      console.log("Falling back to enhanced predefined content")
      content = getEnhancedFallbackContent(contentType, analysis, tone || "professional")
    }

    return NextResponse.json({
      content,
      contentId,
      success: true,
      message: "Content generated successfully",
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

/**
 * Creates an enhanced research prompt with best practices and structured guidance
 */
function createEnhancedResearchPrompt(analysis: any, contentType: string, tone: string): string {
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

  const rawData =
    typeof analysis.raw_data === "object"
      ? analysis.raw_data
      : typeof analysis.raw_data === "string"
        ? JSON.parse(analysis.raw_data || "{}")
        : {}

  const websiteDescription = analysis.summary || "No description available"
  const actualContent = rawData.paragraphs?.slice(0, 3).join("\n\n") || "No content samples available"
  const actualHeadings = rawData.headings?.slice(0, 8).join(", ") || "No headings available"

  // Base context about the website
  const websiteContext = `
WEBSITE ANALYSIS DATA:
===================
Website Name: ${analysis.title}
Website URL: ${analysis.url}
Analysis Date: ${new Date(analysis.created_at).toLocaleDateString()}

WEBSITE DESCRIPTION (Generated by our system):
${websiteDescription}

ACTUAL CONTENT SAMPLES FROM THE WEBSITE:
${actualContent}

ACTUAL HEADINGS FROM THE WEBSITE:
${actualHeadings}

KEY FINDINGS FROM OUR ANALYSIS:
${keyPoints.map((point: string, i: number) => `${i + 1}. ${point}`).join("\n")}

PERFORMANCE METRICS:
- Overall Sustainability Score: ${analysis.sustainability_score}%
- Performance Score: ${analysis.performance_score}%
- Script Optimization: ${analysis.script_optimization_score}%
- Content Quality Score: ${analysis.content_quality_score}%

CONTENT STATISTICS:
- Total Words: ${contentStats.wordCount || 0}
- Paragraphs: ${contentStats.paragraphs || 0}
- Headings: ${contentStats.headings || 0}
- Images: ${contentStats.images || 0}
- Links: ${contentStats.links || 0}

KEYWORDS IDENTIFIED:
${keywords.slice(0, 10).join(", ")}

IMPROVEMENT RECOMMENDATIONS:
${improvements.map((imp: string, i: number) => `${i + 1}. ${imp}`).join("\n")}
`

  // Content-type specific instructions with best practices
  let specificInstructions = ""
  let structureGuidelines = ""

  switch (contentType) {
    case "research":
      specificInstructions = `
TASK: Create a comprehensive research report about ${analysis.title}

RESEARCH BEST PRACTICES TO FOLLOW:
1. Use the actual website description provided above as your foundation
2. Reference real data from our analysis, not generic examples
3. Provide actionable insights based on actual findings
4. Include quantitative data from our performance metrics
5. Use the actual content samples to understand the website's purpose
6. Base recommendations on real improvement opportunities identified

UNIQUE RESEARCH STRUCTURE TO IMPLEMENT:
1. Executive Summary (2-3 sentences about the website's core purpose)
2. Website Overview & Purpose (based on actual content and description)
3. Digital Performance Analysis (using real metrics)
4. Content Strategy Assessment (based on actual content samples)
5. Technical Infrastructure Review (based on performance scores)
6. Competitive Positioning (inferred from keywords and content)
7. Strategic Recommendations (based on actual improvement suggestions)
8. Implementation Roadmap (prioritized action items)
9. Success Metrics & KPIs (measurable outcomes)
10. Conclusion & Next Steps

CRITICAL REQUIREMENTS:
- This is about the REAL website ${analysis.title} at ${analysis.url}
- Use the provided website description as your primary source of truth
- Reference actual performance scores and metrics throughout
- Include specific examples from the actual content samples
- Make recommendations based on the real improvement suggestions
- Write in ${tone} tone throughout
- Ensure each section provides unique value and insights
- Use data-driven language and specific numbers where available
`

      structureGuidelines = `
SECTION-BY-SECTION GUIDELINES:

Executive Summary:
- Start with the website's core purpose based on the description
- Highlight 2-3 key findings from our analysis
- State the overall performance level

Website Overview & Purpose:
- Elaborate on the website description provided
- Reference actual headings and content structure
- Explain what the website does based on real content samples

Digital Performance Analysis:
- Use the exact performance scores provided
- Explain what each metric means for this specific website
- Compare scores to industry standards

Content Strategy Assessment:
- Analyze the actual content samples provided
- Reference the real keywords identified
- Assess content quality based on our metrics

Technical Infrastructure Review:
- Use the script optimization and performance scores
- Reference specific technical improvements suggested
- Explain impact on user experience

Strategic Recommendations:
- Use the actual improvement suggestions provided
- Prioritize based on performance impact
- Provide specific implementation guidance

Implementation Roadmap:
- Create phases based on the improvement suggestions
- Assign realistic timelines
- Consider resource requirements

Success Metrics & KPIs:
- Define measurable outcomes
- Set realistic targets based on current scores
- Include both technical and business metrics
`
      break

    case "blog":
      specificInstructions = `
TASK: Write an engaging blog post about the analysis of ${analysis.title}

BLOG BEST PRACTICES:
1. Start with a compelling hook related to the website's actual purpose
2. Use the website description to explain what makes this site interesting
3. Include real performance data as supporting evidence
4. Reference actual content samples to illustrate points
5. Write in an engaging, ${tone} tone
6. Include actionable takeaways for readers
7. Use the actual keywords naturally throughout the content

BLOG STRUCTURE:
1. Compelling headline
2. Hook (interesting fact about the website or industry)
3. Introduction to ${analysis.title} (using the description)
4. What We Discovered (key findings)
5. Performance Insights (real metrics)
6. Content Analysis (actual samples)
7. Key Takeaways for Website Owners
8. Conclusion with actionable advice

Focus on storytelling while incorporating the real data and insights.
`
      break

    case "marketing":
      specificInstructions = `
TASK: Create marketing content for ${analysis.title} based on our analysis

MARKETING BEST PRACTICES:
1. Use the website description to identify unique value propositions
2. Leverage actual performance metrics as proof points
3. Reference real content samples to understand messaging
4. Identify opportunities based on actual improvement suggestions
5. Use the keywords identified for SEO optimization
6. Create compelling copy in ${tone} tone

MARKETING STRUCTURE:
1. Value Proposition (based on website description)
2. Market Position Analysis
3. Performance Advantages (using real scores)
4. Content Strategy Recommendations
5. SEO Opportunities (using actual keywords)
6. Conversion Optimization Suggestions
7. Marketing Campaign Ideas
8. Success Metrics

Focus on actionable marketing strategies based on real analysis data.
`
      break

    case "social":
      specificInstructions = `
TASK: Create social media content about ${analysis.title}

SOCIAL MEDIA BEST PRACTICES:
1. Use the website description to create compelling hooks
2. Include real performance metrics as social proof
3. Reference actual findings for credibility
4. Create platform-specific content
5. Use relevant hashtags based on actual keywords
6. Maintain ${tone} tone across all platforms

SOCIAL CONTENT STRUCTURE:
1. LinkedIn Professional Post
2. Twitter/X Thread (3-5 tweets)
3. Facebook Detailed Post
4. Instagram Caption with Hashtags
5. YouTube Video Description
6. TikTok Video Script

Each piece should reference the real website and actual analysis data.
`
      break

    case "document":
      specificInstructions = `
TASK: Create a formal document about ${analysis.title}

DOCUMENT BEST PRACTICES:
1. Use formal language appropriate for ${tone} tone
2. Structure information logically with clear sections
3. Include executive summary based on website description
4. Present data in tables and bullet points where appropriate
5. Reference actual metrics and findings throughout
6. Provide clear recommendations based on real improvement suggestions

DOCUMENT STRUCTURE:
1. Title Page
2. Executive Summary
3. Methodology
4. Findings (organized by category)
5. Performance Analysis
6. Recommendations
7. Appendices (raw data)

Focus on professional presentation of the analysis data.
`
      break

    default:
      specificInstructions = `
TASK: Create ${contentType} content about ${analysis.title}

Use the website description and analysis data to create relevant, insightful content in ${tone} tone.
Reference actual findings and metrics throughout.
`
  }

  return `${websiteContext}

${specificInstructions}

${structureGuidelines}

TONE: ${tone}

FINAL REMINDERS:
- This is about the REAL website "${analysis.title}" at ${analysis.url}
- Use the website description provided as your foundation
- Reference actual data, metrics, and findings throughout
- Do not use generic examples or placeholder content
- Ensure every section provides unique, valuable insights
- Write in ${tone} tone consistently
- Format your response with proper Markdown formatting
- Make the content actionable and insightful

Begin your response now:`
}

/**
 * Enhanced fallback content with better structure and real data integration
 */
function getEnhancedFallbackContent(contentType: string, analysis: any, tone: string): string {
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
    analysis.summary ||
    `${analysis.title} is a website that we've analyzed for performance, content quality, and technical optimization.`

  switch (contentType) {
    case "research":
      return `# Comprehensive Research Report: ${analysis.title}

## Executive Summary

${websiteDescription}

Our analysis reveals a website with a sustainability score of ${analysis.sustainability_score}% and performance rating of ${analysis.performance_score}%, indicating ${analysis.sustainability_score > 75 ? "strong digital presence" : "significant optimization opportunities"}.

## Website Overview & Purpose

**Website:** ${analysis.url}  
**Analysis Date:** ${new Date(analysis.created_at).toLocaleDateString()}

${analysis.title} serves as ${websiteDescription.toLowerCase()}. Based on our content analysis, the website contains ${contentStats.wordCount || 0} words across ${contentStats.paragraphs || 0} paragraphs, with ${contentStats.headings || 0} structural headings and ${contentStats.images || 0} images.

## Digital Performance Analysis

### Performance Metrics Overview
- **Overall Sustainability Score:** ${analysis.sustainability_score}%
- **Performance Optimization:** ${analysis.performance_score}%
- **Script Efficiency:** ${analysis.script_optimization_score}%
- **Content Quality:** ${analysis.content_quality_score}%

### Performance Assessment
${
  analysis.performance_score > 80
    ? "The website demonstrates excellent performance optimization with fast loading times and efficient resource management."
    : analysis.performance_score > 60
      ? "The website shows moderate performance with room for improvement in loading speed and resource optimization."
      : "The website faces significant performance challenges that impact user experience and search engine rankings."
}

## Content Strategy Assessment

### Key Content Findings
${keyPoints.map((point: string, i: number) => `${i + 1}. ${point}`).join("\n")}

### Keyword Analysis
The website focuses on: ${keywords.slice(0, 8).join(", ")}

This keyword strategy ${keywords.length > 5 ? "demonstrates good topical coverage" : "could benefit from broader keyword targeting"} and aligns with ${analysis.title}'s core purpose.

### Content Quality Metrics
- **Content Volume:** ${contentStats.wordCount || 0} words
- **Structure:** ${contentStats.headings || 0} headings for organization
- **Visual Elements:** ${contentStats.images || 0} images
- **External References:** ${contentStats.links || 0} outbound links

## Technical Infrastructure Review

### Current Technical Status
The technical analysis reveals ${analysis.script_optimization_score > 75 ? "well-optimized" : "suboptimal"} script implementation with a ${analysis.script_optimization_score}% optimization score.

### Critical Technical Findings
${improvements
  .slice(0, 4)
  .map((imp: string, i: number) => `- **Priority ${i + 1}:** ${imp}`)
  .join("\n")}

## Strategic Recommendations

### Immediate Actions (0-30 days)
1. **${improvements[0] || "Optimize page loading speed"}**
   - Impact: High
   - Effort: Medium
   - Expected improvement: 10-15% performance gain

2. **${improvements[1] || "Improve content structure"}**
   - Impact: Medium
   - Effort: Low
   - Expected improvement: Better user engagement

### Medium-term Initiatives (1-3 months)
3. **${improvements[2] || "Enhance mobile responsiveness"}**
   - Impact: High
   - Effort: High
   - Expected improvement: 20% better mobile performance

4. **${improvements[3] || "Implement SEO best practices"}**
   - Impact: Medium
   - Effort: Medium
   - Expected improvement: Improved search visibility

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- Address critical performance issues
- Implement basic optimization techniques
- Set up monitoring and analytics

### Phase 2: Enhancement (Weeks 3-6)
- Content optimization and restructuring
- Advanced technical improvements
- User experience enhancements

### Phase 3: Optimization (Weeks 7-12)
- Fine-tuning and advanced features
- A/B testing implementation
- Continuous improvement processes

## Success Metrics & KPIs

### Technical KPIs
- Target sustainability score: ${Math.min(95, analysis.sustainability_score + 20)}%
- Target performance score: ${Math.min(95, analysis.performance_score + 25)}%
- Page load time: < 3 seconds
- Mobile performance: > 90%

### Business KPIs
- User engagement: +30%
- Bounce rate: -25%
- Conversion rate: +15%
- Search rankings: Top 10 for primary keywords

## Conclusion & Next Steps

${analysis.title} ${analysis.sustainability_score > 70 ? "demonstrates solid fundamentals with clear opportunities for enhancement" : "requires significant optimization to reach its full potential"}. The recommended improvements focus on ${improvements[0]?.toLowerCase() || "performance optimization"} and ${improvements[1]?.toLowerCase() || "content enhancement"}.

**Immediate Next Steps:**
1. Begin with ${improvements[0] || "performance optimization"}
2. Implement monitoring for key metrics
3. Schedule monthly performance reviews
4. Plan content strategy improvements

This analysis provides a roadmap for transforming ${analysis.title} into a high-performing, user-friendly website that achieves its business objectives.

---
*Analysis completed on ${new Date().toLocaleDateString()} | Generated by DevSphere Website Analyzer*`

    case "blog":
      return `# ${analysis.title}: A Deep Dive into Website Performance and Strategy

## The Digital Landscape Challenge

In today's competitive digital environment, website performance can make or break user experience. When we analyzed ${analysis.title}, we discovered fascinating insights about how ${websiteDescription.toLowerCase()}.

## Meet ${analysis.title}

${websiteDescription}

Located at ${analysis.url}, this website serves ${contentStats.wordCount > 1000 ? "comprehensive content" : "focused information"} across ${contentStats.paragraphs || 0} content sections, making it ${contentStats.wordCount > 2000 ? "a content-rich resource" : "a streamlined digital presence"}.

## What Our Analysis Revealed

### Performance Snapshot
Our comprehensive analysis uncovered some interesting performance metrics:

- **Sustainability Score:** ${analysis.sustainability_score}% ${analysis.sustainability_score > 75 ? "🟢" : analysis.sustainability_score > 50 ? "🟡" : "🔴"}
- **Performance Rating:** ${analysis.performance_score}% ${analysis.performance_score > 75 ? "🟢" : analysis.performance_score > 50 ? "🟡" : "🔴"}
- **Content Quality:** ${analysis.content_quality_score}% ${analysis.content_quality_score > 75 ? "🟢" : analysis.content_quality_score > 50 ? "🟡" : "🔴"}

### Key Discoveries

${keyPoints.map((point: string, i: number) => `**${i + 1}. ${point}**`).join("\n\n")}

## The Content Strategy Deep Dive

${analysis.title} focuses on ${keywords.slice(0, 5).join(", ")}, which tells us a lot about their target audience and market positioning. With ${contentStats.images || 0} images and ${contentStats.links || 0} external links, the site ${contentStats.images > 10 ? "leverages visual storytelling effectively" : "maintains a clean, text-focused approach"}.

## Performance Insights That Matter

${
  analysis.performance_score > 80
    ? `${analysis.title} excels in performance optimization, demonstrating best practices that many websites struggle to achieve. This level of optimization typically results in better user engagement and higher search engine rankings.`
    : analysis.performance_score > 60
      ? `${analysis.title} shows moderate performance with clear opportunities for improvement. The ${analysis.performance_score}% score indicates solid fundamentals but suggests that optimization efforts could yield significant benefits.`
      : `${analysis.title} faces performance challenges that likely impact user experience. With a ${analysis.performance_score}% performance score, there's substantial room for improvement that could dramatically enhance user satisfaction.`
}

## What This Means for Website Owners

### Lesson 1: Performance Drives Experience
${analysis.title}'s ${analysis.performance_score}% performance score demonstrates ${analysis.performance_score > 70 ? "how proper optimization creates seamless user experiences" : "the importance of addressing performance bottlenecks"}.

### Lesson 2: Content Structure Matters
With ${contentStats.headings || 0} headings organizing ${contentStats.paragraphs || 0} content sections, ${analysis.title} ${contentStats.headings > 5 ? "shows good content hierarchy" : "could benefit from better content organization"}.

### Lesson 3: Technical Optimization Is Crucial
The ${analysis.script_optimization_score}% script optimization score reveals ${analysis.script_optimization_score > 70 ? "efficient technical implementation" : "opportunities for technical improvements"}.

## Actionable Takeaways

Based on our analysis of ${analysis.title}, here are key recommendations that any website owner can apply:

${improvements
  .slice(0, 5)
  .map(
    (imp: string, i: number) => `### ${i + 1}. ${imp}

This improvement can ${i === 0 ? "significantly boost" : i === 1 ? "enhance" : "improve"} website performance and user experience.`,
  )
  .join("\n\n")}

## The Bottom Line

${analysis.title} ${analysis.sustainability_score > 70 ? "demonstrates that thoughtful website development pays dividends in performance and user experience" : "illustrates common challenges that many websites face, along with clear paths to improvement"}.

For website owners looking to improve their digital presence, the key lessons from ${analysis.title} are:

1. **Prioritize Performance:** ${analysis.performance_score > 70 ? "Maintain" : "Improve"} loading speeds and technical optimization
2. **Structure Content Strategically:** Use clear headings and logical organization
3. **Monitor and Iterate:** Regular analysis reveals optimization opportunities
4. **Focus on User Experience:** Every technical decision should enhance user satisfaction

Whether you're running a ${keywords[0] || "business"} website or exploring ${keywords[1] || "digital"} strategies, the insights from ${analysis.title} provide a roadmap for digital success.

---
*Want to analyze your own website? Try our comprehensive website analyzer to discover performance insights and optimization opportunities.*`

    case "marketing":
      return `# Marketing Strategy Analysis: ${analysis.title}

## Executive Summary

${websiteDescription}

Our comprehensive analysis of ${analysis.title} reveals significant marketing opportunities with a current digital performance score of ${analysis.sustainability_score}%.

## Market Position Analysis

### Current Digital Presence
- **Website:** ${analysis.url}
- **Performance Score:** ${analysis.performance_score}%
- **Content Volume:** ${contentStats.wordCount || 0} words
- **Visual Assets:** ${contentStats.images || 0} images
- **External Connections:** ${contentStats.links || 0} links

### Target Market Insights
Based on content analysis, ${analysis.title} targets audiences interested in:
${keywords
  .slice(0, 8)
  .map((keyword: string) => `- ${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`)
  .join("\n")}

## Performance Advantages

### Competitive Strengths
${
  analysis.performance_score > 75
    ? `${analysis.title} demonstrates superior technical performance with ${analysis.performance_score}% optimization, providing a competitive advantage in user experience and search rankings.`
    : `${analysis.title} has foundational strengths with ${analysis.performance_score}% performance, indicating solid technical infrastructure ready for optimization.`
}

### Key Differentiators
${keyPoints.map((point: string, i: number) => `**${i + 1}. ${point}**`).join("\n")}

## Content Strategy Recommendations

### Content Optimization Opportunities
- **Current Content Volume:** ${contentStats.wordCount || 0} words across ${contentStats.paragraphs || 0} sections
- **Structural Elements:** ${contentStats.headings || 0} headings for organization
- **Engagement Potential:** ${contentStats.images > 10 ? "High visual engagement" : "Opportunity for visual enhancement"}

### Messaging Strategy
Focus on ${keywords.slice(0, 3).join(", ")} to align with audience interests and search behavior.

## SEO & Digital Marketing Opportunities

### Primary Keywords
Target these high-potential keywords identified in the analysis:
${keywords
  .slice(0, 10)
  .map((keyword: string, i: number) => `${i + 1}. ${keyword}`)
  .join("\n")}

### Technical SEO Status
- **Performance Score:** ${analysis.performance_score}% (${analysis.performance_score > 75 ? "Excellent" : analysis.performance_score > 50 ? "Good" : "Needs Improvement"})
- **Content Quality:** ${analysis.content_quality_score}% (${analysis.content_quality_score > 75 ? "High" : analysis.content_quality_score > 50 ? "Moderate" : "Low"})
- **Technical Optimization:** ${analysis.script_optimization_score}%

## Conversion Optimization Strategy

### Current Conversion Factors
${
  analysis.performance_score > 70
    ? "Strong technical performance supports conversion optimization efforts"
    : "Performance improvements needed to maximize conversion potential"
}

### Optimization Priorities
${improvements
  .slice(0, 4)
  .map((imp: string, i: number) => `**Priority ${i + 1}:** ${imp}`)
  .join("\n")}

## Marketing Campaign Recommendations

### Campaign 1: Performance Excellence
**Objective:** Leverage ${analysis.performance_score}% performance score
**Strategy:** Highlight speed and reliability in marketing messages
**Target:** Performance-conscious users

### Campaign 2: Content Authority
**Objective:** Capitalize on ${contentStats.wordCount || 0} words of content
**Strategy:** Position as industry knowledge leader
**Target:** Information-seeking audience

### Campaign 3: Technical Innovation
**Objective:** Showcase ${analysis.script_optimization_score}% optimization
**Strategy:** Appeal to technically-minded prospects
**Target:** Tech-savvy decision makers

## Social Media Strategy

### Platform Recommendations
- **LinkedIn:** Professional content about ${keywords[0] || "industry topics"}
- **Twitter:** Quick insights and ${keywords[1] || "industry"} updates
- **Facebook:** Community building around ${keywords[2] || "core topics"}

### Content Themes
1. Performance and reliability (${analysis.performance_score}% score)
2. Industry expertise (${keywords.slice(0, 3).join(", ")})
3. Technical innovation (${analysis.script_optimization_score}% optimization)

## Success Metrics & KPIs

### Marketing KPIs
- **Traffic Growth:** Target 25% increase in 6 months
- **Conversion Rate:** Improve by 15% through optimization
- **Brand Awareness:** Increase by 30% in target market
- **Lead Quality:** Improve by 20% through better targeting

### Technical KPIs
- **Performance Score:** Target ${Math.min(95, analysis.performance_score + 20)}%
- **Page Load Time:** Under 3 seconds
- **Mobile Performance:** 90%+ optimization
- **SEO Rankings:** Top 10 for primary keywords

## Implementation Timeline

### Phase 1: Foundation (Month 1)
- Implement priority technical improvements
- Launch performance-focused messaging
- Begin content optimization

### Phase 2: Growth (Months 2-3)
- Execute targeted campaigns
- Expand content marketing
- Optimize conversion funnels

### Phase 3: Scale (Months 4-6)
- Advanced automation
- Market expansion
- Performance refinement

## Budget Allocation Recommendations

### Technical Optimization: 40%
Focus on ${improvements[0] || "performance improvements"} and ${improvements[1] || "technical enhancements"}

### Content Marketing: 35%
Leverage ${keywords.slice(0, 5).join(", ")} for content strategy

### Paid Advertising: 25%
Target high-intent keywords and performance messaging

## Conclusion

${analysis.title} presents strong marketing opportunities with ${analysis.sustainability_score > 70 ? "solid fundamentals" : "clear improvement potential"}. The combination of ${analysis.performance_score}% performance and focus on ${keywords.slice(0, 3).join(", ")} creates a foundation for effective marketing campaigns.

**Next Steps:**
1. Implement ${improvements[0] || "priority optimizations"}
2. Launch performance-focused campaigns
3. Monitor and optimize based on KPIs
4. Scale successful initiatives

---
*Marketing analysis completed ${new Date().toLocaleDateString()} | DevSphere Website Analyzer*`

    case "social":
      return `# Social Media Content Strategy: ${analysis.title}

## Content Overview
Based on our analysis of ${analysis.title}, here's platform-specific social media content that leverages real performance data and insights.

## LinkedIn Professional Posts

### Post 1: Performance Spotlight
\`\`\`
🔍 Just completed an in-depth analysis of ${analysis.title} and the results are fascinating!

📊 Key Performance Metrics:
• Sustainability Score: ${analysis.sustainability_score}%
• Performance Rating: ${analysis.performance_score}%
• Content Quality: ${analysis.content_quality_score}%

${analysis.sustainability_score > 75 ? "Impressive optimization across the board! 🚀" : "Great foundation with clear optimization opportunities 📈"}

What stood out most: ${keyPoints[0] || "Strong technical foundation"}

Key insight: ${improvements[0] || "Performance optimization is crucial for user experience"}

#WebsiteAnalysis #DigitalPerformance #${keywords[0]?.replace(/\s+/g, "") || "WebDev"} #UserExperience

What's your experience optimizing website performance? Share your biggest challenge below! 👇
\`\`\`

### Post 2: Industry Insights
\`\`\`
💡 Analyzing ${analysis.title} revealed some interesting trends in ${keywords[0] || "digital"} strategy:

🎯 Content Strategy Insights:
• ${contentStats.wordCount || 0} words of content
• ${contentStats.headings || 0} structural headings
• ${contentStats.images || 0} visual elements
• Focus on: ${keywords.slice(0, 3).join(", ")}

Key takeaway: ${keyPoints[1] || "Content structure significantly impacts user engagement"}

For ${keywords[0] || "industry"} professionals, this demonstrates the importance of ${improvements[0]?.toLowerCase() || "strategic optimization"}.

#ContentStrategy #${keywords[0]?.replace(/\s+/g, "") || "Digital"}Marketing #WebsiteOptimization

How do you approach content strategy for your website? Let's discuss! 💬
\`\`\`

## Twitter/X Thread

### Thread: Performance Analysis
\`\`\`
🧵 Thread: Analyzed ${analysis.title} and found some eye-opening insights about website performance 

1/5 📊 The numbers:
• ${analysis.sustainability_score}% sustainability
• ${analysis.performance_score}% performance
• ${analysis.content_quality_score}% content quality

${analysis.performance_score > 75 ? "Strong performance foundation! 🚀" : "Room for optimization 📈"}

2/5 🎯 What makes it interesting:
${keyPoints
  .slice(0, 2)
  .map((point: string) => `• ${point}`)
  .join("\n")}

3/5 💡 Key insight: ${improvements[0] || "Performance optimization drives user experience"}

This is especially relevant for ${keywords[0] || "websites"} focusing on ${keywords[1] || "user engagement"}.

4/5 🔧 Top recommendations:
${improvements
  .slice(0, 3)
  .map((imp: string, i: number) => `${i + 1}. ${imp}`)
  .join("\n")}

5/5 🎯 Bottom line: ${analysis.sustainability_score > 70 ? "Solid foundation with optimization opportunities" : "Clear roadmap for improvement"}

What's your biggest website performance challenge? 

#WebPerformance #${keywords[0]?.replace(/\s+/g, "") || "WebDev"} #UX
\`\`\`

## Facebook Detailed Post

\`\`\`
🔍 Website Analysis Deep Dive: ${analysis.title}

I recently analyzed ${analysis.title} and discovered some fascinating insights about modern website performance and strategy.

📈 Performance Snapshot:
${websiteDescription}

🎯 What We Found:
${keyPoints.map((point: string) => `✅ ${point}`).join("\n")}

📊 By the Numbers:
• Overall Score: ${analysis.sustainability_score}%
• Performance: ${analysis.performance_score}%
• Content Quality: ${analysis.content_quality_score}%
• Content Volume: ${contentStats.wordCount || 0} words
• Visual Elements: ${contentStats.images || 0} images

💡 Key Insights:
The analysis revealed that ${analysis.title} ${analysis.performance_score > 70 ? "demonstrates strong technical fundamentals" : "has significant optimization opportunities"}. The focus on ${keywords.slice(0, 3).join(", ")} shows a clear understanding of their target audience.

🔧 Top Recommendations:
${improvements
  .slice(0, 4)
  .map((imp: string, i: number) => `${i + 1}. ${imp}`)
  .join("\n")}

🎯 Takeaway for Website Owners:
${analysis.performance_score > 70 ? "Consistent optimization efforts pay dividends in user experience and search rankings" : "Strategic improvements can dramatically enhance website performance and user satisfaction"}.

What's your experience with website optimization? Have you noticed the impact of performance on user engagement?

#WebsiteAnalysis #DigitalMarketing #${keywords[0]?.replace(/\s+/g, "") || "WebDev"} #UserExperience #ContentStrategy
\`\`\`

## Instagram Caption & Hashtags

\`\`\`
📊 Website Analysis Results: ${analysis.title} ✨

Just completed a comprehensive analysis and the insights are incredible! 

🎯 Quick Stats:
• ${analysis.sustainability_score}% sustainability score
• ${contentStats.wordCount || 0} words of content
• ${contentStats.images || 0} images analyzed
• Focus: ${keywords.slice(0, 2).join(" & ")}

💡 Key Finding: ${keyPoints[0] || "Performance optimization is crucial"}

${analysis.sustainability_score > 75 ? "Impressive optimization! 🚀" : "Great potential for growth 📈"}

Swipe to see the full breakdown! 👉

What's your biggest website challenge? Drop it in the comments! 💬

#WebsiteAnalysis #DigitalMarketing #${keywords[0]?.replace(/\s+/g, "") || "WebDev"} #ContentStrategy #UserExperience #WebDesign #SEO #Performance #Analytics #DigitalStrategy #WebOptimization #UXDesign #ContentMarketing #TechAnalysis #WebsiteOptimization
\`\`\`

## YouTube Video Description

\`\`\`
🔍 Complete Website Analysis: ${analysis.title} | Performance Review & Optimization Tips

In this detailed analysis, we dive deep into ${analysis.title} to uncover performance insights, content strategy, and optimization opportunities.

📊 ANALYSIS HIGHLIGHTS:
• Sustainability Score: ${analysis.sustainability_score}%
• Performance Rating: ${analysis.performance_score}%
• Content Quality: ${analysis.content_quality_score}%

🎯 WHAT WE DISCOVERED:
${keyPoints.map((point: string, i: number) => `${i + 1}. ${point}`).join("\n")}

🔧 TOP RECOMMENDATIONS:
${improvements
  .slice(0, 5)
  .map((imp: string, i: number) => `${i + 1}. ${imp}`)
  .join("\n")}

💡 KEY TAKEAWAYS:
${analysis.title} ${analysis.sustainability_score > 70 ? "demonstrates strong digital fundamentals with clear optimization opportunities" : "shows significant potential for improvement across multiple performance areas"}.

🎯 TIMESTAMPS:
0:00 Introduction
1:30 Performance Overview
3:45 Content Analysis
6:20 Technical Review
8:15 Recommendations
10:30 Implementation Tips
12:45 Conclusion

📈 RESOURCES MENTIONED:
• Website Analyzer Tool: [Link]
• Performance Guide: [Link]
• Optimization Checklist: [Link]

#WebsiteAnalysis #${keywords[0]?.replace(/\s+/g, "") || "WebDev"} #PerformanceOptimization #ContentStrategy #SEO #WebDesign #DigitalMarketing #UXDesign #WebsiteOptimization #TechnicalSEO #UserExperience

👍 Like this video if it helped you understand website analysis better!
🔔 Subscribe for more website optimization content!
💬 Comment below with your website analysis questions!
\`\`\`

## TikTok Video Script

\`\`\`
🎬 TikTok Video Script: "${analysis.title} Website Analysis in 60 Seconds"

[0-5s] Hook: "I analyzed ${analysis.title} and found something surprising..."

[5-15s] Quick Stats Display:
• ${analysis.sustainability_score}% sustainability
• ${analysis.performance_score}% performance  
• ${contentStats.wordCount || 0} words of content

[15-30s] Key Finding: "${keyPoints[0] || "Performance optimization is crucial"}"

[30-45s] Top Tip: "${improvements[0] || "Focus on loading speed optimization"}"

[45-55s] Result: "${analysis.sustainability_score > 70 ? "Strong foundation for growth!" : "Huge potential for improvement!"}"

[55-60s] CTA: "Want your website analyzed? Link in bio!"

Text Overlay Ideas:
• "Website Analysis Results 📊"
• "${analysis.sustainability_score}% Score"
• "Key Finding: ${keyPoints[0]?.substring(0, 30) || "Performance matters"}..."
• "Top Tip: ${improvements[0]?.substring(0, 30) || "Optimize loading speed"}..."

Hashtags: #WebsiteAnalysis #${keywords[0]?.replace(/\s+/g, "") || "WebDev"} #PerformanceOptimization #DigitalMarketing #WebDesign #TechTips #SEO #UserExperience #WebsiteOptimization #ContentStrategy
\`\`\`

---
*Social media content generated based on real analysis data from ${analysis.title} | ${new Date().toLocaleDateString()}*`

    default:
      return `# ${contentType.charAt(0).toUpperCase() + contentType.slice(1)} Content: ${analysis.title}

## Overview
${websiteDescription}

## Analysis Summary
**Website:** ${analysis.url}  
**Analysis Date:** ${new Date(analysis.created_at).toLocaleDateString()}

## Key Findings
${keyPoints.map((point: string, i: number) => `${i + 1}. ${point}`).join("\n")}

## Performance Metrics
- **Sustainability Score:** ${analysis.sustainability_score}%
- **Performance:** ${analysis.performance_score}%
- **Content Quality:** ${analysis.content_quality_score}%

## Recommendations
${improvements.map((imp: string, i: number) => `${i + 1}. ${imp}`).join("\n")}

## Keywords
${keywords.join(", ")}

---
*Generated by DevSphere Website Analyzer*`
  }
}
