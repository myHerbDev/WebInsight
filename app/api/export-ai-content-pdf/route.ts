import { NextResponse } from "next/server"

// Basic Markdown to HTML conversion
const basicMarkdownToHtml = (md: string): string => {
  return (
    md
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*)\*/gim, "<em>$1</em>")
      .replace(/!\[(.*?)\]$$(.*?)$$/gim, '<img alt="$1" src="$2">') // Basic image support
      .replace(/\[(.*?)\]$$(.*?)$$/gim, '<a href="$2">$1</a>') // Basic link support
      .replace(/`([^`]+)`/gim, "<code>$1</code>") // Inline code
      // Handle paragraphs by splitting by double newlines, then wrapping non-empty lines
      .split(/\n\s*\n/)
      .map((paragraph) => {
        const trimmed = paragraph.trim()
        if (!trimmed) return ""
        // Avoid wrapping if it's already a block element (heuristic)
        if (
          trimmed.startsWith("<h") ||
          trimmed.startsWith("<ul") ||
          trimmed.startsWith("<ol") ||
          trimmed.startsWith("<pre") ||
          trimmed.startsWith("<blockquote") ||
          trimmed.startsWith("<table")
        ) {
          return trimmed.replace(/\n/g, "<br />") // Convert single newlines within these blocks to <br>
        }
        return `<p>${trimmed.replace(/\n/g, "<br />")}</p>`
      })
      .join("")
      // Basic unordered list
      .replace(/^\s*-\s+(.*)/gim, "<ul><li>$1</li></ul>")
      .replace(/<\/ul>\s*<ul>/gim, "") // Merge adjacent lists
      // Basic ordered list
      .replace(/^\s*\d+\.\s+(.*)/gim, "<ol><li>$1</li></ol>")
      .replace(/<\/ol>\s*<ol>/gim, "")
  ) // Merge adjacent lists
}

export async function POST(request: Request) {
  try {
    const { markdownContent, title: requestTitle } = await request.json()

    const title = requestTitle || "Exported Content"

    if (!markdownContent) {
      return NextResponse.json({ error: "Markdown content is required" }, { status: 400 })
    }

    const htmlContent = basicMarkdownToHtml(markdownContent)

    const pdfHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body {
            font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            margin: 0;
            padding: 0;
            line-height: 1.6;
            color: #333333;
            background-color: #ffffff;
          }
          .page-container {
            max-width: 800px;
            margin: 20px auto;
            padding: 30px;
            border: 1px solid #e0e0e0;
            box-shadow: 0 0 10px rgba(0,0,0,0.05);
          }
          .page-header {
            text-align: center;
            padding-bottom: 15px;
            margin-bottom: 25px;
            border-bottom: 1px solid #e0e0e0;
          }
          .page-header h1 {
            font-size: 24px;
            color: #1a1a1a;
            margin: 0;
          }
          .content-main {
            font-size: 16px;
          }
          .page-footer {
            text-align: center;
            padding-top: 15px;
            margin-top: 25px;
            border-top: 1px solid #e0e0e0;
            font-size: 12px;
            color: #777777;
          }
          h1, h2, h3, h4, h5, h6 {
            color: #1a1a1a;
            margin-top: 1.4em;
            margin-bottom: 0.6em;
            line-height: 1.3;
          }
          h1 { font-size: 2em; }
          h2 { font-size: 1.75em; }
          h3 { font-size: 1.5em; }
          p { margin-bottom: 1em; }
          pre {
            background-color: #f4f5f7;
            padding: 15px;
            border-radius: 4px;
            overflow-x: auto;
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
            font-size: 0.9em;
          }
          code {
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
            background-color: #f4f5f7;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-size: 0.9em;
          }
          pre > code {
            background-color: transparent;
            padding: 0;
          }
          blockquote {
            border-left: 4px solid #cccccc;
            padding-left: 15px;
            margin-left: 0;
            font-style: italic;
            color: #555555;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1em;
          }
          th, td {
            border: 1px solid #dddddd;
            padding: 10px;
            text-align: left;
          }
          th {
            background-color: #f9f9f9;
          }
          img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
          }
          ul, ol { padding-left: 20px; }

          @media print {
            body {
              font-size: 11pt; /* Adjust for print */
              color: #000000;
            }
            .page-container {
              border: none;
              box-shadow: none;
              margin: 0;
              padding: 0;
              max-width: 100%;
            }
            .page-footer {
              position: fixed;
              bottom: 10px; /* Adjust as needed */
              left: 0;
              right: 0;
              width: auto; /* Let it be natural width or 100% if needed */
              padding-left: 30px; /* Match page padding */
              padding-right: 30px; /* Match page padding */
            }
            /* Avoid breaking elements across pages where possible */
            h1, h2, h3, h4, h5, h6, p, pre, blockquote { page-break-inside: avoid; }
            table, figure { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="page-container">
          <header class="page-header">
            <h1>${title}</h1>
          </header>
          <main class="content-main">
            ${htmlContent}
          </main>
          <footer class="page-footer">
            Made by myHerb &bull; Exported using WebInSight
          </footer>
        </div>
      </body>
      </html>
    `

    return new NextResponse(pdfHtml, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
        // Suggests download, user can then print this HTML to PDF
        "Content-Disposition": `attachment; filename="${title.replace(/[^a-z0-9]/gi, "_")}.html"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF HTML:", error)
    const message = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ error: "Failed to generate PDF content", details: message }, { status: 500 })
  }
}
