"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { MagicalWebsiteInput } from "@/components/magical-website-input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Sparkles,
  FileText,
  BookOpen,
  FileCode,
  MessageSquare,
  PenTool,
  Lightbulb,
  Share2,
  AlertCircle,
  Loader2,
} from "lucide-react"

const CONTENT_TYPES = [
  {
    id: "research",
    name: "Research & Analysis",
    description: "In-depth research documents and analytical reports",
    icon: <BookOpen className="h-5 w-5" />,
    formats: ["Research Paper", "Case Study", "White Paper", "Industry Report", "Literature Review"],
    recommendedTones: ["Academic", "Analytical", "Technical", "Informative"],
    recommendedStyles: ["Analytical", "Formal", "Technical"],
  },
  {
    id: "business",
    name: "Business Documents",
    description: "Professional business content and documentation",
    icon: <FileText className="h-5 w-5" />,
    formats: ["Business Plan", "Executive Summary", "Proposal", "Report", "Policy Document"],
    recommendedTones: ["Professional", "Authoritative", "Informative"],
    recommendedStyles: ["Formal", "Analytical", "Instructional"],
  },
  {
    id: "marketing",
    name: "Marketing Content",
    description: "Engaging content for marketing and promotion",
    icon: <PenTool className="h-5 w-5" />,
    formats: ["Blog Post", "Landing Page", "Email Campaign", "Product Description", "Press Release"],
    recommendedTones: ["Persuasive", "Engaging", "Creative", "Conversational"],
    recommendedStyles: ["Persuasive", "Descriptive", "Conversational"],
  },
  {
    id: "social",
    name: "Social & Communication",
    description: "Content for social media and communication",
    icon: <MessageSquare className="h-5 w-5" />,
    formats: ["Social Media Posts", "Newsletter", "Community Update", "FAQ", "Announcement"],
    recommendedTones: ["Conversational", "Engaging", "Humorous", "Creative"],
    recommendedStyles: ["Conversational", "Creative", "Narrative"],
  },
  {
    id: "technical",
    name: "Technical Content",
    description: "Specialized technical documentation and guides",
    icon: <FileCode className="h-5 w-5" />,
    formats: ["Technical Documentation", "API Guide", "Tutorial", "Troubleshooting Guide", "Specification"],
    recommendedTones: ["Technical", "Informative", "Professional"],
    recommendedStyles: ["Technical", "Instructional", "Analytical"],
  },
  {
    id: "educational",
    name: "Educational Content",
    description: "Content designed for learning and instruction",
    icon: <Lightbulb className="h-5 w-5" />,
    formats: ["Course Material", "Learning Guide", "Educational Article", "Explainer", "How-To Guide"],
    recommendedTones: ["Informative", "Conversational", "Engaging"],
    recommendedStyles: ["Instructional", "Conversational", "Descriptive"],
  },
]

const TONES = [
  { id: "professional", name: "Professional", description: "Formal business communication" },
  { id: "academic", name: "Academic", description: "Scholarly with research focus" },
  { id: "technical", name: "Technical", description: "Precise for technical audiences" },
  { id: "conversational", name: "Conversational", description: "Friendly and approachable" },
  { id: "creative", name: "Creative", description: "Imaginative and artistic" },
  { id: "persuasive", name: "Persuasive", description: "Compelling and action-oriented" },
  { id: "informative", name: "Informative", description: "Clear and educational" },
  { id: "engaging", name: "Engaging", description: "Captivating for audience retention" },
  { id: "authoritative", name: "Authoritative", description: "Expert and credible" },
  { id: "humorous", name: "Humorous", description: "Light-hearted and entertaining" },
]

const WRITING_STYLES = [
  { id: "analytical", name: "Analytical", description: "Data-driven with logical structure" },
  { id: "narrative", name: "Narrative", description: "Story-driven format" },
  { id: "instructional", name: "Instructional", description: "Step-by-step guidance" },
  { id: "persuasive", name: "Persuasive", description: "Argument-based structure" },
  { id: "descriptive", name: "Descriptive", description: "Detailed vivid descriptions" },
  { id: "conversational", name: "Conversational", description: "Natural dialogue-like flow" },
  { id: "formal", name: "Formal", description: "Traditional academic/business writing" },
  { id: "creative", name: "Creative", description: "Artistic and innovative" },
  { id: "technical", name: "Technical", description: "Specification-focused" },
  { id: "journalistic", name: "Journalistic", description: "News-style structure" },
]

