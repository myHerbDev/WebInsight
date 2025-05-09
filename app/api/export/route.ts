import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const { analysisId, contentId, format } = await request.json()

    if (!analysisId && !contentId) {
      return NextResponse.json({ error: "Analysis ID or Content ID is required" }, { status: 400 })
    }

    // For preview mode or when MongoDB is not available, use mock data
    const mockAnalysis = {
      title: "Example Website",
      url: "https://example.com",
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
    }

    let content = ""
    let title = "Example Website"

    // Try to get content from MongoDB if available
    if (process.env.MONGODB_URI) {
      try {
        const client = await clientPromise
        const db = client.db("website-analyzer")

        if (contentId) {
          const generatedContent = await db.collection("generated-content").findOne({
            _id: contentId,
          })

          if (generatedContent) {
            content = generatedContent.content

            // Get analysis for title
            const analysis = await db.collection("analyses").findOne({
              _id: generatedContent.analysisId,
            })

            title = analysis ? analysis.title : "Generated Content"
          }
        } else if (analysisId) {
          const analysis = await db.collection("analyses").findOne({
            _id: analysisId,
          })

          if (analysis) {
            title = analysis.title

            // Create a simple export of the analysis
            content = createAnalysisContent(analysis)
          }
        }
      } catch (dbError) {
        console.error("Database error:", dbError)
        // Fall back to mock data if database operations fail
        content = createAnalysisContent(mockAnalysis)
      }
    } else {
      // Use mock data for preview
      content = createAnalysisContent(mockAnalysis)
    }

    // Format content based on requested format
    let formattedContent = content

    switch (format) {
      case "html":
        // Simple markdown to HTML conversion
        formattedContent = content
          .replace(/^# (.*$)/gm, "<h1>$1</h1>")
          .replace(/^## (.*$)/gm, "<h2>$1</h2>")
          .replace(/^### (.*$)/gm, "<h3>$1</h3>")
          .replace(/\*\*(.*)\*\*/gm, "<strong>$1</strong>")
          .replace(/\*(.*)\*/gm, "<em>$1</em>")
          .replace(/- (.*)/gm, "<li>$1</li>")
          .replace(/\n\n/gm, "<br/><br/>")
        formattedContent = `<html><head><title>${title}</title></head><body>${formattedContent}</body></html>`
        break

      case "plain":
        // Strip markdown
        formattedContent = content
          .replace(/^# (.*$)/gm, "$1\n")
          .replace(/^## (.*$)/gm, "$1\n")
          .replace(/^### (.*$)/gm, "$1\n")
          .replace(/\*\*(.*)\*\*/gm, "$1")
          .replace(/\*(.*)\*/gm, "$1")
          .replace(/- (.*)/gm, "• $1")
        break

      case "markdown":
      default:
        // Keep as markdown
        break
    }

    // Try to log the export to MongoDB
    if (process.env.MONGODB_URI) {
      try {
        const client = await clientPromise
        const db = client.db("website-analyzer")
        await db.collection("exports").insertOne({
          analysisId: analysisId || null,
          contentId: contentId || null,
          format,
          createdAt: new Date(),
        })
      } catch (logError) {
        console.error("Error logging export:", logError)
        // Continue even if logging fails
      }
    }

    return NextResponse.json({
      content: formattedContent,
      title,
      format,
    })
  } catch (error) {
    console.error("Error exporting content:", error)
    return NextResponse.json({
      content: "# Error Exporting Content\n\nThere was an error exporting the content. Please try again.",
      title: "Export Error",
      format: "markdown",
    })
  }
}

// Helper function to create analysis content
function createAnalysisContent(analysis: any) {
  return `# Analysis of ${analysis.title}

URL: ${analysis.url}

## Summary
${analysis.summary}

## Key Points
${analysis.keyPoints.map((point: string) => `- ${point}`).join("\n")}

## Keywords
${analysis.keywords.join(", ")}

## Sustainability Score: ${analysis.sustainability.score}%

## Performance: ${analysis.sustainability.performance}%

## Script Optimization: ${analysis.sustainability.scriptOptimization}%

## Content Quality: ${analysis.sustainability.duplicateContent}%

## Recommendations for Improvement
${analysis.sustainability.improvements.map((imp: string) => `- ${imp}`).join("\n")}

## Content Statistics
- Word Count: ${analysis.contentStats.wordCount}
- Paragraphs: ${analysis.contentStats.paragraphs}
- Headings: ${analysis.contentStats.headings}
- Images: ${analysis.contentStats.images}
- Links: ${analysis.contentStats.links}

Generated by WebInsight
`
}
