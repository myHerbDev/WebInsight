"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { LoadingAnimation } from "@/components/loading-animation"
import { Copy, Download, RefreshCw, Sparkles, Brain, FileText, Wand2 } from "lucide-react"
import { motion } from "framer-motion"
import type { WebsiteData } from "@/types/website-data"

interface EnhancedAIGeneratorProps {
  websiteData: WebsiteData | null
  onSignUpClick: () => void
}

export function EnhancedAIGenerator({ websiteData, onSignUpClick }: EnhancedAIGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [contentType, setContentType] = useState("blog-post")
  const [customPrompt, setCustomPrompt] = useState("")
  const [contentStructure, setContentStructure] = useState("")
  const [contentLength, setContentLength] = useState(1500)
  const [tone, setTone] = useState("professional")
  const [includeKeywords, setIncludeKeywords] = useState(true)
  const [includeCTA, setIncludeCTA] = useState(true)
  const [activeTab, setActiveTab] = useState("generate")

  const contentTypeOptions = [
    { value: "blog-post", label: "Blog Post" },
    { value: "about-us", label: "About Us Page" },
    { value: "faq", label: "FAQ Section" },
    { value: "product-description", label: "Product Description" },
    { value: "service-page", label: "Service Page" },
    { value: "landing-page", label: "Landing Page" },
  ]

  const toneOptions = [
    { value: "professional", label: "Professional" },
    { value: "conversational", label: "Conversational" },
    { value: "enthusiastic", label: "Enthusiastic" },
    { value: "informative", label: "Informative" },
    { value: "persuasive", label: "Persuasive" },
  ]

  const handleGenerate = async () => {
    if (!websiteData) {
      toast({
        title: "No Website Data",
        description: "Please analyze a website first to generate content.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setGeneratedContent("")

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          websiteData,
          contentType,
          customPrompt,
          contentStructure,
          contentLength,
          tone,
          includeKeywords,
          includeCTA,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setGeneratedContent(data.content)
      setActiveTab("result")
    } catch (error) {
      console.error("Error generating content:", error)
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
    toast({
      title: "Copied!",
      description: "Content copied to clipboard.",
    })
  }

  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob([generatedContent], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${contentType}-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const formatContentLength = (length: number) => {
    if (length >= 1000) {
      return `${Math.round(length / 100) / 10}k words`
    }
    return `${length} words`
  }

  return (
    <div className="w-full space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate" className="flex items-center space-x-2">
            <Wand2 className="h-4 w-4" />
            <span>Generate</span>
          </TabsTrigger>
          <TabsTrigger value="result" className="flex items-center space-x-2" disabled={!generatedContent}>
            <FileText className="h-4 w-4" />
            <span>Result</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="content-type">Content Type</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger id="content-type">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-prompt">Custom Instructions (Optional)</Label>
                <Textarea
                  id="custom-prompt"
                  placeholder="Add specific instructions for content generation..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content-structure">Content Structure Template (Optional)</Label>
                <Textarea
                  id="content-structure"
                  placeholder="# Title
## Introduction
Content here...
## Section 1
Content here...
## Section 2
Content here..."
                  value={contentStructure}
                  onChange={(e) => setContentStructure(e.target.value)}
                  className="min-h-[150px] font-mono"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="content-length">Content Length</Label>
                  <span className="text-sm text-gray-500">{formatContentLength(contentLength)}</span>
                </div>
                <Slider
                  id="content-length"
                  min={500}
                  max={4000}
                  step={100}
                  value={[contentLength]}
                  onValueChange={(value) => setContentLength(value[0])}
                  className="py-4"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger id="tone">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {toneOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="include-keywords" className="cursor-pointer">
                    Include Keywords
                  </Label>
                  <span className="text-xs text-gray-500">Optimize for SEO</span>
                </div>
                <Switch id="include-keywords" checked={includeKeywords} onCheckedChange={setIncludeKeywords} />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="include-cta" className="cursor-pointer">
                    Include Call to Action
                  </Label>
                  <span className="text-xs text-gray-500">Add conversion elements</span>
                </div>
                <Switch id="include-cta" checked={includeCTA} onCheckedChange={setIncludeCTA} />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !websiteData}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Generate Content
                  </>
                )}
              </Button>

              {!websiteData && (
                <div className="text-center text-sm text-gray-500">
                  <p>Please analyze a website first to generate content.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="result" className="space-y-6">
          {isGenerating ? (
            <Card>
              <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[400px]">
                <LoadingAnimation />
                <p className="text-center text-gray-500 mt-4">Generating your content...</p>
              </CardContent>
            </Card>
          ) : generatedContent ? (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>

                <div className="border rounded-md p-4 bg-white min-h-[400px] whitespace-pre-wrap">
                  {generatedContent}
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("generate")}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Modify Settings
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[400px]">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                  <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No Content Generated Yet</h3>
                  <p className="text-gray-500 mb-6">
                    Configure your settings and click "Generate Content" to create AI-powered content.
                  </p>
                  <Button onClick={() => setActiveTab("generate")} variant="outline">
                    Go to Generator
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
