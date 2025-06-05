import { NextResponse } from "next/server"
import { sql, safeDbOperation, isNeonAvailable } from "@/lib/neon-db"
import { randomBytes } from "crypto"

export async function POST(request: Request) {
  try {
    let requestBody
    try {
      const bodyText = await request.text()
      if (!bodyText.trim()) {
        return NextResponse.json({ error: "Empty request body" }, { status: 400 })
      }
      requestBody = JSON.parse(bodyText)
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { analysisId, format, includeRawData = false } = requestBody

    if (!analysisId) {
      return NextResponse.json({ error: "Analysis ID is required" }, { status: 400 })
    }

    // Get analysis data from Neon database (only if available)
    let analysisData = null
    if (isNeonAvailable()) {
      analysisData = await safeDbOperation(
        async () => {
          const result = await sql`
            SELECT * FROM website_analyses 
            WHERE id = ${analysisId}
          `
          return result[0] || null
        },
        null,
        "Error fetching analysis data",
      )
    }

    if (!analysisData) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 })
    }

    // Generate export content based on format
    let exportContent = ""
    let contentType = "text/plain"
    let filename = `website-analysis-${analysisId}`

    switch (format) {
      case "json":
        exportContent = JSON.stringify(
          {
            ...analysisData,
            keyPoints: analysisData.key_points,
            rawData: includeRawData ? analysisData.raw_data : undefined,
          },
          null,
          2,
        )
        contentType = "application/json"
        filename += ".json"
        break

      case "csv":
        exportContent = generateCSV(analysisData)
        contentType = "text/csv"
        filename += ".csv"
        break

      case "markdown":
        exportContent = generateMarkdown(analysisData, includeRawData)
        contentType = "text/markdown"
        filename += ".md"
        break

      default:
        exportContent = generateTextReport(analysisData, includeRawData)
        filename += ".txt"
    }

    // Log export activity (only if Neon is available)
    if (isNeonAvailable()) {
      await safeDbOperation(
        async () => {
          const exportId = randomBytes(16).toString("hex")
          await sql`
            INSERT INTO exports (id, analysis_id, export_format, created_at)
            VALUES (${exportId}, ${analysisId}, ${format}, NOW())
          `
        },
        undefined,
        "Error logging export activity",
      )
    }

    return new NextResponse(exportContent, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error: any) {
    console.error("Export error:", error)
    return NextResponse.json(
      {
        error: "Failed to export analysis",
        message: error.message || "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

function generateCSV(data: any): string {
  const headers = [
    "URL",
    "Title",
    "Summary",
    "Sustainability Score",
    "Performance Score",
    "Security Score",
    "Content Quality Score",
    "Script Optimization Score",
    "Hosting Provider",
    "SSL Certificate",
    "Created At",
  ]

  const values = [
    data.url,
    data.title,
    data.summary,
    data.sustainability_score,
    data.performance_score,
    data.security_score,
    data.content_quality_score,
    data.script_optimization_score,
    data.hosting_provider_name,
    data.ssl_certificate,
    data.created_at,
  ]

  return [headers.join(","), values.map((v) => `"${v}"`).join(",")].join("\n")
}

function generateMarkdown(data: any, includeRawData: boolean): string {
  let markdown = `# Website Analysis Report

## Overview
- **URL**: ${data.url}
- **Title**: ${data.title}
- **Analysis Date**: ${new Date(data.created_at).toLocaleDateString()}

## Summary
${data.summary}

## Key Points
${data.key_points?.map((point: string) => `- ${point}`).join("\n") || "No key points available"}

## Performance Metrics
- **Sustainability Score**: ${data.sustainability_score}%
- **Performance Score**: ${data.performance_score}%
- **Security Score**: ${data.security_score}%
- **Content Quality Score**: ${data.content_quality_score}%
- **Script Optimization Score**: ${data.script_optimization_score}%

## Technical Details
- **Hosting Provider**: ${data.hosting_provider_name || "Unknown"}
- **SSL Certificate**: ${data.ssl_certificate ? "Yes" : "No"}

## Keywords
${data.keywords?.join(", ") || "No keywords available"}

## Improvement Recommendations
${data.improvements?.map((improvement: string) => `- ${improvement}`).join("\n") || "No recommendations available"}
`

  if (includeRawData && data.raw_data) {
    markdown += `\n## Raw Data\n\`\`\`json\n${JSON.stringify(data.raw_data, null, 2)}\n\`\`\``
  }

  return markdown
}

function generateTextReport(data: any, includeRawData: boolean): string {
  let report = `WEBSITE ANALYSIS REPORT
${"=".repeat(50)}

URL: ${data.url}
Title: ${data.title}
Analysis Date: ${new Date(data.created_at).toLocaleDateString()}

SUMMARY
${"-".repeat(20)}
${data.summary}

KEY POINTS
${"-".repeat(20)}
${data.key_points?.map((point: string, index: number) => `${index + 1}. ${point}`).join("\n") || "No key points available"}

PERFORMANCE METRICS
${"-".repeat(20)}
Sustainability Score: ${data.sustainability_score}%
Performance Score: ${data.performance_score}%
Security Score: ${data.security_score}%
Content Quality Score: ${data.content_quality_score}%
Script Optimization Score: ${data.script_optimization_score}%

TECHNICAL DETAILS
${"-".repeat(20)}
Hosting Provider: ${data.hosting_provider_name || "Unknown"}
SSL Certificate: ${data.ssl_certificate ? "Yes" : "No"}

KEYWORDS
${"-".repeat(20)}
${data.keywords?.join(", ") || "No keywords available"}

IMPROVEMENT RECOMMENDATIONS
${"-".repeat(20)}
${data.improvements?.map((improvement: string, index: number) => `${index + 1}. ${improvement}`).join("\n") || "No recommendations available"}
`

  if (includeRawData && data.raw_data) {
    report += `\n\nRAW DATA\n${"-".repeat(20)}\n${JSON.stringify(data.raw_data, null, 2)}`
  }

  return report
}
