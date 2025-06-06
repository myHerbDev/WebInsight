"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Brain,
  Copy,
  Download,
  Sparkles,
  FileText,
  Loader2,
  Check,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Search,
  Globe,
  BarChart,
  Lightbulb,
  ListChecks,
  Layers,
  Pencil,
} from "lucide-react"
import type { WebsiteData } from "@/types/website-data"

interface SEOContentGeneratorProps {
  websiteData?: WebsiteData | null
}

interface ContentTypeOption {
  value: string
  label: string
  description: string
  icon: React.ElementType
  sections: string[]
}

const contentTypeOptions: ContentTypeOption[] = [
  {
    value: "blog-post",
    label: "Blog Post",
    description: "Informative article optimized for search engines and reader engagement",
    icon: Pencil,
    sections: [
      "Introduction",
      "Problem Statement",
      "Main Points",
      "Analysis",
      "Solutions",
      "Case Studies",
      "Expert Insights",
      "Statistics",
      "Practical Tips",
      "Conclusion",
      "Call to Action",
    ],
  },
  {
    value: "about-us",
    label: "About Us Page",
    description: "Company information, mission, values, and team details",
    icon: Globe,
    sections: [
      "Company Overview",
      "Our Story",
      "Mission & Vision",
      "Core Values",
      "Team Introduction",
      "Achievements",
      "Testimonials",
      "Company Culture",
      "Social Responsibility",
      "Contact Information",
    ],
  },
  {
    value: "faq-section",
    label: "FAQ Section",
    description: "Comprehensive answers to common customer questions",
    icon: ListChecks,
    sections: [
      "General Questions",
      "Product/Service Specific",
      "Pricing & Payment",
      "Shipping & Delivery",
      "Returns & Refunds",
      "Technical Support",
      "Account Management",
      "Privacy & Security",
      "Troubleshooting",
      "Contact Information",
    ],
  },
  {
    value: "product-description",
    label: "Product Description",
    description: "Detailed, benefit-focused product information",
    icon: Layers,
    sections: [
      "Product Overview",
      "Key Features",
      "Benefits",
      "Technical Specifications",
      "Use Cases",
      "Materials & Quality",
      "Comparison with Alternatives",
      "Customer Reviews",
      "Pricing & Options",
      "Warranty Information",
      "Call to Action",
    ],
  },
  {
    value: "service-page",
    label: "Service Page",
    description: "Comprehensive service details and benefits",
    icon: Lightbulb,
    sections: [
      "Service Overview",
      "Key Benefits",
      "How It Works",
      "Service Packages",
      "Process Explanation",
      "Case Studies",
      "Testimonials",
      "Team Expertise",
      "Pricing Information",
      "FAQs",
      "Contact Information",
    ],
  },
  {
    value: "landing-page",
    label: "Landing Page",
    description: "Conversion-focused page with clear value proposition",
    icon: BarChart,
    sections: [
      "Hero Section",
      "Value Proposition",
      "Key Benefits",
      "Feature Highlights",
      "Social Proof",
      "Testimonials",
      "Pricing Options",
      "FAQ Section",
      "Trust Indicators",
      "Limited-Time Offers",
      "Multiple CTAs",
    ],
  },
]

