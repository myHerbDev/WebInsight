import type { ScrapedWebsiteData } from "./website-scraper"

export interface SEOAnalysis {
  score: number
  issues: string[]
  recommendations: string[]
  metrics: {
    titleLength: number
    descriptionLength: number
    h1Count: number
    imagesMissingAlt: number
    internalLinks: number
    externalLinks: number
    pageSize: number
    loadTime: number
  }
}

export function analyzeSEO(data: ScrapedWebsiteData): SEOAnalysis {
  const issues: string[] = []
  const recommendations: string[] = []
  let score = 100

  // Title analysis
  if (!data.title || data.title.length === 0) {
    issues.push("Missing page title")
    score -= 15
  } else if (data.title.length < 30) {
    issues.push("Title too short (less than 30 characters)")
    score -= 5
  } else if (data.title.length > 60) {
    issues.push("Title too long (more than 60 characters)")
    score -= 5
  }

  // Meta description analysis
  if (!data.description || data.description.length === 0) {
    issues.push("Missing meta description")
    score -= 10
  } else if (data.description.length < 120) {
    issues.push("Meta description too short (less than 120 characters)")
    score -= 5
  } else if (data.description.length > 160) {
    issues.push("Meta description too long (more than 160 characters)")
    score -= 5
  }

  // Heading structure analysis
  if (data.headings.h1.length === 0) {
    issues.push("Missing H1 tag")
    score -= 10
  } else if (data.headings.h1.length > 1) {
    issues.push("Multiple H1 tags found")
    score -= 5
  }

  // Image optimization
  const imagesMissingAlt = data.images.filter((img) => !img.alt || img.alt.trim() === "").length
  if (imagesMissingAlt > 0) {
    issues.push(`${imagesMissingAlt} images missing alt text`)
    score -= Math.min(imagesMissingAlt * 2, 10)
  }

  // Open Graph tags
  if (!data.metaTags.ogTitle) {
    issues.push("Missing Open Graph title")
    score -= 3
  }
  if (!data.metaTags.ogDescription) {
    issues.push("Missing Open Graph description")
    score -= 3
  }

  // SSL check
  if (!data.technicalInfo.hasSSL) {
    issues.push("Website not using HTTPS")
    score -= 15
  }

  // Performance check
  if (data.technicalInfo.responseTime > 3000) {
    issues.push("Slow page load time (>3 seconds)")
    score -= 10
  }

  // Generate recommendations
  if (issues.length === 0) {
    recommendations.push("Great job! Your SEO is well optimized.")
  } else {
    if (data.title.length < 30 || data.title.length > 60) {
      recommendations.push("Optimize title length to 30-60 characters for better search visibility")
    }
    if (data.description.length < 120 || data.description.length > 160) {
      recommendations.push("Optimize meta description to 120-160 characters")
    }
    if (imagesMissingAlt > 0) {
      recommendations.push("Add descriptive alt text to all images for better accessibility and SEO")
    }
    if (!data.technicalInfo.hasSSL) {
      recommendations.push("Implement HTTPS for better security and SEO ranking")
    }
    if (data.technicalInfo.responseTime > 3000) {
      recommendations.push("Optimize page loading speed by compressing images and minifying code")
    }
  }

  return {
    score: Math.max(0, score),
    issues,
    recommendations,
    metrics: {
      titleLength: data.title.length,
      descriptionLength: data.description.length,
      h1Count: data.headings.h1.length,
      imagesMissingAlt,
      internalLinks: data.links.internal.length,
      externalLinks: data.links.external.length,
      pageSize: data.content.textContent.length,
      loadTime: data.technicalInfo.responseTime,
    },
  }
}
