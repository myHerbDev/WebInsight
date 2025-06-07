"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  GraduationCap,
  FileSignature,
  Newspaper,
  ClipboardCheck,
  Briefcase,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface ContentTypeGeneratorProps {
  analysisId: string
  tone: string
  onSignUpClick: () => void
}

export function AiContentStudio({ analysisId, tone, onSignUpClick }: ContentTypeGeneratorProps) {
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentType, setCurrentType] = useState("research")
  const [generatedContentId, setGeneratedContentId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const contentTypes = [
    {
      id: "academic_summary",
      label: "Academic Summary",
      icon: GraduationCap,
      description: "Summarize findings for scholarly or research purposes.",
    },
    {
      id: "generic_document",
      label: "Document",
      icon: FileSignature,
      description: "Generate a structured document for various needs.",
    },
    {
      id: "article",
      label: "Article",
      icon: Newspaper,
      description: "Create an in-depth article based on the analysis.",
    },
    {
      id: "test_report",
      label: "Test Report",
      icon: ClipboardCheck,
      description: "Produce an analytical report of test findings.",
    },
    {
      id: "case_study",
      label: "Case Study",
      icon: Briefcase,
      description: "Develop a case study highlighting key aspects.",
    },
    // Keeping some of the previous distinct ones if they are still valuable
    {
      id: "research_report", // formerly "research"
      label: "Research Report",
      icon: FileText, // Using FileText as Search was generic
      description: "Comprehensive research report with analysis and insights.",
    },
    {
      id: "blog_post", // formerly "blog"
      label: "Blog Post",
      icon: Newspaper, // Or a more blog-specific icon
      description: "Engaging blog post about the website analysis.",
    },
    {
      id: "marketing_copy", // formerly "marketing"
      label: "Marketing Copy",
      icon: Sparkles, // Using Sparkles for creative copy
      description: "Marketing strategy and campaign recommendations.",
    },
  ]

  const handleGenerate = async (type: string) => {
    setIsGenerating(true)
    setGeneratedContent("")
    setCurrentType(type)
    setError(null)
    setSuccess(null)

    try {
      console.log(`Generating ${type} content for analysis ${analysisId}`)

      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysisId,
          contentType: type,
          tone,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to generate content")
      }

      if (data.content) {
        setGeneratedContent(data.content)
        if (data.contentId) {
          setGeneratedContentId(data.contentId)
        }
        setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} content generated successfully!`)

        toast({
          title: "Content Generated",
          description: `${type.charAt(0).toUpperCase() + type.slice(1)} content has been created successfully.`,
        })
      } else {
        throw new Error("No content received from the server")
      }
    } catch (error) {
      console.error("Error generating content:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to generate content. Please try again."
      setError(errorMessage)

      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent)
      toast({
        title: "Copied to clipboard",
        description: "Content has been copied to your clipboard",
      })
    } catch (error) {
      console.error("Error copying to clipboard:", error)
      toast({
        title: "Error",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleExport = async () => {
    try {
      // Create a downloadable file
      const blob = new Blob([generatedContent], { type: "text/markdown" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${currentType}_content_${new Date().toISOString().split("T")[0]}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Export Successful",
        description: "Content has been downloaded as a markdown file.",
      })

      // Prompt for sign up to enable more export features
      setTimeout(() => {
        onSignUpClick()
      }, 2000)
    } catch (error) {
      console.error("Error exporting:", error)
      toast({
        title: "Error",
        description: "Failed to export. Please try again.",
        variant: "destructive",
      })
    }
  }

  const selectedContentType = contentTypes.find((ct) => ct.id === currentType)

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          AI Content Studio
        </CardTitle>
        <CardDescription>
          Magically generate diverse content based on the website analysis using advanced AI. Select a content type to
          begin.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs
          defaultValue="academic_summary"
          value={currentType}
          onValueChange={setCurrentType}
          className="flex flex-col md:flex-row"
        >
          <TabsList className="grid grid-cols-1 md:flex md:flex-col md:w-1/4 h-auto p-4 gap-1 border-r">
            {contentTypes.map((type) => {
              const Icon = type.icon
              return (
                <TabsTrigger key={type.id} value={type.id} className="flex flex-col gap-1 h-auto py-3">
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{type.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          <div className="flex-1 p-6">
            {contentTypes.map((type) => (
              <TabsContent key={type.id} value={type.id} className="space-y-6 mt-0">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <h3 className="text-xl font-semibold capitalize">{type.label}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                  </div>
                  <Button
                    onClick={() => handleGenerate(type.id)}
                    disabled={isGenerating}
                    className="w-full sm:w-auto mt-2 sm:mt-0"
                  >
                    {isGenerating && currentType === type.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate {type.label}
                      </>
                    )}
                  </Button>
                </div>

                {/* Status Messages */}
                {error && currentType === type.id && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && currentType === type.id && (
                  <Alert className="mt-4">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                {/* Loading State */}
                {isGenerating && currentType === type.id && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-md font-medium text-muted-foreground">
                      Conjuring {type.label.toLowerCase()} content...
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      This magical process may take 10-45 seconds.
                    </p>
                  </div>
                )}

                {/* Content Display */}
                <Textarea
                  value={generatedContent}
                  readOnly
                  placeholder={`Your generated ${type.label.toLowerCase()} content will appear here...`}
                  className="min-h-[300px] md:min-h-[450px] font-mono text-sm bg-muted/30 border rounded-md focus:ring-1 focus:ring-primary"
                />

                {/* Action Buttons */}
                {generatedContent && (
                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4 border-t">
                    <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
                      Copy to Clipboard
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExport}>
                      Export as File
                    </Button>
                    <Button
                      size="sm"
                      onClick={onSignUpClick}
                      className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:opacity-90 text-white"
                    >
                      Save & Get More Features
                    </Button>
                  </div>
                )}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t p-6">
        <div className="text-xs text-muted-foreground">
          <p>
            <strong>Tip:</strong> The quality of generated content depends on the richness of the initial website
            analysis. Ensure your target URL provides comprehensive data.
          </p>
          <p className="mt-1">
            Generated content may require review and editing for accuracy and tone. AI is a tool to assist, not replace,
            human oversight.
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}
