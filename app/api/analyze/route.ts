import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { sql, safeDbOperation, isNeonAvailable } from "@/lib/neon-db"
import { safeRedisOperation, CACHE_KEYS, CACHE_TTL, isRedisAvailable } from "@/lib/upstash-redis"
import { randomBytes } from "crypto"
import { createErrorResponse, validateJsonInput, SafeError } from "@/lib/error-handler"
import { safeFetch } from "@/lib/safe-fetch"
import type { WebsiteData, AnalysisOptions } from "@/types/website-data"

// Basic HTML parsing functions (can be expanded or replaced with a library)
const extractText = (html: string, regex: RegExp, group = 1): string[] =>
  Array.from(html.matchAll(regex), (m) => m[group]?.trim()).filter(Boolean) as string[]

const extractAttribute = (html: string, regex: RegExp, attributeRegex: RegExp): string[] =>
  Array.from(html.matchAll(regex), (m) => m[0].match(attributeRegex)?.[1]?.trim()).filter(Boolean) as string[]

const extractTitle = (html: string): string => extractText(html, /<title[^>]*>([^<]+)<\/title>/i)[0] || ""
const extractHeadings = (html: string, level?: number): string[] =>
  level
    ? extractText(html, new RegExp(`<h${level}[^>]*>([^<]+)<\/h${level}>`, "gi"))
    : extractText(html, /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi)
const extractMeta = (html: string, name: string): string =>
  html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, "i"))?.[1]?.trim() || ""

