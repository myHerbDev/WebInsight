import { NextResponse } from "next/server"
import { sql, safeDbOperation, isNeonAvailable } from "@/lib/neon-db"

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

    const { analysisId, includeRawData = false } = requestBody

    if (!analysisId) {
      return NextResponse.json({ error: "Analysis ID is required" }, { status: 400 })
    }

    // Get analysis data from database
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

    // Generate PDF content (simplified HTML that can be converted to PDF)
    const pdfHtml = generatePDFHTML(analysisData, includeRawData)

    // In a real implementation, you would use a library like Puppeteer or jsPDF
    // For now, we'll return the HTML content that can be converted to PDF client-side
    return new NextResponse(pdfHtml, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="website-analysis-${analysisId}.html"`,
      },
    })
  } catch (error: any) {
    console.error("PDF export error:", error)
    return NextResponse.json(
      {
        error: "Failed to export PDF",
        message: error.message || "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

function generatePDFHTML(data: any, includeRawData: boolean): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Website Analysis Report - ${data.title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #6366f1;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            background: linear-gradient(135deg, #6366f1, #06b6d4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        .title {
            font-size: 28px;
            font-weight: bold;
            margin: 10px 0;
        }
        .url {
            color: #6b7280;
            font-size: 16px;
        }
        .section {
            margin: 30px 0;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
        }
        .section h2 {
            color: #6366f1;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
        }
        .metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .metric {
            text-align: center;
            padding: 15px;
            background: #f9fafb;
            border-radius: 8px;
        }
        .metric-value {
            font-size: 32px;
            font-weight: bold;
            color: #6366f1;
        }
        .metric-label {
            font-size: 14px;
            color: #6b7280;
            margin-top: 5px;
        }
        .list {
            list-style: none;
            padding: 0;
        }
        .list li {
            padding: 8px 0;
            border-bottom: 1px solid #f3f4f6;
        }
        .list li:before {
            content: "✓";
            color: #10b981;
            font-weight: bold;
            margin-right: 10px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        @media print {
            body { margin: 0; }
            .section { break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">WSfynder</div>
        <h1 class="title">${data.title}</h1>
        <div class="url">${data.url}</div>
        <div style="margin-top: 10px; color: #6b7280;">
            Generated on ${new Date(data.created_at).toLocaleDateString()}
        </div>
    </div>

    <div class="section">
        <h2>Executive Summary</h2>
        <p>${data.summary}</p>
    </div>

    <div class="section">
        <h2>Performance Metrics</h2>
        <div class="metrics">
            <div class="metric">
                <div class="metric-value">${data.sustainability_score}%</div>
                <div class="metric-label">Sustainability Score</div>
            </div>
            <div class="metric">
                <div class="metric-value">${data.performance_score}%</div>
                <div class="metric-label">Performance Score</div>
            </div>
            <div class="metric">
                <div class="metric-value">${data.security_score}%</div>
                <div class="metric-label">Security Score</div>
            </div>
            <div class="metric">
                <div class="metric-value">${data.content_quality_score}%</div>
                <div class="metric-label">Content Quality</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Key Insights</h2>
        <ul class="list">
            ${data.key_points?.map((point: string) => `<li>${point}</li>`).join("") || "<li>No key points available</li>"}
        </ul>
    </div>

    <div class="section">
        <h2>Recommendations</h2>
        <ul class="list">
            ${data.improvements?.map((improvement: string) => `<li>${improvement}</li>`).join("") || "<li>No recommendations available</li>"}
        </ul>
    </div>

    <div class="section">
        <h2>Technical Details</h2>
        <p><strong>Hosting Provider:</strong> ${data.hosting_provider_name || "Unknown"}</p>
        <p><strong>SSL Certificate:</strong> ${data.ssl_certificate ? "Yes" : "No"}</p>
        <p><strong>Keywords:</strong> ${data.keywords?.join(", ") || "No keywords available"}</p>
    </div>

    ${
      includeRawData && data.raw_data
        ? `
    <div class="section">
        <h2>Raw Data</h2>
        <pre style="background: #f3f4f6; padding: 15px; border-radius: 8px; overflow-x: auto; font-size: 12px;">
${JSON.stringify(data.raw_data, null, 2)}
        </pre>
    </div>
    `
        : ""
    }

    <div class="footer">
        <p>This report was generated by WSfynder - Website Analysis & Optimization Platform</p>
        <p>For more insights and recommendations, visit wsfynder.com</p>
    </div>
</body>
</html>
  `
}
