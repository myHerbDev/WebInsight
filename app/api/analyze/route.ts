import { NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { sql, safeDbOperation, isNeonAvailable } from "@/lib/neon-db"
import { redis, safeRedisOperation, CACHE_KEYS, CACHE_TTL } from "@/lib/upstash-redis"
import { randomBytes } from "crypto"

export async function POST(request: Request) {
  try {
    // Enhanced request body parsing with comprehensive safety
    let requestBody
    try {
      const bodyText = await request.text()
      console.log("Raw request body length:", bodyText?.length || 0)

      if (!bodyText || !bodyText.trim()) {
        console.error("Empty request body received")
        return NextResponse.json({ error: "Request body is required" }, { status: 400 })
      }

      // Validate JSON structure before parsing
      const trimmed = bodyText.trim()
      if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) {
        console.error("Invalid JSON format in request body")
        return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 })
      }

      try {
        requestBody = JSON.parse(trimmed)
        console.log("Successfully parsed request body")
      } catch (parseError: any) {
        console.error("JSON parsing failed:", parseError.message)
        return NextResponse.json(
          {
            error: "Invalid JSON in request body",
            details: parseError.message,
          },
          { status: 400 },
        )
      }

      // Validate parsed object
      if (!requestBody || typeof requestBody !== "object") {
        console.error("Parsed body is not a valid object")
        return NextResponse.json({ error: "Invalid request body format" }, { status: 400 })
      }
    } catch (textError: any) {
      console.error("Failed to read request body:", textError.message)
      return NextResponse.json(
        {
          error: "Failed to read request body",
          details: textError.message,
        },
        { status: 400 },
      )
    }

    const {
      url,
      includeAdvancedMetrics = true,
      analyzeSEO = true,
      checkAccessibility = true,
      analyzePerformance = true,
      checkSecurity = true,
      analyzeSustainability = true,
      includeContentAnalysis = true,
      checkMobileOptimization = true,
      analyzeLoadingSpeed = true,
      checkSocialMedia = true,
    } = requestBody

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Valid URL is required" }, { status: 400 })
    }

    console.log(`Starting enhanced analysis for: ${url}`)

    // Normalize URL
    let normalizedUrl = url.trim()
    if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
      normalizedUrl = "https://" + normalizedUrl
    }

    try {
      new URL(normalizedUrl)
    } catch (e) {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    // Check cache first
    const cachedAnalysis = await safeRedisOperation(
      async () => {
        const cached = await redis!.get(CACHE_KEYS.ANALYSIS(normalizedUrl))
        return cached ? JSON.parse(cached as string) : null
      },
      null,
      "Error checking cache",
    )

    if (cachedAnalysis) {
      console.log("Returning cached analysis")
      return NextResponse.json(cachedAnalysis)
    }

    // Check if analysis already exists in database
    let existingAnalysis = null
    if (isNeonAvailable()) {
      existingAnalysis = await safeDbOperation(
        async () => {
          const result = await sql`
            SELECT * FROM website_analyses 
            WHERE url = ${normalizedUrl} 
            ORDER BY created_at DESC 
            LIMIT 1
          `
          return result[0] || null
        },
        null,
        "Error checking existing analysis",
      )

      if (existingAnalysis && new Date(existingAnalysis.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)) {
        console.log("Returning database analysis")
        const formattedAnalysis = {
          ...existingAnalysis,
          _id: existingAnalysis.id,
          keyPoints: existingAnalysis.key_points || [],
          sustainability: {
            score: existingAnalysis.sustainability_score || 0,
            performance: existingAnalysis.performance_score || 0,
            scriptOptimization: existingAnalysis.script_optimization_score || 0,
            duplicateContent: 0,
            improvements: existingAnalysis.improvements || [],
          },
        }

        // Cache the result
        await safeRedisOperation(
          async () => {
            await redis!.setex(
              CACHE_KEYS.ANALYSIS(normalizedUrl),
              CACHE_TTL.ANALYSIS,
              JSON.stringify(formattedAnalysis),
            )
          },
          undefined,
          "Error caching analysis",
        )

        return NextResponse.json(formattedAnalysis)
      }
    }

    // Fetch website content
    let htmlContent = ""
    let fetchError = null

    try {
      console.log(`Fetching content from: ${normalizedUrl}`)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const response = await fetch(normalizedUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; WebsiteAnalyzer/1.0)",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate",
          Connection: "keep-alive",
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      htmlContent = await response.text()
      console.log(`Successfully fetched ${htmlContent.length} characters`)
    } catch (error: any) {
      console.error("Fetch error:", error)
      fetchError = error.message

      if (error.name === "AbortError") {
        return NextResponse.json({ error: "Request timeout - website took too long to respond" }, { status: 408 })
      }
    }

    // Enhanced content analysis
    const analysisResult = analyzeWebsiteContent(htmlContent, normalizedUrl, {
      includeAdvancedMetrics,
      analyzeSEO,
      checkAccessibility,
      analyzePerformance,
      checkSecurity,
      analyzeSustainability,
      includeContentAnalysis,
      checkMobileOptimization,
      analyzeLoadingSpeed,
      checkSocialMedia,
    })

    // Generate AI summary and insights
    let aiAnalysis = null
    if (process.env.GROQ_API_KEY && htmlContent) {
      try {
        console.log("Generating AI analysis with Groq")
        const prompt = createEnhancedAnalysisPrompt(analysisResult, normalizedUrl)

        const { text } = await generateText({
          model: groq("llama3-70b-8192"),
          prompt,
          maxTokens: 2000,
          temperature: 0.7,
        })

        aiAnalysis = parseAIResponse(text)
        console.log("AI analysis completed successfully")
      } catch (aiError) {
        console.error("AI analysis error:", aiError)
      }
    }

    // Combine analysis results
    const analysisId = randomBytes(16).toString("hex")
    const finalAnalysis = {
      id: analysisId,
      url: normalizedUrl,
      title: aiAnalysis?.title || analysisResult.title || extractDomain(normalizedUrl),
      summary: aiAnalysis?.summary || analysisResult.summary || `Analysis of ${normalizedUrl}`,
      key_points: aiAnalysis?.keyPoints || analysisResult.keyPoints || [],
      keywords: aiAnalysis?.keywords || analysisResult.keywords || [],
      sustainability_score: analysisResult.sustainabilityScore || 0,
      performance_score: analysisResult.performanceScore || 0,
      script_optimization_score: analysisResult.scriptOptimizationScore || 0,
      content_quality_score: analysisResult.contentQualityScore || 0,
      security_score: analysisResult.securityScore || 0,
      improvements: aiAnalysis?.improvements || analysisResult.improvements || [],
      content_stats: analysisResult.contentStats || {},
      raw_data: analysisResult.rawData || {},
      hosting_provider_name: analysisResult.hostingProvider || "Unknown",
      ssl_certificate: analysisResult.hasSSL || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Save to Neon database
    let savedAnalysis = finalAnalysis
    if (isNeonAvailable()) {
      savedAnalysis = await safeDbOperation(
        async () => {
          await sql`
            INSERT INTO website_analyses (
              id, url, title, summary, key_points, keywords,
              sustainability_score, performance_score, script_optimization_score,
              content_quality_score, security_score, improvements,
              content_stats, raw_data, hosting_provider_name, ssl_certificate,
              created_at, updated_at
            ) VALUES (
              ${finalAnalysis.id}, ${finalAnalysis.url}, ${finalAnalysis.title}, 
              ${finalAnalysis.summary}, ${JSON.stringify(finalAnalysis.key_points)}, 
              ${JSON.stringify(finalAnalysis.keywords)}, ${finalAnalysis.sustainability_score},
              ${finalAnalysis.performance_score}, ${finalAnalysis.script_optimization_score},
              ${finalAnalysis.content_quality_score}, ${finalAnalysis.security_score},
              ${JSON.stringify(finalAnalysis.improvements)}, ${JSON.stringify(finalAnalysis.content_stats)},
              ${JSON.stringify(finalAnalysis.raw_data)}, ${finalAnalysis.hosting_provider_name},
              ${finalAnalysis.ssl_certificate}, ${finalAnalysis.created_at}, ${finalAnalysis.updated_at}
            )
          `
          return finalAnalysis
        },
        finalAnalysis,
        "Error saving analysis to database",
      )
    }

    // Format response
    const responseData = {
      _id: savedAnalysis.id,
      url: savedAnalysis.url,
      title: savedAnalysis.title,
      summary: savedAnalysis.summary,
      keyPoints: savedAnalysis.key_points,
      keywords: savedAnalysis.keywords,
      sustainability: {
        score: savedAnalysis.sustainability_score,
        performance: savedAnalysis.performance_score,
        scriptOptimization: savedAnalysis.script_optimization_score,
        duplicateContent: 0,
        improvements: savedAnalysis.improvements,
      },
      subdomains: [],
      contentStats: savedAnalysis.content_stats,
      rawData: savedAnalysis.raw_data,
    }

    // Enhanced response validation and safety
    try {
      // Ensure all required fields are present with safe defaults
      const safeResponse = {
        _id: responseData?._id || "unknown",
        url: responseData?.url || normalizedUrl,
        title: responseData?.title || "Website Analysis",
        summary: responseData?.summary || "Analysis completed successfully",
        keyPoints: Array.isArray(responseData?.keyPoints) ? responseData.keyPoints : [],
        keywords: Array.isArray(responseData?.keywords) ? responseData.keywords : [],
        sustainability: responseData?.sustainability || {
          score: 0,
          performance: 0,
          scriptOptimization: 0,
          duplicateContent: 0,
          improvements: [],
        },
        subdomains: Array.isArray(responseData?.subdomains) ? responseData.subdomains : [],
        contentStats: responseData?.contentStats || {},
        rawData: responseData?.rawData || {},
      }

      // Validate response structure
      if (!safeResponse._id || !safeResponse.url) {
        throw new Error("Invalid response structure")
      }

      console.log("Sending validated response with ID:", safeResponse._id)

      // Create response with proper headers
      return new NextResponse(JSON.stringify(safeResponse), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      })
    } catch (responseError: any) {
      console.error("Response validation error:", responseError.message)
      return NextResponse.json(
        {
          error: "Failed to generate valid response",
          message: responseError.message,
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Analysis error:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze website",
        message: error.message || "Unknown error occurred",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

// Helper functions (same as before but without Supabase dependencies)
function analyzeWebsiteContent(html: string, url: string, options: any) {
  const doc = html || ""

  const title = extractTitle(doc) || extractDomain(url)
  const headings = extractHeadings(doc)
  const paragraphs = extractParagraphs(doc)
  const links = extractLinks(doc)
  const images = extractImages(doc)
  const scripts = extractScripts(doc)
  const styles = extractStyles(doc)

  const performanceScore = calculatePerformanceScore(doc, options)
  const securityScore = calculateSecurityScore(doc, url, options)
  const sustainabilityScore = calculateSustainabilityScore(doc, options)
  const contentQualityScore = calculateContentQualityScore(doc, options)
  const scriptOptimizationScore = calculateScriptOptimizationScore(scripts, options)

  const seoMetrics = options.analyzeSEO ? analyzeSEO(doc) : {}
  const accessibilityMetrics = options.checkAccessibility ? analyzeAccessibility(doc) : {}
  const mobileMetrics = options.checkMobileOptimization ? analyzeMobileOptimization(doc) : {}
  const socialMetrics = options.checkSocialMedia ? analyzeSocialMedia(doc) : {}

  return {
    title,
    summary: `Comprehensive analysis of ${title}`,
    keyPoints: generateKeyPoints(doc, options),
    keywords: extractKeywords(doc),
    sustainabilityScore,
    performanceScore,
    scriptOptimizationScore,
    contentQualityScore,
    securityScore,
    improvements: generateImprovements(doc, options),
    contentStats: {
      wordCount: countWords(paragraphs.join(" ")),
      paragraphs: paragraphs.length,
      headings: headings.length,
      images: images.length,
      links: links.length,
      scripts: scripts.length,
      styles: styles.length,
      ...seoMetrics,
      ...accessibilityMetrics,
      ...mobileMetrics,
      ...socialMetrics,
    },
    rawData: {
      paragraphs: paragraphs.slice(0, 10),
      headings: headings.slice(0, 20),
      links: links.slice(0, 50),
      images: images.slice(0, 20),
    },
    hostingProvider: detectHostingProvider(doc, url),
    hasSSL: url.startsWith("https://"),
  }
}

function calculatePerformanceScore(html: string, options: any): number {
  let score = 85
  if (options.analyzeLoadingSpeed) {
    const scriptCount = (html.match(/<script/g) || []).length
    const imageCount = (html.match(/<img/g) || []).length
    const cssCount = (html.match(/<link.*stylesheet/g) || []).length
    if (scriptCount > 10) score -= 10
    if (imageCount > 20) score -= 5
    if (cssCount > 5) score -= 5
  }
  if (html.includes('loading="lazy"')) score += 5
  if (html.includes("async") || html.includes("defer")) score += 5
  if (html.includes("preload")) score += 3
  return Math.max(0, Math.min(100, score))
}

function calculateSecurityScore(html: string, url: string, options: any): number {
  let score = 70
  if (options.checkSecurity) {
    if (url.startsWith("https://")) score += 15
    if (html.includes("Content-Security-Policy")) score += 5
    if (html.includes("X-Frame-Options")) score += 3
    if (html.includes("X-Content-Type-Options")) score += 2
    if (html.includes("eval(") || html.includes("innerHTML")) score -= 10
    if (html.includes("document.write")) score -= 5
  }
  return Math.max(0, Math.min(100, score))
}

function calculateSustainabilityScore(html: string, options: any): number {
  let score = 75
  if (options.analyzeSustainability) {
    const htmlSize = html.length
    const imageCount = (html.match(/<img/g) || []).length
    const scriptCount = (html.match(/<script/g) || []).length
    if (htmlSize > 100000) score -= 10
    if (htmlSize > 500000) score -= 15
    if (html.includes("webp")) score += 5
    if (html.includes('loading="lazy"')) score += 5
    if (html.includes("preload")) score += 3
    if (imageCount > 30) score -= 10
    if (scriptCount > 15) score -= 8
  }
  return Math.max(0, Math.min(100, score))
}

function calculateContentQualityScore(html: string, options: any): number {
  let score = 80
  if (options.includeContentAnalysis) {
    const headings = extractHeadings(html)
    const paragraphs = extractParagraphs(html)
    const wordCount = countWords(paragraphs.join(" "))
    if (headings.length > 0) score += 5
    if (headings.length > 3) score += 5
    if (wordCount > 300) score += 5
    if (wordCount > 1000) score += 5
    if (html.includes('<meta name="description"')) score += 5
    if (html.includes('<meta name="keywords"')) score += 3
  }
  return Math.max(0, Math.min(100, score))
}

function calculateScriptOptimizationScore(scripts: string[], options: any): number {
  let score = 85
  if (options.analyzePerformance) {
    const scriptCount = scripts.length
    if (scriptCount > 10) score -= 15
    if (scriptCount > 20) score -= 25
    const hasAsync = scripts.some((script) => script.includes("async"))
    const hasDefer = scripts.some((script) => script.includes("defer"))
    if (hasAsync) score += 5
    if (hasDefer) score += 5
  }
  return Math.max(0, Math.min(100, score))
}

function analyzeSEO(html: string) {
  return {
    hasMetaDescription: html.includes('<meta name="description"'),
    hasMetaKeywords: html.includes('<meta name="keywords"'),
    hasTitle: html.includes("<title>"),
    hasH1: html.includes("<h1"),
    hasAltTags: html.includes("alt="),
    hasCanonical: html.includes('rel="canonical"'),
    hasOpenGraph: html.includes('property="og:'),
    hasTwitterCard: html.includes('name="twitter:'),
  }
}

function analyzeAccessibility(html: string) {
  return {
    hasAltAttributes: html.includes("alt="),
    hasAriaLabels: html.includes("aria-label"),
    hasAriaDescribedBy: html.includes("aria-describedby"),
    hasSkipLinks: html.includes("skip"),
    hasLandmarks: html.includes("role=") || html.includes("<main") || html.includes("<nav"),
    hasHeadingStructure: html.includes("<h1") && html.includes("<h2"),
  }
}

function analyzeMobileOptimization(html: string) {
  return {
    hasViewportMeta: html.includes('name="viewport"'),
    hasResponsiveImages: html.includes("srcset") || html.includes("sizes"),
    hasTouchIcons: html.includes("apple-touch-icon"),
    hasMediaQueries: html.includes("@media"),
    hasMobileOptimizedCSS: html.includes("mobile") || html.includes("responsive"),
  }
}

function analyzeSocialMedia(html: string) {
  return {
    hasOpenGraph: html.includes('property="og:'),
    hasTwitterCard: html.includes('name="twitter:'),
    hasFacebookPixel: html.includes("facebook") && html.includes("pixel"),
    hasGoogleAnalytics: html.includes("google-analytics") || html.includes("gtag"),
    hasSocialLinks: html.includes("facebook.com") || html.includes("twitter.com") || html.includes("linkedin.com"),
  }
}

function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return match ? match[1].trim() : ""
}

function extractHeadings(html: string): string[] {
  const headingRegex = /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi
  const matches = html.match(headingRegex) || []
  return matches.map((h) => h.replace(/<[^>]+>/g, "").trim()).filter(Boolean)
}

function extractParagraphs(html: string): string[] {
  const paragraphRegex = /<p[^>]*>([^<]+)<\/p>/gi
  const matches = html.match(paragraphRegex) || []
  return matches.map((p) => p.replace(/<[^>]+>/g, "").trim()).filter(Boolean)
}

function extractLinks(html: string): string[] {
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi
  const matches = html.match(linkRegex) || []
  return matches
    .map((link) => {
      const hrefMatch = link.match(/href=["']([^"']+)["']/)
      return hrefMatch ? hrefMatch[1] : ""
    })
    .filter(Boolean)
}

function extractImages(html: string): string[] {
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi
  const matches = html.match(imgRegex) || []
  return matches
    .map((img) => {
      const srcMatch = img.match(/src=["']([^"']+)["']/)
      return srcMatch ? srcMatch[1] : ""
    })
    .filter(Boolean)
}

function extractScripts(html: string): string[] {
  const scriptRegex = /<script[^>]*>[\s\S]*?<\/script>/gi
  return html.match(scriptRegex) || []
}

function extractStyles(html: string): string[] {
  const styleRegex = /<style[^>]*>[\s\S]*?<\/style>/gi
  const linkRegex = /<link[^>]+rel=["']stylesheet["'][^>]*>/gi
  const styles = html.match(styleRegex) || []
  const links = html.match(linkRegex) || []
  return [...styles, ...links]
}

function extractKeywords(html: string): string[] {
  const text = html.replace(/<[^>]+>/g, " ").toLowerCase()
  const words = text.match(/\b\w{4,}\b/g) || []
  const frequency: { [key: string]: number } = {}
  words.forEach((word) => {
    frequency[word] = (frequency[word] || 0) + 1
  })
  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([word]) => word)
}

function generateKeyPoints(html: string, options: any): string[] {
  const points = []
  if (options.analyzePerformance) {
    const scriptCount = (html.match(/<script/g) || []).length
    if (scriptCount > 10) {
      points.push(`High script count (${scriptCount}) may impact loading speed`)
    }
  }
  if (options.checkSecurity) {
    if (!html.includes("https://")) {
      points.push("Website should implement HTTPS for better security")
    }
  }
  if (options.analyzeSEO) {
    if (!html.includes('<meta name="description"')) {
      points.push("Missing meta description for SEO optimization")
    }
  }
  if (options.checkAccessibility) {
    if (!html.includes("alt=")) {
      points.push("Images missing alt attributes for accessibility")
    }
  }
  return points.length > 0 ? points : ["Website analysis completed successfully"]
}

function generateImprovements(html: string, options: any): string[] {
  const improvements = []
  if (options.analyzePerformance) {
    improvements.push("Optimize images and enable lazy loading")
    improvements.push("Minimize and compress CSS and JavaScript files")
  }
  if (options.checkSecurity) {
    improvements.push("Implement security headers (CSP, HSTS)")
    improvements.push("Regular security audits and updates")
  }
  if (options.analyzeSustainability) {
    improvements.push("Use modern image formats (WebP, AVIF)")
    improvements.push("Implement efficient caching strategies")
  }
  return improvements
}

function detectHostingProvider(html: string, url: string): string {
  if (html.includes("cloudflare") || html.includes("cf-ray")) return "Cloudflare"
  if (html.includes("amazonaws") || html.includes("aws")) return "Amazon Web Services"
  if (html.includes("googleusercontent") || html.includes("gcp")) return "Google Cloud Platform"
  if (html.includes("azure") || html.includes("microsoft")) return "Microsoft Azure"
  if (html.includes("netlify")) return "Netlify"
  if (html.includes("vercel")) return "Vercel"
  if (html.includes("github.io")) return "GitHub Pages"
  return "Unknown"
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "")
  } catch {
    return url
  }
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function createEnhancedAnalysisPrompt(analysis: any, url: string): string {
  return `Analyze this website: ${url}

Content Statistics:
- Word Count: ${analysis.contentStats?.wordCount || 0}
- Headings: ${analysis.contentStats?.headings || 0}
- Images: ${analysis.contentStats?.images || 0}
- Links: ${analysis.contentStats?.links || 0}

Performance Metrics:
- Performance Score: ${analysis.performanceScore || 0}%
- Security Score: ${analysis.securityScore || 0}%
- Sustainability Score: ${analysis.sustainabilityScore || 0}%

Sample Content:
${analysis.rawData?.paragraphs?.slice(0, 3).join("\n") || "No content available"}

Sample Headings:
${analysis.rawData?.headings?.slice(0, 5).join(", ") || "No headings available"}

Please provide:
1. A clear title for this website
2. A 2-3 sentence summary of what this website does
3. 3-5 key findings about the website
4. 8-12 relevant keywords
5. 3-5 specific improvement recommendations

Format your response as JSON:
{
  "title": "Website Title",
  "summary": "Brief description...",
  "keyPoints": ["Point 1", "Point 2", ...],
  "keywords": ["keyword1", "keyword2", ...],
  "improvements": ["Improvement 1", "Improvement 2", ...]
}`
}

function parseAIResponse(text: string): any {
  try {
    const cleanText = text.trim()
    if (!cleanText) {
      throw new Error("Empty AI response")
    }

    const jsonMatch = cleanText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const jsonText = jsonMatch[0]
      const parsed = JSON.parse(jsonText)

      if (typeof parsed === "object" && parsed !== null) {
        return {
          title: parsed.title || "Website Analysis",
          summary: parsed.summary || "Comprehensive website analysis completed",
          keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : ["Analysis completed successfully"],
          keywords: Array.isArray(parsed.keywords) ? parsed.keywords : ["website", "analysis", "performance"],
          improvements: Array.isArray(parsed.improvements)
            ? parsed.improvements
            : ["Optimize performance", "Improve security", "Enhance user experience"],
        }
      }
    }

    throw new Error("No valid JSON found in response")
  } catch (error) {
    console.error("Error parsing AI response:", error)
    return {
      title: "Website Analysis",
      summary: "Comprehensive website analysis completed",
      keyPoints: ["Analysis completed successfully"],
      keywords: ["website", "analysis", "performance"],
      improvements: ["Optimize performance", "Improve security", "Enhance user experience"],
    }
  }
}