export function SEOContentGenerator({ websiteData }: SEOContentGeneratorProps) {
  const [selectedContentType, setSelectedContentType] = useState<string>("blog-post")
  const [targetKeywords, setTargetKeywords] = useState<string>("")
  const [contentLength, setContentLength] = useState<string>("medium")
  const [customInstructions, setCustomInstructions] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [generatedContent, setGeneratedContent] = useState<string>("")
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const [contentTitle, setContentTitle] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("configure")

  // Extract website name and keywords from website data
  useEffect(() => {
    if (websiteData) {
      // Extract potential keywords from website data
      const potentialKeywords: string[] = []

      // Add title words as potential keywords
      if (websiteData.title) {
        const titleWords = websiteData.title
          .split(/\s+/)
          .filter((word) => word.length > 3)
          .slice(0, 3)
        potentialKeywords.push(...titleWords)
      }

      // Add meta keywords if available
      if (websiteData.meta_keywords) {
        const metaKeywords = websiteData.meta_keywords.split(/,\s*/).slice(0, 3)
        potentialKeywords.push(...metaKeywords)
      }

      // Add common industry terms based on website category
      if (websiteData.category) {
        const categoryKeywords: { [key: string]: string[] } = {
          ecommerce: ["shop", "buy", "products", "online store"],
          technology: ["software", "technology", "digital", "innovation"],
          finance: ["financial", "investment", "banking", "money"],
          health: ["healthcare", "wellness", "medical", "health"],
          education: ["learning", "courses", "education", "training"],
          travel: ["travel", "vacation", "destinations", "booking"],
        }

        const category = websiteData.category.toLowerCase()
        if (categoryKeywords[category]) {
          potentialKeywords.push(...categoryKeywords[category].slice(0, 2))
        }
      }

      // Set unique keywords
      const uniqueKeywords = [...new Set(potentialKeywords)].slice(0, 5)
      setTargetKeywords(uniqueKeywords.join(", "))

      // Generate a title based on content type and website
      generateContentTitle(selectedContentType, websiteData.title || websiteData.url)
    }
  }, [websiteData, selectedContentType])

  // Generate title when content type changes
  useEffect(() => {
    if (websiteData) {
      generateContentTitle(selectedContentType, websiteData.title || websiteData.url)
    }
  }, [selectedContentType, websiteData])

  const generateContentTitle = (contentType: string, websiteName: string) => {
    const contentTypeObj = contentTypeOptions.find((type) => type.value === contentType)
    if (!contentTypeObj) return

    const titleTemplates: { [key: string]: string[] } = {
      "blog-post": [
        "The Ultimate Guide to [Topic] for [Website]",
        "How [Website] Transforms [Industry]: A Complete Analysis",
        "[Number] Ways [Website] Excels in [Topic]",
        "Why [Website] is Leading the Way in [Industry]",
        "The Complete [Website] Strategy for [Topic] Success",
      ],
      "about-us": [
        "About [Website]: Our Story, Mission, and Values",
        "The [Website] Journey: Who We Are and What We Do",
        "Meet [Website]: Transforming [Industry] Since [Year]",
        "Our Mission at [Website]: Revolutionizing [Industry]",
        "The [Website] Difference: Our Approach to [Industry]",
      ],
      "faq-section": [
        "Frequently Asked Questions About [Website]",
        "Everything You Need to Know About [Website]: FAQs",
        "[Website] FAQs: Your Complete Guide",
        "Common Questions About [Website]'s [Products/Services]",
        "[Website] Knowledge Base: Comprehensive FAQs",
      ],
      "product-description": [
        "Introducing [Product]: The Ultimate Solution from [Website]",
        "[Website]'s [Product]: Features, Benefits, and Specifications",
        "Why Choose [Website]'s [Product]: A Comprehensive Review",
        "The Complete Guide to [Website]'s [Product]",
        "[Website]'s [Product]: Transforming [Industry] Experience",
      ],
      "service-page": [
        "[Website]'s Professional [Service] Services",
        "How [Website]'s [Service] Can Transform Your Business",
        "Comprehensive [Service] Solutions by [Website]",
        "[Website]: Your Partner for Premium [Service] Services",
        "Discover [Website]'s Industry-Leading [Service] Solutions",
      ],
      "landing-page": [
        "Transform Your [Industry] with [Website]'s Solutions",
        "[Website]: The Ultimate [Product/Service] for [Target Audience]",
        "Revolutionize Your [Process] with [Website]",
        "Discover How [Website] Can Boost Your [Metric]",
        "[Action Verb] Your [Goal] with [Website]'s [Solution]",
      ],
    }

    const templates = titleTemplates[contentType] || titleTemplates["blog-post"]
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)]

    // Extract industry and year
    const industry = websiteData?.category || "Industry"
    const foundingYear = websiteData?.founding_year || "2010"
    const topic = targetKeywords.split(",")[0] || industry

    // Replace placeholders
    const title = randomTemplate
      .replace(/\[Website\]/g, websiteName)
      .replace(/\[Industry\]/g, industry)
      .replace(/\[Topic\]/g, topic)
      .replace(/\[Year\]/g, foundingYear)
      .replace(/\[Number\]/g, (Math.floor(Math.random() * 7) + 5).toString())
      .replace(/\[Products\/Services\]/g, "Products and Services")
      .replace(/\[Product\/Service\]/g, "Solution")
      .replace(/\[Product\]/g, "Product")
      .replace(/\[Service\]/g, "Service")
      .replace(/\[Target Audience\]/g, "Businesses")
      .replace(/\[Process\]/g, "Workflow")
      .replace(/\[Metric\]/g, "Performance")
      .replace(/\[Goal\]/g, "Results")
      .replace(/\[Solution\]/g, "Platform")
      .replace(/\[Action Verb\]/g, "Maximize")

    setContentTitle(title)
  }

  const generateContent = async () => {
    if (!websiteData) {
      toast({
        title: "Website Data Required",
        description: "Please analyze a website first to generate SEO content.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setGenerationError(null)
    setGeneratedContent("")
    setActiveTab("result")

    try {
      // Get the selected content type configuration
      const contentTypeConfig = contentTypeOptions.find((type) => type.value === selectedContentType)
      if (!contentTypeConfig) throw new Error("Invalid content type selected")

      // Prepare the prompt for content generation
      const websiteName = websiteData.title || websiteData.url
      const websiteUrl = websiteData.url
      const websiteDescription =
        websiteData.description || "Website in the " + (websiteData.category || "online") + " industry"

      // Determine content length in words
      const contentLengthMap: { [key: string]: number } = {
        short: 800,
        medium: 1500,
        long: 2500,
        comprehensive: 4000,
      }
      const targetWordCount = contentLengthMap[contentLength] || 1500

      // Build sections based on content type
      const sections = contentTypeConfig.sections.join(", ")

      // Prepare SEO keywords
      const keywords = targetKeywords.trim() || websiteName

      // Build the prompt
      const prompt = `
Create a comprehensive and detailed ${contentTypeConfig.label} for the website "${websiteName}" (${websiteUrl}).

WEBSITE INFORMATION:
- Website Name: ${websiteName}
- URL: ${websiteUrl}
- Description: ${websiteDescription}
- Industry/Category: ${websiteData.category || "Not specified"}
- Target Keywords: ${keywords}

CONTENT REQUIREMENTS:
- Title: "${contentTitle}"
- Content Type: ${contentTypeConfig.label}
- Target Length: ${targetWordCount} words
- Sections to Include: ${sections}
- SEO Optimization: High priority
${customInstructions ? `- Custom Instructions: ${customInstructions}` : ""}

CONTENT GUIDELINES:
1. Create highly detailed, comprehensive content optimized for search engines
2. Use the website's SEO name "${websiteName}" consistently throughout
3. Incorporate target keywords naturally: ${keywords}
4. Structure with clear H2 and H3 headings for each major section
5. Include relevant statistics, examples, and specific details
6. Write in a professional, authoritative tone
7. Add meta description and SEO title suggestions at the end
8. Format with proper paragraph breaks, bullet points, and numbered lists where appropriate
9. Include a strong call-to-action
10. Ensure content is original, valuable, and engaging for readers

The content should be significantly longer and more detailed than typical web content, with comprehensive coverage of each section.
`

      console.log("Generating SEO content with prompt length:", prompt.length)

      // Call the API to generate content
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customPrompt: prompt,
          contentType: "seo-optimized-content",
          tone: "professional",
          websiteData,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate content")
      }

      const data = await response.json()

      if (!data.success || !data.content) {
        throw new Error("Invalid response format from API")
      }

      // Set the generated content
      setGeneratedContent(data.content.content || "")

      toast({
        title: "Content Generated Successfully",
        description: `Your ${contentTypeConfig.label} has been created with ${data.content.wordCount || "many"} words.`,
      })
    } catch (error: any) {
      console.error("Content generation error:", error)
      setGenerationError(error.message || "Failed to generate content")

      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent)
      setIsCopied(true)

      setTimeout(() => {
        setIsCopied(false)
      }, 2000)

      toast({
        title: "Copied to Clipboard",
        description: "Content has been copied to your clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy content to clipboard.",
        variant: "destructive",
      })
    }
  }

  const downloadContent = () => {
    const blob = new Blob([generatedContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${contentTitle.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Content Downloaded",
      description: "Your content has been downloaded as a text file.",
    })
  }

  const retryGeneration = () => {
    setGenerationError(null)
    generateContent()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            SEO Content Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="configure">
                <Sparkles className="w-4 h-4 mr-2" />
                Configure
              </TabsTrigger>
              <TabsTrigger value="result">
                <FileText className="w-4 h-4 mr-2" />
                Generated Content
              </TabsTrigger>
            </TabsList>

            {/* Configure Tab */}
            <TabsContent value="configure" className="space-y-6">
              {/* Website Information */}
              {websiteData && (
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <h3 className="font-medium text-blue-800">Website Information</h3>
                  </div>
                  <p className="text-sm text-blue-700 mb-2">
                    Generating content for:{" "}
                    <span className="font-semibold">{websiteData.title || websiteData.url}</span>
                  </p>
                  {websiteData.description && <p className="text-xs text-blue-600 italic">{websiteData.description}</p>}
                </div>
              )}

              {/* Content Type Selection */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content-type">Content Type</Label>
                  <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                    <SelectTrigger id="content-type">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypeOptions.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    {contentTypeOptions.find((type) => type.value === selectedContentType)?.description}
                  </p>
                </div>

                {/* Content Title */}
                <div className="space-y-2">
                  <Label htmlFor="content-title">Content Title</Label>
                  <Input
                    id="content-title"
                    value={contentTitle}
                    onChange={(e) => setContentTitle(e.target.value)}
                    placeholder="Enter a title for your content"
                  />
                  <p className="text-sm text-gray-500">A compelling title helps with SEO and user engagement</p>
                </div>

                {/* Target Keywords */}
                <div className="space-y-2">
                  <Label htmlFor="target-keywords">Target Keywords</Label>
                  <Input
                    id="target-keywords"
                    value={targetKeywords}
                    onChange={(e) => setTargetKeywords(e.target.value)}
                    placeholder="Enter target keywords separated by commas"
                  />
                  <p className="text-sm text-gray-500">
                    Keywords will be naturally incorporated throughout the content
                  </p>
                </div>

                {/* Content Length */}
                <div className="space-y-2">
                  <Label htmlFor="content-length">Content Length</Label>
                  <Select value={contentLength} onValueChange={setContentLength}>
                    <SelectTrigger id="content-length">
                      <SelectValue placeholder="Select content length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (~800 words)</SelectItem>
                      <SelectItem value="medium">Medium (~1500 words)</SelectItem>
                      <SelectItem value="long">Long (~2500 words)</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive (~4000 words)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    Longer, more detailed content typically performs better for SEO
                  </p>
                </div>

                {/* Custom Instructions */}
                <div className="space-y-2">
                  <Label htmlFor="custom-instructions">Custom Instructions (Optional)</Label>
                  <Textarea
                    id="custom-instructions"
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    placeholder="Add any specific requirements or instructions for content generation"
                    className="min-h-[100px]"
                  />
                </div>

                {/* Generate Button */}
                <div className="pt-4">
                  <Button
                    onClick={generateContent}
                    disabled={isGenerating || !websiteData}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating SEO Content...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate SEO-Optimized Content
                      </>
                    )}
                  </Button>
                  {!websiteData && (
                    <p className="text-sm text-amber-600 mt-2 text-center">
                      Please analyze a website first to generate content
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Result Tab */}
            <TabsContent value="result" className="space-y-6">
              {/* Loading State */}
              {isGenerating && (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating SEO Content</h3>
                  <p className="text-gray-600">
                    Creating{" "}
                    {contentTypeOptions.find((type) => type.value === selectedContentType)?.label.toLowerCase()} for{" "}
                    {websiteData?.title || websiteData?.url || "your website"}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">This may take a minute for comprehensive content</p>
                </div>
              )}

              {/* Error State */}
              {generationError && !isGenerating && (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Generation Failed</h3>
                  <p className="text-gray-600 mb-4">{generationError}</p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={retryGeneration} variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                    <Button onClick={() => setActiveTab("configure")} variant="default">
                      Back to Configure
                    </Button>
                  </div>
                </div>
              )}

              {/* Generated Content */}
              {generatedContent && !isGenerating && !generationError && (
                <div className="space-y-4">
                  {/* Content Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{contentTitle}</h2>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Badge variant="outline" className="mr-2">
                          {contentTypeOptions.find((type) => type.value === selectedContentType)?.label}
                        </Badge>
                        {websiteData && (
                          <span className="flex items-center">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            {websiteData.title || websiteData.url}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        {isCopied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        {isCopied ? "Copied" : "Copy"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadContent}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Content Display */}
                  <div className="relative">
                    <Textarea
                      value={generatedContent}
                      readOnly
                      className="min-h-[500px] p-4 font-serif text-gray-800 leading-relaxed whitespace-pre-wrap"
                    />
                  </div>

                  {/* Word Count */}
                  <div className="text-sm text-gray-500 text-right">
                    Approximately {generatedContent.split(/\s+/).length.toLocaleString()} words
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setActiveTab("configure")}>
                      Back to Configure
                    </Button>
                    <Button onClick={generateContent}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Regenerate Content
                    </Button>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!generatedContent && !isGenerating && !generationError && (
                <div className="text-center py-12">
                  <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Content Generated Yet</h3>
                  <p className="text-gray-600 mb-4">Configure your settings and generate SEO-optimized content</p>
                  <Button onClick={() => setActiveTab("configure")} variant="outline">
                    Configure Content
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
