import { NextResponse } from "next/server"
import { publicIpv4 } from "public-ip"

// Add this function to improve hosting detection
function detectHostingProvider(headers: any, ip: string, domain: string): string {
  const serverHeader = headers.server?.toLowerCase() || ""
  const xPoweredBy = headers["x-powered-by"]?.toLowerCase() || ""
  const cfRay = headers["cf-ray"]
  const xVercelId = headers["x-vercel-id"]
  const xAmznRequestId = headers["x-amzn-requestid"]

  // Enhanced hosting detection patterns
  const hostingPatterns = [
    { pattern: /cloudflare|cf-ray/i, name: "Cloudflare" },
    { pattern: /vercel|x-vercel/i, name: "Vercel" },
    { pattern: /netlify/i, name: "Netlify" },
    { pattern: /amazonaws|aws|amazon/i, name: "Amazon AWS" },
    { pattern: /google|gcp|appengine/i, name: "Google Cloud" },
    { pattern: /azure|microsoft/i, name: "Microsoft Azure" },
    { pattern: /digitalocean/i, name: "DigitalOcean" },
    { pattern: /hostinger/i, name: "Hostinger" },
    { pattern: /godaddy/i, name: "GoDaddy" },
    { pattern: /namecheap/i, name: "Namecheap" },
    { pattern: /bluehost/i, name: "Bluehost" },
    { pattern: /siteground/i, name: "SiteGround" },
    { pattern: /hostgator/i, name: "HostGator" },
    { pattern: /a2hosting/i, name: "A2 Hosting" },
    { pattern: /wix/i, name: "Wix.com" },
    { pattern: /apache/i, name: "Apache Server" },
    { pattern: /nginx/i, name: "Nginx Server" },
    { pattern: /iis/i, name: "Microsoft IIS" },
  ]

  // Check headers for hosting patterns
  const allHeaders = `${serverHeader} ${xPoweredBy} ${JSON.stringify(headers)}`.toLowerCase()

  for (const { pattern, name } of hostingPatterns) {
    if (pattern.test(allHeaders)) {
      return name
    }
  }

  // Check specific header signatures
  if (cfRay) return "Cloudflare"
  if (xVercelId) return "Vercel"
  if (xAmznRequestId) return "Amazon AWS"

  // IP-based detection (simplified)
  if (ip.startsWith("104.21") || ip.startsWith("172.67")) return "Cloudflare"
  if (ip.startsWith("76.76")) return "Vercel"

  return "Unknown"
}

export async function GET(request: Request) {
  try {
    const ip = await publicIpv4({ timeout: 500 })
    const headers = request.headers
    const domain = request.headers.get("host") || "unknown"

    const hostingProvider = detectHostingProvider(Object.fromEntries(headers.entries()), ip, domain)

    return NextResponse.json({
      ip,
      headers: Object.fromEntries(headers.entries()),
      domain,
      hostingProvider,
    })
  } catch (error: any) {
    console.error("Error during analysis:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
