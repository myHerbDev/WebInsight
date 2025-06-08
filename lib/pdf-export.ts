export interface ExportData {
  title: string
  url: string
  summary: string
  scores: {
    performance: number
    seo: number
    security: number
    accessibility: number
    mobile: number
    sustainability: number
  }
  technologies: Array<{ name: string; category: string; version?: string }>
  improvements: string[]
  keywords: string[]
  analysisDate: string
}

export async function exportToPDF(data: ExportData): Promise<void> {
  try {
    const response = await fetch("/api/export-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to generate PDF")
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `wsfynder-analysis-${data.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error("PDF export failed:", error)
    throw error
  }
}

export function generatePDFContent(data: ExportData): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>WSfynder Analysis Report - ${data.title}</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            margin: 0; 
            padding: 40px; 
            color: #333;
        }
        .header { 
            text-align: center; 
            margin-bottom: 40px; 
            border-bottom: 3px solid #8b5cf6; 
            padding-bottom: 20px; 
        }
        .logo { 
            font-size: 28px; 
            font-weight: bold; 
            background: linear-gradient(135deg, #8b5cf6, #10b981); 
            -webkit-background-clip: text; 
            -webkit-text-fill-color: transparent; 
            margin-bottom: 10px; 
        }
        h1 { 
            color: #1f2937; 
            margin: 0; 
            font-size: 24px; 
        }
        h2 { 
            color: #8b5cf6; 
            margin-top: 30px; 
            margin-bottom: 15px; 
            font-size: 20px;
            border-left: 4px solid #8b5cf6;
            padding-left: 15px;
        }
        .website-info { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 8px; 
            margin-bottom: 30px; 
            border-left: 4px solid #10b981;
        }
        .scores-grid { 
            display: grid; 
            grid-template-columns: repeat(3, 1fr); 
            gap: 20px; 
            margin: 20px 0; 
        }
        .score-card { 
            background: #ffffff; 
            padding: 20px; 
            border-radius: 8px; 
            text-align: center; 
            border: 2px solid #e5e7eb;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .score-value { 
            font-size: 36px; 
            font-weight: bold; 
            margin-bottom: 5px; 
        }
        .score-good { color: #10b981; }
        .score-fair { color: #f59e0b; }
        .score-poor { color: #ef4444; }
        .score-label { 
            font-size: 14px; 
            color: #6b7280; 
            font-weight: 500;
        }
        .tech-list { 
            display: grid; 
            grid-template-columns: repeat(2, 1fr); 
            gap: 10px; 
            margin: 15px 0; 
        }
        .tech-item { 
            background: #f3f4f6; 
            padding: 12px; 
            border-radius: 6px; 
            border-left: 3px solid #8b5cf6;
        }
        .tech-name { 
            font-weight: 600; 
            color: #1f2937; 
        }
        .tech-category { 
            font-size: 12px; 
            color: #6b7280; 
        }
        .improvements-list { 
            list-style: none; 
            padding: 0; 
        }
        .improvements-list li { 
            background: #fef3c7; 
            margin: 8px 0; 
            padding: 12px; 
            border-radius: 6px; 
            border-left: 3px solid #f59e0b;
            position: relative;
            padding-left: 30px;
        }
        .improvements-list li:before {
            content: "💡";
            position: absolute;
            left: 8px;
            top: 12px;
        }
        .keywords { 
            display: flex; 
            flex-wrap: wrap; 
            gap: 8px; 
            margin: 15px 0; 
        }
        .keyword { 
            background: #ddd6fe; 
            color: #5b21b6; 
            padding: 6px 12px; 
            border-radius: 20px; 
            font-size: 12px; 
            font-weight: 500;
        }
        .footer { 
            margin-top: 40px; 
            padding-top: 20px; 
            border-top: 2px solid #e5e7eb; 
            text-align: center; 
            color: #6b7280; 
            font-size: 12px; 
        }
        .analysis-date {
            color: #6b7280;
            font-size: 14px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">WSfynder</div>
        <h1>Website Analysis Report</h1>
        <div class="analysis-date">Generated on ${data.analysisDate}</div>
    </div>

    <div class="website-info">
        <h2 style="margin-top: 0; border: none; padding: 0;">Website Overview</h2>
        <p><strong>Title:</strong> ${data.title}</p>
        <p><strong>URL:</strong> ${data.url}</p>
        <p><strong>Summary:</strong> ${data.summary}</p>
    </div>

    <h2>Performance Scores</h2>
    <div class="scores-grid">
        <div class="score-card">
            <div class="score-value ${data.scores.performance >= 80 ? "score-good" : data.scores.performance >= 60 ? "score-fair" : "score-poor"}">${data.scores.performance}</div>
            <div class="score-label">Performance</div>
        </div>
        <div class="score-card">
            <div class="score-value ${data.scores.seo >= 80 ? "score-good" : data.scores.seo >= 60 ? "score-fair" : "score-poor"}">${data.scores.seo}</div>
            <div class="score-label">SEO</div>
        </div>
        <div class="score-card">
            <div class="score-value ${data.scores.security >= 80 ? "score-good" : data.scores.security >= 60 ? "score-fair" : "score-poor"}">${data.scores.security}</div>
            <div class="score-label">Security</div>
        </div>
        <div class="score-card">
            <div class="score-value ${data.scores.accessibility >= 80 ? "score-good" : data.scores.accessibility >= 60 ? "score-fair" : "score-poor"}">${data.scores.accessibility}</div>
            <div class="score-label">Accessibility</div>
        </div>
        <div class="score-card">
            <div class="score-value ${data.scores.mobile >= 80 ? "score-good" : data.scores.mobile >= 60 ? "score-fair" : "score-poor"}">${data.scores.mobile}</div>
            <div class="score-label">Mobile</div>
        </div>
        <div class="score-card">
            <div class="score-value ${data.scores.sustainability >= 80 ? "score-good" : data.scores.sustainability >= 60 ? "score-fair" : "score-poor"}">${data.scores.sustainability}</div>
            <div class="score-label">Sustainability</div>
        </div>
    </div>

    <h2>Technologies Detected</h2>
    <div class="tech-list">
        ${data.technologies
          .map(
            (tech) => `
            <div class="tech-item">
                <div class="tech-name">${tech.name}${tech.version ? ` v${tech.version}` : ""}</div>
                <div class="tech-category">${tech.category}</div>
            </div>
        `,
          )
          .join("")}
    </div>

    <h2>Keywords</h2>
    <div class="keywords">
        ${data.keywords.map((keyword) => `<span class="keyword">${keyword}</span>`).join("")}
    </div>

    <h2>Recommendations for Improvement</h2>
    <ul class="improvements-list">
        ${data.improvements.map((improvement) => `<li>${improvement}</li>`).join("")}
    </ul>

    <div class="footer">
        <p>Generated by WSfynder - Intelligent Website Analysis Platform</p>
        <p>Visit wsfynder.com for more advanced analysis and insights</p>
    </div>
</body>
</html>
  `
}
