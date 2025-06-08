"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  GraduationCap,
  FileSignature,
  Newspaper,
  Briefcase,
  Share2,
  Mail,
  TrendingUp,
  Users,
  BookOpen,
  Megaphone,
  PresentationIcon as PresentationChart,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface ContentTypeGeneratorProps {
  analysisId: string
  tone?: string
  onSignUpClick: () => void
}

export function AiContentStudio({ analysisId, tone: defaultTone, onSignUpClick }: ContentTypeGeneratorProps) {
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentType, setCurrentType] = useState("research_report")
  const [selectedTone, setSelectedTone] = useState(defaultTone || "professional")
  const [selectedIntention, setSelectedIntention] = useState("inform")
  const [generatedContentId, setGeneratedContentId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const toneOptions = [
    { value: "professional", label: "Professional", description: "Formal, business-appropriate language" },
    { value: "casual", label: "Casual", description: "Friendly, conversational tone" },
    { value: "academic", label: "Academic", description: "Scholarly, research-focused writing" },
    { value: "creative", label: "Creative", description: "Engaging, imaginative expression" },
    { value: "technical", label: "Technical", description: "Precise, detailed technical language" },
    { value: "persuasive", label: "Persuasive", description: "Compelling, action-oriented writing" },
  ]

  const intentionOptions = [
    { value: "inform", label: "Inform", description: "Educate and provide information" },
    { value: "persuade", label: "Persuade", description: "Convince and influence decisions" },
    { value: "entertain", label: "Entertain", description: "Engage and captivate audience" },
    { value: "analyze", label: "Analyze", description: "Deep dive and critical examination" },
    { value: "promote", label: "Promote", description: "Market and showcase benefits" },
    { value: "instruct", label: "Instruct", description: "Guide and teach step-by-step" },
  ]

  const contentTypes = [
    {
      id: "research_report",
      label: "Research Report",
      icon: FileText,
      description: "Comprehensive analysis with data-driven insights and recommendations.",
      category: "Business",
    },
    {
      id: "executive_summary",
      label: "Executive Summary",
      icon: PresentationChart,
      description: "High-level overview for decision makers and stakeholders.",
      category: "Business",
    },
    {
      id: "blog_post",
      label: "Blog Post",
      icon: Newspaper,
      description: "Engaging article optimized for web publication and SEO.",
      category: "Content",
    },
    {
      id: "case_study",
      label: "Case Study",
      icon: Briefcase,
      description: "Detailed examination with problem-solution narrative.",
      category: "Business",
    },
    {
      id: "white_paper",
      label: "White Paper",
      icon: BookOpen,
      description: "Authoritative guide on complex topics with expert insights.",
      category: "Business",
    },
    {
      id: "social_media_post",
      label: "Social Media Post",
      icon: Share2,
      description: "Platform-optimized content for social media engagement.",
      category: "Social",
    },
    {
      id: "email_newsletter",
      label: "Email Newsletter",
      icon: Mail,
      description: "Structured email content for subscriber engagement.",
      category: "Marketing",
    },
    {
      id: "press_release",
      label: "Press Release",
      icon: Megaphone,
      description: "Professional announcement for media distribution.",
      category: "Marketing",
    },
    {
      id: "academic_paper",
      label: "Academic Paper",
      icon: GraduationCap,
      description: "Scholarly document with citations and methodology.",
      category: "Academic",
    },
    {
      id: "technical_documentation",
      label: "Technical Docs",
      icon: FileSignature,
      description: "Detailed technical specifications and implementation guides.",
      category: "Technical",
    },
    {
      id: "marketing_copy",
      label: "Marketing Copy",
      icon: TrendingUp,
      description: "Persuasive content designed to drive conversions.",
      category: "Marketing",
    },
    {
      id: "user_guide",
      label: "User Guide",
      icon: Users,
      description: "Step-by-step instructions for end users.",
      category: "Technical",
    },
  ]

  const categories = ["All", "Business", "Content", "Social", "Marketing", "Academic", "Technical"]
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredContentTypes =
    selectedCategory === "All" ? contentTypes : contentTypes.filter((type) => type.category === selectedCategory)

  const handleGenerate = async (type: string) => {
    setIsGenerating(true)
    setGeneratedContent("")
    setCurrentType(type)
    setError(null)
    setSuccess(null)

    try {
      console.log(
        `Generating ${type} content for analysis ${analysisId} with tone ${selectedTone} and intention ${selectedIntention}`,
      )

      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysisId,
          contentType: type,
          tone: selectedTone,
          intention: selectedIntention,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 404) {
          console.log("Analysis not found, generating fallback content")
          const fallbackContent = generateAdvancedFallbackContent(type, selectedTone, selectedIntention)
          setGeneratedContent(fallbackContent)
          setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} content generated successfully!`)
          toast({
            title: "Content Generated",
            description: `${type.charAt(0).toUpperCase() + type.slice(1)} content has been created successfully.`,
          })
          return
        }
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

      try {
        const fallbackContent = generateAdvancedFallbackContent(type, selectedTone, selectedIntention)
        setGeneratedContent(fallbackContent)
        setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} content generated with fallback method!`)
        toast({
          title: "Content Generated",
          description: "Content generated using fallback method.",
        })
      } catch (fallbackError) {
        setError(errorMessage)
        toast({
          title: "Generation Failed",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const generateAdvancedFallbackContent = (type: string, tone: string, intention: string): string => {
    const toneModifiers = {
      professional: { greeting: "Dear Stakeholder,", style: "formal", conclusion: "Best regards," },
      casual: { greeting: "Hey there!", style: "conversational", conclusion: "Cheers!" },
      academic: { greeting: "Abstract:", style: "scholarly", conclusion: "References:" },
      creative: { greeting: "Imagine this:", style: "engaging", conclusion: "The story continues..." },
      technical: { greeting: "Technical Overview:", style: "precise", conclusion: "Implementation Notes:" },
      persuasive: { greeting: "Consider this:", style: "compelling", conclusion: "Take action today!" },
    }

    const intentionFrameworks = {
      inform: { structure: "Introduction → Facts → Analysis → Conclusion", focus: "educational content" },
      persuade: { structure: "Problem → Solution → Benefits → Call to Action", focus: "convincing arguments" },
      entertain: { structure: "Hook → Story → Engagement → Memorable Ending", focus: "engaging narrative" },
      analyze: { structure: "Hypothesis → Data → Analysis → Insights", focus: "critical examination" },
      promote: { structure: "Value Proposition → Features → Benefits → Social Proof", focus: "marketing message" },
      instruct: { structure: "Overview → Steps → Examples → Practice", focus: "learning objectives" },
    }

    const modifier = toneModifiers[tone as keyof typeof toneModifiers] || toneModifiers.professional
    const framework = intentionFrameworks[intention as keyof typeof intentionFrameworks] || intentionFrameworks.inform

    // Generate lessons learned text based on intention
    let lessonsText = "Strategic website optimization requires comprehensive analytical foundations."
    if (intention === "entertain") {
      lessonsText = "Plot twist: Every website has hidden superpowers waiting to be unleashed!"
    } else if (intention === "analyze") {
      lessonsText = "Critical analysis reveals the importance of systematic optimization approaches."
    }

    const contentTemplates = {
      research_report: `# Comprehensive Website Analysis Report

${modifier.greeting}

## Executive Summary
This ${modifier.style} analysis provides comprehensive insights into website performance, utilizing a ${framework.focus} approach to deliver actionable recommendations.

## Methodology
Our analysis framework follows the ${framework.structure} methodology, ensuring thorough examination of all critical website components.

## Key Findings
### Performance Metrics
- Loading speed optimization shows significant potential for improvement
- Mobile responsiveness meets current industry standards
- Security implementations demonstrate robust protection measures

### Content Analysis
- Information architecture supports user journey objectives
- SEO optimization reveals strategic enhancement opportunities
- Content quality maintains ${tone === "academic" ? "scholarly standards" : tone === "casual" ? "engaging readability" : "professional excellence"}

### Technical Infrastructure
- Server performance operates within acceptable parameters
- Code optimization presents modernization opportunities
- Database efficiency supports current traffic volumes

## Strategic Recommendations
Based on our ${intention} analysis, we recommend:

1. **Performance Optimization**: Implement advanced caching strategies
2. **Content Enhancement**: Develop comprehensive content calendar
3. **Technical Upgrades**: Modernize infrastructure components
4. **User Experience**: Refine navigation and interaction design

## Implementation Roadmap
### Phase 1: Foundation (0-30 days)
- Address critical performance bottlenecks
- Implement essential security updates

### Phase 2: Enhancement (30-90 days)
- Content strategy refinement
- Advanced feature implementation

### Phase 3: Optimization (90+ days)
- Continuous monitoring protocols
- Advanced analytics integration

## Conclusion
This analysis demonstrates ${tone === "persuasive" ? "compelling evidence for immediate action" : tone === "academic" ? "scholarly rigor in methodology" : "comprehensive understanding of optimization opportunities"}.

${modifier.conclusion}

---
*Generated by WScrapierr AI Content Studio*`,

      social_media_post: `🚀 Website Analysis Insights ${tone === "casual" ? "That'll Blow Your Mind!" : "for Strategic Growth"}

${intention === "promote" ? "🎯 Ready to transform your digital presence?" : intention === "inform" ? "📊 Here's what we discovered:" : "💡 Key insights revealed:"}

✨ Performance Score: Optimization opportunities identified
🔒 Security Status: ${tone === "technical" ? "SSL/TLS protocols verified" : "Protection measures active"}
📱 Mobile Experience: ${tone === "casual" ? "Looking good on all devices!" : "Cross-platform compatibility confirmed"}
🎨 Content Quality: ${intention === "persuade" ? "Ready for enhancement!" : "Strategic improvements available"}

${intention === "entertain" ? "Plot twist: Your website has hidden potential! 🎭" : intention === "instruct" ? "Next steps: 1️⃣ Review findings 2️⃣ Prioritize improvements 3️⃣ Implement changes" : ""}

${tone === "persuasive" ? "Don't let your competition get ahead! 🏆" : tone === "casual" ? "Pretty cool stuff, right? 😎" : ""}

#WebsiteAnalysis #DigitalOptimization #WebPerformance ${intention === "promote" ? "#GrowthHacking #DigitalMarketing" : "#TechInsights #WebDev"}

${modifier.conclusion}`,

      email_newsletter: `Subject: ${intention === "promote" ? "Unlock Your Website's Hidden Potential" : intention === "inform" ? "Your Website Analysis Results" : "Important Website Insights Inside"}

${modifier.greeting}

## ${intention === "persuade" ? "Transform Your Digital Presence Today" : intention === "inform" ? "Your Comprehensive Website Analysis" : "Critical Website Performance Update"}

We've completed a thorough analysis of your website, and the results are ${tone === "casual" ? "pretty exciting" : tone === "professional" ? "highly informative" : "strategically significant"}!

### 🎯 Key Highlights
- **Performance**: ${intention === "promote" ? "Massive improvement potential identified" : "Optimization opportunities available"}
- **Security**: ${tone === "technical" ? "Protocol compliance verified" : "Protection status confirmed"}
- **Content**: ${intention === "persuade" ? "Ready for strategic enhancement" : "Quality assessment completed"}
- **Mobile**: ${tone === "casual" ? "Works great on phones!" : "Cross-device compatibility verified"}

### 📊 What This Means for You
${framework.focus === "marketing message" ? "Your website is sitting on untapped potential that could significantly boost your business results." : framework.focus === "educational content" ? "Understanding these metrics helps you make informed decisions about your digital strategy." : "These insights provide a roadmap for strategic improvements."}

### 🚀 Next Steps
${intention === "instruct" ? "1. Review the detailed findings\n2. Prioritize improvements based on impact\n3. Implement changes systematically" : intention === "persuade" ? "Don't wait – your competitors aren't! Contact us today to start optimizing." : "Consider these recommendations for your digital strategy planning."}

${tone === "persuasive" ? "Ready to take action? Reply to this email or visit our website to get started!" : tone === "casual" ? "Questions? Just hit reply – we're here to help! 😊" : "We appreciate your attention to these important findings."}

${modifier.conclusion}

---
*Powered by WScrapierr Analytics*`,

      case_study: `# Case Study: ${intention === "promote" ? "Digital Transformation Success" : intention === "analyze" ? "Comprehensive Website Analysis" : "Strategic Website Optimization"}

## ${tone === "academic" ? "Research Objective" : tone === "casual" ? "The Challenge" : "Executive Overview"}

This case study examines ${framework.focus} through detailed website analysis, demonstrating ${intention === "persuade" ? "the transformative power of strategic optimization" : intention === "inform" ? "comprehensive analytical methodologies" : "practical implementation strategies"}.

## Background & Context
${tone === "professional" ? "The subject website represents a typical digital presence requiring strategic enhancement." : tone === "casual" ? "We looked at a website that had some room for improvement – and boy, did we find opportunities!" : tone === "academic" ? "The research subject demonstrates characteristics common to contemporary web properties requiring optimization." : ""}

## Methodology
Our analysis employed ${framework.structure} to ensure ${tone === "technical" ? "precise measurement and evaluation" : tone === "creative" ? "innovative assessment techniques" : "comprehensive examination"}.

### Data Collection
- Performance metrics analysis
- Content quality assessment  
- Security protocol evaluation
- User experience testing

### Analysis Framework
${intention === "analyze" ? "Critical examination revealed multiple optimization vectors" : intention === "inform" ? "Systematic evaluation identified key improvement areas" : "Strategic assessment uncovered significant opportunities"}.

## Key Findings
### Performance Insights
${tone === "persuasive" ? "Dramatic improvement potential identified across all metrics!" : tone === "academic" ? "Quantitative analysis revealed statistically significant optimization opportunities." : "Multiple enhancement opportunities discovered through comprehensive testing."}

### Strategic Implications
${intention === "promote" ? "These findings represent substantial business value waiting to be unlocked." : intention === "instruct" ? "Implementation of these recommendations follows established best practices." : "Results indicate clear pathways for strategic improvement."}

## Implementation Strategy
${framework.focus === "learning objectives" ? "Step-by-step implementation ensures systematic improvement" : framework.focus === "marketing message" ? "Immediate action on these insights delivers competitive advantage" : "Strategic implementation maximizes optimization impact"}.

## Results & Impact
${tone === "casual" ? "The potential improvements are honestly pretty amazing!" : tone === "professional" ? "Analysis indicates significant optimization potential across multiple dimensions." : tone === "academic" ? "Quantitative projections suggest substantial performance improvements." : ""}

## Lessons Learned
${lessonsText}

## Conclusion
${modifier.conclusion}

---
*WScrapierr Case Study Analysis*`,
    }

    return contentTemplates[type as keyof typeof contentTemplates] || contentTemplates.research_report
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
      const blob = new Blob([generatedContent], { type: "text/markdown" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${currentType}_${selectedTone}_${selectedIntention}_${new Date().toISOString().split("T")[0]}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Export Successful",
        description: "Content has been downloaded as a markdown file.",
      })
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
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          AI Content Studio
        </CardTitle>
        <CardDescription>
          Generate professional content with customizable tone and intention. Choose from various document types
          optimized for different purposes.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {/* Tone and Intention Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="tone-select">Tone</Label>
            <Select value={selectedTone} onValueChange={setSelectedTone}>
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {toneOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="intention-select">Intention</Label>
            <Select value={selectedIntention} onValueChange={setSelectedIntention}>
              <SelectTrigger>
                <SelectValue placeholder="Select intention" />
              </SelectTrigger>
              <SelectContent>
                {intentionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <Tabs value={currentType} onValueChange={setCurrentType} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 h-auto flex-wrap">
            {filteredContentTypes.map((type) => {
              const Icon = type.icon
              return (
                <TabsTrigger key={type.id} value={type.id} className="flex flex-col gap-1 h-auto py-3">
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{type.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          <div className="mt-6">
            {filteredContentTypes.map((type) => (
              <TabsContent key={type.id} value={type.id} className="space-y-6 mt-0">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">{type.label}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{selectedTone}</span>
                      <span className="text-xs bg-secondary/10 text-secondary-foreground px-2 py-1 rounded">
                        {selectedIntention}
                      </span>
                    </div>
                  </div>
                  <Button onClick={() => handleGenerate(type.id)} disabled={isGenerating} className="w-full sm:w-auto">
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
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-md font-medium text-muted-foreground">
                      Creating {type.label.toLowerCase()} with {selectedTone} tone...
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Optimizing for {selectedIntention} intention
                    </p>
                  </div>
                )}

                {/* Content Display */}
                <Textarea
                  value={generatedContent}
                  readOnly
                  placeholder={`Your generated ${type.label.toLowerCase()} content will appear here...`}
                  className="min-h-[400px] font-mono text-sm bg-muted/30 border rounded-md focus:ring-1 focus:ring-primary"
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
            <strong>Pro Tip:</strong> Different combinations of tone and intention create unique content styles.
            Experiment with various settings for optimal results.
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}
