import type { ScrapedWebsiteData } from "./website-scraper"

export interface PerformanceAnalysis {
  score: number
  metrics: {
    loadTime: number
    scriptCount: number
    styleCount: number
    imageCount: number
    totalRequests: number
    hasCompression: boolean
    hasCaching: boolean
  }
  issues: string[]
  recommendations: string[]
}

export function analyzePerformance(data: ScrapedWebsiteData): PerformanceAnalysis {
  const issues: string[] = []
  const recommendations: string[] = []
  let score = 100

  const metrics = {
    loadTime: data.technicalInfo.responseTime,
    scriptCount: data.scripts.length,
    styleCount: data.styles.length,
    imageCount: data.images.length,
    totalRequests: data.scripts.length + data.styles.length + data.images.length,
    hasCompression: checkCompression(data.technicalInfo.serverHeaders),
    hasCaching: checkCaching(data.technicalInfo.serverHeaders),
  }

  // Load time analysis
  if (metrics.loadTime > 3000) {
    issues.push("Slow page load time (>3 seconds)")
    score -= 20
    recommendations.push("Optimize server response time and reduce resource loading")
  } else if (metrics.loadTime > 1500) {
    issues.push("Moderate page load time (>1.5 seconds)")
    score -= 10
    recommendations.push("Consider optimizing images and minifying CSS/JS")
  }

  // Resource count analysis
  if (metrics.scriptCount > 10) {
    issues.push("Too many JavaScript files")
    score -= 10
    recommendations.push("Combine and minify JavaScript files")
  }

  if (metrics.styleCount > 5) {
    issues.push("Too many CSS files")
    score -= 5
    recommendations.push("Combine and minify CSS files")
  }

  if (metrics.imageCount > 20) {
    issues.push("Large number of images may slow loading")
    score -= 5
    recommendations.push("Optimize images and consider lazy loading")
  }

  // Compression check
  if (!metrics.hasCompression) {
    issues.push("No compression detected")
    score -= 15
    recommendations.push("Enable Gzip or Brotli compression")
  }

  // Caching check
  if (!metrics.hasCaching) {
    issues.push("No caching headers detected")
    score -= 10
    recommendations.push("Implement proper caching headers")
  }

  return {
    score: Math.max(0, score),
    metrics,
    issues,
    recommendations,
  }
}

function checkCompression(headers: Record<string, string>): boolean {
  const contentEncoding = headers["content-encoding"]
  return !!(contentEncoding && (contentEncoding.includes("gzip") || contentEncoding.includes("br")))
}

function checkCaching(headers: Record<string, string>): boolean {
  return !!(headers["cache-control"] || headers["expires"] || headers["etag"])
}
