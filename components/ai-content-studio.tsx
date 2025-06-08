"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { LoadingAnimation } from "./loading-animation"

// Define types for content generation
interface ContentGenerationProps {
  websiteUrl?: string
  websiteTitle?: string
}

export function AIContentStudio({ websiteUrl = "", websiteTitle = "" }: ContentGenerationProps) {
  const [prompt, setPrompt] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [contentType, setContentType] = useState("blog-post")
  const [contentHistory, setContentHistory] = useState<string[]>([])
  const [structureTemplate, setStructureTemplate] = useState("")
  const [activeTab, setActiveTab] = useState("generate")
  const [websiteData, setWebsiteData] = useState({
    url: websiteUrl || "",
    title: websiteTitle || "Your Website",
  })

  // Update website data when props change
  useEffect(() => {
    if (websiteUrl || websiteTitle) {
      setWebsiteData({
        url: websiteUrl || websiteData.url,
        title: websiteTitle || websiteData.title,
      })

      // Set default prompt based on website data
      if (!prompt && (websiteUrl || websiteTitle)) {
        const siteName = websiteTitle || websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
        setPrompt(`Write a comprehensive article about ${siteName} focusing on its key features and benefits.`)
      }
    }
  }, [websiteUrl, websiteTitle])

  const contentTypeOptions = {
    "blog-post": "Blog Post",
    "product-description": "Product Description",
    "landing-page": "Landing Page Copy",
    "social-media": "Social Media Post",
    "email-newsletter": "Email Newsletter",
    "press-release": "Press Release",
    "seo-content": "SEO Content",
    "technical-documentation": "Technical Documentation",
  }

  const structureTemplates = {
    "blog-post": `# [TITLE]\n\n## Introduction\n\n## Main Point 1\n\n## Main Point 2\n\n## Main Point 3\n\n## Conclusion`,
    "product-description": `# [PRODUCT NAME]\n\n## Overview\n\n## Key Features\n\n## Benefits\n\n## Technical Specifications\n\n## Pricing\n\n## Call to Action`,
    "landing-page": `# [HEADLINE]\n\n## Hero Section\n\n## Features\n\n## Benefits\n\n## Testimonials\n\n## Pricing\n\n## FAQ\n\n## Call to Action`,
    "social-media": `# [HEADLINE]\n\n## Hook\n\n## Main Message\n\n## Call to Action\n\n## Hashtags`,
    "email-newsletter": `# [SUBJECT LINE]\n\n## Greeting\n\n## Main Content\n\n## Promotional Section\n\n## Call to Action\n\n## Footer`,
    "press-release": `# [HEADLINE]\n\n## Dateline\n\n## Introduction\n\n## Body\n\n## Company Information\n\n## Contact Information`,
    "seo-content": `# [SEO TITLE]\n\n## Introduction with Keywords\n\n## Main Section 1\n\n## Main Section 2\n\n## Main Section 3\n\n## FAQ Section\n\n## Conclusion with Call to Action`,
    "technical-documentation": `# [DOCUMENT TITLE]\n\n## Overview\n\n## Prerequisites\n\n## Installation\n\n## Configuration\n\n## Usage Examples\n\n## API Reference\n\n## Troubleshooting\n\n## Conclusion`,
  }

  const handleContentTypeChange = (value: string) => {
    setContentType(value)
    setStructureTemplate(structureTemplates[value as keyof typeof structureTemplates] || "")
  }

  const generateContent = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt")
      return
    }

    setIsGenerating(true)

    try {
      // Prepare the request with website data
      const requestData = {
        prompt,
        contentType,
        structureTemplate:
          structureTemplate || structureTemplates[contentType as keyof typeof structureTemplates] || "",
        websiteUrl: websiteData.url,
        websiteTitle: websiteData.title,
      }

      // Log the request for debugging
      console.log("Generating content with:", requestData)

      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()

      if (data.content) {
        setGeneratedContent(data.content)
        setContentHistory((prev) => [data.content, ...prev].slice(0, 10))
        toast.success("Content generated successfully!")
        setActiveTab("preview")
      } else {
        // Use fallback content if API fails
        const fallbackContent = generateFallbackContent(requestData)
        setGeneratedContent(fallbackContent)
        setContentHistory((prev) => [fallbackContent, ...prev].slice(0, 10))
        toast.success("Content generated with local templates!")
        setActiveTab("preview")
      }
    } catch (error) {
      console.error("Error generating content:", error)

      // Generate fallback content
      const fallbackContent = generateFallbackContent({
        prompt,
        contentType,
        structureTemplate:
          structureTemplate || structureTemplates[contentType as keyof typeof structureTemplates] || "",
        websiteUrl: websiteData.url,
        websiteTitle: websiteData.title,
      })

      setGeneratedContent(fallbackContent)
      setContentHistory((prev) => [fallbackContent, ...prev].slice(0, 10))
      toast.success("Content generated with local templates!")
      setActiveTab("preview")
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate fallback content when API fails
  const generateFallbackContent = (requestData: any) => {
    const { prompt, contentType, structureTemplate, websiteUrl, websiteTitle } = requestData

    // Extract domain name for better fallback content
    const domainName = websiteUrl
      ? new URL(websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`).hostname.replace("www.", "")
      : "example.com"
    const siteName = websiteTitle || domainName

    // Generate a title based on the prompt and website
    const title = prompt.includes("?")
      ? prompt.split("?")[0] + "?"
      : `${contentTypeOptions[contentType as keyof typeof contentTypeOptions]} About ${siteName}`

    // Generate paragraphs based on content type
    let content = ""

    switch (contentType) {
      case "blog-post":
        content = `# ${title.replace(/^write a |create a |generate a /i, "")}\n\n`
        content += `## Introduction\n\n${siteName} offers a comprehensive solution for businesses looking to enhance their online presence. In this article, we'll explore the key features and benefits that make ${siteName} stand out in the market.\n\n`
        content += `## Key Features\n\n${siteName} provides a robust set of features designed to streamline your workflow and improve productivity. From intuitive user interfaces to powerful backend capabilities, every aspect has been carefully crafted to deliver an exceptional experience.\n\n`
        content += `## Benefits for Businesses\n\nImplementing ${siteName} can lead to significant improvements in efficiency and cost savings. Many organizations have reported increased customer satisfaction and higher conversion rates after adopting this solution.\n\n`
        content += `## Real-World Applications\n\nAcross various industries, ${siteName} has proven its value through practical applications. Case studies demonstrate how businesses have leveraged its capabilities to overcome challenges and achieve their goals.\n\n`
        content += `## Future Developments\n\nThe team behind ${siteName} continues to innovate, with exciting new features on the roadmap. Upcoming releases promise to further enhance the platform's capabilities and address evolving market needs.\n\n`
        content += `## Conclusion\n\n${siteName} represents a significant advancement in the field, offering a powerful yet accessible solution for businesses of all sizes. By adopting this platform, organizations can position themselves for success in an increasingly competitive landscape.`
        break

      case "product-description":
        content = `# ${siteName} - Professional Solution for Modern Businesses\n\n`
        content += `## Overview\n\n${siteName} is a cutting-edge solution designed to address the complex challenges faced by today's businesses. With its intuitive interface and powerful features, it streamlines operations and enhances productivity across your organization.\n\n`
        content += `## Key Features\n\n- Intuitive dashboard with real-time analytics\n- Seamless integration with existing systems\n- Advanced security protocols to protect sensitive data\n- Customizable workflows to match your business processes\n- Comprehensive reporting capabilities\n- Mobile accessibility for on-the-go management\n\n`
        content += `## Benefits\n\n- Reduce operational costs by up to 30%\n- Improve team productivity and collaboration\n- Enhance customer satisfaction through faster response times\n- Gain valuable insights from comprehensive analytics\n- Scale effortlessly as your business grows\n\n`
        content += `## Technical Specifications\n\n- Cloud-based architecture with 99.9% uptime guarantee\n- Enterprise-grade security with end-to-end encryption\n- API access for custom integrations\n- Regular updates and feature enhancements\n- Dedicated support team available 24/7\n\n`
        content += `## Pricing\n\nFlexible pricing options are available to suit businesses of all sizes, from startups to enterprise organizations. Contact our sales team for a customized quote tailored to your specific needs.\n\n`
        content += `## Call to Action\n\nDiscover how ${siteName} can transform your business operations. Schedule a demo today and see the difference for yourself.`
        break

      case "landing-page":
        content = `# Transform Your Business with ${siteName}\n\n`
        content += `## Hero Section\n\nRevolutionize your approach with ${siteName} - the all-in-one solution for modern businesses seeking growth and efficiency.\n\n`
        content += `## Features\n\n### Seamless Integration\nConnect with your existing tools and systems without disruption.\n\n### Powerful Analytics\nGain actionable insights with our comprehensive reporting dashboard.\n\n### Enterprise Security\nProtect your valuable data with industry-leading security protocols.\n\n### Scalable Architecture\nGrow confidently knowing our platform evolves with your business needs.\n\n`
        content += `## Benefits\n\n- Increase operational efficiency by up to 40%\n- Reduce costs and maximize ROI\n- Improve team collaboration and productivity\n- Enhance customer satisfaction and loyalty\n- Make data-driven decisions with confidence\n\n`
        content += `## Testimonials\n\n"${siteName} has completely transformed how we operate. We've seen remarkable improvements in efficiency and customer satisfaction." - Jane Smith, CEO\n\n"The implementation was smooth, and the results were immediate. Our team adapted quickly and now can't imagine working without it." - John Davis, Operations Director\n\n`
        content += `## Pricing\n\n### Starter: $49/month\nPerfect for small businesses just getting started\n\n### Professional: $99/month\nIdeal for growing companies with expanding needs\n\n### Enterprise: Custom pricing\nTailored solutions for large organizations with complex requirements\n\n`
        content += `## FAQ\n\n**Q: How long does implementation take?**\nA: Most customers are up and running within 48 hours.\n\n**Q: Is training provided?**\nA: Yes, comprehensive training is included with all plans.\n\n**Q: Can I integrate with my existing tools?**\nA: We offer seamless integration with most popular business applications.\n\n`
        content += `## Call to Action\n\nReady to transform your business? Start your free 14-day trial today - no credit card required.`
        break

      default:
        // Generic content for other types
        content = structureTemplate.replace("[TITLE]", title.replace(/^write a |create a |generate a /i, ""))
        content += `\n\nThis comprehensive content about ${siteName} covers all the essential aspects you need to know. The platform offers innovative solutions designed to address modern challenges while providing exceptional value to users.`
        content += `\n\n${siteName} stands out in the market due to its intuitive design, powerful features, and commitment to customer success. Whether you're a small business or a large enterprise, you'll find the tools and support needed to achieve your goals.`
        content += `\n\nFor more information, visit ${websiteUrl || domainName} and discover how this solution can transform your approach.`
    }

    return content
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">AI Content Studio</CardTitle>
        <CardDescription>
          Generate high-quality content for your website using AI
          {websiteData.url && ` - Currently analyzing: ${websiteData.url}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="content-type">Content Type</Label>
                  <Select value={contentType} onValueChange={handleContentTypeChange}>
                    <SelectTrigger id="content-type">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(contentTypeOptions).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="website-url">Website URL (Optional)</Label>
                  <Input
                    id="website-url"
                    value={websiteData.url}
                    onChange={(e) => setWebsiteData({ ...websiteData, url: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Write a blog post about the benefits of using our product..."
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="structure-template">Structure Template (Optional)</Label>
                <Textarea
                  id="structure-template"
                  value={structureTemplate}
                  onChange={(e) => setStructureTemplate(e.target.value)}
                  placeholder="# [TITLE]&#10;&#10;## Introduction&#10;&#10;## Main Points&#10;&#10;## Conclusion"
                  className="min-h-[150px] font-mono text-sm"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            {generatedContent ? (
              <div className="prose max-w-none dark:prose-invert">
                <div className="bg-muted p-4 rounded-md overflow-auto max-h-[600px]">
                  <pre className="whitespace-pre-wrap">{generatedContent}</pre>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground">Generate content to see preview</div>
            )}
          </TabsContent>

          <TabsContent value="history">
            {contentHistory.length > 0 ? (
              <div className="space-y-4">
                {contentHistory.map((content, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm">Generated Content #{contentHistory.length - index}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 max-h-[200px] overflow-auto">
                      <pre className="whitespace-pre-wrap text-xs">{content.substring(0, 300)}...</pre>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setGeneratedContent(content)
                          setActiveTab("preview")
                        }}
                      >
                        View
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground">No content history yet</div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <Separator />

      <CardFooter className="flex justify-between p-6">
        <div className="text-sm text-muted-foreground">{websiteData.url && `Analyzing: ${websiteData.url}`}</div>
        <Button onClick={generateContent} disabled={isGenerating || !prompt.trim()} className="ml-auto">
          {isGenerating ? (
            <>
              <LoadingAnimation size="sm" className="mr-2" />
              Generating...
            </>
          ) : (
            "Generate Content"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
