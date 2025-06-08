import * as cheerio from "cheerio"
import { lookup } from "dns/promises"

interface AnalysisResult {
  _id?: string
  url: string
  title: string | null
  summary: string | null
  key_points: string[]
  keywords: string[]
  sustainability_score: number
  performance_score: number
  content_quality_score: number
  script_optimization_score: number
  improvements: string[]
  content_stats: {
    word_count: number
    char_count: number
    images_count: number
    links_count: number
    headings_count: number
  }
  hosting: {
    provider: string | null
    ipAddress: string | null
    location: string | null
  }
  metadata: {
    title: string | null
    description: string | null
    keywords: string[] | null
    favicon: string | null
    language: string | null
  }
  performance: {
    pageSize: number
    httpRequests: number
    resourceCounts: {
      html: number
      css: number
      js: number
      images: number
      fonts: number
      videos: number
    }
  }
  security: {
    httpsEnabled: boolean
    httpHeaders: Record<string, string> | null
    mixedContent: boolean
    serverSignature: string | null
  }
  technologies: Array<{ name: string; category: string }> | null
  links: {
    internalLinks: number
    externalLinks: number
    nofollowLinks: number
  }
  contentAnalysis: {
    wordCount: number
    charCount: number
    imagesCount: number
    videosCount: number
    headingsStructure: Record<string, Array<{ text: string; level: number }>> | null
  }
}

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
  ]

  commonSecHeaders.forEach((header) => {
    const value = headers.get(header)
    if (value) {
      securityHeaders[header] = value
    }
  })

  return securityHeaders
}

async function detectHostingProvider(
  ipAddress: string,
  hostname: string,
): Promise<{
  provider: string | null
  location: string | null
}> {
  let provider: string | null = null
  const location: string | null = null

  // Basic pattern matching for major providers
  if (hostname.includes("amazonaws.com") || hostname.includes("aws")) {
    provider = "Amazon Web Services"
  } else if (hostname.includes("googleusercontent.com") || hostname.includes("google")) {
    provider = "Google Cloud Platform"
  } else if (hostname.includes("azure") || hostname.includes("microsoft")) {
    provider = "Microsoft Azure"
  } else if (hostname.includes("cloudflare")) {
    provider = "Cloudflare"
  } else if (hostname.includes("digitalocean")) {
    provider = "DigitalOcean"
  } else if (hostname.includes("linode")) {
    provider = "Linode"
  } else if (hostname.includes("vercel.app") || hostname.includes("vercel.com")) {
    provider = "Vercel"
  } else if (hostname.includes("netlify.app") || hostname.includes("netlify.com")) {
    provider = "Netlify"
  }

  return { provider, location }
}

function calculateScores(
  $: cheerio.CheerioAPI,
  html: string,
  responseHeaders: Headers | null,
  httpsEnabled: boolean,
): {
  sustainability_score: number
  performance_score: number
  content_quality_score: number
  script_optimization_score: number
} {
  // Sustainability Score (0-100)
  let sustainabilityScore = 50 // Base score
  const pageSize = Buffer.from(html).length / 1024 // KB
  if (pageSize < 100) sustainabilityScore += 20
  else if (pageSize < 500) sustainabilityScore += 10
  else if (pageSize > 2000) sustainabilityScore -= 20

  const imageCount = $("img").length
  if (imageCount < 10) sustainabilityScore += 10
  else if (imageCount > 50) sustainabilityScore -= 15

  if (httpsEnabled) sustainabilityScore += 10
  if (responseHeaders?.get("content-encoding")?.includes("gzip")) sustainabilityScore += 5

  // Performance Score (0-100)
  let performanceScore = 60 // Base score
  const scriptCount = $("script").length
  const cssCount = $('link[rel="stylesheet"]').length

  if (scriptCount < 5) performanceScore += 15
  else if (scriptCount > 20) performanceScore -= 20

  if (cssCount < 3) performanceScore += 10
  else if (cssCount > 10) performanceScore -= 15

  if (pageSize < 200) performanceScore += 15
  else if (pageSize > 1000) performanceScore -= 25

  if (responseHeaders?.get("cache-control")) performanceScore += 10

  // Content Quality Score (0-100)
  let contentQualityScore = 40 // Base score
  const title = $("title").text().trim()
  const description = $('meta[name="description"]').attr("content")
  const h1Count = $("h1").length
  const wordCount = $("body").text().replace(/\s+/g, " ").trim().split(/\s+/).length

  if (title && title.length > 10 && title.length < 60) contentQualityScore += 15
  if (description && description.length > 50 && description.length < 160) contentQualityScore += 15
  if (h1Count === 1) contentQualityScore += 10
  else if (h1Count === 0 || h1Count > 3) contentQualityScore -= 10

  if (wordCount > 300) contentQualityScore += 15
  if ($("img[alt]").length === imageCount && imageCount > 0) contentQualityScore += 10

  // Script Optimization Score (0-100)
  let scriptOptScore = 70 // Base score
  const inlineScripts = $("script:not([src])").length
  const externalScripts = $("script[src]").length

  if (inlineScripts < 3) scriptOptScore += 15
  else if (inlineScripts > 10) scriptOptScore -= 20

  if (externalScripts < 5) scriptOptScore += 10
  else if (externalScripts > 15) scriptOptScore -= 25

  if ($("script[async], script[defer]").length > 0) scriptOptScore += 5

  return {
    sustainability_score: Math.max(0, Math.min(100, sustainabilityScore)),
    performance_score: Math.max(0, Math.min(100, performanceScore)),
    content_quality_score: Math.max(0, Math.min(100, contentQualityScore)),
    script_optimization_score: Math.max(0, Math.min(100, scriptOptScore)),
  }
}

