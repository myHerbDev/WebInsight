"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Copy, FileText, Sparkles } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface ContentExportProps {
  content: string
  contentType: string
  analysisData?: any
  withMarkdown?: boolean
}

export function ContentExport({ content, contentType, analysisData, withMarkdown = true }: ContentExportProps) {
  const [isExporting, setIsExporting] = useState(false)

  const generateBeautifulExport = (includeMarkdown: boolean) => {
    const timestamp = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${contentType.charAt(0).toUpperCase() + contentType.slice(1)} Content - WebInSight</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            position: relative;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
        }
        
        .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-bottom: 20px;
            position: relative;
            z-index: 1;
        }
        
        .logo-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 18px;
        }
        
        .brand-name {
            font-size: 28px;
            font-weight: bold;
            background: linear-gradient(45deg, #fff, #e0e7ff);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .subtitle {
            opacity: 0.9;
            font-size: 16px;
            margin-top: 10px;
            position: relative;
            z-index: 1;
        }
        
        .meta-info {
            background: #f8fafc;
            padding: 20px 30px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .meta-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .meta-item {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #64748b;
            font-size: 14px;
        }
        
        .meta-icon {
            width: 16px;
            height: 16px;
            color: #6366f1;
        }
        
        .content {
            padding: 40px;
            background: white;
        }
        
        .content h1 {
            color: #1e293b;
            margin-bottom: 20px;
            font-size: 2.2em;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .content h2 {
            color: #334155;
            margin: 30px 0 15px 0;
            font-size: 1.8em;
            font-weight: 600;
            border-left: 4px solid #6366f1;
            padding-left: 15px;
        }
        
        .content h3 {
            color: #475569;
            margin: 25px 0 12px 0;
            font-size: 1.4em;
            font-weight: 600;
        }
        
        .content p {
            margin-bottom: 15px;
            text-align: justify;
            color: #475569;
        }
        
        .content ul, .content ol {
            margin: 15px 0;
            padding-left: 30px;
        }
        
        .content li {
            margin-bottom: 8px;
            color: #475569;
        }
        
        .content blockquote {
            background: #f1f5f9;
            border-left: 4px solid #6366f1;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 10px 10px 0;
            font-style: italic;
        }
        
        .content code {
            background: #f1f5f9;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            color: #6366f1;
        }
        
        .content pre {
            background: #1e293b;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 10px;
            overflow-x: auto;
            margin: 20px 0;
            border: 1px solid #334155;
        }
        
        .footer {
            background: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
        }
        
        .footer-logo {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 10px;
        }
        
        .print-only {
            display: none;
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .container {
                box-shadow: none;
                border-radius: 0;
            }
            
            .print-only {
                display: block;
            }
        }
        
        .performance-badge {
            display: inline-block;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin: 5px;
        }
        
        .highlight {
            background: linear-gradient(135deg, #fef3c7, #fbbf24);
            padding: 2px 6px;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <div class="logo-icon">W</div>
                <div class="brand-name">WebInSight</div>
            </div>
            <div class="subtitle">AI-Powered Website Analysis & Content Generation</div>
        </div>
        
        <div class="meta-info">
            <div class="meta-grid">
                <div class="meta-item">
                    <svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Generated: ${timestamp}
                </div>
                <div class="meta-item">
                    <svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Content Type: ${contentType.charAt(0).toUpperCase() + contentType.slice(1)}
                </div>
                ${
                  analysisData
                    ? `
                <div class="meta-item">
                    <svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
                    </svg>
                    Website: ${analysisData.url || "N/A"}
                </div>
                `
                    : ""
                }
                <div class="meta-item">
                    <svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    Powered by AI
                </div>
            </div>
        </div>
        
        <div class="content">
            ${includeMarkdown ? content.replace(/\n/g, "<br>") : content.replace(/[#*`]/g, "").replace(/\n/g, "<br>")}
        </div>
        
        <div class="footer">
            <div class="footer-logo">
                <div class="logo-icon" style="width: 24px; height: 24px; font-size: 12px;">W</div>
                <strong>WebInSight</strong>
            </div>
            <p>Professional website analysis and AI-powered content generation</p>
            <p style="font-size: 12px; margin-top: 10px; opacity: 0.7;">
                Generated with ❤️ by myHerb's WebInSight Platform
            </p>
        </div>
    </div>
</body>
</html>`

    return htmlTemplate
  }

  const handleCopy = async (withMarkdown: boolean) => {
    try {
      const textToCopy = withMarkdown ? content : content.replace(/[#*`]/g, "")
      await navigator.clipboard.writeText(textToCopy)
      toast({
        title: "✨ Copied to clipboard",
        description: `Content copied ${withMarkdown ? "with" : "without"} markdown formatting`,
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy content to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const htmlContent = generateBeautifulExport(withMarkdown)
      const blob = new Blob([htmlContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `webinsight-${contentType}-${new Date().toISOString().split("T")[0]}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "✨ Export successful",
        description: "Beautiful HTML report downloaded successfully",
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export content",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-teal-500 rounded-lg">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          Export Options
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(true)}
            className="flex flex-col gap-1 h-auto py-3 border-purple-200 hover:bg-purple-50"
          >
            <Copy className="h-4 w-4" />
            <span className="text-xs">Copy with MD</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(false)}
            className="flex flex-col gap-1 h-auto py-3 border-purple-200 hover:bg-purple-50"
          >
            <FileText className="h-4 w-4" />
            <span className="text-xs">Copy Plain</span>
          </Button>

          <Button
            onClick={handleExport}
            disabled={isExporting}
            size="sm"
            className="flex flex-col gap-1 h-auto py-3 bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white"
          >
            {isExporting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span className="text-xs">Export HTML</span>
          </Button>

          <div className="flex flex-col gap-1 items-center py-3 text-center">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs">myHerb Style</Badge>
            <span className="text-xs text-gray-500">Beautiful Design</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            💡 <strong>Pro tip:</strong> The exported HTML includes beautiful styling, myHerb branding, and can be
            printed as PDF or shared directly. Content is automatically saved for future access.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
