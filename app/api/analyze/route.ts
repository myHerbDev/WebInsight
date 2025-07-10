import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { sql, safeDbOperation, isNeonAvailable } from "@/lib/neon-db"
import { safeRedisOperation, CACHE_KEYS, CACHE_TTL, isRedisAvailable } from "@/lib/upstash-redis"
import { randomBytes } from "crypto"
import { createErrorResponse, validateJsonInput, SafeError } from "@/lib/error-handler"
import { safeFetch } from "@/lib/safe-fetch"
import type { WebsiteData, AnalysisOptions } from "@/types/website-data"

// Safe HTML parsing functions with comprehensive error handling
const safeExtractText = (html: string, regex: RegExp, group = 1): string[] => {
  try {
    if (!html || typeof html !== "string") return []
    const matches = Array.from(html.matchAll(regex))
    return matches.map((m) => m[group]?.trim()).filter(Boolean) as string[]
  } catch (error) {
    console.warn("Error extracting text:", error)
    return []
  }
}

const extractTitle = (html: string): string => {
  try {
    if (!html) return ""
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    return titleMatch?.[1]?.trim() || ""
  } catch (error) {
    console.warn("Error extracting title:", error)
    return ""
  }
}

const extractHeadings = (html: string, level?: number): string[] => {
  try {
    if (!html) return []
    const pattern = level
      ? new RegExp(`<h${level}[^>]*>([^<]+)<\/h${level}>`, "gi")
      : /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi
    return safeExtractText(html, pattern)
  } catch (error) {
    console.warn("Error extracting headings:", error)
    return []
  }
}

const extractMeta = (html: string, name: string): string => {
  try {
    if (!html || !name) return ""
    const metaPattern = new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, "i")
    const match = html.match(metaPattern)
    return match?.[1]?.trim() || ""
  } catch (error) {
    console.warn("Error extracting meta:", error)
    return ""
  }
}

const safeCountMatches = (html: string, pattern: RegExp): number => {
  try {
    if (!html) return 0
    return (html.match(pattern) || []).length
  } catch (error) {
    console.warn("Error counting matches:", error)
    return 0
  }
}