function generateImprovements(
  $: cheerio.CheerioAPI,
  html: string,
  responseHeaders: Headers | null,
  httpsEnabled: boolean,
): string[] {
  const improvements: string[] = []

  // Security improvements
  if (!httpsEnabled) {
    improvements.push("Enable HTTPS to secure data transmission")
  }

  const securityHeaders = extractSecurityHeaders(responseHeaders || new Headers())
  if (!securityHeaders["strict-transport-security"]) {
    improvements.push("Add HSTS header for enhanced security")
  }
  if (!securityHeaders["content-security-policy"]) {
    improvements.push("Implement Content Security Policy (CSP)")
  }

  // Performance improvements
  const pageSize = Buffer.from(html).length / 1024
  if (pageSize > 1000) {
    improvements.push("Optimize page size - current size is over 1MB")
  }

  const imageCount = $("img").length
  const imagesWithoutAlt = $("img:not([alt])").length
  if (imagesWithoutAlt > 0) {
    improvements.push(`Add alt text to ${imagesWithoutAlt} images for accessibility`)
  }

  if ($("script").length > 15) {
    improvements.push("Reduce number of JavaScript files to improve loading speed")
  }

  if (!responseHeaders?.get("cache-control")) {
    improvements.push("Add caching headers to improve performance")
  }

  // SEO improvements
  const title = $("title").text().trim()
  if (!title) {
    improvements.push("Add a page title for better SEO")
  } else if (title.length > 60) {
    improvements.push("Shorten page title to under 60 characters")
  }

  const description = $('meta[name="description"]').attr("content")
  if (!description) {
    improvements.push("Add meta description for better search engine visibility")
  }

  const h1Count = $("h1").length
  if (h1Count === 0) {
    improvements.push("Add an H1 heading to improve content structure")
  } else if (h1Count > 1) {
    improvements.push("Use only one H1 heading per page")
  }

  // Accessibility improvements
  if (!$("html[lang]").length) {
    improvements.push("Add language attribute to HTML element")
  }

  return improvements
}

