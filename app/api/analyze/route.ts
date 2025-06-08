import { NextResponse } from "next/server"

// Define types for website analysis
interface AnalysisRequest {
  url: string
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const body: AnalysisRequest = await request.json()
    const { url } = body

    // Validate URL
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Clean the URL
    const cleanUrl = url.trim().toLowerCase()
    const fullUrl = cleanUrl.startsWith("http") ? cleanUrl : `https://${cleanUrl}`

    try {
      // Try to fetch the website
      const response = await fetch(fullUrl, {
        headers: { "User-Agent": "WSfynder Analysis Bot/1.0" },
        redirect: "follow",
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch website: ${response.status}`)
      }

      const html = await response.text()

      // Extract basic information
      const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || "Unknown Title"
      const description = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)?.[1] || ""
      const favicon = html.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i)?.[1] || ""

      // Count elements
      const scriptCount = (html.match(/<script[^>]*>/g) || []).length
      const styleCount =
        (html.match(/<style[^>]*>/g) || []).length +
        (html.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/g) || []).length
      const imageCount = (html.match(/<img[^>]*>/g) || []).length

      // Calculate page size (approximate)
      const pageSize = html.length
      const pageSizeKB = Math.round(pageSize / 1024)

      // Extract meta tags
      const metaTags: Record<string, string> = {}
      const metaMatches = html.matchAll(/<meta[^>]*name=["']([^"']+)["'][^>]*content=["']([^"']+)["'][^>]*>/gi)
      for (const match of metaMatches) {
        if (match[1] && match[2]) {
          metaTags[match[1]] = match[2]
        }
      }

      // Extract headings
      const h1s = html.match(/<h1[^>]*>([^<]+)<\/h1>/gi) || []
      const headings = h1s.map((h) => h.replace(/<\/?[^>]+(>|$)/g, "").trim()).filter(Boolean)

      // Determine if it's a single page application
      const isSPA = html.includes("react") || html.includes("vue") || html.includes("angular")

      // Determine if it uses a framework
      let framework = "Unknown"
      if (html.includes("react")) framework = "React"
      else if (html.includes("vue")) framework = "Vue"
      else if (html.includes("angular")) framework = "Angular"
      else if (html.includes("next")) framework = "Next.js"
      else if (html.includes("nuxt")) framework = "Nuxt.js"
      else if (html.includes("wordpress")) framework = "WordPress"

      // Calculate performance score (simplified)
      const performanceScore = Math.min(100, Math.max(0, 100 - scriptCount * 2 - pageSizeKB / 100))

      // Calculate SEO score (simplified)
      let seoScore = 50
      if (title) seoScore += 10
      if (description) seoScore += 10
      if (headings.length > 0) seoScore += 10
      if (Object.keys(metaTags).length > 5) seoScore += 10
      if (html.includes("canonical")) seoScore += 10

      // Calculate accessibility score (simplified)
      let accessibilityScore = 70
      if (html.includes("aria-")) accessibilityScore += 10
      if (html.includes("role=")) accessibilityScore += 10
      if (html.includes("alt=")) accessibilityScore += 10

      // Calculate sustainability impact
      const co2PerPage = pageSizeKB * 0.2 // g CO2 per page view (simplified)
      const annualViews = 100000 // Assumed annual page views
      const annualCO2 = (co2PerPage * annualViews) / 1000 // kg CO2 per year
      const treesNeeded = annualCO2 / 21 // Each tree absorbs ~21kg CO2 per year
      const paperSheets = annualCO2 * 100 // Sheets of paper equivalent

      // Determine hosting provider (simplified detection)
      let hostingProvider = "Unknown"
      if (response.headers.get("server")?.includes("Vercel")) hostingProvider = "Vercel"
      else if (response.headers.get("server")?.includes("Netlify")) hostingProvider = "Netlify"
      else if (response.headers.get("server")?.includes("Cloudflare")) hostingProvider = "Cloudflare"
      else if (response.headers.get("server")?.includes("GitHub")) hostingProvider = "GitHub Pages"
      else if (response.headers.get("server")?.includes("Apache")) hostingProvider = "Apache"
      else if (response.headers.get("server")?.includes("nginx")) hostingProvider = "Nginx"
      else if (response.headers.get("server")?.includes("gws")) hostingProvider = "Google Cloud"
      else if (response.headers.get("server")?.includes("AmazonS3")) hostingProvider = "AWS S3"
      else if (response.headers.get("server")?.includes("Microsoft")) hostingProvider = "Azure"

      // Return analysis results
      return NextResponse.json({
        url: fullUrl,
        title,
        description,
        favicon: favicon ? new URL(favicon, fullUrl).href : null,
        metrics: {
          pageSize: pageSizeKB,
          scriptCount,
          styleCount,
          imageCount,
          performanceScore,
          seoScore,
          accessibilityScore,
        },
        content: {
          headings,
          metaTags,
        },
        technical: {
          framework,
          isSPA,
          hostingProvider,
        },
        sustainability: {
          co2PerPage,
          annualCO2,
          treesNeeded,
          paperSheets,
        },
      })
    } catch (fetchError) {
      console.error("Error fetching website:", fetchError)

      // Generate fallback analysis for demonstration
      const domain = new URL(fullUrl).hostname
      const isPopularSite = ["google", "facebook", "amazon", "twitter", "instagram"].some((site) =>
        domain.includes(site),
      )

      // Return fallback analysis
      return NextResponse.json({
        url: fullUrl,
        title: domain,
        description: `Website at ${domain}`,
        favicon: null,
        metrics: {
          pageSize: isPopularSite ? 250 : 500,
          scriptCount: isPopularSite ? 15 : 8,
          styleCount: isPopularSite ? 10 : 5,
          imageCount: isPopularSite ? 20 : 10,
          performanceScore: isPopularSite ? 85 : 70,
          seoScore: isPopularSite ? 95 : 65,
          accessibilityScore: isPopularSite ? 90 : 75,
        },
        content: {
          headings: [`Welcome to ${domain}`],
          metaTags: {
            description: `Website at ${domain}`,
            viewport: "width=device-width, initial-scale=1",
          },
        },
        technical: {
          framework: isPopularSite ? "Custom" : "Unknown",
          isSPA: isPopularSite,
          hostingProvider: isPopularSite ? "Custom Infrastructure" : "Unknown",
        },
        sustainability: {
          co2PerPage: isPopularSite ? 0.5 : 1.2,
          annualCO2: isPopularSite ? 50 : 120,
          treesNeeded: isPopularSite ? 2.4 : 5.7,
          paperSheets: isPopularSite ? 5000 : 12000,
        },
        _fallback: true,
      })
    }
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze website" }, { status: 500 })
  }
}
