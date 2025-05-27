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

    // Get the analysis data from Neon database
    let analysis = null

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
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 })
    }

    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 })
    }

    // Use Groq if available, otherwise use predefined content
    let content = ""
    let contentId = null

    try {
      if (process.env.GROQ_API_KEY) {
        // Create a sophisticated prompt based on the analysis and content type
        const prompt = createAdvancedPrompt(analysis, contentType, tone || "professional")

        const { text } = await generateText({
          model: groq("llama3-70b-8192"),
          prompt,
          maxTokens: 2000,
        })

        content = text
      } else {
        // Fallback content if Groq is not available
        content = getFallbackContent(contentType, analysis, tone || "professional")
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
      } catch (saveError) {
        console.error("Error saving content:", saveError)
        // Continue even if saving fails
      }
    } catch (aiError) {
      console.error("AI generation error:", aiError)
      // Fallback to predefined content
      content = getFallbackContent(contentType, analysis, tone || "professional")
    }

    return NextResponse.json({ content, contentId })
  } catch (error) {
    console.error("Error generating content:", error)
    return NextResponse.json({
      content: "# Error Generating Content\n\nThere was an error generating the requested content. Please try again.",
      error: "Failed to generate content",
    })
  }
}

/**
 * Creates an advanced prompt for Groq based on content type and analysis data
 */
function createAdvancedPrompt(analysis: any, contentType: string, tone: string): string {
  // Parse JSON fields if they're strings
  const keyPoints =
    typeof analysis.key_points === "string" ? JSON.parse(analysis.key_points) : analysis.key_points || []

  const keywords = typeof analysis.keywords === "string" ? JSON.parse(analysis.keywords) : analysis.keywords || []

  const improvements =
    typeof analysis.improvements === "string" ? JSON.parse(analysis.improvements) : analysis.improvements || []

  const contentStats =
    typeof analysis.content_stats === "string" ? JSON.parse(analysis.content_stats) : analysis.content_stats || {}

  const rawData = typeof analysis.raw_data === "string" ? JSON.parse(analysis.raw_data) : analysis.raw_data || {}

  const analysisData = `
    WEBSITE BEING ANALYZED: ${analysis.title}
    WEBSITE URL: ${analysis.url}
    
    ANALYSIS SUMMARY: ${analysis.summary}
    
    KEY FINDINGS FROM THIS SPECIFIC WEBSITE:
    ${keyPoints.map((point: string, i: number) => `${i + 1}. ${point}`).join("\n")}
    
    KEYWORDS FOUND ON THIS WEBSITE: ${keywords.join(", ")}
    
    PERFORMANCE METRICS FOR ${analysis.title}:
    - Overall Sustainability Score: ${analysis.sustainability_score}%
    - Performance Score: ${analysis.performance_score}%
    - Script Optimization: ${analysis.script_optimization_score}%
    - Content Quality Score: ${analysis.content_quality_score}%
    
    CONTENT STATISTICS FOR ${analysis.url}:
    - Total Words: ${contentStats.wordCount || 0}
    - Paragraphs: ${contentStats.paragraphs || 0}
    - Headings: ${contentStats.headings || 0}
    - Images: ${contentStats.images || 0}
    - Links: ${contentStats.links || 0}
    
    ACTUAL CONTENT SAMPLES FROM ${analysis.title}:
    ${rawData.paragraphs?.slice(0, 3).join("\n\n") || "No content samples available"}
    
    ACTUAL HEADINGS FROM ${analysis.title}:
    ${rawData.headings?.slice(0, 5).join("\n") || "No headings available"}
    
    IMPROVEMENT RECOMMENDATIONS FOR ${analysis.title}:
    ${improvements.map((imp: string, i: number) => `${i + 1}. ${imp}`).join("\n")}
  `

  // Add specific instructions based on content type
  let specificInstructions = ""

  switch (contentType) {
    case "research":
      specificInstructions = `
        Create a comprehensive research report specifically about ${analysis.title} (${analysis.url}).
        
        CRITICAL: This must be about the ACTUAL website ${analysis.title}, not a generic example.
        Use the real data provided above. Reference the actual website name, URL, and specific findings.
        
        Your report should analyze:
        1. What ${analysis.title} actually does based on the content found
        2. The specific performance issues found on ${analysis.url}
        3. Real recommendations based on the actual analysis data
        4. Specific areas where ${analysis.title} excels or needs improvement
        5. Technical analysis of the website's structure and performance
        6. Content quality assessment with examples from the actual site
        7. SEO and keyword analysis based on the real keywords found
        
        Include sections for:
        - Executive Summary
        - Website Overview
        - Performance Analysis
        - Content Analysis
        - Technical Assessment
        - Recommendations
        - Conclusion
        
        Do NOT use placeholder text or generic examples. This is a real analysis of ${analysis.title}.
      `
      break

    case "blog":
      specificInstructions = `
        Write a blog post about the analysis of ${analysis.title} (${analysis.url}).
        
        CRITICAL: This must be about the ACTUAL website ${analysis.title}, not a generic example.
        
        Your blog post should:
        1. Discuss what makes ${analysis.title} unique based on the actual content found
        2. Share specific insights from analyzing ${analysis.url}
        3. Use the real performance metrics and findings
        4. Provide actionable takeaways based on this specific analysis
        
        Reference the actual website throughout the post.
      `
      break

    case "marketing":
      specificInstructions = `
        Create marketing content for ${analysis.title} based on the actual analysis of ${analysis.url}.
        
        CRITICAL: Focus on the real strengths and opportunities found in this specific website.
        
        Your content should:
        1. Highlight the actual competitive advantages of ${analysis.title}
        2. Address the real performance metrics found
        3. Create messaging based on the actual keywords and content discovered
        4. Provide specific recommendations for ${analysis.title}
      `
      break

    case "social":
      specificInstructions = `
        Create social media posts about the analysis of ${analysis.title} (${analysis.url}).
        
        CRITICAL: These posts must be about the ACTUAL website ${analysis.title}.
        
        Include:
        1. The real website name and URL
        2. Actual performance scores and findings
        3. Specific insights discovered during analysis
        4. Real recommendations for improvement
      `
      break
  }

  return `
    You are analyzing the REAL website "${analysis.title}" located at ${analysis.url}.
    
    ${analysisData}
    
    TONE: ${tone}
    
    TASK: ${specificInstructions}
    
    IMPORTANT REMINDERS:
    - This is NOT a generic example - you are analyzing the actual website ${analysis.title}
    - Use the real data provided above, not placeholder information
    - Reference the actual website name "${analysis.title}" and URL "${analysis.url}" throughout your response
    - Base all insights on the actual analysis data provided
    - Do not use generic examples or placeholder text
    
    Format your response with proper Markdown formatting.
  `
}

