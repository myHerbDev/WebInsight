import { NextResponse } from "next/server"
import { generatePDFContent, type ExportData } from "@/lib/pdf-export"

export async function POST(request: Request) {
  try {
    const data: ExportData = await request.json()

    if (!data.title || !data.url) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    const htmlContent = generatePDFContent(data)

    // In a real implementation, you would use a library like Puppeteer or Playwright
    // to generate the PDF from HTML. For now, we'll return the HTML content
    // that can be used with a client-side PDF generation library.

    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="wsfynder-analysis-${data.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.html"`,
      },
    })
  } catch (error) {
    console.error("PDF export error:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
