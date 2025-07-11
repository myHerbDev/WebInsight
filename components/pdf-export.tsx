"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileDown, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface PDFExportProps {
  analysisId: string
  websiteTitle: string
  disabled?: boolean
}

export function PDFExport({ analysisId, websiteTitle, disabled = false }: PDFExportProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (!analysisId) {
      toast({
        title: "Export Failed",
        description: "No analysis data available to export.",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)

    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysisId,
          format: "pdf",
          includeRawData: false,
        }),
      })

      if (!response.ok) {
        throw new Error("Export failed")
      }

      // Get the PDF blob
      const blob = await response.blob()

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${websiteTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_analysis.pdf`
      document.body.appendChild(a)
      a.click()

      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Export Successful",
        description: "Your PDF report has been downloaded.",
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export Failed",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={disabled || isExporting}
      variant="outline"
      size="sm"
      className="gap-2 bg-transparent"
    >
      {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
      {isExporting ? "Generating PDF..." : "Export PDF"}
    </Button>
  )
}
