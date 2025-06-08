"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Copy, Check, FileText, FileCode, FileSpreadsheet } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface AiContentStudioProps {
  analysisId?: string
  websiteUrl?: string
  websiteTitle?: string
  tone?: string
  onSignUpClick?: () => void
}

export function AiContentStudio({
  analysisId = "",
  websiteUrl = "",
  websiteTitle = "",
  tone = "professional",
  onSignUpClick,
}: AiContentStudioProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [contentType, setContentType] = useState("blog-post")
  const [customPrompt, setCustomPrompt] = useState("")
  const [copied, setCopied] = useState(false)
  const [selectedStructure, setSelectedStructure] = useState("default")

  const structures = {
    default: "Default structure",
    seo: "SEO-optimized with headings and keywords",
    social: "Social media friendly with short paragraphs",
    technical: "Technical with code examples and detailed explanations",
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGeneratedContent("")

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysisId,
          websiteUrl,
          websiteTitle,
          contentType,
          tone,
          customPrompt,
          structure: selectedStructure,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate content")
      }

      const data = await response.json()
      setGeneratedContent(data.content || "")
      toast({
        title: "Content Generated",
        description: "Your content has been successfully generated.",
      })
    } catch (error) {
      console.error("Error generating content:", error)
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      })

      // Fallback content for demonstration
      setGeneratedContent(
        `# ${websiteTitle || "Website"} - Sample Content\n\nThis is a sample content generated for demonstration purposes. The actual content generation service is currently unavailable.\n\n## About This Website\n\nThis website appears to be about ${websiteTitle || "various topics"}. Here's what we might include in a real analysis:\n\n- Key features and benefits\n- Target audience analysis\n- Content structure recommendations\n- SEO improvement suggestions\n\n## Next Steps\n\n1. Analyze your website's performance\n2. Identify content gaps\n3. Develop a content strategy\n4. Implement SEO best practices`,
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Copied!",
      description: "Content copied to clipboard.",
    })
  }

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-green-100">
        <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
          AI Content Studio
        </CardTitle>
        <CardDescription>Generate optimized content based on website analysis</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="generate">Generate Content</TabsTrigger>
            <TabsTrigger value="custom">Custom Prompt</TabsTrigger>
          </TabsList>
          <TabsContent value="generate" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="content-type">Content Type</Label>
                <Select defaultValue={contentType} onValueChange={setContentType}>
                  <SelectTrigger id="content-type">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog-post">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Blog Post</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="product-description">
                      <div className="flex items-center">
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        <span>Product Description</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="meta-description">
                      <div className="flex items-center">
                        <FileCode className="mr-2 h-4 w-4" />
                        <span>Meta Description</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tone">Content Tone</Label>
                <Select defaultValue={tone} onValueChange={(value) => (tone = value)}>
                  <SelectTrigger id="tone">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="humorous">Humorous</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="structure">Content Structure</Label>
              <Select defaultValue={selectedStructure} onValueChange={setSelectedStructure}>
                <SelectTrigger id="structure">
                  <SelectValue placeholder="Select structure" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(structures).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          <TabsContent value="custom" className="space-y-4">
            <div>
              <Label htmlFor="custom-prompt">Custom Prompt</Label>
              <Textarea
                id="custom-prompt"
                placeholder="Enter your custom prompt here..."
                className="min-h-[100px]"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Use {"{website}"} to reference the website URL and {"{title}"} for the website title.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Content"
            )}
          </Button>
        </div>

        {generatedContent && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <Label>Generated Content</Label>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
              </Button>
            </div>
            <div className="bg-muted p-4 rounded-md overflow-auto max-h-[400px]">
              <pre className="whitespace-pre-wrap text-sm">{generatedContent}</pre>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gradient-to-r from-purple-50 to-green-50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">Generate SEO-optimized content based on website analysis.</p>
        {onSignUpClick && (
          <Button variant="outline" onClick={onSignUpClick}>
            Sign Up for More Features
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
