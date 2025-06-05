import { NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { supabaseAdmin, safeDbOperation, isSupabaseAvailable } from "@/lib/supabase-db"

export async function POST(request: Request) {
  try {
    let requestBody
    try {
      requestBody = await request.json()
    } catch (error) {
      console.error("Invalid JSON in request body:", error)
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
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

    // Check if analysis already exists in Supabase (only if available)
    let existingAnalysis = null
    if (isSupabaseAvailable()) {
      existingAnalysis = await safeDbOperation(
        async () => {
          const { data } = await supabaseAdmin
            .from("website_analyses")
            .select("*")
            .eq("url", normalizedUrl)
            .order("created_at", { ascending: false })
            .limit(1)
            .single()
          return data
        },
        null,
        "Error checking existing analysis",
      )

      if (existingAnalysis && new Date(existingAnalysis.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)) {
        console.log("Returning cached analysis")
        return NextResponse.json({
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
        })
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
    const finalAnalysis = {
      url: normalizedUrl,
      title: aiAnalysis?.title || analysisResult.title || extractDomain(normalizedUrl),
      summary: aiAnalysis?.summary || analysisResult.summary || `Analysis of ${normalizedUrl}`,
      keyPoints: aiAnalysis?.keyPoints || analysisResult.keyPoints || [],
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
    }

    // Save to Supabase (only if available)
    let savedAnalysis = { id: Date.now().toString(), ...finalAnalysis }
    if (isSupabaseAvailable()) {
      savedAnalysis = await safeDbOperation(
        async () => {
          const { data, error } = await supabaseAdmin
            .from("website_analyses")
            .insert([
              {
                ...finalAnalysis,
                key_points: finalAnalysis.keyPoints,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ])
            .select()
            .single()

          if (error) throw error
          return data
        },
        { id: Date.now().toString(), ...finalAnalysis },
        "Error saving analysis to database",
      )
    } else {
      console.log("Supabase not available - analysis not saved to database")
    }

    // Return formatted response
    return NextResponse.json({
      _id: savedAnalysis.id,
      ...finalAnalysis,
      sustainability: {
        score: finalAnalysis.sustainability_score,
        performance: finalAnalysis.performance_score,
        scriptOptimization: finalAnalysis.script_optimization_score,
        duplicateContent: 0,
        improvements: finalAnalysis.improvements,
      },
    })
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

function analyzeWebsiteContent(html: string, url: string, options: any) {
  // Enhanced content analysis with all the new parameters
  const doc = html || ""

  // Extract basic content
  const title = extractTitle(doc) || extractDomain(url)
  const headings = extractHeadings(doc)
  const paragraphs = extractParagraphs(doc)
  const links = extractLinks(doc)
  const images = extractImages(doc)
  const scripts = extractScripts(doc)
  const styles = extractStyles(doc)

  // Enhanced metrics calculation
  const performanceScore = calculatePerformanceScore(doc, options)
  const securityScore = calculateSecurityScore(doc, url, options)
  const sustainabilityScore = calculateSustainabilityScore(doc, options)
  const contentQualityScore = calculateContentQualityScore(doc, options)
  const scriptOptimizationScore = calculateScriptOptimizationScore(scripts, options)

  // SEO Analysis
  const seoMetrics = options.analyzeSEO ? analyzeSEO(doc) : {}

  // Accessibility Analysis
  const accessibilityMetrics = options.checkAccessibility ? analyzeAccessibility(doc) : {}

  // Mobile Optimization
  const mobileMetrics = options.checkMobileOptimization ? analyzeMobileOptimization(doc) : {}

  // Social Media Analysis
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

// Enhanced analysis functions
function calculatePerformanceScore(html: string, options: any): number {
  let score = 85 // Base score

  if (options.analyzeLoadingSpeed) {
    const scriptCount = (html.match(/<script/g) || []).length
    const imageCount = (html.match(/<img/g) || []).length
    const cssCount = (html.match(/<link.*stylesheet/g) || []).length

    // Penalize excessive resources
    if (scriptCount > 10) score -= 10
    if (imageCount > 20) score -= 5
    if (cssCount > 5) score -= 5
  }

  // Check for performance optimizations
  if (html.includes('loading="lazy"')) score += 5
  if (html.includes("async") || html.includes("defer")) score += 5
  if (html.includes("preload")) score += 3

  return Math.max(0, Math.min(100, score))
}

function calculateSecurityScore(html: string, url: string, options: any): number {
  let score = 70 // Base score

  if (options.checkSecurity) {
    // SSL check
    if (url.startsWith("https://")) score += 15

    // Security headers (simulated)
    if (html.includes("Content-Security-Policy")) score += 5
    if (html.includes("X-Frame-Options")) score += 3
    if (html.includes("X-Content-Type-Options")) score += 2

    // Check for potential vulnerabilities
    if (html.includes("eval(") || html.includes("innerHTML")) score -= 10
    if (html.includes("document.write")) score -= 5
  }

  return Math.max(0, Math.min(100, score))
}

function calculateSustainabilityScore(html: string, options: any): number {
  let score = 75 // Base score

  if (options.analyzeSustainability) {
    const htmlSize = html.length
    const imageCount = (html.match(/<img/g) || []).length
    const scriptCount = (html.match(/<script/g) || []).length

    // Penalize large page size
    if (htmlSize > 100000) score -= 10
    if (htmlSize > 500000) score -= 15

    // Reward optimization
    if (html.includes("webp")) score += 5
    if (html.includes('loading="lazy"')) score += 5
    if (html.includes("preload")) score += 3

    // Penalize excessive resources
    if (imageCount > 30) score -= 10
    if (scriptCount > 15) score -= 8
  }

  return Math.max(0, Math.min(100, score))
}

function calculateContentQualityScore(html: string, options: any): number {
  let score = 80 // Base score

  if (options.includeContentAnalysis) {
    const headings = extractHeadings(html)
    const paragraphs = extractParagraphs(html)
    const wordCount = countWords(paragraphs.join(" "))

    // Content structure
    if (headings.length > 0) score += 5
    if (headings.length > 3) score += 5

    // Content volume
    if (wordCount > 300) score += 5
    if (wordCount > 1000) score += 5

    // Meta tags
    if (html.includes('<meta name="description"')) score += 5
    if (html.includes('<meta name="keywords"')) score += 3
  }

  return Math.max(0, Math.min(100, score))
}

function calculateScriptOptimizationScore(scripts: string[], options: any): number {
  let score = 85 // Base score

  if (options.analyzePerformance) {
    const scriptCount = scripts.length

    // Penalize too many scripts
    if (scriptCount > 10) score -= 15
    if (scriptCount > 20) score -= 25

    // Check for optimization
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

// Helper functions
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
  const domain = extractDomain(url)

  // Common hosting provider detection
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
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const jsonText = jsonMatch[0]
      // Validate JSON before parsing
      JSON.parse(jsonText) // This will throw if invalid
      return JSON.parse(jsonText)
    }
  } catch (error) {
    console.error("Error parsing AI response:", error)
  }

  // Fallback parsing
  return {
    title: "Website Analysis",
    summary: "Comprehensive website analysis completed",
    keyPoints: ["Analysis completed successfully"],
    keywords: ["website", "analysis", "performance"],
    improvements: ["Optimize performance", "Improve security", "Enhance user experience"],
  }
}
