import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: Request) {
  try {
    const { analysisId, contentType, tone } = await request.json()

    if (!contentType) {
      return NextResponse.json({ error: "Content type is required" }, { status: 400 })
    }

    if (!analysisId) {
      return NextResponse.json({ error: "Analysis ID is required" }, { status: 400 })
    }

    // Get the analysis data
    let analysis = null

    if (process.env.MONGODB_URI) {
      try {
        const client = await clientPromise
        const db = client.db("website-analyzer")
        analysis = await db.collection("analyses").findOne({ _id: analysisId })
      } catch (dbError) {
        console.error("Database error:", dbError)
      }
    }

    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 })
    }

    // Use Groq if available, otherwise use predefined content
    let content = ""
    let contentId = null

    try {
      if (process.env.GROQ_API_KEY) {
        // Create a more sophisticated prompt based on the analysis and content type
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

      // Try to save the generated content to MongoDB
      if (process.env.MONGODB_URI) {
        try {
          const client = await clientPromise
          const db = client.db("website-analyzer")
          const result = await db.collection("generated-content").insertOne({
            analysisId: analysisId,
            contentType,
            tone: tone || "professional",
            content,
            createdAt: new Date(),
          })
          contentId = result.insertedId.toString()
        } catch (saveError) {
          console.error("Error saving content:", saveError)
          // Continue even if saving fails
        }
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
  // Validate that we have real analysis data
  if (!analysis.title || !analysis.url) {
    throw new Error("Invalid analysis data - missing title or URL")
  }

  const analysisData = `
    WEBSITE BEING ANALYZED: ${analysis.title}
    WEBSITE URL: ${analysis.url}
    
    ANALYSIS SUMMARY: ${analysis.summary}
    
    KEY FINDINGS FROM THIS SPECIFIC WEBSITE:
    ${analysis.keyPoints.map((point: string, i: number) => `${i + 1}. ${point}`).join("\n")}
    
    KEYWORDS FOUND ON THIS WEBSITE: ${analysis.keywords.join(", ")}
    
    PERFORMANCE METRICS FOR ${analysis.title}:
    - Overall Sustainability Score: ${analysis.sustainability.score}%
    - Performance Score: ${analysis.sustainability.performance}%
    - Script Optimization: ${analysis.sustainability.scriptOptimization}%
    - Content Quality Score: ${analysis.sustainability.duplicateContent}%
    
    CONTENT STATISTICS FOR ${analysis.url}:
    - Total Words: ${analysis.contentStats.wordCount}
    - Paragraphs: ${analysis.contentStats.paragraphs}
    - Headings: ${analysis.contentStats.headings}
    - Images: ${analysis.contentStats.images}
    - Links: ${analysis.contentStats.links}
    
    ACTUAL CONTENT SAMPLES FROM ${analysis.title}:
    ${analysis.rawData?.paragraphs?.slice(0, 3).join("\n\n") || "No content samples available"}
    
    ACTUAL HEADINGS FROM ${analysis.title}:
    ${analysis.rawData?.headings?.slice(0, 5).join("\n") || "No headings available"}
    
    IMPROVEMENT RECOMMENDATIONS FOR ${analysis.title}:
    ${analysis.sustainability.improvements.map((imp: string, i: number) => `${i + 1}. ${imp}`).join("\n")}
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
  // At the beginning of getFallbackContent function, add validation:
  if (!analysis || !analysis.title || !analysis.url) {
    return "# Error: Invalid Analysis Data\n\nThe analysis data is incomplete or missing. Please re-analyze the website."
  }

  // Helper function to get a random item from an array
  const getRandomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]

  // Helper function to format based on tone
  const formatForTone = (text: string, tone: string) => {
    switch (tone) {
      case "professional":
        return text
      case "casual":
        return text.replace(/\. /g, "! ").replace(/We/g, "You").replace(/Our/g, "Your")
      case "enthusiastic":
        return text.replace(/\. /g, "! ").replace(/is/g, "is absolutely").replace(/good/g, "amazing")
      case "technical":
        return text
          .replace(/website/g, "web application")
          .replace(/good/g, "optimal")
          .replace(/use/g, "utilize")
      case "friendly":
        return text
          .replace(/\. /g, ". 😊 ")
          .replace(/We/g, "We together")
          .replace(/recommend/g, "suggest")
      default:
        return text
    }
  }

  let content = ""

  switch (contentType) {
    case "research":
      content = `# Research Report: ${analysis.title}

## Executive Summary
${analysis.summary}

## Key Findings
${analysis.keyPoints.map((point: string) => `- ${point}`).join("\n")}

## Website Performance Analysis
The website has a sustainability score of ${analysis.sustainability.score}%, with performance at ${analysis.sustainability.performance}% and script optimization at ${analysis.sustainability.scriptOptimization}%.

## Content Analysis
The website contains approximately ${analysis.contentStats.wordCount} words across ${analysis.contentStats.paragraphs} paragraphs. It has ${analysis.contentStats.headings} headings and ${analysis.contentStats.images} images.

## Key Topics and Keywords
${analysis.keywords.join(", ")}

## Recommendations for Improvement
${analysis.sustainability.improvements.map((imp: string) => `- ${imp}`).join("\n")}

## Sample Content Excerpts
${analysis.rawData?.paragraphs?.slice(0, 3).join("\n\n") || "No content excerpts available."}

## Conclusion
Based on our analysis, this website ${analysis.sustainability.score > 75 ? "performs well" : "needs improvement"} in terms of sustainability and content structure. The key areas to focus on are ${analysis.sustainability.score < 75 ? analysis.sustainability.improvements[0].toLowerCase() + " and " + analysis.sustainability.improvements[1].toLowerCase() : "maintaining current performance while expanding content reach"}.
`
      break

    case "blog":
      content = `# What We Learned from Analyzing ${analysis.title}

Are you curious about what makes a website effective? We recently analyzed ${analysis.title} and discovered some fascinating insights.

## The First Impression

${analysis.summary}

When visitors first land on this website, they're greeted with content about ${analysis.keywords.slice(0, 3).join(", ")}. ${analysis.rawData?.paragraphs?.[0] || ""}

## Behind the Numbers

Our analysis revealed some interesting statistics:

- The website contains approximately ${analysis.contentStats.wordCount} words
- There are ${analysis.contentStats.images} images throughout the site
- The content is structured with ${analysis.contentStats.headings} headings
- Visitors can navigate through ${analysis.contentStats.links} links

## Performance Insights

With a sustainability score of ${analysis.sustainability.score}%, this website ${analysis.sustainability.score > 75 ? "performs quite well" : "has room for improvement"}. ${getRandomItem(analysis.sustainability.improvements)}.

## Key Topics Covered

The website focuses primarily on ${analysis.keywords.slice(0, 5).join(", ")}. This suggests that the target audience is interested in these topics and the website is positioned to address their needs.

## What We Can Learn

${analysis.rawData?.paragraphs?.[1] || "The content structure and focus provide valuable lessons for anyone looking to create an effective online presence."}

## Conclusion

Analyzing websites like ${analysis.title} helps us understand what works in digital communication. Whether you're building your own website or just curious about digital marketing, these insights can help guide your strategy.

What website would you like us to analyze next? Let us know in the comments!
`
      break

    case "marketing":
      content = `# ${analysis.title}: Website Analysis & Marketing Opportunities

## Website Overview
${analysis.summary}

## Target Audience
Based on our analysis, this website appears to target individuals interested in ${analysis.keywords.slice(0, 3).join(", ")}. The content structure and terminology suggest a focus on ${analysis.keywords[0]} enthusiasts who value ${analysis.keywords[1] || "quality"}.

## Competitive Advantages
- **Content Focus:** Strong emphasis on ${analysis.keywords[0]} and ${analysis.keywords[1] || "related topics"}
- **Visual Elements:** ${analysis.contentStats.images > 10 ? "Rich visual content with " + analysis.contentStats.images + " images" : "Limited visual content that could be expanded"}
- **User Experience:** ${analysis.sustainability.performance > 75 ? "Excellent performance metrics" : "Performance improvements needed"} (${analysis.sustainability.performance}% performance score)

## Marketing Opportunities

### Content Marketing
The website already covers topics like ${analysis.keywords.slice(0, 3).join(", ")}. We recommend expanding content in these areas:
- ${analysis.keywords[3] || "Industry trends"}
- ${analysis.keywords[4] || "Case studies"}
- ${analysis.keywords[5] || "User testimonials"}

### Performance Optimization
${analysis.sustainability.improvements
  .slice(0, 2)
  .map((imp: string) => `- ${imp}`)
  .join("\n")}

### Audience Engagement
Based on the current content structure, we recommend:
- Creating interactive elements around ${analysis.keywords[0]}
- Developing a newsletter focused on ${analysis.keywords[1] || "industry updates"}
- Building community features for ${analysis.keywords[2] || "enthusiasts"}

## Implementation Timeline
1. **Immediate:** ${analysis.sustainability.improvements[0]}
2. **Short-term (1-3 months):** Expand content on ${analysis.keywords[3] || "key topics"}
3. **Medium-term (3-6 months):** Implement engagement features
4. **Long-term (6-12 months):** Full performance optimization

## Expected Outcomes
Implementing these recommendations could result in:
- Improved user engagement
- Higher conversion rates
- Better search engine rankings for terms related to ${analysis.keywords.slice(0, 3).join(", ")}
- Increased brand authority in the ${analysis.keywords[0]} space

## Next Steps
We recommend beginning with ${analysis.sustainability.improvements[0]} to establish a solid foundation for future marketing efforts.
`
      break

    case "social":
      // LinkedIn post
      const linkedinPost = `📊 Website Analysis: ${analysis.title} 📊

I just analyzed ${analysis.title} and discovered some interesting insights!

Key findings:
• Focus on ${analysis.keywords.slice(0, 3).join(", ")}
• ${analysis.sustainability.score}% sustainability score
• ${analysis.contentStats.wordCount} words of valuable content

${analysis.sustainability.score > 75 ? "The site performs exceptionally well" : "The site has potential for improvement"} in terms of user experience and content delivery.

One thing that stood out: ${analysis.rawData?.paragraphs?.[0]?.substring(0, 100) || analysis.summary.substring(0, 100)}...

#WebsiteAnalysis #DigitalMarketing #${analysis.keywords[0]?.replace(/\s+/g, "")} #${analysis.keywords[1]?.replace(/\s+/g, "") || "WebDesign"}

What website should I analyze next?`

      // Twitter/X post
      const twitterPost = `I analyzed ${analysis.title} and found:

• ${analysis.sustainability.score}% sustainability score
• Focus on ${analysis.keywords.slice(0, 2).join(" & ")}
• ${analysis.sustainability.score > 75 ? "Great performance" : "Needs optimization"}

${getRandomItem(analysis.sustainability.improvements)}

#WebAnalysis #${analysis.keywords[0]?.replace(/\s+/g, "")}`

      // Facebook post
      const facebookPost = `📱 Website Analysis Results 📱

I just completed an in-depth analysis of ${analysis.title} and wanted to share what I found!

This website focuses on ${analysis.keywords.slice(0, 3).join(", ")} and has a sustainability score of ${analysis.sustainability.score}%.

What I loved: ${analysis.sustainability.score > 75 ? "The excellent performance metrics and clean content structure" : "The potential for growth with some simple optimizations"}

What could be improved: ${getRandomItem(analysis.sustainability.improvements)}

Have you visited this website? What was your experience like?

#WebsiteAnalysis #DigitalMarketing`

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
${facebookPost}
\`\`\`

## Instagram Caption
\`\`\`
📊 Website Analysis Results 📊

Just analyzed ${analysis.title}! 

Key stats:
• ${analysis.sustainability.score}% sustainability score
• ${analysis.contentStats.images} images
• ${analysis.contentStats.wordCount} words

Swipe to see the full analysis and recommendations!

#WebsiteAnalysis #DigitalMarketing #${analysis.keywords[0]?.replace(/\s+/g, "")} #${analysis.keywords[1]?.replace(/\s+/g, "") || "WebDesign"}
\`\`\`
`
      break

    default:
      content = `# Analysis of ${analysis.title}

${analysis.summary}

## Key Points
${analysis.keyPoints.map((point: string) => `- ${point}`).join("\n")}

## Keywords
${analysis.keywords.join(", ")}

## Sustainability Score: ${analysis.sustainability.score}%

## Recommendations
${analysis.sustainability.improvements.map((imp: string) => `- ${imp}`).join("\n")}
`
  }

  // Apply tone formatting if specified
  return formatForTone(content, tone)
}
