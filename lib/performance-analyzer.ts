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
  if (metrics.loadTime > 4000) {
    // More lenient threshold
    issues.push("Page load time could be optimized for better user experience")
    score -= 12 // Reduced penalty
    recommendations.push("Optimize server response time and consider CDN implementation")
  } else if (metrics.loadTime > 2500) {
    // More lenient threshold
    issues.push("Good load time with room for minor improvements")
    score -= 5 // Reduced penalty
    recommendations.push("Consider optimizing images and minifying resources for faster loading")
  } else if (metrics.loadTime > 1000) {
    recommendations.push("Excellent load time! Consider advanced optimizations for even better performance")
  }

  // Resource count analysis
  if (metrics.scriptCount > 15) {
    // More lenient threshold
    issues.push("Consider optimizing JavaScript resources")
    score -= 6 // Reduced penalty
    recommendations.push("Bundle and minify JavaScript files to reduce HTTP requests")
  } else if (metrics.scriptCount > 8) {
    recommendations.push("Good script management, consider combining files for optimal performance")
    score -= 2
  }

  if (metrics.styleCount > 8) {
    // More lenient threshold
    issues.push("Consider optimizing CSS resources")
    score -= 4 // Reduced penalty
    recommendations.push("Combine and minify CSS files for better performance")
  } else if (metrics.styleCount > 4) {
    recommendations.push("CSS optimization opportunities exist for marginal performance gains")
    score -= 1
  }

  if (metrics.imageCount > 30) {
    // More lenient threshold
    issues.push("Large number of images - consider optimization strategies")
    score -= 4 // Reduced penalty
    recommendations.push("Implement lazy loading and image optimization for better performance")
  } else if (metrics.imageCount > 15) {
    recommendations.push("Good image usage, consider lazy loading for optimal performance")
    score -= 1
  }

  // Compression check
  if (!metrics.hasCompression) {
    issues.push("Enable compression for better performance")
    score -= 8 // Reduced penalty
    recommendations.push("Implement Gzip or Brotli compression to reduce transfer sizes")
  }

  // Caching check
  if (!metrics.hasCaching) {
    issues.push("Implement caching headers for better performance")
    score -= 6 // Reduced penalty
    recommendations.push("Add appropriate caching headers to improve repeat visit performance")
  }

  // Add positive reinforcement
  if (score > 90) {
    recommendations.push("Outstanding performance! Your website is well-optimized")
  } else if (score > 80) {
    recommendations.push("Great performance foundation with minor optimization opportunities")
  } else if (score > 70) {
    recommendations.push("Good performance baseline, focus on key optimizations above")
  }

  return {
    score: Math.max(70, score), // Minimum score of 70 for better results
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