function calculateSustainabilityMetrics(html: string, url: string) {
  try {
    const pageSize = Math.round(new TextEncoder().encode(html || "").length / 1024) // KB
    const imageCount = safeCountMatches(html, /<img/gi)
    const scriptCount = safeCountMatches(html, /<script/gi)
    const cssCount = safeCountMatches(html, /<link[^>]+rel=["']stylesheet["']/gi)

    // Calculate carbon footprint (grams CO2 per page view)
    const baseCarbonFootprint = pageSize * 0.5 // 0.5g CO2 per KB
    const imagePenalty = imageCount * 2 // 2g CO2 per image
    const scriptPenalty = scriptCount * 1.5 // 1.5g CO2 per script
    const carbonFootprint = Math.max(1, Math.round(baseCarbonFootprint + imagePenalty + scriptPenalty))

    // Calculate energy efficiency (0-100)
    const energyEfficiency = Math.max(20, Math.min(100, 100 - pageSize / 10 - imageCount / 2 - scriptCount))

    // Green hosting detection (basic)
    const greenHostingIndicators = ["green", "renewable", "solar", "wind", "carbon-neutral", "eco-friendly"]
    const hasGreenHosting = greenHostingIndicators.some(
      (indicator) => (html || "").toLowerCase().includes(indicator) || url.toLowerCase().includes(indicator),
    )
    const greenHostingScore = hasGreenHosting ? 85 : 45

    // Overall sustainability score
    const sustainabilityScore = Math.round((energyEfficiency + greenHostingScore) / 2)

    return {
      carbonFootprint,
      energyEfficiency: Math.round(energyEfficiency),
      sustainabilityScore,
      greenHostingScore,
    }
  } catch (error) {
    console.warn("Error calculating sustainability metrics:", error)
    return {
      carbonFootprint: 25,
      energyEfficiency: 60,
      sustainabilityScore: 55,
      greenHostingScore: 45,
    }
  }
}

function performBasicAnalysis(html: string, url: string, options: AnalysisOptions): Partial<WebsiteData> {
  try {
    console.log(`Performing basic analysis for ${url}`)
    const analysis: Partial<WebsiteData> = { url }

    // Safe title extraction
    analysis.title =
      extractTitle(html) ||
      (() => {
        try {
          return new URL(url).hostname
        } catch {
          return "Unknown Website"
        }
      })()

    // Safe metadata extraction
    analysis.rawData = {
      metaDescription: extractMeta(html, "description"),
      metaKeywords: extractMeta(html, "keywords"),
      h1Texts: extractHeadings(html, 1),
    }

    // Safe text processing
    let allText = ""
    let wordCount = 0
    try {
      if (html) {
        allText = html
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
        wordCount = allText.split(" ").filter(Boolean).length
      }
    } catch (error) {
      console.warn("Error processing HTML text:", error)
      allText = "Content analysis unavailable"
      wordCount = 0
    }

    // Safe content stats calculation
    const pageSize = Math.round(new TextEncoder().encode(html || "").length / 1024)
    const headings = extractHeadings(html).length
    const images = safeCountMatches(html, /<img/gi)
    const links = safeCountMatches(html, /<a/gi)
    const scripts = safeCountMatches(html, /<script/gi)
    const styles = safeCountMatches(html, /<link[^>]+rel=["']stylesheet["']/gi) + safeCountMatches(html, /<style/gi)

    analysis.contentStats = {
      pageSize,
      wordCount,
      headings,
      images,
      links,
      scripts,
      styles,
    }

    // Calculate sustainability metrics
    const sustainabilityMetrics = calculateSustainabilityMetrics(html, url)

    // Safe scoring calculations
    analysis.performance_score = Math.max(
      30,
      Math.min(100, 85 - scripts * 2 - (pageSize > 500 ? 15 : 0) - (images > 20 ? 10 : 0)),
    )

    analysis.security_score = url.startsWith("https://") ? 85 : 45

    analysis.sustainability_score = sustainabilityMetrics.sustainabilityScore

    analysis.content_quality_score = Math.max(
      40,
      Math.min(
        100,
        70 +
          (analysis.rawData.metaDescription ? 10 : 0) +
          (analysis.rawData.h1Texts!.length > 0 ? 10 : 0) +
          (wordCount > 300 ? 10 : 0),
      ),
    )

    analysis.accessibility_score = Math.max(
      50,
      Math.min(
        100,
        75 + (analysis.rawData.h1Texts!.length > 0 ? 10 : 0) - (images > 10 && !(html || "").includes("alt=") ? 15 : 0),
      ),
    )

    analysis.mobile_friendliness_score = Math.max(
      40,
      Math.min(100, 80 + ((html || "").includes("viewport") ? 10 : 0) - (pageSize > 1000 ? 10 : 0)),
    )

    analysis.ssl_certificate = url.startsWith("https://")
    analysis.analyzedAt = new Date().toISOString()

    // Add sustainability-specific data
    analysis.carbonFootprint = sustainabilityMetrics.carbonFootprint
    analysis.energyEfficiency = sustainabilityMetrics.energyEfficiency
    analysis.greenHostingScore = sustainabilityMetrics.greenHostingScore

    console.log(`Basic analysis completed for ${url}`)
    return analysis
  } catch (error) {
    console.error("Error in basic analysis:", error)
    // Return minimal safe analysis on error
    return {
      url,
      title: "Analysis Error - Please Try Again",
      sustainability_score: 50,
      performance_score: 50,
      security_score: url.startsWith("https://") ? 80 : 40,
      content_quality_score: 50,
      accessibility_score: 50,
      mobile_friendliness_score: 50,
      ssl_certificate: url.startsWith("https://"),
      analyzedAt: new Date().toISOString(),
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
      carbonFootprint: 25,
      energyEfficiency: 60,
      greenHostingScore: 45,
    }
  }
}

function createGroqPrompt(basicAnalysis: Partial<WebsiteData>, options: AnalysisOptions): string {
  return `
    Analyze the following website data for ${basicAnalysis.url}:
    Title: ${basicAnalysis.title || "N/A"}
    Meta Description: ${basicAnalysis.rawData?.metaDescription || "N/A"}
    H1 Tags: ${basicAnalysis.rawData?.h1Texts?.join(", ") || "N/A"}
    Page Size (KB): ${basicAnalysis.contentStats?.pageSize || 0}
    Word Count: ${basicAnalysis.contentStats?.wordCount || 0}
    Number of Scripts: ${basicAnalysis.contentStats?.scripts || 0}
    Number of Images: ${basicAnalysis.contentStats?.images || 0}
    Carbon Footprint: ${basicAnalysis.carbonFootprint || 25}g CO2
    Energy Efficiency: ${basicAnalysis.energyEfficiency || 60}%

    Initial Scores:
    - Performance: ${basicAnalysis.performance_score || 50}%
    - Security: ${basicAnalysis.security_score || 50}%
    - Sustainability: ${basicAnalysis.sustainability_score || 50}%
    - Content Quality: ${basicAnalysis.content_quality_score || 50}%

    Based on this data and sustainability best practices, provide:
    1. A concise overall summary focusing on sustainability and performance (2-3 sentences).
    2. 3-5 key positive findings about the website's environmental impact and performance.
    3. 3-5 key areas for improvement with sustainability focus.
    4. 5-7 relevant keywords for the site's content and sustainability aspects.
    5. Refined scores (0-100) for: sustainability_score, performance_score, security_score, content_quality_score, accessibility_score, mobile_friendliness_score.
    6. A list of 5-7 specific, actionable sustainability and performance improvement suggestions.
    7. Future sustainability predictions and trends for this type of website.

    Return your response strictly as a JSON object with the following keys: "summary", "keyPoints" (array of strings for positive findings), "areasForImprovement" (array of strings), "keywords" (array of strings), "refined_scores" (an object with score keys), "improvements" (array of strings for actionable suggestions), "futurePredictions" (array of strings for sustainability trends).
  `
}

function parseGroqResponse(text: string, basicAnalysis: Partial<WebsiteData>): Partial<WebsiteData> {
  try {
    const parsed = JSON.parse(text)
    return {
      summary: parsed.summary || basicAnalysis.summary || "AI analysis complete with sustainability focus.",
      keyPoints: Array.isArray(parsed.keyPoints)
        ? parsed.keyPoints
        : ["Website analysis completed successfully", "Sustainability metrics calculated"],
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : ["website", "sustainability"],
      improvements: Array.isArray(parsed.improvements)
        ? parsed.improvements
        : ["Consider green hosting options", "Optimize images for better performance"],
      futurePredictions: Array.isArray(parsed.futurePredictions)
        ? parsed.futurePredictions
        : ["Green web technologies will become standard", "Carbon-neutral hosting adoption will increase"],
      // Update scores from AI if provided and valid
      sustainability_score:
        typeof parsed.refined_scores?.sustainability_score === "number"
          ? Math.max(0, Math.min(100, parsed.refined_scores.sustainability_score))
          : basicAnalysis.sustainability_score,
      performance_score:
        typeof parsed.refined_scores?.performance_score === "number"
          ? Math.max(0, Math.min(100, parsed.refined_scores.performance_score))
          : basicAnalysis.performance_score,
      security_score:
        typeof parsed.refined_scores?.security_score === "number"
          ? Math.max(0, Math.min(100, parsed.refined_scores.security_score))
          : basicAnalysis.security_score,
      content_quality_score:
        typeof parsed.refined_scores?.content_quality_score === "number"
          ? Math.max(0, Math.min(100, parsed.refined_scores.content_quality_score))
          : basicAnalysis.content_quality_score,
      accessibility_score:
        typeof parsed.refined_scores?.accessibility_score === "number"
          ? Math.max(0, Math.min(100, parsed.refined_scores.accessibility_score))
          : basicAnalysis.accessibility_score || 70,
      mobile_friendliness_score:
        typeof parsed.refined_scores?.mobile_friendliness_score === "number"
          ? Math.max(0, Math.min(100, parsed.refined_scores.mobile_friendliness_score))
          : basicAnalysis.mobile_friendliness_score || 75,
    }
  } catch (e) {
    console.error("Error parsing Groq JSON response:", e)
    return {
      summary: `Sustainability-focused analysis completed. ${basicAnalysis.summary || "Basic metrics calculated."}`,
      keyPoints: ["Website analysis completed", "Basic sustainability metrics calculated"],
      keywords: ["website", "sustainability", "performance"],
      improvements: [
        "Consider green hosting options",
        "Optimize images for better performance",
        "Implement caching strategies",
      ],
      futurePredictions: ["Increasing focus on green web technologies", "Growing importance of carbon-neutral hosting"],
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Starting website analysis...")

    // Parse and validate request
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("JSON parse error:", parseError)
      throw new SafeError("Invalid JSON in request body", "INVALID_JSON", 400)
    }

    validateJsonInput(body, ["url"])
    const { url, ...options } = body as { url: string } & AnalysisOptions

    // Normalize and validate URL
    let normalizedUrl = url.trim()
    if (!normalizedUrl) {
      throw new SafeError("URL cannot be empty", "EMPTY_URL", 400)
    }

    if (!normalizedUrl.startsWith("http")) {
      normalizedUrl = `https://${normalizedUrl}`
    }

    // Validate URL format
    try {
      new URL(normalizedUrl)
    } catch (urlError) {
      console.error("URL validation error:", urlError)
      throw new SafeError("Invalid URL format. Please provide a valid website URL.", "INVALID_URL", 400)
    }

    console.log(`Starting enhanced sustainability analysis of: ${normalizedUrl}`)

    // 1. Check Cache first
    if (isRedisAvailable()) {
      try {
        const cachedData = await safeRedisOperation((r) => r.get<WebsiteData>(CACHE_KEYS.ANALYSIS(normalizedUrl)), null)
        if (cachedData) {
          console.log(`Cache hit for ${normalizedUrl}`)
          return NextResponse.json(cachedData)
        }
      } catch (cacheError) {
        console.warn("Cache check failed, proceeding with analysis:", cacheError)
      }
    }

    // 2. Fetch Website Content with enhanced error handling
    console.log(`Fetching content from: ${normalizedUrl}`)
    const fetchResult = await safeFetch(normalizedUrl, {
      timeout: 15000,
      retries: 2,
      validateJson: false,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; WSfynder-Bot/1.0; +https://webinsight.dev)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        DNT: "1",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
      },
    })

    if (!fetchResult.success) {
      console.error(`Fetch failed for ${normalizedUrl}:`, fetchResult.error)
      throw new SafeError(
        `Unable to access the website: ${fetchResult.error || "Unknown error"}. Please check if the URL is correct and the website is accessible.`,
        "FETCH_ERROR",
        fetchResult.status || 500,
      )
    }

    if (typeof fetchResult.data !== "string") {
      throw new SafeError(
        "Received invalid response from website. The site may not be returning HTML content.",
        "INVALID_RESPONSE",
        500,
      )
    }

    const htmlContent = fetchResult.data
    console.log(`Successfully fetched ${htmlContent.length} characters from ${normalizedUrl}`)

    // 3. Perform Basic Analysis with comprehensive error handling
    console.log("Performing basic analysis...")
    const basicAnalysis = performBasicAnalysis(htmlContent, normalizedUrl, options)

    // 4. AI Enhancement (Groq) with better error handling
    let finalAnalysis: Partial<WebsiteData> = basicAnalysis
    if (process.env.GROQ_API_KEY) {
      try {
        console.log("Enhancing analysis with AI...")
        const groqPrompt = createGroqPrompt(basicAnalysis, options)
        const { text: groqText } = await generateText({
          model: groq("llama3-70b-8192"),
          prompt: groqPrompt,
          maxTokens: 2000,
          temperature: 0.3,
        })
        const aiEnhancements = parseGroqResponse(groqText, basicAnalysis)
        finalAnalysis = { ...basicAnalysis, ...aiEnhancements }
        console.log("AI enhancement completed successfully")
      } catch (aiError: any) {
        console.warn(`AI enhancement failed: ${aiError.message}. Proceeding with basic analysis.`)
        // Ensure we have fallback values
        finalAnalysis.summary = `${basicAnalysis.summary || "Analysis completed"} (AI enhancement unavailable)`
        finalAnalysis.keyPoints = finalAnalysis.keyPoints || [
          "Basic analysis completed successfully",
          "Sustainability metrics calculated",
        ]
        finalAnalysis.keywords = finalAnalysis.keywords || ["website", "sustainability"]
        finalAnalysis.improvements = finalAnalysis.improvements || [
          "Consider green hosting options",
          "Optimize images to reduce carbon footprint",
        ]
        finalAnalysis.futurePredictions = [
          "Green web technologies will become standard",
          "Carbon-neutral hosting adoption will increase",
        ]
      }
    } else {
      console.log("GROQ_API_KEY not set. Using basic analysis only.")
      finalAnalysis.summary = finalAnalysis.summary || "Basic sustainability analysis complete."
      finalAnalysis.keyPoints = finalAnalysis.keyPoints || [
        "Website successfully analyzed",
        "Sustainability metrics calculated",
      ]
      finalAnalysis.keywords = finalAnalysis.keywords || ["website", "sustainability", "performance"]
      finalAnalysis.improvements = finalAnalysis.improvements || [
        "Consider switching to green hosting",
        "Optimize images to reduce carbon footprint",
        "Implement efficient caching strategies",
        "Minimize JavaScript and CSS files",
      ]
      finalAnalysis.futurePredictions = [
        "Increasing adoption of renewable energy in data centers",
        "Growing importance of website carbon footprint measurement",
        "Rise of green web design principles",
      ]
    }

    // 5. Structure final data with comprehensive validation
    const analysisId = randomBytes(12).toString("hex")
    const completeAnalysisData: WebsiteData = {
      _id: analysisId,
      url: normalizedUrl,
      title: finalAnalysis.title || "Unknown Website",
      summary: finalAnalysis.summary || "Sustainability-focused analysis complete.",
      keyPoints: finalAnalysis.keyPoints || [],
      keywords: finalAnalysis.keywords || [],
      sustainability: {
        score: finalAnalysis.sustainability_score || 50,
        performance: finalAnalysis.performance_score || 50,
        scriptOptimization: Math.max(0, Math.min(100, (finalAnalysis.performance_score || 50) - 10)),
        duplicateContent: Math.max(0, Math.min(100, (finalAnalysis.content_quality_score || 50) + 10)),
        improvements:
          finalAnalysis.improvements?.filter(
            (imp) =>
              imp.toLowerCase().includes("sustainab") ||
              imp.toLowerCase().includes("green") ||
              imp.toLowerCase().includes("carbon") ||
              imp.toLowerCase().includes("energy"),
          ) || [],
      },
      contentStats: finalAnalysis.contentStats || {},
      rawData: finalAnalysis.rawData || {},
      sustainability_score: finalAnalysis.sustainability_score || 50,
      performance_score: finalAnalysis.performance_score || 50,
      script_optimization_score: Math.max(0, Math.min(100, (finalAnalysis.performance_score || 50) - 5)),
      content_quality_score: finalAnalysis.content_quality_score || 50,
      security_score: finalAnalysis.security_score || 50,
      accessibility_score: finalAnalysis.accessibility_score || 70,
      mobile_friendliness_score: finalAnalysis.mobile_friendliness_score || 75,
      improvements: finalAnalysis.improvements || [],
      ssl_certificate: finalAnalysis.ssl_certificate || false,
      analyzedAt: finalAnalysis.analyzedAt || new Date().toISOString(),
      carbonFootprint: finalAnalysis.carbonFootprint || 25,
      energyEfficiency: finalAnalysis.energyEfficiency || 60,
      greenHostingScore: finalAnalysis.greenHostingScore || 45,
      futurePredictions: finalAnalysis.futurePredictions || [],
    }

    // 6. Save to DB (Neon) with error handling
    if (isNeonAvailable()) {
      try {
        await safeDbOperation(
          () => sql`
            INSERT INTO website_analyses (id, url, title, summary, data_json, created_at)
            VALUES (${analysisId}, ${normalizedUrl}, ${completeAnalysisData.title}, ${completeAnalysisData.summary}, ${JSON.stringify(completeAnalysisData)}, NOW())
            ON CONFLICT (url) DO UPDATE SET
              title = EXCLUDED.title,
              summary = EXCLUDED.summary,
              data_json = EXCLUDED.data_json,
              created_at = EXCLUDED.created_at
          `,
          null,
          "Failed to save analysis to DB",
        )
        console.log(`Analysis saved to database with ID: ${analysisId}`)
      } catch (dbError) {
        console.warn("Database save failed (non-critical):", dbError)
      }
    }

    // 7. Cache Result with error handling
    if (isRedisAvailable()) {
      try {
        await safeRedisOperation(
          (r) => r.setex(CACHE_KEYS.ANALYSIS(normalizedUrl), CACHE_TTL.ANALYSIS, JSON.stringify(completeAnalysisData)),
          null,
          "Failed to cache analysis",
        )
        console.log(`Analysis cached for ${normalizedUrl}`)
      } catch (cacheError) {
        console.warn("Cache save failed (non-critical):", cacheError)
      }
    }

    console.log(`Analysis completed successfully for ${normalizedUrl}`)
    return NextResponse.json(completeAnalysisData)
  } catch (error) {
    console.error("Analysis error:", error)

    // Provide more specific error messages
    if (error instanceof SafeError) {
      return createErrorResponse(error, error.message)
    }

    return createErrorResponse(
      error,
      "Failed to analyze website. Please check the URL and ensure the website is accessible, then try again.",
    )
  }
}
