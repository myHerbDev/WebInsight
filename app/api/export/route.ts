import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { generatePdfHtml } from "@/lib/pdf-generator"
import { put } from "@vercel/blob"

export async function POST(request: Request) {
  try {
    const { analysisId, contentId, format, includeScreenshot = true } = await request.json()

    if (!analysisId && !contentId) {
      return NextResponse.json({ error: "Analysis ID or Content ID is required" }, { status: 400 })
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        {
          error: "Database not configured. Cannot retrieve analysis data.",
        },
        { status: 500 },
      )
    }

    let content = ""
    let title = ""
    let analysis = null

    try {
      const client = await clientPromise
      const db = client.db("website-analyzer")

      if (contentId) {
        const generatedContent = await db.collection("generated-content").findOne({
          _id: contentId,
        })

        if (generatedContent) {
          content = generatedContent.content

          // Get analysis for title and context
          analysis = await db.collection("analyses").findOne({
            _id: generatedContent.analysisId,
          })

          title = analysis ? `${generatedContent.contentType} - ${analysis.title}` : "Generated Content"
        } else {
          return NextResponse.json({ error: "Generated content not found" }, { status: 404 })
        }
      } else if (analysisId) {
        analysis = await db.collection("analyses").findOne({
          _id: analysisId,
        })

        if (analysis) {
          title = `Analysis - ${analysis.title}`
          content = createAnalysisContent(analysis)
        } else {
          return NextResponse.json({ error: "Analysis not found" }, { status: 404 })
        }
      }
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Database error occurred" }, { status: 500 })
    }

    if (!analysis) {
      return NextResponse.json({ error: "No data found" }, { status: 404 })
    }

    // Format content based on requested format
    let formattedContent = content
    let blobUrl = null

    switch (format) {
      case "html":
        formattedContent = content
          .replace(/^# (.*$)/gm, "<h1>$1</h1>")
          .replace(/^## (.*$)/gm, "<h2>$1</h2>")
          .replace(/^### (.*$)/gm, "<h3>$1</h3>")
          .replace(/\*\*(.*)\*\*/gm, "<strong>$1</strong>")
          .replace(/\*(.*)\*/gm, "<em>$1</em>")
          .replace(/^- (.*)/gm, "<li>$1</li>")
          .replace(/\n\n/gm, "<br/><br/>")
        formattedContent = `<html><head><title>${title}</title></head><body>${formattedContent}</body></html>`
        break

      case "plain":
        formattedContent = content
          .replace(/^# (.*$)/gm, "$1\n")
          .replace(/^## (.*$)/gm, "$1\n")
          .replace(/^### (.*$)/gm, "$1\n")
          .replace(/\*\*(.*)\*\*/gm, "$1")
          .replace(/\*(.*)\*/gm, "$1")
          .replace(/^- (.*)/gm, "• $1")
        break

      case "pdf":
        if (analysis) {
          const pdfHtml = generatePdfHtml(analysis, includeScreenshot)

          if (process.env.BLOB_READ_WRITE_TOKEN) {
            try {
              const filename = `analysis-${analysis.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${Date.now()}.html`
              const blob = await put(filename, pdfHtml, {
                access: "public",
                contentType: "text/html",
              })
              blobUrl = blob.url
            } catch (blobError) {
              console.error("Error saving PDF HTML to Blob:", blobError)
            }
          }

          formattedContent = pdfHtml
        }
        break

      case "markdown":
      default:
        // Keep as markdown
        break
    }

    // Log the export
    try {
      const client = await clientPromise
      const db = client.db("website-analyzer")
      await db.collection("exports").insertOne({
        analysisId: analysisId || null,
        contentId: contentId || null,
        format,
        blobUrl: blobUrl || null,
        createdAt: new Date(),
      })
    } catch (logError) {
      console.error("Error logging export:", logError)
    }

    return NextResponse.json({
      content: formattedContent,
      title,
      format,
      blobUrl,
      websiteTitle: analysis.title,
      websiteUrl: analysis.url,
    })
  } catch (error) {
    console.error("Error exporting content:", error)
    return NextResponse.json(
      {
        error: "Failed to export content",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
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
