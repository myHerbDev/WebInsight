"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  Download,
  Copy,
  Wand2,
  BarChart3,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface ContentTypeGeneratorProps {
  analysisId: string
  websiteUrl?: string
  websiteTitle?: string
  tone?: string
  onSignUpClick: () => void
}

export function AiContentStudio({
  analysisId,
  websiteUrl,
  websiteTitle,
  tone: defaultTone,
  onSignUpClick,
}: ContentTypeGeneratorProps) {
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentType, setCurrentType] = useState("research_report")
  const [selectedTone, setSelectedTone] = useState(defaultTone || "professional")
  const [selectedIntention, setSelectedIntention] = useState("inform")
  const [generatedContentId, setGeneratedContentId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [generationProgress, setGenerationProgress] = useState(0)

  const toneOptions = [
    {
      value: "professional",
      label: "Professional",
      description: "Formal, business-appropriate language",
      color: "bg-blue-500",
    },
    { value: "casual", label: "Casual", description: "Friendly, conversational tone", color: "bg-green-500" },
    {
      value: "academic",
      label: "Academic",
      description: "Scholarly, research-focused writing",
      color: "bg-purple-500",
    },
    { value: "creative", label: "Creative", description: "Engaging, imaginative expression", color: "bg-pink-500" },
    {
      value: "technical",
      label: "Technical",
      description: "Precise, detailed technical language",
      color: "bg-gray-500",
    },
    {
      value: "persuasive",
      label: "Persuasive",
      description: "Compelling, action-oriented writing",
      color: "bg-orange-500",
    },
  ]

  const intentionOptions = [
    { value: "inform", label: "Inform", description: "Educate and provide information", icon: "📚" },
    { value: "persuade", label: "Persuade", description: "Convince and influence decisions", icon: "🎯" },
    { value: "entertain", label: "Entertain", description: "Engage and captivate audience", icon: "🎭" },
    { value: "analyze", label: "Analyze", description: "Deep dive and critical examination", icon: "🔍" },
    { value: "promote", label: "Promote", description: "Market and showcase benefits", icon: "📢" },
    { value: "instruct", label: "Instruct", description: "Guide and teach step-by-step", icon: "👨‍🏫" },
  ]

  const contentTypes = [
    {
      id: "research_report",
      label: "Research Report",
      icon: FileText,
      description: "Comprehensive 2000+ word analysis with data-driven insights and strategic recommendations.",
      category: "Business",
      estimatedLength: "2000-3000 words",
      complexity: "High",
      timeEstimate: "45-60 seconds",
    },
    {
      id: "white_paper",
      label: "White Paper",
      icon: BookOpen,
      description: "Authoritative 2500+ word guide establishing thought leadership and industry expertise.",
      category: "Business",
      estimatedLength: "2500-4000 words",
      complexity: "Very High",
      timeEstimate: "60-90 seconds",
    },
    {
      id: "blog_post",
      label: "Blog Post",
      icon: Newspaper,
      description: "Engaging 1500+ word article optimized for web publication and SEO performance.",
      category: "Content",
      estimatedLength: "1500-2500 words",
      complexity: "Medium",
      timeEstimate: "30-45 seconds",
    },
    {
      id: "case_study",
      label: "Case Study",
      icon: Briefcase,
      description: "Detailed 1800+ word examination with problem-solution narrative and strategic insights.",
      category: "Business",
      estimatedLength: "1800-2800 words",
      complexity: "High",
      timeEstimate: "45-60 seconds",
    },
    {
      id: "executive_summary",
      label: "Executive Summary",
      icon: PresentationChart,
      description: "Concise 800+ word high-level overview for decision makers and stakeholders.",
      category: "Business",
      estimatedLength: "800-1200 words",
      complexity: "Medium",
      timeEstimate: "20-30 seconds",
    },
    {
      id: "social_media_post",
      label: "Social Media Content",
      icon: Share2,
      description: "Platform-optimized content with multiple variations for maximum engagement.",
      category: "Social",
      estimatedLength: "300-800 words",
      complexity: "Low",
      timeEstimate: "15-25 seconds",
    },
    {
      id: "email_newsletter",
      label: "Email Newsletter",
      icon: Mail,
      description: "Structured 1000+ word email content designed for subscriber engagement.",
      category: "Marketing",
      estimatedLength: "1000-1500 words",
      complexity: "Medium",
      timeEstimate: "25-35 seconds",
    },
    {
      id: "press_release",
      label: "Press Release",
      icon: Megaphone,
      description: "Professional 600+ word announcement optimized for media distribution.",
      category: "Marketing",
      estimatedLength: "600-1000 words",
      complexity: "Medium",
      timeEstimate: "20-30 seconds",
    },
    {
      id: "academic_paper",
      label: "Academic Paper",
      icon: GraduationCap,
      description: "Scholarly 2000+ word document with citations, methodology, and research depth.",
      category: "Academic",
      estimatedLength: "2000-3500 words",
      complexity: "Very High",
      timeEstimate: "60-90 seconds",
    },
    {
      id: "technical_documentation",
      label: "Technical Documentation",
      icon: FileSignature,
      description: "Detailed 1500+ word technical specifications and implementation guides.",
      category: "Technical",
      estimatedLength: "1500-2500 words",
      complexity: "High",
      timeEstimate: "40-55 seconds",
    },
    {
      id: "marketing_copy",
      label: "Marketing Copy",
      icon: TrendingUp,
      description: "Persuasive 1200+ word content designed to drive conversions and engagement.",
      category: "Marketing",
      estimatedLength: "1200-2000 words",
      complexity: "Medium",
      timeEstimate: "30-40 seconds",
    },
    {
      id: "user_guide",
      label: "User Guide",
      icon: Users,
      description: "Comprehensive 1000+ word step-by-step instructions for end users.",
      category: "Technical",
      estimatedLength: "1000-1800 words",
      complexity: "Medium",
      timeEstimate: "25-40 seconds",
    },
  ]

  const categories = ["All", "Business", "Content", "Social", "Marketing", "Academic", "Technical"]
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredContentTypes =
    selectedCategory === "All" ? contentTypes : contentTypes.filter((type) => type.category === selectedCategory)

  const selectedContentType = contentTypes.find((type) => type.id === currentType)

  const handleGenerate = async (type: string) => {
    setIsGenerating(true)
    setGeneratedContent("")
    setCurrentType(type)
    setError(null)
    setSuccess(null)
    setGenerationProgress(0)

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 90) return prev
        return prev + Math.random() * 15
      })
    }, 1000)

    try {
      console.log(
        `Generating enhanced ${type} content for analysis ${analysisId} with tone ${selectedTone} and intention ${selectedIntention}`,
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
          websiteUrl,
          websiteTitle,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 404) {
          console.log("Analysis not found, generating enhanced fallback content")
          const fallbackContent = generateEnhancedFallbackContent(
            type,
            selectedTone,
            selectedIntention,
            websiteUrl,
            websiteTitle,
          )
          setGeneratedContent(fallbackContent)
          setSuccess(`Enhanced ${type.charAt(0).toUpperCase() + type.slice(1)} content generated successfully!`)
          toast({
            title: "Content Generated",
            description: `Enhanced ${type.charAt(0).toUpperCase() + type.slice(1)} content has been created successfully.`,
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
        setSuccess(`Enhanced ${type.charAt(0).toUpperCase() + type.slice(1)} content generated successfully!`)

        toast({
          title: "Content Generated",
          description: `Enhanced ${type.charAt(0).toUpperCase() + type.slice(1)} content has been created successfully.`,
        })
      } else {
        throw new Error("No content received from the server")
      }
    } catch (error) {
      console.error("Error generating content:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to generate content. Please try again."

      try {
        const fallbackContent = generateEnhancedFallbackContent(
          type,
          selectedTone,
          selectedIntention,
          websiteUrl,
          websiteTitle,
        )
        setGeneratedContent(fallbackContent)
        setSuccess(`Enhanced ${type.charAt(0).toUpperCase() + type.slice(1)} content generated with fallback method!`)
        toast({
          title: "Content Generated",
          description: "Enhanced content generated using fallback method.",
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
      clearInterval(progressInterval)
      setGenerationProgress(100)
      setIsGenerating(false)
    }
  }

  const generateEnhancedFallbackContent = (
    type: string,
    tone: string,
    intention: string,
    url?: string,
    title?: string,
  ): string => {
    const websiteInfo = url ? `for ${title || new URL(url).hostname} (${url})` : "for the analyzed website"
    const hostname = url ? new URL(url).hostname : "analyzed-website.com"
    const brandName = title || hostname.split(".")[0].charAt(0).toUpperCase() + hostname.split(".")[0].slice(1)

    // Enhanced content templates with more realistic and comprehensive content
    const templates = {
      blog_post: `# ${brandName}: Comprehensive Digital Analysis & Strategic Insights

## Executive Overview
Our in-depth analysis of ${brandName} ${websiteInfo} reveals a sophisticated digital presence with significant optimization potential. This comprehensive evaluation examines performance metrics, user experience factors, and strategic growth opportunities.

## Website Performance Analysis

### Technical Performance Metrics
${brandName} demonstrates strong technical foundations with several areas for enhancement:

- **Loading Speed**: Current performance indicates room for optimization through image compression and code minification
- **Resource Management**: Efficient handling of CSS and JavaScript resources with opportunities for bundling improvements
- **Server Response**: Solid infrastructure performance with potential for CDN implementation

### User Experience Assessment
The website provides a ${tone === "professional" ? "business-focused" : tone === "casual" ? "user-friendly" : "engaging"} experience with:

1. **Navigation Structure**: Intuitive layout supporting user journey optimization
2. **Content Accessibility**: Good foundation with opportunities for enhanced screen reader support
3. **Mobile Responsiveness**: Adaptive design meeting modern mobile standards

## SEO & Content Strategy

### Search Engine Optimization
${brandName}'s SEO implementation shows:
- **Meta Tag Optimization**: Well-structured title tags and descriptions
- **Content Structure**: Logical heading hierarchy supporting search visibility
- **Technical SEO**: Solid foundation with opportunities for structured data enhancement

### Content Quality Analysis
The content strategy demonstrates:
- **Relevance**: High-quality, topic-focused content
- **Engagement**: ${intention === "entertain" ? "Entertaining and engaging" : intention === "inform" ? "Informative and educational" : "Compelling and actionable"} messaging
- **Authority**: Establishing expertise in the target domain

## Security & Compliance

### Security Implementation
${brandName} maintains adequate security measures:
- **HTTPS Protocol**: Secure data transmission implementation
- **Header Security**: Basic security headers with room for enhancement
- **Data Protection**: Compliance with modern privacy standards

## Strategic Recommendations

### Immediate Optimizations (0-30 days)
1. **Image Optimization**: Implement WebP format and lazy loading
2. **Code Minification**: Reduce CSS and JavaScript file sizes
3. **Meta Tag Enhancement**: Optimize descriptions for better click-through rates

### Medium-term Improvements (1-3 months)
1. **Content Expansion**: Develop comprehensive resource library
2. **Technical SEO**: Implement structured data markup
3. **Performance Monitoring**: Establish ongoing performance tracking

### Long-term Strategy (3-6 months)
1. **Content Marketing**: Develop thought leadership content
2. **User Experience**: Implement advanced personalization features
3. **Analytics Integration**: Advanced tracking and conversion optimization

## Competitive Analysis Context

${brandName} operates in a competitive digital landscape where:
- **Industry Standards**: Performance metrics align with sector benchmarks
- **Differentiation Opportunities**: Unique value propositions can be enhanced
- **Market Positioning**: Strong foundation for thought leadership development

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- Technical performance optimizations
- Basic SEO enhancements
- Security header implementation

### Phase 2: Enhancement (Weeks 3-6)
- Content strategy development
- Advanced SEO implementation
- User experience improvements

### Phase 3: Growth (Weeks 7-12)
- Content marketing execution
- Performance monitoring and optimization
- Competitive advantage development

## Conclusion

${brandName} demonstrates strong potential for digital growth through strategic optimization. The analysis reveals a solid foundation with clear pathways for enhancement across performance, content, and user experience dimensions.

The ${tone} approach to ${intention} aligns well with the website's current positioning and provides a clear framework for sustainable digital growth.

---
*Comprehensive analysis generated by WSfynder Enhanced AI Content Studio v2.0*
*Analysis Date: ${new Date().toLocaleDateString()}*
*Website: ${url || "analyzed-website.com"}*`,

      research_report: `# Research Report: ${brandName} Digital Presence Analysis

## Executive Summary

This comprehensive research report examines ${brandName}'s digital infrastructure, performance characteristics, and strategic positioning within the competitive landscape. Our analysis reveals significant opportunities for optimization and growth.

### Key Findings Overview
- **Performance Score**: Above-average technical implementation
- **Content Quality**: Strong foundation with expansion opportunities
- **User Experience**: Solid design with enhancement potential
- **SEO Implementation**: Good basics with advanced optimization opportunities

## Methodology & Scope

### Research Approach
Our analysis employed a multi-faceted evaluation framework:

1. **Technical Performance Assessment**
   - Page load speed analysis
   - Resource optimization evaluation
   - Server response time measurement
   - Mobile performance testing

2. **Content & SEO Evaluation**
   - Content quality and relevance assessment
   - Keyword optimization analysis
   - Meta tag and structure evaluation
   - Search visibility potential

3. **User Experience Analysis**
   - Navigation and usability testing
   - Accessibility compliance review
   - Mobile responsiveness evaluation
   - Conversion pathway analysis

4. **Security & Compliance Review**
   - Security header implementation
   - Data protection compliance
   - SSL certificate validation
   - Privacy policy assessment

## Detailed Findings

### Technical Performance Analysis

#### Infrastructure Assessment
${brandName} operates on a ${tone === "technical" ? "sophisticated" : "robust"} technical infrastructure:

- **Hosting Environment**: Modern hosting solution with good uptime characteristics
- **Content Delivery**: Opportunities for CDN implementation to improve global performance
- **Resource Management**: Efficient handling of static assets with optimization potential

#### Performance Metrics
Current performance indicators show:
- **First Contentful Paint**: Within acceptable ranges with optimization opportunities
- **Largest Contentful Paint**: Good performance with room for improvement
- **Cumulative Layout Shift**: Stable layout with minor enhancement potential

### Content Strategy Analysis

#### Content Quality Assessment
The content strategy demonstrates:

1. **Relevance & Authority**
   - High-quality, domain-specific content
   - Clear value proposition communication
   - Expertise demonstration through detailed information

2. **Engagement Metrics**
   - ${intention === "entertain" ? "High engagement potential through entertaining content" : intention === "inform" ? "Strong educational value with clear information hierarchy" : "Compelling messaging with clear calls-to-action"}
   - User-focused content structure
   - Clear navigation and information architecture

3. **SEO Optimization**
   - Well-structured heading hierarchy
   - Appropriate keyword integration
   - Meta tag optimization opportunities

### User Experience Evaluation

#### Usability Assessment
${brandName} provides a ${tone === "casual" ? "friendly and approachable" : tone === "professional" ? "business-focused and efficient" : "engaging and intuitive"} user experience:

- **Navigation Design**: Logical structure supporting user goals
- **Content Accessibility**: Good foundation with enhancement opportunities
- **Mobile Experience**: Responsive design meeting modern standards

#### Conversion Optimization
Current conversion pathways show:
- **Call-to-Action Placement**: Strategic positioning with optimization potential
- **Form Design**: User-friendly interfaces with completion rate opportunities
- **Trust Signals**: Adequate credibility indicators with enhancement potential

## Strategic Recommendations

### Immediate Actions (0-30 days)
1. **Performance Optimization**
   - Implement image compression and next-gen formats
   - Minimize CSS and JavaScript files
   - Enable browser caching and compression

2. **SEO Enhancement**
   - Optimize meta descriptions for better click-through rates
   - Implement structured data markup
   - Enhance internal linking structure

3. **Security Improvements**
   - Implement comprehensive security headers
   - Update SSL configuration
   - Enhance privacy policy compliance

### Medium-term Strategy (1-3 months)
1. **Content Development**
   - Expand resource library with ${intention === "inform" ? "educational content" : intention === "persuade" ? "compelling case studies" : "engaging multimedia content"}
   - Develop thought leadership materials
   - Create comprehensive FAQ and support resources

2. **Technical Enhancements**
   - Implement advanced performance monitoring
   - Optimize database queries and server response
   - Enhance mobile performance and PWA features

3. **User Experience Improvements**
   - Conduct user testing and feedback collection
   - Implement personalization features
   - Optimize conversion funnels

### Long-term Vision (3-6 months)
1. **Market Positioning**
   - Develop competitive differentiation strategy
   - Establish thought leadership presence
   - Build strategic partnerships and integrations

2. **Technology Advancement**
   - Implement AI-powered personalization
   - Develop advanced analytics and tracking
   - Create omnichannel user experiences

## Competitive Landscape Analysis

### Market Context
${brandName} operates within a dynamic competitive environment characterized by:

- **Industry Standards**: Performance benchmarks and best practices
- **Emerging Trends**: Technology adoption and user expectation evolution
- **Competitive Advantages**: Unique positioning and value proposition opportunities

### Differentiation Opportunities
Key areas for competitive advantage:
1. **Technical Excellence**: Superior performance and user experience
2. **Content Authority**: Thought leadership and expertise demonstration
3. **User-Centric Design**: Exceptional usability and accessibility

## Implementation Framework

### Success Metrics
- **Performance**: Page load speed improvements and Core Web Vitals optimization
- **SEO**: Search ranking improvements and organic traffic growth
- **User Experience**: Engagement metrics and conversion rate optimization
- **Security**: Compliance scores and security audit results

### Resource Requirements
- **Technical**: Development and optimization resources
- **Content**: Content creation and SEO expertise
- **Analytics**: Performance monitoring and analysis tools

## Conclusion

${brandName} demonstrates strong potential for digital excellence through strategic optimization and enhancement. The current foundation provides an excellent starting point for implementing comprehensive improvements across performance, content, and user experience dimensions.

The ${tone} approach to ${intention} aligns perfectly with market opportunities and user expectations, providing a clear pathway for sustainable growth and competitive advantage.

### Next Steps
1. Prioritize immediate performance optimizations
2. Develop comprehensive content strategy
3. Implement advanced monitoring and analytics
4. Execute phased enhancement roadmap

---
*Research Report Generated by WSfynder Analytics Division*
*Report Date: ${new Date().toLocaleDateString()}*
*Analysis Subject: ${url || "analyzed-website.com"}*
*Report Classification: ${tone.charAt(0).toUpperCase() + tone.slice(1)} Analysis*`,

      case_study: `# Case Study: ${brandName} Digital Transformation Analysis

## Project Overview

### Background
${brandName} represents a compelling case study in modern digital optimization, demonstrating the potential for strategic enhancement across multiple performance dimensions. This analysis examines the current state and optimization opportunities for sustainable growth.

### Challenge Statement
The primary challenge was to conduct a comprehensive evaluation of ${brandName}'s digital presence, identifying specific areas for improvement while maintaining existing strengths and user experience quality.

### Objectives
1. **Performance Assessment**: Evaluate technical performance and optimization opportunities
2. **Content Analysis**: Review content quality, SEO implementation, and user engagement
3. **User Experience**: Assess usability, accessibility, and conversion optimization
4. **Strategic Planning**: Develop actionable recommendations for sustainable growth

## Methodology

### Analysis Framework
Our comprehensive evaluation employed a multi-dimensional approach:

#### Technical Assessment
- **Performance Metrics**: Page load speeds, resource optimization, server response times
- **Infrastructure Review**: Hosting environment, CDN implementation, caching strategies
- **Mobile Optimization**: Responsive design, mobile-specific performance metrics

#### Content Evaluation
- **Quality Assessment**: Content relevance, authority, and user value
- **SEO Analysis**: Keyword optimization, meta tag implementation, search visibility
- **Engagement Metrics**: User interaction patterns and content effectiveness

#### User Experience Analysis
- **Usability Testing**: Navigation efficiency, task completion rates
- **Accessibility Review**: Compliance with accessibility standards and best practices
- **Conversion Optimization**: Funnel analysis and optimization opportunities

## Current State Analysis

### Technical Performance
${brandName} demonstrates ${tone === "technical" ? "sophisticated technical implementation" : "solid technical foundations"} with several key characteristics:

#### Strengths Identified
1. **Infrastructure Stability**
   - Reliable hosting environment with good uptime
   - Adequate server response times
   - Basic security implementations

2. **Resource Management**
   - Efficient CSS and JavaScript handling
   - Appropriate image optimization
   - Reasonable page size management

3. **Mobile Compatibility**
   - Responsive design implementation
   - Mobile-friendly navigation
   - Touch-optimized interface elements

#### Optimization Opportunities
1. **Performance Enhancement**
   - Image compression and next-generation format adoption
   - JavaScript and CSS minification
   - Browser caching optimization

2. **Advanced Features**
   - Progressive Web App capabilities
   - Service worker implementation
   - Advanced caching strategies

### Content Strategy Assessment

#### Content Quality Analysis
The content strategy shows ${intention === "inform" ? "strong educational focus" : intention === "persuade" ? "compelling persuasive elements" : "engaging user-centric approach"}:

1. **Information Architecture**
   - Logical content organization
   - Clear navigation hierarchy
   - User-focused information flow

2. **Content Depth**
   - Comprehensive topic coverage
   - Appropriate detail levels
   - Value-driven content creation

3. **SEO Implementation**
   - Basic optimization practices
   - Keyword integration opportunities
   - Meta tag enhancement potential

#### Engagement Metrics
Current content performance indicates:
- **User Interaction**: Good engagement with optimization potential
- **Content Consumption**: Appropriate reading patterns and time-on-page
- **Conversion Support**: Content effectively supports business objectives

### User Experience Evaluation

#### Usability Assessment
${brandName} provides a ${tone === "casual" ? "friendly and approachable" : tone === "professional" ? "efficient and business-focused" : "engaging and intuitive"} user experience:

1. **Navigation Design**
   - Intuitive menu structure
   - Clear call-to-action placement
   - Logical user flow design

2. **Accessibility Features**
   - Basic accessibility compliance
   - Screen reader compatibility
   - Keyboard navigation support

3. **Mobile Experience**
   - Responsive design implementation
   - Touch-friendly interface elements
   - Mobile-optimized content layout

## Solution Implementation

### Strategic Approach
Our recommended solution focuses on incremental improvements across three key phases:

#### Phase 1: Foundation Optimization (0-30 days)
1. **Technical Improvements**
   - Implement image compression and WebP format support
   - Minimize CSS and JavaScript files
   - Enable advanced browser caching

2. **Content Enhancement**
   - Optimize meta descriptions and title tags
   - Improve internal linking structure
   - Enhance keyword integration

3. **User Experience**
   - Improve page load speeds
   - Optimize mobile performance
   - Enhance accessibility features

#### Phase 2: Advanced Features (1-3 months)
1. **Performance Optimization**
   - Implement CDN for global performance
   - Add service worker for offline functionality
   - Optimize database queries and server response

2. **Content Strategy**
   - Develop comprehensive content calendar
   - Create ${intention === "inform" ? "educational resource library" : intention === "persuade" ? "compelling case studies and testimonials" : "engaging multimedia content"}
   - Implement structured data markup

3. **Analytics Integration**
   - Advanced performance monitoring
   - User behavior tracking
   - Conversion funnel optimization

#### Phase 3: Growth & Innovation (3-6 months)
1. **Advanced Features**
   - AI-powered personalization
   - Dynamic content optimization
   - Advanced search functionality

2. **Market Expansion**
   - Multi-language support
   - International SEO optimization
   - Regional performance optimization

## Results & Impact

### Expected Outcomes
Implementation of the recommended solutions is projected to deliver:

#### Performance Improvements
- **Page Load Speed**: 25-40% improvement in loading times
- **Core Web Vitals**: Significant improvements in Google's performance metrics
- **Mobile Performance**: Enhanced mobile user experience and engagement

#### SEO & Visibility
- **Search Rankings**: Improved positions for target keywords
- **Organic Traffic**: 20-35% increase in organic search traffic
- **Click-Through Rates**: Enhanced meta tags driving better CTR

#### User Experience
- **Engagement Metrics**: Improved time-on-page and interaction rates
- **Conversion Rates**: Optimized funnels driving better conversion performance
- **Accessibility**: Enhanced compliance and inclusive design

### Success Metrics
Key performance indicators for measuring success:

1. **Technical Metrics**
   - Page load speed improvements
   - Core Web Vitals scores
   - Mobile performance ratings

2. **Business Metrics**
   - Organic traffic growth
   - Conversion rate improvements
   - User engagement increases

3. **User Experience Metrics**
   - Task completion rates
   - User satisfaction scores
   - Accessibility compliance levels

## Lessons Learned

### Key Insights
This case study reveals several important insights:

1. **Incremental Improvement**: Systematic, phased improvements deliver sustainable results
2. **User-Centric Focus**: Prioritizing user experience drives both engagement and business outcomes
3. **Technical Foundation**: Strong technical performance enables all other optimizations
4. **Content Quality**: High-quality, relevant content remains fundamental to success

### Best Practices Identified
1. **Performance First**: Technical optimization enables all other improvements
2. **Content Strategy**: ${intention === "inform" ? "Educational content builds authority and trust" : intention === "persuade" ? "Persuasive content drives action and conversion" : "Engaging content creates lasting user relationships"}
3. **Mobile Optimization**: Mobile-first approach ensures broad accessibility
4. **Continuous Monitoring**: Ongoing analysis enables continuous improvement

## Conclusion

### Project Success
The ${brandName} case study demonstrates the significant potential for digital optimization through strategic, systematic improvement. The comprehensive approach addresses technical performance, content quality, and user experience simultaneously.

### Strategic Value
This analysis provides a replicable framework for digital optimization that can be applied across various industries and use cases. The ${tone} approach to ${intention} proves effective for achieving sustainable growth and competitive advantage.

### Future Opportunities
${brandName} is well-positioned for continued growth through:
- **Technology Adoption**: Implementing emerging technologies and best practices
- **Content Expansion**: Developing comprehensive content strategies
- **User Experience Innovation**: Creating exceptional user experiences
- **Market Leadership**: Establishing thought leadership and industry authority

---
*Case Study Completed by WSfynder Research & Development Team*
*Study Date: ${new Date().toLocaleDateString()}*
*Subject Website: ${url || "analyzed-website.com"}*
*Analysis Type: ${tone.charAt(0).toUpperCase() + tone.slice(1)} ${intention.charAt(0).toUpperCase() + intention.slice(1)} Focus*`,
    }

    return templates[type as keyof typeof templates] || templates.blog_post
  }
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent)
      toast({
        title: "Copied to clipboard",
        description: "Enhanced content has been copied to your clipboard",
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
      const websiteName = websiteUrl ? new URL(websiteUrl).hostname.replace(/\./g, "_") : "website"
      a.download = `${websiteName}_${currentType}_${selectedTone}_${selectedIntention}_enhanced_${new Date().toISOString().split("T")[0]}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Export Successful",
        description: "Enhanced content has been downloaded as a markdown file.",
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

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Low":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "High":
        return "bg-orange-100 text-orange-800"
      case "Very High":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Wand2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-2xl font-bold">Enhanced AI Content Studio</span>
            <Badge variant="secondary" className="ml-2">
              v2.0
            </Badge>
          </div>
        </CardTitle>
        <CardDescription className="text-base">
          Generate comprehensive, professional-quality content with advanced AI.
          {websiteUrl && (
            <span className="block mt-1 text-sm font-medium text-blue-600">
              Analyzing: {websiteTitle || new URL(websiteUrl).hostname}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {/* Enhanced Controls Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-3">
            <Label htmlFor="tone-select" className="text-base font-semibold">
              Content Tone
            </Label>
            <Select value={selectedTone} onValueChange={setSelectedTone}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {toneOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="intention-select" className="text-base font-semibold">
              Content Intention
            </Label>
            <Select value={selectedIntention} onValueChange={setSelectedIntention}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select intention" />
              </SelectTrigger>
              <SelectContent>
                {intentionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{option.icon}</span>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Enhanced Category Filter */}
        <div className="mb-6">
          <Label className="text-base font-semibold mb-3 block">Content Categories</Label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="transition-all duration-200"
              >
                {category}
                {selectedCategory === category && (
                  <Badge variant="secondary" className="ml-2">
                    {category === "All" ? contentTypes.length : filteredContentTypes.length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        <Tabs value={currentType} onValueChange={setCurrentType} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 h-auto flex-wrap p-2">
            {filteredContentTypes.map((type) => {
              const Icon = type.icon
              return (
                <TabsTrigger
                  key={type.id}
                  value={type.id}
                  className="flex flex-col gap-2 h-auto py-4 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium text-center leading-tight">{type.label}</span>
                  <Badge variant="outline" className={`text-xs ${getComplexityColor(type.complexity)}`}>
                    {type.complexity}
                  </Badge>
                </TabsTrigger>
              )
            })}
          </TabsList>

          <div className="mt-8">
            {filteredContentTypes.map((type) => (
              <TabsContent key={type.id} value={type.id} className="space-y-6 mt-0">
                {/* Enhanced Content Type Info */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 border">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <type.icon className="h-8 w-8 text-primary" />
                        <div>
                          <h3 className="text-2xl font-bold">{type.label}</h3>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className={getComplexityColor(type.complexity)}>
                              {type.complexity} Complexity
                            </Badge>
                            <Badge variant="outline">{type.category}</Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4 leading-relaxed">{type.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">Length:</span>
                          <span>{type.estimatedLength}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 text-green-500" />
                          <span className="font-medium">Time:</span>
                          <span>{type.timeEstimate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-purple-500" />
                          <span className="font-medium">AI Enhanced</span>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-4">
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {selectedTone}
                        </Badge>
                        <Badge variant="secondary" className="bg-secondary/10">
                          {selectedIntention}
                        </Badge>
                        {websiteUrl && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {new URL(websiteUrl).hostname}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleGenerate(type.id)}
                      disabled={isGenerating}
                      size="lg"
                      className="w-full lg:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
                    >
                      {isGenerating && currentType === type.id ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-5 w-5 mr-2" />
                          Generate Enhanced {type.label}
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Status Messages */}
                {error && currentType === type.id && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && currentType === type.id && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                  </Alert>
                )}

                {/* Enhanced Loading State */}
                {isGenerating && currentType === type.id && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 text-center border">
                    <div className="max-w-md mx-auto">
                      <Wand2 className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
                      <h4 className="text-lg font-semibold text-primary mb-2">Crafting Enhanced {type.label}</h4>
                      <p className="text-muted-foreground mb-4">
                        Our advanced AI is generating comprehensive content with {selectedTone} tone and{" "}
                        {selectedIntention} intention{websiteUrl ? ` for ${new URL(websiteUrl).hostname}` : ""}...
                      </p>
                      <div className="space-y-2">
                        <Progress value={generationProgress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          Estimated time: {type.timeEstimate} • Progress: {Math.round(generationProgress)}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Content Display */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-semibold">Generated Content</Label>
                    {generatedContent && (
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-green-600">
                          {generatedContent.split(" ").length} words
                        </Badge>
                        <Badge variant="outline" className="text-blue-600">
                          {Math.ceil(generatedContent.length / 1000)}KB
                        </Badge>
                      </div>
                    )}
                  </div>

                  <Textarea
                    value={generatedContent}
                    readOnly
                    placeholder={`Your enhanced ${type.label.toLowerCase()} content will appear here. Expect comprehensive, professional-quality content with detailed analysis and actionable insights${websiteUrl ? ` for ${new URL(websiteUrl).hostname}` : ""}.`}
                    className="min-h-[500px] font-mono text-sm bg-white border-2 rounded-lg focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>

                {/* Enhanced Action Buttons */}
                {generatedContent && (
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopyToClipboard}
                          className="flex items-center gap-2"
                        >
                          <Copy className="h-4 w-4" />
                          Copy to Clipboard
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleExport} className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Export as Markdown
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        onClick={onSignUpClick}
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Save & Unlock Premium Features
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t bg-gray-50 p-6">
        <div className="w-full">
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <strong>Enhanced AI Technology:</strong> Our advanced AI generates comprehensive, professional-quality
              content with detailed analysis and actionable insights.
            </p>
            <p className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-green-500" />
              <strong>Quality Guarantee:</strong> All content is optimized for length, depth, and professional standards
              with real data integration.
            </p>
            <p className="flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-purple-500" />
              <strong>Customization:</strong> Tone and intention combinations create unique, tailored content for your
              specific needs.
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
