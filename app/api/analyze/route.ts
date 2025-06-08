import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import * as cheerio from "cheerio"
import { lookup } from "dns/promises"
import type {
  WebsiteData,
  Metadata,
  HostingInfo,
  PerformanceMetrics,
  SecurityInfo,
  SustainabilityInfo,
  Technology,
  DomainInfo,
  LinkInfo,
  ContentAnalysis,
  AccessibilityInfo,
  MobileFriendliness,
  SocialPresence,
} from "@/types/website-data" // Ensure this path is correct

const sql = neon(process.env.DATABASE_URL!)

// --- Helper Functions (some might need to be more advanced for new data points) ---

function extractSecurityHeaders(headers: Headers): Record<string, string> {
  const securityHeaders: Record<string, string> = {}
  const commonSecHeaders = [
    "strict-transport-security",
    "content-security-policy",
    "x-frame-options",
    "x-content-type-options",
    "referrer-policy",
    "permissions-policy",
    "x-xss-protection",
    "cross-origin-opener-policy",
    "cross-origin-embedder-policy",
    "cross-origin-resource-policy",
  ]
  commonSecHeaders.forEach((header) => {
    if (headers.has(header)) {
      securityHeaders[header.toLowerCase()] = headers.get(header)!
    }
  })
  return securityHeaders
}

async function detectHostingProvider(ipAddress: string, hostname: string): Promise<Partial<HostingInfo>> {
  // This is a simplified detection. Real-world would use IP geolocation APIs and ASN lookups.
  let provider: string | null = null
  const location: string | null = null
  const countryCode: string | null = null

  // Basic pattern matching for major providers
  if (hostname.includes("amazonaws.com") || hostname.includes("aws")) provider = "Amazon Web Services"
  else if (hostname.includes("googleusercontent.com") || hostname.includes("google")) provider = "Google Cloud Platform"
  else if (hostname.includes("azure") || hostname.includes("microsoft")) provider = "Microsoft Azure"
  else if (hostname.includes("cloudflare")) provider = "Cloudflare"
  else if (hostname.includes("digitalocean")) provider = "DigitalOcean"
  else if (hostname.includes("linode")) provider = "Linode"
  else if (hostname.includes("vercel.app") || hostname.includes("vercel.com")) provider = "Vercel"
  else if (hostname.includes("netlify.app") || hostname.includes("netlify.com")) provider = "Netlify"

  // Placeholder for actual IP Geolocation API call
  // For example: const geoData = await fetch(`https://ipapi.co/${ipAddress}/json/`).then(res => res.json());
  // location = `${geoData.city}, ${geoData.region}, ${geoData.country_name}`;
  // countryCode = geoData.country_code;
  // ipOrganization = geoData.org;
  // asn = geoData.asn;

  return { provider, ipAddress, location, countryCode }
}

function extractSocialLinks($: cheerio.CheerioAPI, baseDomain: string): SocialPresence {
  const socialPresence: SocialPresence = {}
  const socialPatterns: Record<keyof SocialPresence, RegExp> = {
    facebook: /facebook\.com\/[a-zA-Z0-9._-]+/i,
    twitter: /twitter\.com\/[a-zA-Z0-9_]+/i,
    linkedin: /linkedin\.com\/(in|company)\/[a-zA-Z0-9._-]+/i,
    instagram: /instagram\.com\/[a-zA-Z0-9._-]+/i,
    youtube: /youtube\.com\/(user|channel|c)\/[a-zA-Z0-9_-]+/i,
  }

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href")
    if (href) {
      for (const platform in socialPatterns) {
        if (socialPatterns[platform as keyof SocialPresence].test(href)) {
          if (!socialPresence[platform as keyof SocialPresence]) {
            // Take the first match
            socialPresence[platform as keyof SocialPresence] = href
          }
        }
      }
    }
  })
  return socialPresence
}