export async function analyzeWebsite(url: string): Promise<AnalysisResult | null> {
  try {
    let formattedUrl = url.trim()
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`
    }

    // Validate URL
    try {
      new URL(formattedUrl)
    } catch {
      throw new Error("Invalid URL format")
    }

    console.log(`Starting analysis of: ${formattedUrl}`)

    const baseDomain = new URL(formattedUrl).hostname

    // Get IP address and hosting info
    let ipAddress: string | null = null
    let hostingInfo = { provider: null, location: null }
    try {
      const addresses = await lookup(baseDomain)
      ipAddress = addresses.address
      hostingInfo = await detectHostingProvider(ipAddress, baseDomain)
    } catch (error) {
      console.error("Failed to get IP/hosting info:", error)
    }

    // Fetch website content
    let html = ""
    let responseHeaders: Headers | null = null
    let finalUrl = formattedUrl

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const response = await fetch(formattedUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 WebInsight/1.0",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
        signal: controller.signal,
        redirect: "follow",
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      finalUrl = response.url
      responseHeaders = response.headers
      html = await response.text()
    } catch (error) {
      console.error(`Failed to fetch ${formattedUrl}:`, error)
      throw new Error(`Failed to fetch website: ${error instanceof Error ? error.message : "Network error"}`)
    }

    const $ = cheerio.load(html)

    // Extract metadata
    const title = $("title").first().text().trim() || $('meta[property="og:title"]').attr("content")?.trim() || null
    const description =
      $('meta[name="description"]').attr("content")?.trim() ||
      $('meta[property="og:description"]').attr("content")?.trim() ||
      null
    const keywords =
      $('meta[name="keywords"]')
        .attr("content")
        ?.split(",")
        .map((k) => k.trim())
        .filter(Boolean) || []

    let favicon = $('link[rel="icon"]').attr("href") || $('link[rel="shortcut icon"]').attr("href")
    if (favicon && !favicon.startsWith("http")) {
      favicon = new URL(favicon, finalUrl).toString()
    }

    const language = $("html").attr("lang") || null

    // Content analysis
    $("script, style, nav, footer, aside, .advertisement, .ads, header, noscript").remove()
    const bodyText = $("body").text().replace(/\s+/g, " ").trim()
    const wordCount = bodyText.split(/\s+/).filter(Boolean).length
    const charCount = bodyText.length

    // Headings structure
    const headingsStructure: Record<string, Array<{ text: string; level: number }>> = {}
    $("h1, h2, h3, h4, h5, h6").each((_, el) => {
      const level = Number.parseInt($(el).prop("tagName").substring(1))
      const text = $(el).text().trim()
      const key = `h${level}`
      if (!headingsStructure[key]) headingsStructure[key] = []
      headingsStructure[key].push({ text, level })
    })

    // Link analysis
    const internalLinksSet = new Set<string>()
    const externalLinksSet = new Set<string>()
    let nofollowCount = 0

    $("a[href]").each((_, el) => {
      const href = $(el).attr("href")
      if (href) {
        try {
          const absoluteUrl = new URL(href, finalUrl).toString()
          if (new URL(absoluteUrl).hostname === baseDomain) {
            internalLinksSet.add(absoluteUrl)
          } else {
            externalLinksSet.add(absoluteUrl)
          }
          if ($(el).attr("rel")?.toLowerCase().includes("nofollow")) {
            nofollowCount++
          }
        } catch (e) {
          // Invalid URL, skip
        }
      }
    })

    // Technology detection
    const technologies: Array<{ name: string; category: string }> = []
    if ($('script[src*="jquery"]').length) technologies.push({ name: "jQuery", category: "JavaScript Library" })
    if (html.includes("wp-content")) technologies.push({ name: "WordPress", category: "CMS" })
    if (html.includes("Shopify")) technologies.push({ name: "Shopify", category: "eCommerce" })
    if ($('script[src*="react"]').length) technologies.push({ name: "React", category: "JavaScript Framework" })
    if ($('script[src*="vue"]').length) technologies.push({ name: "Vue.js", category: "JavaScript Framework" })
    if (responseHeaders?.get("server")?.toLowerCase().includes("nginx")) {
      technologies.push({ name: "Nginx", category: "Web Server" })
    }

    const httpsEnabled = finalUrl.startsWith("https://")
    const securityHeaders = responseHeaders ? extractSecurityHeaders(responseHeaders) : {}
    const scores = calculateScores($, html, responseHeaders, httpsEnabled)
    const improvements = generateImprovements($, html, responseHeaders, httpsEnabled)

    // Generate key points
    const keyPoints: string[] = []
    if (title) keyPoints.push(`Page title: "${title}"`)
    if (description) keyPoints.push(`Meta description available (${description.length} characters)`)
    keyPoints.push(`Content contains ${wordCount} words and ${$("img").length} images`)
    keyPoints.push(`${httpsEnabled ? "Secure HTTPS" : "Insecure HTTP"} connection`)
    if (hostingInfo.provider) keyPoints.push(`Hosted on ${hostingInfo.provider}`)
    keyPoints.push(`Performance score: ${scores.performance_score}/100`)

    const analysisResult: AnalysisResult = {
      url: finalUrl,
      title,
      summary: description,
      key_points: keyPoints,
      keywords,
      ...scores,
      improvements,
      content_stats: {
        word_count: wordCount,
        char_count: charCount,
        images_count: $("img").length,
        links_count: internalLinksSet.size + externalLinksSet.size,
        headings_count: $("h1, h2, h3, h4, h5, h6").length,
      },
      hosting: {
        provider: hostingInfo.provider,
        ipAddress,
        location: hostingInfo.location,
      },
      metadata: {
        title,
        description,
        keywords: keywords.length > 0 ? keywords : null,
        favicon,
        language,
      },
      performance: {
        pageSize: Math.round(Buffer.from(html).length / 1024),
        httpRequests: $("script[src]").length + $('link[rel="stylesheet"]').length + $("img").length,
        resourceCounts: {
          html: 1,
          css: $('link[rel="stylesheet"]').length,
          js: $("script").length,
          images: $("img").length,
          fonts: $('link[as="font"]').length,
          videos: $("video").length,
        },
      },
      security: {
        httpsEnabled,
        httpHeaders: Object.keys(securityHeaders).length > 0 ? securityHeaders : null,
        mixedContent: httpsEnabled && $('img[src^="http:"], script[src^="http:"], link[href^="http:"]').length > 0,
        serverSignature: responseHeaders?.get("server") || null,
      },
      technologies: technologies.length > 0 ? technologies : null,
      links: {
        internalLinks: internalLinksSet.size,
        externalLinks: externalLinksSet.size,
        nofollowLinks: nofollowCount,
      },
      contentAnalysis: {
        wordCount,
        charCount,
        imagesCount: $("img").length,
        videosCount: $("video").length + $('iframe[src*="youtube.com"], iframe[src*="vimeo.com"]').length,
        headingsStructure: Object.keys(headingsStructure).length > 0 ? headingsStructure : null,
      },
    }

    return analysisResult
  } catch (error) {
    console.error("Error in analyzeWebsite:", error)
    return null
  }
}