function performBasicAnalysis(html: string, url: string, options: AnalysisOptions): Partial<WebsiteData> {
  const analysis: Partial<WebsiteData> = { url }

  analysis.title = extractTitle(html) || new URL(url).hostname
  analysis.rawData = {
    metaDescription: extractMeta(html, "description"),
    metaKeywords: extractMeta(html, "keywords"),
    h1Texts: extractHeadings(html, 1),
  }

  const allText = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  analysis.contentStats = {
    pageSize: Math.round(new TextEncoder().encode(html).length / 1024), // Size in KB
    wordCount: allText.split(" ").filter(Boolean).length,
    headings: extractHeadings(html).length,
    images: (html.match(/<img/gi) || []).length,
    links: (html.match(/<a/gi) || []).length,
    scripts: (html.match(/<script/gi) || []).length,
    styles: (html.match(/<link[^>]+rel=["']stylesheet["']/gi) || []).length + (html.match(/<style/gi) || []).length,
  }

  // Basic scoring (can be much more sophisticated)
  analysis.performance_score =
    70 + (analysis.contentStats.scripts! < 10 ? 10 : 0) + (analysis.contentStats.pageSize! < 500 ? 10 : 0)
  analysis.security_score = url.startsWith("https://") ? 80 : 50
  analysis.sustainability_score =
    75 - (analysis.contentStats.pageSize! > 1000 ? 10 : 0) - (analysis.contentStats.images! > 20 ? 5 : 0)
  analysis.content_quality_score =
    70 + (analysis.rawData.metaDescription ? 5 : 0) + (analysis.rawData.h1Texts!.length > 0 ? 5 : 0)

  // Ensure scores are within 0-100
  Object.keys(analysis).forEach((key) => {
    if (key.endsWith("_score")) {
      analysis[key as keyof WebsiteData] = Math.max(0, Math.min(100, analysis[key as keyof WebsiteData] as number))
    }
  })

  analysis.ssl_certificate = url.startsWith("https://")
  analysis.analyzedAt = new Date().toISOString()
  return analysis
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

    Initial Scores:
    - Performance: ${basicAnalysis.performance_score}%
    - Security: ${basicAnalysis.security_score}%
    - Sustainability: ${basicAnalysis.sustainability_score}%
    - Content Quality: ${basicAnalysis.content_quality_score}%

    Based on this data and general web best practices, provide:
    1. A concise overall summary (2-3 sentences).
    2. 3-5 key positive findings.
    3. 3-5 key areas for improvement.
    4. 5-7 relevant keywords for the site's content.
    5. Refined scores (0-100) for: sustainability_score, performance_score, security_score, content_quality_score, accessibility_score, mobile_friendliness_score.
    6. A list of 3-5 specific, actionable improvement suggestions.

    Return your response strictly as a JSON object with the following keys: "summary", "keyPoints" (array of strings for positive findings), "areasForImprovement" (array of strings), "keywords" (array of strings), "refined_scores" (an object with score keys), "improvements" (array of strings for actionable suggestions).
  `
}

function parseGroqResponse(text: string, basicAnalysis: Partial<WebsiteData>): Partial<WebsiteData> {
  try {
    const parsed = JSON.parse(text)
    return {
      summary: parsed.summary || basicAnalysis.summary || "AI analysis complete.",
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
      // Update scores from AI if provided and valid
      sustainability_score:
        typeof parsed.refined_scores?.sustainability_score === "number"
          ? parsed.refined_scores.sustainability_score
          : basicAnalysis.sustainability_score,
      performance_score:
        typeof parsed.refined_scores?.performance_score === "number"
          ? parsed.refined_scores.performance_score
          : basicAnalysis.performance_score,
      security_score:
        typeof parsed.refined_scores?.security_score === "number"
          ? parsed.refined_scores.security_score
          : basicAnalysis.security_score,
      content_quality_score:
        typeof parsed.refined_scores?.content_quality_score === "number"
          ? parsed.refined_scores.content_quality_score
          : basicAnalysis.content_quality_score,
      accessibility_score:
        typeof parsed.refined_scores?.accessibility_score === "number" ? parsed.refined_scores.accessibility_score : 70, // Default if not provided
      mobile_friendliness_score:
        typeof parsed.refined_scores?.mobile_friendliness_score === "number"
          ? parsed.refined_scores.mobile_friendliness_score
          : 75, // Default
    }
  } catch (e) {
    console.error("Error parsing Groq JSON response:", e)
    // Fallback to basic summary if parsing fails
    return {
      summary: `AI analysis could not be fully parsed. Basic summary: ${basicAnalysis.summary || "Analysis performed."}`,
      keyPoints: [],
      keywords: [],
      improvements: ["Review AI prompt for JSON structure if this error persists."],
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
    new URL(normalizedUrl) // Validate

    // 1. Check Cache
    if (isRedisAvailable()) {
      const cachedData = await safeRedisOperation((r) => r.get<WebsiteData>(CACHE_KEYS.ANALYSIS(normalizedUrl)), null)
      if (cachedData) {
        console.log(`Cache hit for ${normalizedUrl}`)
        return NextResponse.json(cachedData)
      }
    }

    // 2. Fetch Website Content
    const fetchResult = await safeFetch(normalizedUrl, { timeout: 15000, validateJson: false })
    if (!fetchResult.success || typeof fetchResult.data !== "string") {
      throw new SafeError(
        fetchResult.error || "Failed to fetch website content",
        "FETCH_ERROR",
        fetchResult.status || 500,
      )
    }
    const htmlContent = fetchResult.data

    // 3. Perform Basic Analysis
    const basicAnalysis = performBasicAnalysis(htmlContent, normalizedUrl, options)

    // 4. AI Enhancement (Groq)
    let finalAnalysis: Partial<WebsiteData> = basicAnalysis
    if (process.env.GROQ_API_KEY) {
      try {
        const groqPrompt = createGroqPrompt(basicAnalysis, options)
        const { text: groqText } = await generateText({
          model: groq("llama3-70b-8192"), // Ensure this model is available
          prompt: groqPrompt,
          maxTokens: 1500,
        })
        const aiEnhancements = parseGroqResponse(groqText, basicAnalysis)
        finalAnalysis = { ...basicAnalysis, ...aiEnhancements }
      } catch (aiError: any) {
        console.warn(
          `Groq AI enhancement failed for ${normalizedUrl}: ${aiError.message}. Proceeding with basic analysis.`,
        )
        // finalAnalysis will remain as basicAnalysis
      }
    } else {
      console.warn("GROQ_API_KEY not set. Skipping AI enhancement.")
      finalAnalysis.summary = finalAnalysis.summary || "Basic analysis complete. AI enhancement skipped."
      finalAnalysis.keyPoints = finalAnalysis.keyPoints || []
      finalAnalysis.keywords = finalAnalysis.keywords || []
      finalAnalysis.improvements = finalAnalysis.improvements || []
    }

    // 5. Structure final data
    const analysisId = randomBytes(12).toString("hex")
    const completeAnalysisData: WebsiteData = {
      _id: analysisId,
      url: normalizedUrl,
      title: finalAnalysis.title || new URL(normalizedUrl).hostname,
      summary: finalAnalysis.summary || "Analysis complete.",
      keyPoints: finalAnalysis.keyPoints || [],
      keywords: finalAnalysis.keywords || [],
      sustainability: {
        // Populate this based on scores or more detailed AI output
        score: finalAnalysis.sustainability_score || 0,
        performance: finalAnalysis.performance_score || 0, // Example, might need specific AI field
        scriptOptimization: finalAnalysis.script_optimization_score || 0, // Example
        duplicateContent: 0, // Placeholder
        improvements: finalAnalysis.improvements?.filter((imp) => imp.toLowerCase().includes("sustainab")) || [],
      },
      contentStats: finalAnalysis.contentStats || {},
      rawData: finalAnalysis.rawData, // Already populated in basicAnalysis
      sustainability_score: finalAnalysis.sustainability_score,
      performance_score: finalAnalysis.performance_score,
      script_optimization_score: finalAnalysis.script_optimization_score, // This might be redundant if covered by performance
      content_quality_score: finalAnalysis.content_quality_score,
      security_score: finalAnalysis.security_score,
      accessibility_score: finalAnalysis.accessibility_score,
      mobile_friendliness_score: finalAnalysis.mobile_friendliness_score,
      improvements: finalAnalysis.improvements,
      ssl_certificate: finalAnalysis.ssl_certificate,
      analyzedAt: finalAnalysis.analyzedAt || new Date().toISOString(),
    }

    // 6. Save to DB (Neon)
    if (isNeonAvailable()) {
      await safeDbOperation(
        () => sql`
                INSERT INTO website_analyses (id, url, title, summary, data_json, created_at)
                VALUES (${analysisId}, ${normalizedUrl}, ${completeAnalysisData.title}, ${completeAnalysisData.summary}, ${JSON.stringify(completeAnalysisData)}, NOW())
            `,
        null,
        "Failed to save analysis to DB",
      )
    }

    // 7. Cache Result
    if (isRedisAvailable()) {
      await safeRedisOperation(
        (r) => r.setex(CACHE_KEYS.ANALYSIS(normalizedUrl), CACHE_TTL.ANALYSIS, JSON.stringify(completeAnalysisData)),
        null,
        "Failed to cache analysis",
      )
    }

    return NextResponse.json(completeAnalysisData)
  } catch (error) {
    return createErrorResponse(error, "Failed to analyze website")
  }
}
