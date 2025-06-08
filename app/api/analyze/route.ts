import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import * as cheerio from "cheerio"
import { lookup } from "dns/promises"

const sql = neon(process.env.DATABASE_URL!)

// Helper functions (extractSecurityHeaders, calculateSecurityScore, detectHostingProvider, generateImprovements, generateAndSaveRecommendations)
// remain largely the same as in your provided context, but their return values might need to feed into the new structure.

// ... (Keep existing helper functions: extractSecurityHeaders, calculateSecurityScore, detectHostingProvider, generateImprovements, generateAndSaveRecommendations)
// You might need to adjust what these helpers return or how their results are used.

export async function POST(request: Request) {
  try {
    const { url, userId } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    let formattedUrl = url
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      formattedUrl = `https://${url}`
    }

    try {
      new URL(formattedUrl)
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    console.log(`Starting analysis of: ${formattedUrl}`)

    const analysisPerformedDate = new Date().toISOString()

    let ipAddress: string | null = null
    let hostingInfoDetected: { id: number; name: string; location: string } | null = null
    let domainHostname = ""
    try {
      domainHostname = new URL(formattedUrl).hostname
      const addresses = await lookup(domainHostname)
      ipAddress = addresses.address
      hostingInfoDetected = await detectHostingProvider(ipAddress, domainHostname)
    } catch (error) {
      console.error("Failed to get IP/hosting info:", error)
    }

    let html = ""
    let responseHeaders: Headers | null = null
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15s timeout

      const fetchResponse = await fetch(formattedUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 WScrapierr/1.0",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
        signal: controller.signal,
        redirect: "follow",
      })
      clearTimeout(timeoutId)

      if (!fetchResponse.ok) {
        throw new Error(`HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`)
      }
      responseHeaders = fetchResponse.headers
      html = await fetchResponse.text()
    } catch (error) {
      console.error(`Failed to fetch ${formattedUrl}:`, error)
      return NextResponse.json(
        {
          error: "Failed to fetch website",
          message: error instanceof Error ? error.message : "Network error",
        },
        { status: 500 },
      )
    }

    const $ = cheerio.load(html)

    // --- Metadata Extraction ---
    const extractedTitle =
      $("title").first().text().trim() ||
      $('meta[property="og:title"]').attr("content")?.trim() ||
      $('meta[name="twitter:title"]').attr("content")?.trim() ||
      $("h1").first().text().trim()
    const extractedDescription =
      $('meta[name="description"]').attr("content")?.trim() ||
      $('meta[property="og:description"]').attr("content")?.trim() ||
      $('meta[name="twitter:description"]').attr("content")?.trim()
    const extractedKeywords =
      $('meta[name="keywords"]')
        .attr("content")
        ?.split(",")
        .map((k) => k.trim())
        .filter(Boolean) || []
    let favicon = $('link[rel="icon"]').attr("href") || $('link[rel="shortcut icon"]').attr("href")
    if (favicon && !favicon.startsWith("http")) {
      favicon = new URL(favicon, formattedUrl).toString()
    }
    const ogImage = $('meta[property="og:image"]').attr("content")?.trim()
    const lang = $("html").attr("lang") || null

    // --- Content Analysis ---
    $("script, style, nav, footer, aside, .advertisement, .ads, header, noscript").remove() // More aggressive removal
    const bodyText = $("body").text().replace(/\s+/g, " ").trim()
    const wordCount = bodyText.split(/\s+/).filter(Boolean).length
    const charCount = bodyText.length
    const headingsCount: Record<string, number> = {}
    $("h1, h2, h3, h4, h5, h6").each((_, el) => {
      const tagName = $(el).prop("tagName").toLowerCase()
      headingsCount[tagName] = (headingsCount[tagName] || 0) + 1
    })
    const imagesCount = $("img").length
    // Placeholder for more advanced content analysis
    const readabilityScore = null // Requires a library
    const sentiment = null // Requires NLP library

    // --- Link Analysis ---
    const internalLinksSet = new Set<string>()
    const externalLinksSet = new Set<string>()
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href")
      if (href) {
        try {
          const absoluteUrl = new URL(href, formattedUrl).toString()
          if (new URL(absoluteUrl).hostname === domainHostname) {
            internalLinksSet.add(absoluteUrl)
          } else {
            externalLinksSet.add(absoluteUrl)
          }
        } catch (e) {
          // Invalid URL
        }
      }
    })
    const internalLinksCount = internalLinksSet.size
    const externalLinksCount = externalLinksSet.size
    // Broken link checking is complex and usually done separately

    // --- Security Info ---
    const securityHeadersExtracted = responseHeaders ? extractSecurityHeaders(responseHeaders) : {}
    const httpsEnabled = formattedUrl.startsWith("https://")
    // SSL info requires more advanced checks (e.g., connecting via 'tls' module or external API)
    const sslIssuer = null
    const sslExpiryDate = null
    const serverSignature = responseHeaders?.get("server") || null

    // --- Performance (Basic from Cheerio, real metrics need Puppeteer/Playwright or PageSpeed API) ---
    const scriptCount = $("script[src]").length // External scripts
    const cssCount = $('link[rel="stylesheet"]').length
    // Placeholder values for detailed performance metrics
    const performanceScoreCalculated = Math.min(100, Math.max(30, 100 - (scriptCount * 2 + imagesCount / 3 + cssCount)))

    // --- Technologies (Basic from Cheerio, real detection needs Wappalyzer-like tool) ---
    const detectedTech: string[] = []
    if ($('script[src*="jquery"]').length > 0) detectedTech.push("jQuery")
    if (html.includes("wp-content") || html.includes("WordPress")) detectedTech.push("WordPress")
    if (html.includes("Shopify")) detectedTech.push("Shopify")
    // Add more basic checks or integrate a library

    // --- Constructing the new WebsiteData structure ---
    const analysisResult = {
      _id: "", // Will be set after DB insert
      url: formattedUrl,
      analysisDate: analysisPerformedDate,

      metadata: {
        title: extractedTitle,
        description: extractedDescription,
        keywords: extractedKeywords.length > 0 ? extractedKeywords : null,
        favicon: favicon || null,
        ogImage: ogImage || null,
        language: lang,
      },
      hosting: {
        provider: hostingInfoDetected?.name || null,
        ipAddress: ipAddress,
        location: hostingInfoDetected?.location || null, // Geolocation would be needed for accuracy
        serverType: serverSignature, // Often includes server type
        asn: null, // Requires IP to ASN lookup
      },
      performance: {
        // These are mostly placeholders, real values need browser context or APIs
        loadTime: null,
        pageSize: Math.round(Buffer.from(html).length / 1024), // Rough page size in KB
        ttfb: null,
        fcp: null,
        lcp: null,
        cls: null,
        speedIndex: null,
        interactiveTime: null,
        httpRequests: scriptCount + cssCount + imagesCount, // Very rough estimate
        lighthouseScore: null,
      },
      security: {
        httpsEnabled: httpsEnabled,
        sslIssuer: sslIssuer,
        sslValidFrom: null,
        sslExpiryDate: sslExpiryDate,
        httpHeaders:
          Object.keys(securityHeadersExtracted).length > 0
            ? Object.entries(securityHeadersExtracted).map(([k, v]) => `${k}: ${v}`)
            : null,
        vulnerabilitiesFound: false, // Placeholder
        vulnerabilities: null, // Placeholder
        mixedContent: $('img[src^="http:"], script[src^="http:"], link[href^="http:"]').length > 0 && httpsEnabled,
        serverSignature: serverSignature,
      },
      sustainability: {
        // Placeholders, requires specific calculation/APIs
        isGreenHosting: null,
        carbonEmissions: null,
        energySource: null,
        pageWeightEcoIndex: null,
      },
      technologies: detectedTech.length > 0 ? detectedTech : null,
      traffic: null, // Requires external API (e.g., SimilarWeb, Semrush)
      domain: {
        // Requires WHOIS lookup or domain info API
        registrar: null,
        registrationDate: null,
        expiryDate: null,
        nameservers: null,
        domainAge: null,
        status: null,
      },
      links: {
        internalLinks: internalLinksCount,
        externalLinks: externalLinksCount,
        brokenLinks: 0, // Placeholder, requires active checking
        nofollowLinks: $('a[rel~="nofollow"]').length,
      },
      contentAnalysis: {
        wordCount: wordCount,
        charCount: charCount,
        readabilityScore: readabilityScore,
        sentiment: sentiment,
        headingsCount: Object.keys(headingsCount).length > 0 ? headingsCount : null,
        imagesCount: imagesCount,
        videosCount: $("video").length + $('iframe[src*="youtube.com"], iframe[src*="vimeo.com"]').length,
        hasSitemapXml: null, // Requires checking /sitemap.xml
        hasRobotsTxt: null, // Requires checking /robots.txt
      },

      // Legacy fields for potential partial compatibility or simpler views
      title: extractedTitle,
      summary: extractedDescription,
      keywords: extractedKeywords,
      performance_score: performanceScoreCalculated, // Example of a legacy score
      // ... other legacy fields can be mapped if necessary
    }

    // Save to Neon database (ensure your DB schema matches this new structure or adapt the insert)
    let analysisId: number | string = Date.now() // Fallback ID
    try {
      // IMPORTANT: Your SQL INSERT statement needs to be updated
      // to match the new 'analysisResult' structure and your database table schema.
      // This is a complex object, so you might store parts of it as JSONB in Postgres.
      // For example, metadata, performance, security etc. could be JSONB columns.
      // Or flatten it if your table has all these columns.

      // Example for a table with a 'data' JSONB column:
      const result = await sql`
        INSERT INTO website_analyzer.analyses (url, user_id, created_at, analysis_data)
        VALUES (${formattedUrl}, ${userId || null}, NOW(), ${JSON.stringify(analysisResult)})
        RETURNING id
      `
      analysisId = result[0].id
      console.log(`Analysis saved to database with ID: ${analysisId}`)
      analysisResult._id = analysisId.toString() // Add the DB ID to the result
    } catch (dbError) {
      console.error("Database error (non-critical):", dbError)
      analysisResult._id = analysisId.toString() // Use fallback ID
    }

    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error("Error analyzing website:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze website",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// --- Helper Functions (ensure they are defined as in your original context) ---
// function extractSecurityHeaders(headers: Headers): Record<string, string> { ... }
// async function detectHostingProvider(ipAddress: string, hostname: string): Promise<{ id: number; name: string; location: string } | null> { ... }
// ... and any other helpers you use.

// Dummy helper functions if not provided in context, replace with your actual ones
function extractSecurityHeaders(headers: Headers): Record<string, string> {
  const securityHeaders: Record<string, string> = {}
  const relevantHeaders = [
    "strict-transport-security",
    "content-security-policy",
    "x-frame-options",
    "x-content-type-options",
    "referrer-policy",
    "permissions-policy",
  ]
  relevantHeaders.forEach((h) => {
    if (headers.has(h)) securityHeaders[h] = headers.get(h)!
  })
  return securityHeaders
}

async function detectHostingProvider(
  ipAddress: string,
  hostname: string,
): Promise<{ id: number; name: string; location: string } | null> {
  // Simplified version from your context
  const providers = [
    { pattern: /amazonaws\.com|aws/, name: "Amazon Web Services", id: 4 },
    { pattern: /googleusercontent\.com|google/, name: "Google Cloud Platform", id: 5 },
    { pattern: /azure|microsoft/, name: "Microsoft Azure", id: 6 },
    { pattern: /cloudflare/, name: "Cloudflare", id: 12 },
  ]
  for (const provider of providers) {
    if (provider.pattern.test(hostname.toLowerCase())) {
      return { id: provider.id, name: provider.name, location: "Unknown" }
    }
  }
  if (ipAddress.startsWith("104.16.") || ipAddress.startsWith("104.17."))
    return { id: 12, name: "Cloudflare", location: "Unknown" } // Example
  return null
}
