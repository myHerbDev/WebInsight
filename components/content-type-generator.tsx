"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Copy, Download, FileText, Loader2, Sparkles, Wand2 } from "lucide-react"
import { copyToClipboard } from "@/lib/share"

interface ContentTypeGeneratorProps {
  analysisId: string
  tone?: string
  onSignUpClick: () => void
}

export function ContentTypeGenerator({ analysisId, tone = "professional", onSignUpClick }: ContentTypeGeneratorProps) {
  const [selectedContentType, setSelectedContentType] = useState("blog-post")
  const [selectedTone, setSelectedTone] = useState(tone)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string>("")
  const [contentHistory, setContentHistory] = useState<Array<{ type: string; content: string; timestamp: Date }>>([])

  // Load content from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem(`content-history-${analysisId}`)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setContentHistory(
          parsed.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          })),
        )
      } catch (error) {
        console.error("Error loading content history:", error)
      }
    }
  }, [analysisId])

  // Save content to localStorage whenever contentHistory changes
  useEffect(() => {
    if (contentHistory.length > 0) {
      localStorage.setItem(`content-history-${analysisId}`, JSON.stringify(contentHistory))
    }
  }, [contentHistory, analysisId])

  const contentTypes = [
    { value: "blog-post", label: "Blog Post", icon: FileText },
    { value: "social-media", label: "Social Media Post", icon: Sparkles },
    { value: "email-newsletter", label: "Email Newsletter", icon: FileText },
    { value: "press-release", label: "Press Release", icon: FileText },
    { value: "product-description", label: "Product Description", icon: FileText },
    { value: "meta-description", label: "Meta Description", icon: FileText },
  ]

  const tones = [
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual" },
    { value: "enthusiastic", label: "Enthusiastic" },
    { value: "technical", label: "Technical" },
    { value: "friendly", label: "Friendly" },
    { value: "authoritative", label: "Authoritative" },
  ]

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysisId,
          contentType: selectedContentType,
          tone: selectedTone,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate content")
      }

      const data = await response.json()
      setGeneratedContent(data.content)

      // Add to history
      const newHistoryItem = {
        type: selectedContentType,
        content: data.content,
        timestamp: new Date(),
      }
      setContentHistory((prev) => [newHistoryItem, ...prev.slice(0, 9)]) // Keep last 10 items

      toast({
        title: "Content Generated!",
        description: `${contentTypes.find((t) => t.value === selectedContentType)?.label} has been generated successfully.`,
      })
    } catch (error) {
      console.error("Error generating content:", error)
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async (content: string) => {
    const success = await copyToClipboard(content)
    if (success) {
      toast({
        title: "Copied!",
        description: "Content copied to clipboard.",
      })
    } else {
      toast({
        title: "Copy Failed",
        description: "Failed to copy content to clipboard.",
        variant: "destructive",
      })
    }
  }

  const handleDownload = (content: string, type: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${type.replace("-", "_")}_${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded!",
      description: "Content saved as text file.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Content Generation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wand2 className="h-5 w-5 text-purple-500" />
            <span>AI Content Generator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Content Type</label>
              <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tone</label>
              <Select value={selectedTone} onValueChange={setSelectedTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((tone) => (
                    <SelectItem key={tone.value} value={tone.value}>
                      {tone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Content Display */}
      {generatedContent && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Content</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleCopy(generatedContent)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(generatedContent, selectedContentType)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Badge variant="outline" className="mr-2">
                {contentTypes.find((t) => t.value === selectedContentType)?.label}
              </Badge>
              <Badge variant="outline">{tones.find((t) => t.value === selectedTone)?.label} Tone</Badge>
            </div>
            <Textarea
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
              placeholder="Generated content will appear here..."
            />
          </CardContent>
        </Card>
      )}

      {/* Content History */}
      {contentHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Content History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contentHistory.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{contentTypes.find((t) => t.value === item.type)?.label}</Badge>
                      <span className="text-sm text-gray-500">
                        {item.timestamp.toLocaleDateString()} {item.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleCopy(item.content)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownload(item.content, item.type)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setGeneratedContent(item.content)}>
                        Load
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {item.content.substring(0, 200)}...
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sign Up Prompt */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Unlock More Features</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Sign up to save your generated content, access more content types, and get unlimited generations.
          </p>
          <Button onClick={onSignUpClick} className="bg-gradient-to-r from-purple-600 to-blue-600">
            Sign Up Now
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
