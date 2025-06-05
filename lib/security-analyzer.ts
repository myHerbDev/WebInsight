import type { ScrapedWebsiteData } from "./website-scraper"

export interface SecurityAnalysis {
  score: number
  issues: string[]
  recommendations: string[]
  checks: {
    hasSSL: boolean
    hasHSTS: boolean
    hasCSP: boolean
    hasXFrameOptions: boolean
    hasXContentTypeOptions: boolean
    hasReferrerPolicy: boolean
    hasSRI: boolean
  }
}

export function analyzeSecurity(data: ScrapedWebsiteData): SecurityAnalysis {
  const issues: string[] = []
  const recommendations: string[] = []
  let score = 100

  const headers = data.technicalInfo.serverHeaders

  const checks = {
    hasSSL: data.technicalInfo.hasSSL,
    hasHSTS: !!headers["strict-transport-security"],
    hasCSP: !!headers["content-security-policy"],
    hasXFrameOptions: !!headers["x-frame-options"],
    hasXContentTypeOptions: !!headers["x-content-type-options"],
    hasReferrerPolicy: !!headers["referrer-policy"],
    hasSRI: checkSubresourceIntegrity(data.scripts, data.styles),
  }

  // SSL/HTTPS check
  if (!checks.hasSSL) {
    issues.push("Website not using HTTPS")
    score -= 25
    recommendations.push("Implement SSL/TLS certificate for secure connections")
  }

  // HSTS check
  if (!checks.hasHSTS && checks.hasSSL) {
    issues.push("Missing HTTP Strict Transport Security (HSTS)")
    score -= 10
    recommendations.push("Add HSTS header to prevent protocol downgrade attacks")
  }

  // Content Security Policy
  if (!checks.hasCSP) {
    issues.push("Missing Content Security Policy (CSP)")
    score -= 15
    recommendations.push("Implement CSP to prevent XSS attacks")
  }

  // X-Frame-Options
  if (!checks.hasXFrameOptions) {
    issues.push("Missing X-Frame-Options header")
    score -= 10
    recommendations.push("Add X-Frame-Options to prevent clickjacking")
  }

  // X-Content-Type-Options
  if (!checks.hasXContentTypeOptions) {
    issues.push("Missing X-Content-Type-Options header")
    score -= 5
    recommendations.push("Add X-Content-Type-Options: nosniff")
  }

  // Referrer Policy
  if (!checks.hasReferrerPolicy) {
    issues.push("Missing Referrer Policy")
    score -= 5
    recommendations.push("Set appropriate referrer policy")
  }

  // Subresource Integrity
  if (!checks.hasSRI && (data.scripts.length > 0 || data.styles.length > 0)) {
    issues.push("External resources lack integrity checks")
    score -= 10
    recommendations.push("Add Subresource Integrity (SRI) for external resources")
  }

  return {
    score: Math.max(0, score),
    issues,
    recommendations,
    checks,
  }
}

function checkSubresourceIntegrity(scripts: string[], styles: string[]): boolean {
  // This is a simplified check - in reality, you'd need to examine the actual HTML
  // to see if external scripts/styles have integrity attributes
  return false // Conservative assumption
}
