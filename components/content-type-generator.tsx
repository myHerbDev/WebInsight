"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, FileType, Loader2, MessageSquare, Newspaper, Search, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface ContentTypeGeneratorProps {
  analysisId: string
  tone: string
  onSignUpClick: () => void
}

export function ContentTypeGenerator({ analysisId, tone, onSignUpClick }: ContentTypeGeneratorProps) {
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentType, setCurrentType] = useState("research")
  const [generatedContentId, setGeneratedContentId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const contentTypes = [
    {
      id: "research",
      label: "Research",
      icon: Search,
      description: "Comprehensive research report with analysis and insights",
    },
    {
      id: "document",
      label: "Document",
      icon: FileText,
      description: "Formal document with structured findings",
    },
    {
      id: "blog",
      label: "Blog",
      icon: FileType,
      description: "Engaging blog post about the website analysis",
    },
    {
      id: "marketing",
      label: "Marketing",
      icon: Newspaper,
      description: "Marketing strategy and campaign recommendations",
    },
    {
      id: "social",
      label: "Social",
      icon: MessageSquare,
      description: "Social media content for multiple platforms",
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          AI Content Generator
        </CardTitle>
        <CardDescription>
          Generate different types of content based on the website analysis using advanced AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="research" value={currentType} onValueChange={setCurrentType}>
          <TabsList className="grid grid-cols-5 mb-6">
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

          {contentTypes.map((type) => (
            <TabsContent key={type.id} value={type.id} className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium capitalize">{type.label} Content</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{type.description}</p>
                </div>
                <Button onClick={() => handleGenerate(type.id)} disabled={isGenerating} className="ml-4">
                  {isGenerating && currentType === type.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <type.icon className="h-4 w-4 mr-2" />
                      Generate {type.label}
                    </>
                  )}
                </Button>
              </div>

              {/* Status Messages */}
              {error && currentType === type.id && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && currentType === type.id && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Loading State */}
              {isGenerating && currentType === type.id && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Analyzing website data and generating {type.label.toLowerCase()} content...
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">This may take 10-30 seconds</p>
                  </div>
                </div>
              )}

              {/* Content Display */}
              <Textarea
                value={generatedContent}
                readOnly
                placeholder={`Your generated ${type.label.toLowerCase()} content will appear here...`}
                className="min-h-[400px] font-mono text-sm"
              />

              {/* Action Buttons */}
              {generatedContent && (
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
                    Copy to Clipboard
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    Export as File
                  </Button>
                  <Button size="sm" onClick={onSignUpClick} className="bg-purple-600 hover:bg-purple-700">
                    Save & Get More Features
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Help Section */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h4 className="font-medium mb-2">Content Generation Tips:</h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Research reports provide comprehensive analysis with actionable insights</li>
            <li>• Blog posts are engaging and shareable for content marketing</li>
            <li>• Marketing content focuses on strategy and campaign recommendations</li>
            <li>• Social media content is optimized for different platforms</li>
            <li>• All content is based on real analysis data from your website</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