function getFallbackContent(contentType: string, analysis: any, tone: string) {
  // Parse JSON fields if they're strings
  const keyPoints =
    typeof analysis.key_points === "string" ? JSON.parse(analysis.key_points) : analysis.key_points || []

  const keywords = typeof analysis.keywords === "string" ? JSON.parse(analysis.keywords) : analysis.keywords || []

  const improvements =
    typeof analysis.improvements === "string" ? JSON.parse(analysis.improvements) : analysis.improvements || []

  const contentStats =
    typeof analysis.content_stats === "string" ? JSON.parse(analysis.content_stats) : analysis.content_stats || {}

  const rawData = typeof analysis.raw_data === "string" ? JSON.parse(analysis.raw_data) : analysis.raw_data || {}

  let content = ""

  switch (contentType) {
    case "research":
      content = `# Research Report: ${analysis.title}

## Executive Summary
${analysis.summary}

## Website Overview
**URL:** ${analysis.url}
**Title:** ${analysis.title}

This comprehensive analysis examines the performance, content quality, and technical aspects of ${analysis.title}.

## Key Findings
${keyPoints.map((point: string) => `- ${point}`).join("\n")}

## Performance Analysis
The website demonstrates the following performance metrics:

- **Overall Sustainability Score:** ${analysis.sustainability_score}%
- **Performance Score:** ${analysis.performance_score}%
- **Script Optimization:** ${analysis.script_optimization_score}%
- **Content Quality:** ${analysis.content_quality_score}%

## Content Analysis
The website contains:
- **Word Count:** ${contentStats.wordCount || 0} words
- **Paragraphs:** ${contentStats.paragraphs || 0}
- **Headings:** ${contentStats.headings || 0}
- **Images:** ${contentStats.images || 0}
- **Links:** ${contentStats.links || 0}

## Keywords and Topics
The primary keywords identified on ${analysis.title} include: ${keywords.join(", ")}

## Sample Content
${rawData.paragraphs?.slice(0, 2).join("\n\n") || "No content samples available."}

## Technical Assessment
Based on our analysis, ${analysis.title} shows ${analysis.sustainability_score > 75 ? "strong" : "moderate"} performance in sustainability metrics.

## Recommendations for Improvement
${improvements.map((imp: string) => `- ${imp}`).join("\n")}

## Conclusion
${analysis.title} demonstrates ${analysis.sustainability_score > 75 ? "good overall performance" : "areas for improvement"} with particular strengths in ${analysis.performance_score > 75 ? "performance optimization" : "content structure"}. The key focus areas should be ${improvements[0]?.toLowerCase() || "performance optimization"} and ${improvements[1]?.toLowerCase() || "content enhancement"}.

**Analysis Date:** ${new Date().toLocaleDateString()}
**Website Analyzed:** ${analysis.url}
`
      break

    case "blog":
      content = `# Analyzing ${analysis.title}: Key Insights and Takeaways

I recently had the opportunity to analyze ${analysis.title} (${analysis.url}) and discovered some fascinating insights about its performance and content strategy.

## What ${analysis.title} Does Well

${analysis.summary}

The website demonstrates several strengths:
${keyPoints
  .slice(0, 3)
  .map((point: string) => `- ${point}`)
  .join("\n")}

## Performance Snapshot

Here's what the numbers tell us about ${analysis.title}:

- **Sustainability Score:** ${analysis.sustainability_score}%
- **Performance:** ${analysis.performance_score}%
- **Content Quality:** ${analysis.content_quality_score}%

${analysis.sustainability_score > 75 ? "These are impressive numbers that show the website is well-optimized." : "There's definitely room for improvement in these areas."}

## Content Strategy Analysis

The website focuses on ${keywords.slice(0, 3).join(", ")}, which suggests a clear understanding of their target audience. With ${contentStats.wordCount || 0} words across ${contentStats.paragraphs || 0} paragraphs, the content is ${contentStats.wordCount > 1000 ? "comprehensive" : "concise"}.

## Key Takeaways

What can we learn from ${analysis.title}?

1. **Content Focus:** The emphasis on ${keywords[0] || "key topics"} shows the importance of targeted messaging
2. **Performance Matters:** With a ${analysis.performance_score}% performance score, ${analysis.performance_score > 75 ? "they've prioritized user experience" : "there's opportunity to improve user experience"}
3. **Room for Growth:** ${improvements[0] || "Optimization opportunities exist"}

## Final Thoughts

${analysis.title} provides valuable lessons for anyone building or optimizing a website. The key is to focus on ${keywords[0] || "your core message"} while ensuring ${analysis.performance_score > 75 ? "you maintain" : "you improve"} technical performance.

*Analysis conducted on ${new Date().toLocaleDateString()}*
`
      break

    case "marketing":
      content = `# Marketing Analysis: ${analysis.title}

## Executive Summary
${analysis.title} presents significant marketing opportunities based on our comprehensive analysis of ${analysis.url}.

## Target Market Analysis
Based on the content and keyword analysis, ${analysis.title} targets audiences interested in:
${keywords
  .slice(0, 5)
  .map((keyword: string) => `- ${keyword}`)
  .join("\n")}

## Competitive Positioning
**Strengths:**
- ${analysis.performance_score > 75 ? "Strong technical performance" : "Solid foundation for improvement"}
- Content focus on ${keywords[0] || "key market segments"}
- ${contentStats.images > 10 ? "Rich visual content" : "Streamlined content approach"}

**Opportunities:**
${improvements
  .slice(0, 3)
  .map((imp: string) => `- ${imp}`)
  .join("\n")}

## Performance Metrics
- **Overall Score:** ${analysis.sustainability_score}%
- **User Experience:** ${analysis.performance_score}%
- **Content Quality:** ${analysis.content_quality_score}%

## Marketing Recommendations

### Short-term (1-3 months)
1. ${improvements[0] || "Optimize current content"}
2. Enhance focus on ${keywords[0] || "primary keywords"}
3. Improve ${analysis.performance_score < 75 ? "technical performance" : "content engagement"}

### Medium-term (3-6 months)
1. Expand content around ${keywords[1] || "secondary keywords"}
2. Develop ${contentStats.images < 10 ? "visual content strategy" : "interactive elements"}
3. Build authority in ${keywords[2] || "niche markets"}

### Long-term (6-12 months)
1. ${improvements[1] || "Comprehensive optimization"}
2. Market expansion into ${keywords[3] || "related verticals"}
3. Performance optimization to achieve 90%+ scores

## Expected ROI
Implementing these recommendations could result in:
- Improved search rankings for ${keywords.slice(0, 3).join(", ")}
- Enhanced user engagement
- Higher conversion rates
- Stronger brand authority

## Next Steps
Begin with ${improvements[0] || "performance optimization"} to establish a strong foundation for future marketing efforts.

*Analysis Date: ${new Date().toLocaleDateString()}*
*Website: ${analysis.url}*
`
      break

    case "social":
      const linkedinPost = `🔍 Just analyzed ${analysis.title} and found some interesting insights!

📊 Key metrics:
• Sustainability score: ${analysis.sustainability_score}%
• Performance: ${analysis.performance_score}%
• Focus areas: ${keywords.slice(0, 2).join(", ")}

${analysis.sustainability_score > 75 ? "Impressive performance across the board! 🚀" : "Great potential for optimization! 📈"}

Key takeaway: ${improvements[0] || "Focus on performance optimization"}

#WebsiteAnalysis #DigitalMarketing #${keywords[0]?.replace(/\s+/g, "") || "WebDev"}

What's your experience with ${analysis.title}?`

      const twitterPost = `Analyzed ${analysis.title} 📊

Results:
• ${analysis.sustainability_score}% sustainability
• ${analysis.performance_score}% performance  
• Focus: ${keywords.slice(0, 2).join(" & ")}

${analysis.sustainability_score > 75 ? "Strong performance! 🚀" : "Room for growth 📈"}

#WebAnalysis #${keywords[0]?.replace(/\s+/g, "") || "WebDev"}`

      content = `# Social Media Content for ${analysis.title}

## LinkedIn Post
\`\`\`
${linkedinPost}
\`\`\`

## Twitter/X Post
\`\`\`
${twitterPost}
\`\`\`

## Facebook Post
\`\`\`
📱 Website Analysis Results 📱

Just completed an in-depth analysis of ${analysis.title}!

🎯 What we found:
• Sustainability score: ${analysis.sustainability_score}%
• Performance rating: ${analysis.performance_score}%
• Key focus areas: ${keywords.slice(0, 3).join(", ")}

${analysis.sustainability_score > 75 ? "The site shows excellent optimization!" : "Great opportunities for improvement identified!"}

💡 Main recommendation: ${improvements[0] || "Focus on performance optimization"}

Have you visited ${analysis.title}? What was your experience?

#WebsiteAnalysis #DigitalMarketing #UserExperience
\`\`\`

## Instagram Caption
\`\`\`
📊 Website Analysis: ${analysis.title} ✨

Key findings:
• ${analysis.sustainability_score}% sustainability score
• ${contentStats.images || 0} images analyzed
• ${contentStats.wordCount || 0} words of content

Swipe to see the full breakdown! 👉

#WebsiteAnalysis #DigitalMarketing #${keywords[0]?.replace(/\s+/g, "") || "WebDev"} #DataAnalysis
\`\`\`
`
      break

    default:
      content = `# Analysis of ${analysis.title}

**Website:** ${analysis.url}

## Summary
${analysis.summary}

## Key Points
${keyPoints.map((point: string) => `- ${point}`).join("\n")}

## Keywords
${keywords.join(", ")}

## Performance Scores
- **Sustainability:** ${analysis.sustainability_score}%
- **Performance:** ${analysis.performance_score}%
- **Content Quality:** ${analysis.content_quality_score}%

## Recommendations
${improvements.map((imp: string) => `- ${imp}`).join("\n")}

*Analysis completed on ${new Date().toLocaleDateString()}*
`
  }

  return content
}
