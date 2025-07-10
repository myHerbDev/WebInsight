import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { sql, safeDbOperation, isNeonAvailable } from "@/lib/neon-db"
import { safeRedisOperation, CACHE_KEYS, CACHE_TTL, isRedisAvailable } from "@/lib/upstash-redis"
import { randomBytes } from "crypto"
import { createErrorResponse, validateJsonInput, SafeError } from "@/lib/error-handler"
import { safeFetch } from "@/lib/safe-fetch"
import type { WebsiteData, AnalysisOptions } from "@/types/website-data"

// Enhanced HTML parsing functions with error handling
const extractText = (html: string, regex: RegExp, group = 1): string[] => {
  try {
    return Array.from(html.matchAll(regex), (m) => m[group]?.trim()).filter(Boolean) as string[]
  } catch (error) {
    console.warn("Error extracting text:", error)
    return []
  }
}

const extractTitle = (html: string): string => {
  try {
    return extractText(html, /<title[^>]*>([^<]+)<\/title>/i)[0] || ""
  } catch (error) {
    console.warn("Error extracting title:", error)
    return ""
  }
}

const extractHeadings = (html: string, level?: number): string[] => {
  try {
    return level
      ? extractText(html, new RegExp(`<h${level}[^>]*>([^<]+)<\/h${level}>`, "gi"))
      : extractText(html, /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi)
  } catch (error) {
    console.warn("Error extracting headings:", error)
    return []
  }
}

const extractMeta = (html: string, name: string): string => {
  try {
    return html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, "i"))?.[1]?.trim() || ""
  } catch (error) {
    console.warn("Error extracting meta:", error)
    return ""
  }
}

