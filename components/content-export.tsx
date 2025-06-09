"use client"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, FileJson, FileText } from "lucide-react"
import type { WebsiteData } from "@/types/website-data"
import { toast } from "@/components/ui/use-toast"

interface ContentExportProps {
  data: WebsiteData
  onSignUpClick: (userId?: string) => void // For potential premium export features
}

export function ContentExport({ data, onSignUpClick }: ContentExportProps) {
  const downloadFile = (filename: string, content: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({ title: "Download Started", description: `${filename} is downloading.` })
  }

  const exportOptions = [
    {
      name: "JSON",
      icon: FileJson,
      action: () =>
        downloadFile(
          `${(data.title || "website_analysis").replace(/\s+/g, "_").toLowerCase()}.json`,
          JSON.stringify(data, null, 2),
          "application/json",
        ),
    },
    {
      name: "Text Summary",
      icon: FileText,
      action: () => {
        const textSummary = `Website Analysis for: ${data.url}\nTitle: ${data.title}\n\nSummary:\n${data.summary}\n\nKey Points:\n${data.keyPoints.join("\n- ")}\n\nKeywords:\n${data.keywords.join(", ")}\n\nImprovements:\n${data.improvements?.join("\n- ")}`
        downloadFile(
          `${(data.title || "website_summary").replace(/\s+/g, "_").toLowerCase()}.txt`,
          textSummary,
          "text/plain",
        )
      },
    },
    // Add Markdown export if AI generates markdown content
  ]

  return (
    <Card className="dark:bg-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Download className="h-5 w-5 text-blue-500" />
          <span>Export Analysis Data</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Download your website analysis data in various formats.</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" />
              Choose Export Format
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {exportOptions.map((option) => {
              const Icon = option.icon
              return (
                <DropdownMenuItem key={option.name} onClick={option.action} className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span>Export as {option.name}</span>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* 
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md text-center">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Want more export options or automated reports? 
            <Button variant="link" onClick={() => onSignUpClick()} className="p-0 h-auto ml-1 text-blue-700 dark:text-blue-300">Sign up for premium features!</Button>
          </p>
        </div>
        */}
      </CardContent>
    </Card>
  )
}
