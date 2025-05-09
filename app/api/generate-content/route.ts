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

    // Sample analysis data (would normally come from MongoDB)
    const mockAnalysis = {
      _id: analysisId || "mock-id",
      url: "https://example.com",
      title: "Example Website",
      summary: "This is a modern website with various features and content sections.",
      keyPoints: [
        "Mobile-friendly design",
        "Fast loading times",
        "Clear navigation structure",
        "Strong brand messaging",
        "Effective call-to-actions",
      ],
      keywords: ["technology", "design", "innovation", "services", "solutions"],
      sustainability: {
        score: 78,
        performance: 85,
        scriptOptimization: 72,
        duplicateContent: 92,
        improvements: [
          "Optimize image sizes",
          "Implement lazy loading",
          "Reduce third-party scripts",
          "Enable browser caching",
        ],
      },
      contentStats: {
        wordCount: 2450,
        paragraphs: 32,
        headings: 18,
        images: 24,
        links: 47,
      },
      rawData: {
        paragraphs: [
          "This is an example paragraph that would be extracted from the website.",
          "Another paragraph with some sample content for demonstration purposes.",
          "A third paragraph showing how content would be displayed in the analysis.",
        ],
        headings: ["Welcome to Our Website", "Our Services", "About Us", "Contact Information"],
        links: ["https://example.com/about", "https://example.com/services", "https://example.com/contact"],
      },
    }

    // Try to get analysis from MongoDB if available
    let analysis = mockAnalysis
    if (process.env.MONGODB_URI && analysisId) {
      try {
        const client = await clientPromise
        const db = client.db("website-analyzer")
        const dbAnalysis = await db.collection("analyses").findOne({
          _id: analysisId,
        })

        if (dbAnalysis) {
          analysis = dbAnalysis
        }
      } catch (dbError) {
        console.error("Database error:", dbError)
        // Continue with mock data if DB fails
      }
    }

    // Use Groq if available, otherwise use predefined content
    let content = ""
    let contentId = null

    try {
      if (process.env.GROQ_API_KEY) {
        // Create a prompt based on the analysis and content type
        const prompt = `
          You are a professional content creator specializing in website analysis.
          
          I have analyzed a website with the following information:
          - Title: ${analysis.title}
          - URL: ${analysis.url}
          - Summary: ${analysis.summary}
          - Key Points: ${analysis.keyPoints.join(", ")}
          - Keywords: ${analysis.keywords.join(", ")}
          - Sustainability Score: ${analysis.sustainability.score}%
          - Performance: ${analysis.sustainability.performance}%
          
          Please create a ${contentType} about this website with a ${tone || "professional"} tone.
          
          If it's a research document, include detailed analysis.
          If it's a blog post, make it engaging and informative.
          If it's marketing content, focus on selling points.
          If it's social media content, make it concise and shareable.
          
          Format the content with proper Markdown headings, lists, and emphasis.
        `

        const { text } = await generateText({
          model: groq("llama3-70b-8192"),
          prompt,
          maxTokens: 1000,
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

function getFallbackContent(contentType: string, analysis: any, tone: string) {
  switch (contentType) {
    case "research":
      return `# Research Report: ${analysis.title}

## Executive Summary
${analysis.summary}

## Key Findings
${analysis.keyPoints.map((point: string) => `- ${point}`).join("\n")}

## Website Performance Analysis
The website has a sustainability score of ${analysis.sustainability.score}%, with performance at ${analysis.sustainability.performance}%.

## Content Analysis
The website contains approximately ${analysis.contentStats.wordCount} words across ${analysis.contentStats.paragraphs} paragraphs.

## Key Topics and Keywords
${analysis.keywords.join(", ")}

## Recommendations for Improvement
${analysis.sustainability.improvements.map((imp: string) => `- ${imp}`).join("\n")}

## Conclusion
Based on our analysis, this website ${analysis.sustainability.score > 75 ? "performs well" : "needs improvement"} in terms of sustainability and content structure.
`
    case "blog":
      return `# What We Learned from Analyzing ${analysis.title}

Are you curious about what makes a website effective? We recently analyzed ${analysis.title} and discovered some fascinating insights.

## The First Impression

${analysis.summary}

When visitors first land on this website, they're greeted with content about ${analysis.keywords.slice(0, 3).join(", ")}.

## Behind the Numbers

Our analysis revealed some interesting statistics:

- The website contains approximately ${analysis.contentStats.wordCount} words
- There are ${analysis.contentStats.images} images throughout the site
- The content is structured with ${analysis.contentStats.headings} headings
- Visitors can navigate through ${analysis.contentStats.links} links

## Performance Insights

With a sustainability score of ${analysis.sustainability.score}%, this website ${analysis.sustainability.score > 75 ? "performs quite well" : "has room for improvement"}.

## Conclusion

Analyzing websites like ${analysis.title} helps us understand what works in digital communication. Whether you're building your own website or just curious about digital marketing, these insights can help guide your strategy.
`
    case "social":
      return `# Social Media Content for ${analysis.title}

## LinkedIn Post
\`\`\`
📊 Website Analysis: ${analysis.title} 📊

I just analyzed ${analysis.title} and discovered some interesting insights!

Key findings:
• Focus on ${analysis.keywords.slice(0, 3).join(", ")}
• ${analysis.sustainability.score}% sustainability score
• ${analysis.contentStats.wordCount} words of valuable content

#WebsiteAnalysis #DigitalMarketing
\`\`\`

## Twitter/X Post
\`\`\`
I analyzed ${analysis.title} and found:

• ${analysis.sustainability.score}% sustainability score
• Focus on ${analysis.keywords.slice(0, 2).join(" & ")}
• ${analysis.sustainability.score > 75 ? "Great performance" : "Needs optimization"}

#WebAnalysis
\`\`\`
`
    default:
      return `# Analysis of ${analysis.title}

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
}
