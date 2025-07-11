import { NextResponse } from "next/server"
import { SafeError } from "@/utils/error"
import { safeFetch } from "@/utils/fetch"
import { CACHE_KEYS, isRedisAvailable, safeRedisOperation } from "@/utils/redis"
import type { WebsiteData } from "@/types"
import { randomBytes } from "crypto"

export const runtime = "edge"

export async function POST(req: Request): Promise<NextResponse<WebsiteData>> {
  const { url } = await req.json()

  if (!url) {
    throw new SafeError("URL is required", "MISSING_URL", 400)
  }

  const normalizedUrl = url.startsWith("http") ? url : `https://${url}`

  const fetchResult = await safeFetch(normalizedUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; WSfynder/1.0; +https://wsfynder.com)",
    },
  })

  if (!fetchResult.success) {
    // Instead of aborting the whole request (which bubbles up as 500),
    // fall back to an "unreachable-site" skeleton so the client still
    // gets a successful (200) response it can display.

    console.warn(
      `[WSfynder] Content fetch failed for ${normalizedUrl}: ${fetchResult.error}. Returning fallback analysis.`,
    )

    const now = new Date().toISOString()
    const stub: WebsiteData = {
      _id: randomBytes(12).toString("hex"),
      url: normalizedUrl,
      title: "Site unreachable",
      summary:
        "The target website could not be fetched (timeout / 4xx / mixed-content). The data below is a generic placeholder.",
      keyPoints: [],
      keywords: [],
      sustainability: {
        score: 0,
        performance: 0,
        scriptOptimization: 0,
        duplicateContent: 0,
        improvements: [],
      },
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
      accessibility_score: 0,
      mobile_friendliness_score: 0,
      improvements: [],
      ssl_certificate: normalizedUrl.startsWith("https://"),
      analysedAt: now,
      carbonFootprint: 0,
      energyEfficiency: 0,
      greenHostingScore: 0,
      futurePredictions: [],
    }

    // We still cache the stub for a short time so repeated attempts don’t hammer the API
    if (isRedisAvailable()) {
      try {
        await safeRedisOperation(
          (r) => r.setex(CACHE_KEYS.ANALYSIS(normalizedUrl), 60 /* 1 min */, JSON.stringify(stub)),
          null,
          "Failed to cache stub analysis",
        )
      } catch {
        /* non-fatal */
      }
    }

    return NextResponse.json(stub) // ✅ return 200 – prevents front-end 500
  }

  /** rest of code here **/
}
