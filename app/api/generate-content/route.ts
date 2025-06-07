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
    case "research_report": // was "research"
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

    case "blog_post": // was "blog"
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

    case "marketing_copy": // was "marketing"
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

    case "academic_summary":
      specificInstructions = `
TASK: Create a concise academic summary of the analysis of ${analysis.title}.

ACADEMIC SUMMARY BEST PRACTICES:
1. Focus on objective findings and data-driven insights from the analysis.
2. Use formal, academic language in a ${tone} tone.
3. Clearly state the purpose of the analysis and key outcomes.
4. Reference specific metrics and data points (e.g., performance scores, content stats).
5. Structure the summary logically: Introduction, Methodology (implied by analysis), Key Findings, Discussion/Implications, Conclusion.
6. Avoid marketing language or overly subjective statements.

ACADEMIC SUMMARY STRUCTURE:
1. Abstract/Brief Overview (1-2 sentences).
2. Introduction: Purpose of analyzing ${analysis.title}.
3. Key Analytical Findings: Summarize crucial data points from performance, content, and technical aspects.
4. Discussion: Interpret the findings and their potential implications for the website's effectiveness or field.
5. Conclusion: Briefly reiterate the main takeaways from the analysis.

CRITICAL REQUIREMENTS:
- Maintain a scholarly ${tone} tone.
- Prioritize factual information from the WEBSITE ANALYSIS DATA.
- Ensure clarity, conciseness, and precision.
`
      break

    case "generic_document": // was "document"
      specificInstructions = `
TASK: Generate a formal document based on the analysis of ${analysis.title}.

FORMAL DOCUMENT BEST PRACTICES:
1. Use formal language appropriate for ${tone} tone
2. Structure information logically with clear sections, headings, and subheadings.
3. Include an executive summary based on website description and key findings.
4. Present data in tables, bullet points, or lists where appropriate for readability.
5. Reference actual metrics and findings throughout the document.
6. Provide clear, actionable recommendations if applicable, based on real improvement suggestions.

DOCUMENT STRUCTURE (Adaptable based on specific needs, but provide a general template):
1. Title: Formal Document Regarding Analysis of ${analysis.title}
2. Date of Generation: ${new Date().toLocaleDateString()}
3. Executive Summary: A concise overview of the analysis purpose, key findings, and overall assessment.
4. Introduction: Background on ${analysis.title} and the objectives of the analysis.
5. Detailed Analysis Sections:
    5.1. Performance Metrics Overview (using actual scores)
    5.2. Content Strategy & SEO Insights (based on keywords, content stats)
    5.3. Technical Infrastructure Assessment (script optimization, etc.)
    5.4. Sustainability Insights (if applicable from scores)
6. Key Findings Summary: Bulleted list of the most critical discoveries.
7. Recommendations (Optional, if applicable): Actionable steps based on identified improvements.
8. Conclusion: Final thoughts and overall assessment.
9. Appendix (Optional): Reference to raw data points or detailed metrics.

Focus on professional presentation of the analysis data.
`
      break

    case "article":
      specificInstructions = `
TASK: Write an in-depth article about the analysis of ${analysis.title}.

ARTICLE WRITING BEST PRACTICES:
1. Develop a clear thesis or central theme for the article based on the analysis.
2. Structure with an engaging introduction, well-developed body paragraphs, and a strong conclusion.
3. Incorporate storytelling elements where appropriate, using the website's data as a case study.
4. Use the ${tone} tone consistently. If "journalistic", maintain objectivity. If "analytical", provide deep insights.
5. Support claims with specific data and examples from the WEBSITE ANALYSIS DATA.
6. Include direct quotes or paraphrased insights from the 'Key Findings' or 'Improvements' sections.

ARTICLE STRUCTURE:
1. Catchy Headline: Reflecting the core insight of the article.
2. Introduction: Hook the reader and introduce ${analysis.title} and the purpose of the analysis.
3. Body Paragraphs (Multiple):
    - Each paragraph focusing on a specific aspect (e.g., Performance Deep Dive, Content Effectiveness, Technical Soundness).
    - Integrate data, findings, and improvement suggestions naturally.
    - Compare/contrast aspects if relevant.
4. Analysis/Interpretation: Go beyond just stating facts; explain what they mean.
5. Conclusion: Summarize the main points and offer a final thought or call to action (if appropriate for the tone).
`
      break

    case "test_report":
      specificInstructions = `
TASK: Create an analytical test report for ${analysis.title} based on the provided analysis data.

TEST REPORT BEST PRACTICES:
1. Present information in a structured, factual, and objective manner using a ${tone} tone.
2. Clearly define the "tests" as the different aspects of the website analysis (Performance, Content Quality, SEO, etc.).
3. For each "test area", report the metrics/findings (scores, stats, keywords).
4. Identify any "issues" or "areas for improvement" based on the 'Improvements' section of the analysis.
5. Conclude with an overall assessment and prioritized recommendations.

TEST REPORT STRUCTURE:
1. Report Title: Analytical Test Report for ${analysis.title}
2. Report Date: ${new Date().toLocaleDateString()}
3. Executive Summary: Overview of tests conducted (analysis areas) and summary of key results.
4. Test Areas & Results:
    4.1. Performance Test: Metrics (Overall Score, Load Times if available), Findings.
    4.2. Content Quality & SEO Test: Metrics (Content Score, Word Count, Keywords), Findings.
    4.3. Technical Test: Metrics (Script Optimization), Findings.
    4.4. Sustainability Test: Metrics (Sustainability Score), Findings.
5. Summary of Issues/Observations: Bulleted list of key areas needing attention from 'Improvements'.
6. Recommendations: Prioritized list of actions.
7. Overall Conclusion: Final assessment of the website based on the "tests".
`
      break

    case "case_study":
      specificInstructions = `
TASK: Develop a case study on ${analysis.title} using the analysis data.

CASE STUDY BEST PRACTICES:
1. Structure as a narrative: Problem/Challenge (implied by areas for improvement), Solution (applied analysis), Results (current state), and Future Recommendations.
2. Use the ${tone} tone. If for marketing, highlight strengths and potential. If for internal review, focus on honest assessment.
3. Clearly present ${analysis.title} as the subject of the case study.
4. Use specific data points from the analysis to illustrate points.
5. Focus on what can be learned from this website's current state and analysis.

CASE STUDY STRUCTURE:
1. Title: Case Study: Analyzing the Digital Presence of ${analysis.title}
2. Introduction: Introduce ${analysis.title} and the objective of this case study (to understand its digital effectiveness).
3. Background/Situation: Describe ${analysis.title} based on its summary and content samples.
4. Analysis & Findings (The Core of the Case Study):
    - Present key metrics (Performance, Content, SEO, Sustainability).
    - Discuss significant findings from 'Key Points'.
    - Highlight strengths and weaknesses identified in the analysis.
5. Challenges/Opportunities: Frame 'Improvements' as challenges to overcome or opportunities for growth.
6. Discussion/Lessons Learned: What insights can be drawn from this analysis?
7. Conclusion & Recommendations: Summarize the case and suggest future strategic directions for ${analysis.title}.
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
    case "research_report":
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

    case "blog_post":
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

    case "marketing_copy":
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

    case "academic_summary":
      return `# Academic Summary: Analysis of ${analysis.title}
