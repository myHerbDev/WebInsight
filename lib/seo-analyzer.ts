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

  // More lenient title analysis
  if (!data.title || data.title.length === 0) {
    issues.push("Missing page title")
    score -= 10 // Reduced penalty
  } else if (data.title.length < 25) {
    // More lenient minimum
    issues.push("Title could be longer for better SEO impact")
    score -= 3 // Reduced penalty
  } else if (data.title.length > 65) {
    // More lenient maximum
    issues.push("Title slightly long, may be truncated in search results")
    score -= 3 // Reduced penalty
  }

  // More lenient meta description analysis
  if (!data.description || data.description.length === 0) {
    issues.push("Missing meta description")
    score -= 8 // Reduced penalty
  } else if (data.description.length < 100) {
    // More lenient minimum
    issues.push("Meta description could be more descriptive")
    score -= 3 // Reduced penalty
  } else if (data.description.length > 170) {
    // More lenient maximum
    issues.push("Meta description slightly long, may be truncated")
    score -= 3 // Reduced penalty
  }

  // More lenient heading structure analysis
  if (data.headings.h1.length === 0) {
    issues.push("Consider adding an H1 tag for better structure")
    score -= 5 // Reduced penalty
  } else if (data.headings.h1.length > 1) {
    issues.push("Multiple H1 tags found - consider using H2-H6 for hierarchy")
    score -= 2 // Reduced penalty
  }

  // More lenient image optimization
  const imagesMissingAlt = data.images.filter((img) => !img.alt || img.alt.trim() === "").length
  if (imagesMissingAlt > 0) {
    const penalty = Math.min(imagesMissingAlt * 1, 5) // Reduced penalty cap
    issues.push(`${imagesMissingAlt} images could benefit from alt text`)
    score -= penalty
  }

  // More lenient Open Graph tags
  if (!data.metaTags.ogTitle) {
    issues.push("Consider adding Open Graph title for social sharing")
    score -= 2 // Reduced penalty
  }
  if (!data.metaTags.ogDescription) {
    issues.push("Consider adding Open Graph description for social sharing")
    score -= 2 // Reduced penalty
  }

  // More lenient SSL check
  if (!data.technicalInfo.hasSSL) {
    issues.push("HTTPS recommended for better security and SEO")
    score -= 8 // Reduced penalty
  }

  // More lenient performance check
  if (data.technicalInfo.responseTime > 4000) {
    // More lenient threshold
    issues.push("Page load time could be optimized")
    score -= 5 // Reduced penalty
  } else if (data.technicalInfo.responseTime > 2000) {
    issues.push("Good load time, minor optimization opportunities exist")
    score -= 2 // Minor penalty
  }

  // Generate more positive recommendations
  if (issues.length === 0) {
    recommendations.push("Excellent SEO optimization! Your website follows best practices.")
  } else {
    if (data.title.length < 25 || data.title.length > 65) {
      recommendations.push("Fine-tune title length to 25-65 characters for optimal search visibility")
    }
    if (data.description.length < 100 || data.description.length > 170) {
      recommendations.push("Optimize meta description to 100-170 characters for better click-through rates")
    }
    if (imagesMissingAlt > 0) {
      recommendations.push("Add descriptive alt text to images for improved accessibility and SEO")
    }
    if (!data.technicalInfo.hasSSL) {
      recommendations.push("Implement HTTPS for enhanced security and search ranking benefits")
    }
    if (data.technicalInfo.responseTime > 2000) {
      recommendations.push("Consider optimizing page speed through image compression and code minification")
    }

    // Add positive reinforcement
    if (score > 85) {
      recommendations.push("Great foundation! Minor tweaks will achieve excellent SEO performance")
    } else if (score > 75) {
      recommendations.push("Good SEO practices in place, focus on the key areas above for improvement")
    }
  }

  return {
    score: Math.max(65, score), // Minimum score of 65 for better results
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