function calculateSustainabilityMetrics(
  html: string,
  url: string,
): {
  carbonFootprint: number
  energyEfficiency: number
  sustainabilityScore: number
  greenHostingScore: number
} {
  try {
    const pageSize = new TextEncoder().encode(html).length / 1024 // KB
    const imageCount = (html.match(/<img/gi) || []).length
    const scriptCount = (html.match(/<script/gi) || []).length
    const cssCount = (html.match(/<link[^>]+rel=["']stylesheet["']/gi) || []).length

    // Calculate carbon footprint (grams CO2 per page view)
    const baseCarbonFootprint = pageSize * 0.5 // 0.5g CO2 per KB
    const imagePenalty = imageCount * 2 // 2g CO2 per image
    const scriptPenalty = scriptCount * 1.5 // 1.5g CO2 per script
    const carbonFootprint = Math.round(baseCarbonFootprint + imagePenalty + scriptPenalty)

    // Calculate energy efficiency (0-100)
    const energyEfficiency = Math.max(0, Math.min(100, 100 - pageSize / 10 - imageCount / 2 - scriptCount))

    // Green hosting detection (basic)
    const greenHostingIndicators = ["green", "renewable", "solar", "wind", "carbon-neutral", "eco-friendly"]
    const hasGreenHosting = greenHostingIndicators.some(
      (indicator) => html.toLowerCase().includes(indicator) || url.toLowerCase().includes(indicator),
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
      carbonFootprint: 50,
      energyEfficiency: 60,
      sustainabilityScore: 55,
      greenHostingScore: 45,
    }
  }
}

function performBasicAnalysis(html: string, url: string, options: AnalysisOptions): Partial<WebsiteData> {
  try {
    const analysis: Partial<WebsiteData> = { url }

    analysis.title = extractTitle(html) || new URL(url).hostname
    analysis.rawData = {
      metaDescription: extractMeta(html, "description"),
      metaKeywords: extractMeta(html, "keywords"),
      h1Texts: extractHeadings(html, 1),
    }

    // Safe text extraction
    let allText = ""
    try {
      allText = html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    } catch (error) {
      console.warn("Error processing HTML text:", error)
      allText = "Content analysis unavailable"
    }

    const pageSize = Math.round(new TextEncoder().encode(html).length / 1024)
    const wordCount = allText.split(" ").filter(Boolean).length
    const headings = extractHeadings(html).length
    const images = (html.match(/<img/gi) || []).length
    const links = (html.match(/<a/gi) || []).length
    const scripts = (html.match(/<script/gi) || []).length
    const styles =
      (html.match(/<link[^>]+rel=["']stylesheet["']/gi) || []).length + (html.match(/<style/gi) || []).length

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

    // Enhanced scoring with sustainability focus
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
        75 + (analysis.rawData.h1Texts!.length > 0 ? 10 : 0) - (images > 10 && !html.includes("alt=") ? 15 : 0),
      ),
    )

    analysis.mobile_friendliness_score = Math.max(
      40,
      Math.min(100, 80 + (html.includes("viewport") ? 10 : 0) - (pageSize > 1000 ? 10 : 0)),
    )

    analysis.ssl_certificate = url.startsWith("https://")
    analysis.analyzedAt = new Date().toISOString()

    // Add sustainability-specific data
    analysis.carbonFootprint = sustainabilityMetrics.carbonFootprint
    analysis.energyEfficiency = sustainabilityMetrics.energyEfficiency
    analysis.greenHostingScore = sustainabilityMetrics.greenHostingScore

    return analysis
  } catch (error) {
    console.error("Error in basic analysis:", error)
    // Return minimal analysis on error
    return {
      url,
      title: "Analysis Error",
      sustainability_score: 50,
      performance_score: 50,
      security_score: 50,
      content_quality_score: 50,
      accessibility_score: 50,
      mobile_friendliness_score: 50,
      ssl_certificate: url.startsWith("https://"),
      analyzedAt: new Date().toISOString(),
      contentStats: {},
      rawData: {},
    }
  }
}

function createGroqPrompt(basicAnalysis: Partial<WebsiteData>, options: AnalysisOptions): string {
  return `
    Analyze the following website data for ${basicAnalysis.url}:
    Title: ${basicAnalysis.title}
    Meta Description: ${basicAnalysis.rawData?.metaDescription || "N/A"}
    H1 Tags: ${basicAnalysis.rawData?.h1Texts?.join(", ") || "N/A"}
    Page Size (KB): ${basicAnalysis.contentStats?.pageSize}
    Word Count: ${basicAnalysis.contentStats?.wordCount}
    Number of Scripts: ${basicAnalysis.contentStats?.scripts}
    Number of Images: ${basicAnalysis.contentStats?.images}
    Carbon Footprint: ${basicAnalysis.carbonFootprint}g CO2
    Energy Efficiency: ${basicAnalysis.energyEfficiency}%

    Initial Scores:
    - Performance: ${basicAnalysis.performance_score}%
    - Security: ${basicAnalysis.security_score}%
    - Sustainability: ${basicAnalysis.sustainability_score}%
    - Content Quality: ${basicAnalysis.content_quality_score}%

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
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
      futurePredictions: Array.isArray(parsed.futurePredictions) ? parsed.futurePredictions : [],
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
    const body = await request.json()
    validateJsonInput(body, ["url"])
    const { url, ...options } = body as { url: string } & AnalysisOptions

    let normalizedUrl = url.trim()
    if (!normalizedUrl.startsWith("http")) normalizedUrl = `https://${normalizedUrl}`

    // Validate URL
    try {
      new URL(normalizedUrl)
    } catch (urlError) {
      throw new SafeError("Invalid URL format", "INVALID_URL", 400)
    }

    console.log(`Starting enhanced sustainability analysis of: ${normalizedUrl}`)

    // 1. Check Cache
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
    const fetchResult = await safeFetch(normalizedUrl, {
      timeout: 20000,
      validateJson: false,
      headers: {
        "User-Agent": "WSfynder-Bot/1.0 (Sustainability Analysis)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        DNT: "1",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
    })

    if (!fetchResult.success || typeof fetchResult.data !== "string") {
      throw new SafeError(
        fetchResult.error ||
          "Failed to fetch website content. The website may be blocking automated requests or temporarily unavailable.",
        "FETCH_ERROR",
        fetchResult.status || 500,
      )
    }

    const htmlContent = fetchResult.data
    console.log(`Successfully fetched ${htmlContent.length} characters from ${normalizedUrl}`)

    // 3. Perform Basic Analysis with enhanced sustainability metrics
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
        console.warn(
          `Groq AI enhancement failed for ${normalizedUrl}: ${aiError.message}. Proceeding with basic analysis.`,
        )
        finalAnalysis.summary = `${basicAnalysis.summary || "Analysis completed"} (AI enhancement unavailable)`
        finalAnalysis.keyPoints = finalAnalysis.keyPoints || [
          "Basic analysis completed",
          "Sustainability metrics calculated",
        ]
        finalAnalysis.keywords = finalAnalysis.keywords || ["website", "sustainability"]
        finalAnalysis.improvements = finalAnalysis.improvements || ["Consider green hosting", "Optimize performance"]
        finalAnalysis.futurePredictions = [
          "Green web technologies will become standard",
          "Carbon-neutral hosting adoption will increase",
        ]
      }
    } else {
      console.warn("GROQ_API_KEY not set. Skipping AI enhancement.")
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

    // 5. Structure final data with enhanced sustainability focus
    const analysisId = randomBytes(12).toString("hex")
    const completeAnalysisData: WebsiteData = {
      _id: analysisId,
      url: normalizedUrl,
      title: finalAnalysis.title || new URL(normalizedUrl).hostname,
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
      sustainability_score: finalAnalysis.sustainability_score,
      performance_score: finalAnalysis.performance_score,
      script_optimization_score: Math.max(0, Math.min(100, (finalAnalysis.performance_score || 50) - 5)),
      content_quality_score: finalAnalysis.content_quality_score,
      security_score: finalAnalysis.security_score,
      accessibility_score: finalAnalysis.accessibility_score,
      mobile_friendliness_score: finalAnalysis.mobile_friendliness_score,
      improvements: finalAnalysis.improvements,
      ssl_certificate: finalAnalysis.ssl_certificate,
      analyzedAt: finalAnalysis.analyzedAt || new Date().toISOString(),
      carbonFootprint: finalAnalysis.carbonFootprint,
      energyEfficiency: finalAnalysis.energyEfficiency,
      greenHostingScore: finalAnalysis.greenHostingScore,
      futurePredictions: finalAnalysis.futurePredictions,
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
    return createErrorResponse(error, "Failed to analyze website. Please check the URL and try again.")
  }
}