**Date:** ${new Date().toLocaleDateString()}
**Subject:** ${analysis.title} (${analysis.url})

**Abstract:** This summary presents key findings from a digital analysis of ${analysis.title}, focusing on performance, content strategy, and technical optimization. The analysis utilized automated tools to assess various metrics, providing a snapshot of the website's current digital efficacy.

**1. Introduction:** The website ${analysis.title}, accessible at ${analysis.url}, was analyzed to evaluate its overall digital presence and identify areas for potential enhancement. The primary goal was to objectively measure its performance against standard web benchmarks.

**2. Key Analytical Findings:**
    - **Performance Metrics:** Overall Sustainability Score: ${analysis.sustainability_score}%; Performance Optimization: ${analysis.performance_score}%; Script Efficiency: ${analysis.script_optimization_score}%.
    - **Content & SEO:** Content Quality Score: ${analysis.content_quality_score}%; Total Words: ${contentStats.wordCount || "N/A"}; Identified Keywords: ${keywords.slice(0, 5).join(", ") || "N/A"}.
    - **Key Observations:** ${
      keyPoints
        .slice(0, 3)
        .map((p: string) => `- ${p}`)
        .join("\n") || "No specific key points highlighted in data."
    }

**3. Discussion:** The data indicates ${analysis.title} ${(analysis.performance_score || 0) > 70 ? "demonstrates a relatively strong technical foundation" : "has notable areas for technical improvement"}. The content volume and keyword focus suggest ${(contentStats.wordCount || 0) > 1000 ? "a significant content base" : "a concise content strategy"}. Identified improvement areas primarily revolve around: ${improvements.slice(0, 2).join("; ") || "general best practices"}.

**4. Conclusion:** The analysis provides a quantitative overview of ${analysis.title}'s digital standing. While exhibiting ${(analysis.sustainability_score || 0) > 60 ? "several strengths" : "some foundational elements"}, strategic attention to ${improvements[0] || "performance optimization"} and ${improvements[1] || "content refinement"} could further enhance its effectiveness.

---
*Generated by WScrapierr - AI Content Studio*`

    case "generic_document":
    case "article":
    case "test_report":
    case "case_study":
      // For these new types, a more generic fallback is fine for now,
      // as the main generation logic relies on the detailed prompts above.
      return `# ${contentType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}: ${analysis.title}
## Overview
${websiteDescription}
This document provides a ${contentType.replace(/_/g, " ")} based on the automated analysis of ${analysis.title}.
Key metrics include: Performance (${analysis.performance_score}%), Sustainability (${analysis.sustainability_score}%), Content Quality (${analysis.content_quality_score}%).
Further details would be populated by the AI based on the specific prompt for this content type.
---
*Generated by WScrapierr - AI Content Studio*`

    default:
      return `# ${contentType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}: ${analysis.title}
## Overview
${websiteDescription}
This document provides a ${contentType.replace(/_/g, " ")} based on the automated analysis of ${analysis.title}.
Key metrics include: Performance (${analysis.performance_score}%), Sustainability (${analysis.sustainability_score}%), Content Quality (${analysis.content_quality_score}%).
Further details would be populated by the AI based on the specific prompt for this content type.
---
*Generated by WScrapierr - AI Content Studio*`
  }
}
