"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FileText, FileType, Loader2, MessageSquare, Newspaper, Search } from "lucide-react"
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

  const handleGenerate = async (type: string) => {
    setIsGenerating(true)
    setGeneratedContent("")
    setCurrentType(type)
    setError(null)

    try {
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
        throw new Error(data.error || "Failed to generate content")
      }

      setGeneratedContent(data.content)
      if (data.contentId) {
        setGeneratedContentId(data.contentId)
      }
    } catch (error) {
      console.error("Error generating content:", error)
      setError("Failed to generate content. Please try again.")
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
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
      // In a real app, you'd generate a PDF and trigger download
      toast({
        title: "Export",
        description: "In a production app, this would export your content to a file.",
      })

      // Prompt for sign up to enable full export features
      onSignUpClick()
    } catch (error) {
      console.error("Error exporting:", error)
      toast({
        title: "Error",
        description: "Failed to export. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Content</CardTitle>
        <CardDescription>Create different types of content based on the website analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="research" value={currentType} onValueChange={setCurrentType}>
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="research">
              <Search className="h-4 w-4 mr-2" />
              Research
            </TabsTrigger>
            <TabsTrigger value="document">
              <FileText className="h-4 w-4 mr-2" />
              Document
            </TabsTrigger>
            <TabsTrigger value="blog">
              <FileType className="h-4 w-4 mr-2" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="marketing">
              <Newspaper className="h-4 w-4 mr-2" />
              Marketing
            </TabsTrigger>
            <TabsTrigger value="social">
              <MessageSquare className="h-4 w-4 mr-2" />
              Social
            </TabsTrigger>
          </TabsList>

          {["research", "document", "blog", "marketing", "social"].map((type) => (
            <TabsContent key={type} value={type} className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium capitalize">{type} Content</h3>
                <Button onClick={() => handleGenerate(type)} disabled={isGenerating}>
                  {isGenerating && currentType === type ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    `Generate ${type}`
                  )}
                </Button>
              </div>

              {error && currentType === type && !isGenerating && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-2">
                  <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                </div>
              )}

              <Textarea
                value={generatedContent}
                readOnly
                placeholder={`Your generated ${type} content will appear here...`}
                className="min-h-[300px] font-mono text-sm"
              />

              {generatedContent && (
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
                    Copy to Clipboard
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    Export
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
