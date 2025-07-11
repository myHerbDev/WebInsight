import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import type { WebsiteData, AnalysisOptions } from "@/types/website-data"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, ...options }: { url: string } & AnalysisOptions = body

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Normalize URL
    let normalizedUrl = url.trim()
    if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
      normalizedUrl = `https://${normalizedUrl}`
    }

    console.log(`[Analysis] Starting analysis for: ${normalizedUrl}`)

    // Fetch website content with timeout and error handling
    let htmlContent = ""
    let fetchError = null

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

      const response = await fetch(normalizedUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; WebInSight/1.0; +https://webinsight.com/bot)",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate",
          Connection: "keep-alive",
          "Upgrade-Insecure-Requests": "1",
        },
        signal: controller.signal,
        redirect: "follow",
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      htmlContent = await response.text()
      console.log(`[Analysis] Successfully fetched ${htmlContent.length} characters`)
    } catch (error: any) {
      fetchError = error.message || "Failed to fetch website"
      console.warn(`[Analysis] Fetch failed for ${normalizedUrl}:`, fetchError)
    }

    // If fetch failed, return a fallback analysis
    if (!htmlContent || fetchError) {
      console.log(`[Analysis] Returning fallback analysis due to fetch failure`)

      const fallbackAnalysis: WebsiteData = {
        _id: `fallback_${Date.now()}`,
        url: normalizedUrl,
        title: "Website Analysis - Fetch Failed",
        summary: `Unable to fetch content from ${normalizedUrl}. This may be due to network restrictions, CORS policies, or the website being temporarily unavailable. Error: ${fetchError || "Unknown error"}`,
        keyPoints: [
          "Website content could not be retrieved",
          "This may be due to network restrictions or CORS policies",
          "Try again later or check if the URL is correct",
          "Some websites block automated requests",
        ],
        keywords: ["unavailable", "fetch-error", "network-issue"],
        sustainability: {
          score: 0,
          performance: 0,
          scriptOptimization: 0,
          duplicateContent: 0,
          improvements: ["Ensure website is accessible", "Check server configuration", "Verify SSL certificate"],
        },
        subdomains: [],
        contentStats: {
          pageSize: 0,
          wordCount: 0,
          headings: 0,
          images: 0,
          links: 0,
          scripts: 0,
          styles: 0,
        },
        rawData: {
          metaDescription: "",
          metaKeywords: "",
          h1Texts: [],
        },
        sustainability_score: 0,
        performance_score: 0,
        script_optimization_score: 0,
        content_quality_score: 0,
        security_score: normalizedUrl.startsWith("https://") ? 50 : 0,
        improvements: [
          "Website could not be analyzed due to fetch failure",
          "Ensure the website is publicly accessible",
          "Check if the URL is correct and the site is online",
        ],
        hosting_provider_name: "Unknown",
        ssl_certificate: normalizedUrl.startsWith("https://"),
        server_location: "Unknown",
        ip_address: "Unknown",
      }

      return NextResponse.json(fallbackAnalysis)
    }

    // Parse HTML content safely
    const parseHtmlSafely = (html: string) => {
      try {
        // Extract basic information using regex (safer than DOM parsing in edge runtime)
        const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)
        const title = titleMatch ? titleMatch[1].trim() : "Untitled"

        const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i)
        const metaDescription = metaDescMatch ? metaDescMatch[1] : ""

        const h1Matches = html.match(/<h1[^>]*>([^<]*)<\/h1>/gi) || []
        const h1Texts = h1Matches.map((h1) => h1.replace(/<[^>]*>/g, "").trim())

        // Count various elements
        const images = (html.match(/<img[^>]*>/gi) || []).length
        const links = (html.match(/<a[^>]*href/gi) || []).length
        const scripts = (html.match(/<script[^>]*>/gi) || []).length
        const styles = (html.match(/<style[^>]*>|<link[^>]*rel=["']stylesheet["']/gi) || []).length
        const headings = (html.match(/<h[1-6][^>]*>/gi) || []).length

        // Estimate word count (remove HTML tags and count words)
        const textContent = html
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
        const wordCount = textContent.split(" ").filter((word) => word.length > 0).length

        return {
          title,
          metaDescription,
          h1Texts,
          images,
          links,
          scripts,
          styles,
          headings,
          wordCount,
          pageSize: html.length,
          textContent: textContent.substring(0, 1000), // First 1000 chars for AI analysis
        }
      } catch (error) {
        console.error("[Analysis] HTML parsing error:", error)
        return {
          title: "Parsing Error",
          metaDescription: "",
          h1Texts: [],
          images: 0,
          links: 0,
          scripts: 0,
          styles: 0,
          headings: 0,
          wordCount: 0,
          pageSize: html.length,
          textContent: "",
        }
      }
    }

    const parsedData = parseHtmlSafely(htmlContent)
    console.log(`[Analysis] Parsed data:`, {
      title: parsedData.title,
      wordCount: parsedData.wordCount,
      images: parsedData.images,
      links: parsedData.links,
    })

    // Calculate basic scores
    const calculateScores = (data: typeof parsedData) => {
      // Performance score based on page size and resource count
      let performanceScore = 100
      if (data.pageSize > 1000000) performanceScore -= 30 // Large page
      if (data.scripts > 10) performanceScore -= 20 // Too many scripts
      if (data.images > 50) performanceScore -= 15 // Too many images
      performanceScore = Math.max(0, performanceScore)

      // Content quality score
      let contentScore = 0
      if (data.wordCount > 300) contentScore += 30
      if (data.metaDescription.length > 120) contentScore += 20
      if (data.h1Texts.length > 0) contentScore += 25
      if (data.headings > 3) contentScore += 25
      contentScore = Math.min(100, contentScore)

      // Security score
      const securityScore = normalizedUrl.startsWith("https://") ? 60 : 20

      // Sustainability score (based on efficiency)
      let sustainabilityScore = 100
      if (data.pageSize > 500000) sustainabilityScore -= 25
      if (data.scripts > 5) sustainabilityScore -= 15
      sustainabilityScore = Math.max(0, sustainabilityScore)

      return {
        performance: performanceScore,
        content: contentScore,
        security: securityScore,
        sustainability: sustainabilityScore,
      }
    }

    const scores = calculateScores(parsedData)

    // Generate AI-enhanced analysis
    let aiSummary = ""
    let aiKeyPoints: string[] = []
    let aiKeywords: string[] = []
    let aiImprovements: string[] = []

    try {
      console.log("[Analysis] Generating AI insights...")

      const aiPrompt = `Analyze this website data and provide insights:
URL: ${normalizedUrl}
Title: ${parsedData.title}
Meta Description: ${parsedData.metaDescription}
Word Count: ${parsedData.wordCount}
Images: ${parsedData.images}
Links: ${parsedData.links}
Scripts: ${parsedData.scripts}
Page Size: ${parsedData.pageSize} bytes
Content Preview: ${parsedData.textContent}

Please provide:
1. A brief summary (2-3 sentences)
2. 3-5 key points about the website
3. 5-8 relevant keywords
4. 3-5 improvement suggestions

Format as JSON with keys: summary, keyPoints, keywords, improvements`

      const { text } = await generateText({
        model: xai("grok-beta"),
        prompt: aiPrompt,
        maxTokens: 1000,
      })

      try {
        const aiResponse = JSON.parse(text)
        aiSummary =
          aiResponse.summary ||
          `Analysis of ${parsedData.title} - a website with ${parsedData.wordCount} words and ${parsedData.images} images.`
        aiKeyPoints = Array.isArray(aiResponse.keyPoints) ? aiResponse.keyPoints : []
        aiKeywords = Array.isArray(aiResponse.keywords) ? aiResponse.keywords : []
        aiImprovements = Array.isArray(aiResponse.improvements) ? aiResponse.improvements : []
      } catch (parseError) {
        console.warn("[Analysis] AI response parsing failed, using fallback")
        aiSummary = `Analysis of ${parsedData.title} - a website with ${parsedData.wordCount} words and ${parsedData.images} images.`
        aiKeyPoints = [
          `Website has ${parsedData.wordCount} words of content`,
          `Contains ${parsedData.images} images and ${parsedData.links} links`,
          `Uses ${parsedData.scripts} JavaScript files`,
          `Page size is ${Math.round(parsedData.pageSize / 1024)}KB`,
        ]
        aiKeywords = ["website", "analysis", "performance", "content", "seo"]
        aiImprovements = [
          "Optimize images for better performance",
          "Improve meta description if missing",
          "Consider reducing page size",
          "Ensure mobile responsiveness",
        ]
      }
    } catch (aiError) {
      console.warn("[Analysis] AI generation failed:", aiError)
      aiSummary = `Technical analysis of ${parsedData.title}. The website contains ${parsedData.wordCount} words and ${parsedData.images} images.`
      aiKeyPoints = [
        `Content analysis: ${parsedData.wordCount} words`,
        `Media elements: ${parsedData.images} images`,
        `Navigation: ${parsedData.links} links`,
        `Technical: ${parsedData.scripts} scripts loaded`,
      ]
      aiKeywords = ["analysis", "website", "performance", "content"]
      aiImprovements = ["Optimize page loading speed", "Improve content structure", "Enhance SEO elements"]
    }

    // Build final analysis result
    const analysisResult: WebsiteData = {
      _id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url: normalizedUrl,
      title: parsedData.title,
      summary: aiSummary,
      keyPoints: aiKeyPoints,
      keywords: aiKeywords,
      sustainability: {
        score: scores.sustainability,
        performance: scores.performance,
        scriptOptimization: Math.max(0, 100 - parsedData.scripts * 10),
        duplicateContent: 0,
        improvements: aiImprovements,
      },
      subdomains: [],
      contentStats: {
        pageSize: parsedData.pageSize,
        wordCount: parsedData.wordCount,
        headings: parsedData.headings,
        images: parsedData.images,
        links: parsedData.links,
        scripts: parsedData.scripts,
        styles: parsedData.styles,
      },
      rawData: {
        metaDescription: parsedData.metaDescription,
        metaKeywords: "",
        h1Texts: parsedData.h1Texts,
      },
      sustainability_score: scores.sustainability,
      performance_score: scores.performance,
      script_optimization_score: Math.max(0, 100 - parsedData.scripts * 10),
      content_quality_score: scores.content,
      security_score: scores.security,
      improvements: aiImprovements,
      hosting_provider_name: "Unknown",
      ssl_certificate: normalizedUrl.startsWith("https://"),
      server_location: "Unknown",
      ip_address: "Unknown",
    }

    console.log(`[Analysis] Completed analysis for ${normalizedUrl}`)
    return NextResponse.json(analysisResult)
  } catch (error: any) {
    console.error("[Analysis] Unexpected error:", error)

    // Return a generic error analysis instead of throwing
    const errorAnalysis: WebsiteData = {
      _id: `error_${Date.now()}`,
      url: "unknown",
      title: "Analysis Error",
      summary: `An unexpected error occurred during analysis: ${error.message || "Unknown error"}`,
      keyPoints: ["Analysis could not be completed", "An unexpected error occurred", "Please try again later"],
      keywords: ["error", "analysis-failed"],
      sustainability: {
        score: 0,
        performance: 0,
        scriptOptimization: 0,
        duplicateContent: 0,
        improvements: [],
      },
      subdomains: [],
      contentStats: {
        pageSize: 0,
        wordCount: 0,
        headings: 0,
        images: 0,
        links: 0,
        scripts: 0,
        styles: 0,
      },
      rawData: {
        metaDescription: "",
        metaKeywords: "",
        h1Texts: [],
      },
      sustainability_score: 0,
      performance_score: 0,
      script_optimization_score: 0,
      content_quality_score: 0,
      security_score: 0,
      improvements: ["Please try the analysis again"],
      hosting_provider_name: "Unknown",
      ssl_certificate: false,
      server_location: "Unknown",
      ip_address: "Unknown",
    }

    return NextResponse.json(errorAnalysis)
  }
}