export default function AIContentPage() {
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeStep, setActiveStep] = useState(1)
  const [selectedContentType, setSelectedContentType] = useState<string>("research")
  const [selectedFormat, setSelectedFormat] = useState<string>("")
  const [selectedTone, setSelectedTone] = useState<string>("informative")
  const [selectedStyle, setSelectedStyle] = useState<string>("analytical")
  const [customPrompt, setCustomPrompt] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    // Check if there's stored analysis data
    const storedData = localStorage.getItem("webInsightAnalysisData")
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setAnalysisData(parsedData)
        setUrl(parsedData.url || "")
        setActiveStep(2)
      } catch (e) {
        console.error("Failed to parse stored analysis data")
      }
    }
  }, [])

  useEffect(() => {
    // Update format when content type changes
    if (selectedContentType) {
      const contentType = CONTENT_TYPES.find((type) => type.id === selectedContentType)
      if (contentType && contentType.formats.length > 0) {
        setSelectedFormat(contentType.formats[0])
      }
    }
  }, [selectedContentType])

  const handleAnalyze = async (inputUrl: string) => {
    if (!inputUrl) return

    setUrl(inputUrl)
    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: inputUrl }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to analyze website")
      }

      const data = await response.json()
      setAnalysisData(data)
      localStorage.setItem("webInsightAnalysisData", JSON.stringify(data))
      setActiveStep(2)
    } catch (err: any) {
      console.error("Analysis error:", err)
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleGenerateContent = async () => {
    if (!analysisData) return

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          websiteData: analysisData,
          contentType: selectedContentType,
          format: selectedFormat,
          tone: selectedTone,
          writingStyle: selectedStyle,
          customPrompt: customPrompt,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to generate content")
      }

      const data = await response.json()
      setGeneratedContent(data.content)
      setActiveStep(3)
    } catch (err: any) {
      console.error("Generation error:", err)
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  const getContentTypeById = (id: string) => {
    return CONTENT_TYPES.find((type) => type.id === id)
  }

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div
            className={`rounded-full w-10 h-10 flex items-center justify-center ${activeStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
          >
            1
          </div>
          <div className={`h-1 w-16 ${activeStep >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
          <div
            className={`rounded-full w-10 h-10 flex items-center justify-center ${activeStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
          >
            2
          </div>
          <div className={`h-1 w-16 ${activeStep >= 3 ? "bg-blue-600" : "bg-gray-200"}`}></div>
          <div
            className={`rounded-full w-10 h-10 flex items-center justify-center ${activeStep >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
          >
            3
          </div>
        </div>
      </div>
    )
  }

  const renderStep1 = () => {
    return (
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Analyze Website</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
          Enter a website URL to analyze and generate content based on the results
        </p>
        <MagicalWebsiteInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} error={error} />
      </div>
    )
  }

  const renderStep2 = () => {
    if (!analysisData) return null

    const contentType = getContentTypeById(selectedContentType)

    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Configure Content Generation</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
          Customize how you want your content to be generated based on the analysis of{" "}
          <span className="font-semibold">{analysisData.title || url}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Website Analysis</CardTitle>
                <CardDescription>Key metrics from your website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Website</Label>
                  <p className="text-sm font-semibold truncate">{analysisData.title || url}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Performance Score</Label>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${analysisData.performanceScore || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{analysisData.performanceScore || 0}%</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">SEO Score</Label>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${analysisData.seoScore || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{analysisData.seoScore || 0}%</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Sustainability Score</Label>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div
                        className="bg-emerald-600 h-2.5 rounded-full"
                        style={{ width: `${analysisData.sustainabilityScore || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{analysisData.sustainabilityScore || 0}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Content Configuration</CardTitle>
                <CardDescription>Select the type of content you want to generate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="contentType">Content Type</Label>
                  <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTENT_TYPES.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          <div className="flex items-center">
                            {type.icon}
                            <span className="ml-2">{type.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {contentType && <p className="text-sm text-gray-500">{contentType.description}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="format">Format</Label>
                  <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentType?.formats.map((format) => (
                        <SelectItem key={format} value={format}>
                          {format}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Tone</Label>
                    {contentType?.recommendedTones.includes(selectedTone) && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Recommended
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {TONES.map((tone) => (
                      <div key={tone.id} className="flex flex-col items-center">
                        <Button
                          type="button"
                          variant={selectedTone === tone.id ? "default" : "outline"}
                          className={`w-full h-full flex flex-col items-center justify-center p-3 ${
                            selectedTone === tone.id ? "border-2 border-blue-600" : ""
                          } ${contentType?.recommendedTones.includes(tone.name) ? "ring-2 ring-blue-200" : ""}`}
                          onClick={() => setSelectedTone(tone.id)}
                        >
                          <span className="text-sm font-medium">{tone.name}</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Writing Style</Label>
                    {contentType?.recommendedStyles.includes(selectedStyle) && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Recommended
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {WRITING_STYLES.map((style) => (
                      <div key={style.id} className="flex flex-col items-center">
                        <Button
                          type="button"
                          variant={selectedStyle === style.id ? "default" : "outline"}
                          className={`w-full h-full flex flex-col items-center justify-center p-3 ${
                            selectedStyle === style.id ? "border-2 border-blue-600" : ""
                          } ${contentType?.recommendedStyles.includes(style.name) ? "ring-2 ring-blue-200" : ""}`}
                          onClick={() => setSelectedStyle(style.id)}
                        >
                          <span className="text-sm font-medium">{style.name}</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customPrompt">Custom Instructions (Optional)</Label>
                  <Textarea
                    id="customPrompt"
                    placeholder="Add any specific instructions or requirements for your content..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={handleGenerateContent}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Content
                      <Sparkles className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    )
  }

  const renderStep3 = () => {
    if (!generatedContent) return null

    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Generated Content</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setActiveStep(2)}>
              Edit Configuration
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(generatedContent)
              }}
              variant="outline"
            >
              Copy Content
            </Button>
            <Button>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{selectedFormat}</CardTitle>
                <CardDescription>Generated for {analysisData?.title || url}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {TONES.find((t) => t.id === selectedTone)?.name}
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {WRITING_STYLES.find((s) => s.id === selectedStyle)?.name}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              {generatedContent.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</div>
            <Button onClick={handleGenerateContent} variant="outline" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Regenerate
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Logo size="md" />
          <Button variant="ghost" onClick={() => router.push("/")} className="flex items-center gap-2">
            Back to Dashboard
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">AI Content Generator</h1>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Generate optimized content based on website analysis
          </p>
        </div>

        {renderStepIndicator()}

        {activeStep === 1 && renderStep1()}
        {activeStep === 2 && renderStep2()}
        {activeStep === 3 && renderStep3()}
      </div>
    </main>
  )
}