export async function POST(request: Request) {
  try {
    const { url: rawUrl, userId } = await request.json()

    if (!rawUrl) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    let formattedUrl = rawUrl.trim()
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`
    }

    try {
      new URL(formattedUrl)
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    console.log(`Starting comprehensive analysis of: ${formattedUrl}`)
    const analysisDate = new Date().toISOString()
    const baseDomain = new URL(formattedUrl).hostname

    // --- Initial Network Requests ---
    let ipAddress: string | null = null
    let hostingInfoPartial: Partial<HostingInfo> = {}
    try {
      const addresses = await lookup(baseDomain)
      ipAddress = addresses.address
      hostingInfoPartial = await detectHostingProvider(ipAddress, baseDomain)
    } catch (e) {
      console.error("IP/Hostname lookup failed:", e)
    }

    let html = ""
    let responseHeaders: Headers | null = null
    let finalUrlAfterRedirects = formattedUrl // Track final URL after redirects
    let statusCode: number | null = null

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 20000) // 20s timeout

      const fetchResponse = await fetch(formattedUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 WScrapierr/1.0 (+https://wscrapierr.com/bot)",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        signal: controller.signal,
        redirect: "follow",
      })
      clearTimeout(timeoutId)

      finalUrlAfterRedirects = fetchResponse.url // Update with final URL
      statusCode = fetchResponse.status
      responseHeaders = fetchResponse.headers
      html = await fetchResponse.text()

      if (!fetchResponse.ok) {
        console.warn(`HTTP Error ${statusCode} for ${formattedUrl}`)
        // Continue analysis if HTML is available, otherwise throw
        if (!html) throw new Error(`HTTP ${statusCode}: ${fetchResponse.statusText}`)
      }
    } catch (error) {
      console.error(`Failed to fetch ${formattedUrl}:`, error)
      return NextResponse.json(
        { error: "Failed to fetch website", message: error instanceof Error ? error.message : "Network error" },
        { status: 500 },
      )
    }

    const $ = cheerio.load(html)

    // --- Metadata Extraction ---
    const metadata: Metadata = {
      title: $("title").first().text().trim() || $('meta[property="og:title"]').attr("content")?.trim() || null,
      description:
        $('meta[name="description"]').attr("content")?.trim() ||
        $('meta[property="og:description"]').attr("content")?.trim() ||
        null,
      keywords:
        $('meta[name="keywords"]')
          .attr("content")
          ?.split(",")
          .map((k) => k.trim())
          .filter(Boolean) || null,
      favicon:
        $('link[rel="icon"]').attr("href") || $('link[rel="shortcut icon"]').attr("href")
          ? new URL(
              $('link[rel="icon"]').attr("href") || $('link[rel="shortcut icon"]').attr("href")!,
              finalUrlAfterRedirects,
            ).toString()
          : null,
      ogImage: $('meta[property="og:image"]').attr("content")?.trim() || null,
      language: $("html").attr("lang") || null,
      canonicalUrl: $('link[rel="canonical"]').attr("href")
        ? new URL($('link[rel="canonical"]').attr("href")!, finalUrlAfterRedirects).toString()
        : null,
      charSet:
        $("meta[charset]").attr("charset") ||
        $('meta[http-equiv="Content-Type"]')
          .attr("content")
          ?.match(/charset=([^;]+)/)?.[1]
          ?.trim() ||
        null,
      viewport: $('meta[name="viewport"]').attr("content") || null,
      themeColor: $('meta[name="theme-color"]').attr("content") || null,
      robots: $('meta[name="robots"]').attr("content") || null,
      generator: $('meta[name="generator"]').attr("content") || null,
      jsonLd: $('script[type="application/ld+json"]')
        .map((_, el) => {
          try {
            return JSON.parse($(el).html()!)
          } catch {
            return null
          }
        })
        .get()
        .filter(Boolean),
      dublinCore: {}, // Placeholder for DC tags
    }
    $('meta[name^="DC."]').each((_, el) => {
      const name = $(el).attr("name")?.substring(3) // Remove "DC."
      const content = $(el).attr("content")
      if (name && content) {
        if (metadata.dublinCore![name]) {
          if (Array.isArray(metadata.dublinCore![name])) {
            ;(metadata.dublinCore![name] as string[]).push(content)
          } else {
            metadata.dublinCore![name] = [metadata.dublinCore![name] as string, content]
          }
        } else {
          metadata.dublinCore![name] = content
        }
      }
    })

    // --- Hosting Info (enriching partial info) ---
    const hosting: HostingInfo = {
      ...hostingInfoPartial,
      serverType: responseHeaders?.get("server") || null,
      // ASN, ipOrganization, more detailed location would require external IP intelligence API
    }

    // --- Performance Metrics (Cheerio-based are very basic) ---
    const performance: PerformanceMetrics = {
      pageSize: Math.round(Buffer.from(html).length / 1024),
      httpRequests: $("script[src]").length + $('link[rel="stylesheet"]').length + $("img").length, // Very rough
      resourceCounts: {
        html: 1,
        css: $('link[rel="stylesheet"]').length,
        js: $("script").length, // Includes inline
        images: $("img").length,
        fonts: $('link[as="font"]').length + (html.match(/@font-face/g) || []).length,
        videos: $("video").length,
      },
      compression: {
        usesGzip: responseHeaders?.get("content-encoding")?.includes("gzip") || false,
        usesBrotli: responseHeaders?.get("content-encoding")?.includes("br") || false,
      },
      caching: {
        hasCachingHeaders: !!responseHeaders?.get("cache-control"),
        cachePolicy: responseHeaders?.get("cache-control") || null,
      },
      // lighthouseScore, loadTime, TTFB, FCP, LCP, CLS, SpeedIndex, InteractiveTime require browser context (e.g. Puppeteer + Lighthouse)
    }

    // --- Security Info ---
    const securityHeaders = responseHeaders ? extractSecurityHeaders(responseHeaders) : {}
    const security: SecurityInfo = {
      httpsEnabled: finalUrlAfterRedirects.startsWith("https://"),
      httpHeaders: Object.keys(securityHeaders).length > 0 ? securityHeaders : null,
      mixedContent:
        finalUrlAfterRedirects.startsWith("https://") &&
        $('img[src^="http:"], script[src^="http:"], link[href^="http:"]').length > 0,
      serverSignature: responseHeaders?.get("server") || null,
      csp: securityHeaders["content-security-policy"] || null,
      hsts: !!securityHeaders["strict-transport-security"],
      cookies:
        responseHeaders
          ?.get("set-cookie")
          ?.split(",")
          .map((cookieStr) => {
            const parts = cookieStr.split(";").map((p) => p.trim())
            const [nameValue] = parts[0].split("=")
            return {
              name: nameValue,
              secure: parts.some((p) => p.toLowerCase() === "secure"),
              httpOnly: parts.some((p) => p.toLowerCase() === "httponly"),
              sameSite: parts.find((p) => p.toLowerCase().startsWith("samesite="))?.split("=")[1] || undefined,
            }
          }) || null,
      // SSL Issuer, Expiry, TLS Version, Vulnerabilities require dedicated tools or libraries
    }

    // --- Sustainability Info (Placeholders) ---
    const sustainability: SustainabilityInfo = {
      // Requires external data/APIs (e.g., The Green Web Foundation, CO2.js)
      isGreenHosting: null, // Could check hosting.provider against a list of known green hosts
      carbonEmissions: null, // Estimate based on performance.pageSize and hosting.energySource
      dataTransferBytes: Buffer.from(html).length,
    }

    // --- Technologies (Basic detection) ---
    const technologies: Technology[] = []
    if (metadata.generator) technologies.push({ name: metadata.generator, category: "CMS/Generator" })
    if ($('script[src*="jquery"]').length) technologies.push({ name: "jQuery", category: "JavaScript Library" })
    if (html.includes("wp-content")) technologies.push({ name: "WordPress", category: "CMS" })
    if (html.includes("Shopify") || baseDomain.includes("myshopify.com"))
      technologies.push({ name: "Shopify", category: "eCommerce" })
    if ($('script[src*="react"]').length || $("[data-reactroot]").length)
      technologies.push({ name: "React", category: "JavaScript Framework" })
    if ($('script[src*="vue"]').length || $("[data-v-app]").length)
      technologies.push({ name: "Vue.js", category: "JavaScript Framework" })
    if ($('script[src*="angular"]').length) technologies.push({ name: "Angular", category: "JavaScript Framework" })
    if (responseHeaders?.get("server")?.toLowerCase().includes("nginx"))
      technologies.push({ name: "Nginx", category: "Web Server" })
    if (responseHeaders?.get("server")?.toLowerCase().includes("apache"))
      technologies.push({ name: "Apache HTTP Server", category: "Web Server" })
    if (responseHeaders?.get("server")?.toLowerCase().includes("cloudflare"))
      technologies.push({ name: "Cloudflare", category: "CDN/Proxy" })
    if (responseHeaders?.get("x-powered-by"))
      technologies.push({ name: responseHeaders.get("x-powered-by")!, category: "Backend Language/Framework" })

    // --- Domain Info (Placeholders, requires WHOIS) ---
    const domain: DomainInfo = {
      // Requires WHOIS lookup service
    }

    // --- Link Info ---
    const internalLinksSet = new Set<string>()
    const externalLinksSet = new Set<string>()
    let nofollowCount = 0
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href")
      if (href) {
        try {
          const absoluteUrl = new URL(href, finalUrlAfterRedirects).toString()
          if (new URL(absoluteUrl).hostname === baseDomain) {
            internalLinksSet.add(absoluteUrl)
          } else {
            externalLinksSet.add(absoluteUrl)
          }
          if ($(el).attr("rel")?.toLowerCase().includes("nofollow")) {
            nofollowCount++
          }
        } catch (e) {
          /* ignore invalid URLs */
        }
      }
    })
    const links: LinkInfo = {
      internalLinks: internalLinksSet.size,
      externalLinks: externalLinksSet.size,
      nofollowLinks: nofollowCount,
      // Broken link checking is an extensive process, not done here
    }

    // --- Content Analysis ---
    const tempContentEl = $("<div>").html($.html($("body").clone())) // Create a copy for manipulation
    tempContentEl
      .find(
        "script, style, noscript, nav, footer, aside, header, form, button, input, textarea, select, .ad, .advertisement, .popup, .modal, .menu, .sidebar, .social-links, .share-buttons, .comments-section, #comments",
      )
      .remove()
    const mainContentText = tempContentEl.text().replace(/\s+/g, " ").trim()

    const headingsStructure: ContentAnalysis["headingsStructure"] = {}
    $("h1, h2, h3, h4, h5, h6").each((_, el) => {
      const level = Number.parseInt($(el).prop("tagName").substring(1))
      const text = $(el).text().trim()
      if (!headingsStructure![`h${level}`]) headingsStructure![`h${level}`] = []
      headingsStructure![`h${level}`].push({ text, level })
    })

    const imagesMissingAlt = $('img:not([alt]), img[alt=""]').length

    const contentAnalysis: ContentAnalysis = {
      wordCount: mainContentText.split(/\s+/).filter(Boolean).length,
      charCount: mainContentText.length,
      headingsStructure: Object.keys(headingsStructure).length > 0 ? headingsStructure : null,
      imagesCount: $("img").length,
      imagesMissingAlt: imagesMissingAlt,
      videosCount: $("video").length + $('iframe[src*="youtube.com"], iframe[src*="vimeo.com"]').length,
      // Readability, Sentiment, Sitemap, Robots.txt require more specific logic or fetching additional files
      hasRobotsTxt: null, // Placeholder: would need to fetch /robots.txt
      hasSitemapXml: null, // Placeholder: would need to fetch /sitemap.xml
    }

    // --- Accessibility Info (Basic Checks) ---
    const accessibility: AccessibilityInfo = {
      imageAltTextCoverage: contentAnalysis.imagesCount
        ? Math.round(((contentAnalysis.imagesCount - imagesMissingAlt) / contentAnalysis.imagesCount) * 100)
        : null,
      ariaAttributesPresent: $("[aria-label], [aria-labelledby], [role]").length > 0,
      formLabelCoverage: null, // More complex to calculate accurately with Cheerio
      // Contrast, Keyboard Nav requires browser rendering context
    }

    // --- Mobile Friendliness (Basic Checks) ---
    const mobileFriendliness: MobileFriendliness = {
      viewportMetaPresent: !!metadata.viewport,
      isMobileFriendly: !!metadata.viewport && metadata.viewport.includes("width=device-width"), // Very basic check
    }

    // --- Social Presence ---
    const socialPresence = extractSocialLinks($, baseDomain)

    // --- Construct Final Result ---
    const analysisResult: WebsiteData = {
      _id: "", // Will be set after DB insert
      url: finalUrlAfterRedirects,
      analysisDate,
      metadata,
      hosting,
      performance,
      security,
      sustainability,
      technologies: technologies.length > 0 ? technologies : null,
      domain, // Mostly null unless WHOIS is integrated
      links,
      contentAnalysis,
      accessibility,
      mobileFriendliness,
      socialPresence: Object.keys(socialPresence).length > 0 ? socialPresence : null,
      traffic: null, // Requires external API

      // Legacy fields for summary
      title: metadata.title,
      summary: metadata.description,
      keywords: metadata.keywords,
    }

    // --- Database Insert ---
    let analysisId: number | string = Date.now().toString() // Fallback ID
    try {
      // IMPORTANT: Your SQL INSERT statement needs to be updated
      // to match the new 'analysisResult' structure and your database table schema.
      // Storing complex objects as JSONB is recommended.
      const dbResult = await sql`
        INSERT INTO website_analyzer.analyses (url, user_id, created_at, analysis_data, status_code)
        VALUES (${finalUrlAfterRedirects}, ${userId || null}, NOW(), ${JSON.stringify(analysisResult)}, ${statusCode})
        RETURNING id
      `
      analysisId = dbResult[0].id
      analysisResult._id = analysisId.toString()
      console.log(`Analysis saved to database with ID: ${analysisId}`)
    } catch (dbError) {
      console.error("Database error (non-critical):", dbError)
      analysisResult._id = analysisId.toString() // Use fallback ID
    }

    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error("Critical error in /api/analyze:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze website due to a critical server error",
        message: error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 },
    )
  }
}
