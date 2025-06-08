// Test the enhanced website analyzer with comprehensive data collection
import { analyzeWebsite } from "../lib/analyzer"

async function testEnhancedAnalysis() {
  console.log("🚀 Testing Enhanced Website Analysis")
  console.log("=".repeat(50))

  // Test with a well-known website
  const testUrl = "https://github.com"

  console.log(`📊 Analyzing: ${testUrl}`)
  console.log("⏳ Starting comprehensive analysis...")

  const startTime = Date.now()

  try {
    const result = await analyzeWebsite(testUrl)

    if (!result) {
      console.error("❌ Analysis failed - no result returned")
      return
    }

    const analysisTime = Date.now() - startTime
    console.log(`✅ Analysis completed in ${analysisTime}ms`)
    console.log("=".repeat(50))

    // Display comprehensive results
    console.log("📋 COMPREHENSIVE ANALYSIS RESULTS")
    console.log("=".repeat(50))

    console.log("\n🎯 BASIC INFO:")
    console.log(`Title: ${result.title}`)
    console.log(`URL: ${result.url}`)
    console.log(`Summary: ${result.summary?.substring(0, 200)}...`)

    console.log("\n📊 ENHANCED SCORES:")
    console.log(`Performance: ${result.performance_score}/100`)
    console.log(`SEO: ${result.seo_score}/100`)
    console.log(`Security: ${result.security_score}/100`)
    console.log(`Accessibility: ${result.accessibility_score}/100`)
    console.log(`Mobile: ${result.mobile_score}/100`)
    console.log(`Sustainability: ${result.sustainability_score}/100`)
    console.log(`Content Quality: ${result.content_quality_score}/100`)
    console.log(`Script Optimization: ${result.script_optimization_score}/100`)

    console.log("\n🏢 HOSTING & INFRASTRUCTURE:")
    console.log(`Provider: ${result.hosting.provider || "Unknown"}`)
    console.log(`IP Address: ${result.hosting.ipAddress || "Unknown"}`)
    console.log(`Server Type: ${result.hosting.serverType || "Unknown"}`)
    console.log(`Response Time: ${result.hosting.responseTime || "Unknown"}ms`)
    console.log(`Location: ${result.hosting.location || "Unknown"}`)

    console.log("\n🔧 DETECTED TECHNOLOGIES:")
    if (result.technologies && result.technologies.length > 0) {
      result.technologies.forEach((tech) => {
        console.log(`- ${tech.name} (${tech.category}) - ${tech.confidence || "N/A"}% confidence`)
        if (tech.description) {
          console.log(`  └─ ${tech.description}`)
        }
      })
    } else {
      console.log("No specific technologies detected")
    }

    console.log("\n📈 ENHANCED CONTENT STATS:")
    console.log(`Word Count: ${result.content_stats.word_count.toLocaleString()}`)
    console.log(`Character Count: ${result.content_stats.char_count.toLocaleString()}`)
    console.log(`Images: ${result.content_stats.images_count}`)
    console.log(`Links: ${result.content_stats.links_count}`)
    console.log(`Headings: ${result.content_stats.headings_count}`)
    console.log(`Paragraphs: ${result.content_stats.paragraphs_count}`)
    console.log(`Lists: ${result.content_stats.lists_count}`)
    console.log(`Forms: ${result.content_stats.forms_count}`)
    console.log(`Videos: ${result.content_stats.videos_count}`)
    console.log(`Social Links: ${result.content_stats.social_links_count}`)

    console.log("\n🔍 SEO ANALYSIS:")
    console.log(`Title Length: ${result.seoAnalysis.titleLength} characters`)
    console.log(`Description Length: ${result.seoAnalysis.descriptionLength} characters`)
    console.log(`H1 Count: ${result.seoAnalysis.h1Count}`)
    console.log(`H2 Count: ${result.seoAnalysis.h2Count}`)
    console.log(`Images with Alt: ${result.seoAnalysis.imageAltCount}`)
    console.log(`Images Missing Alt: ${result.seoAnalysis.imagesMissingAlt}`)
    console.log(`Internal Links: ${result.seoAnalysis.internalLinkCount}`)
    console.log(`External Links: ${result.seoAnalysis.externalLinkCount}`)
    console.log(`Structured Data: ${result.seoAnalysis.structuredDataPresent ? "Yes" : "No"}`)

    console.log("\n🔒 SECURITY ANALYSIS:")
    console.log(`HTTPS Enabled: ${result.security.httpsEnabled ? "Yes" : "No"}`)
    console.log(`Mixed Content: ${result.security.mixedContent ? "Yes" : "No"}`)
    console.log(`Server Signature: ${result.security.serverSignature || "Hidden"}`)
    if (result.security.httpHeaders) {
      console.log("Security Headers:")
      Object.entries(result.security.httpHeaders).forEach(([key, value]) => {
        console.log(`  - ${key}: ${value}`)
      })
    }

    console.log("\n♿ ACCESSIBILITY ANALYSIS:")
    console.log(`Alt Text Coverage: ${result.accessibility.altTextCoverage.toFixed(1)}%`)
    console.log(`Heading Structure Valid: ${result.accessibility.headingStructureValid ? "Yes" : "No"}`)
    console.log(`ARIA Labels Present: ${result.accessibility.ariaLabelsPresent ? "Yes" : "No"}`)

    console.log("\n📱 MOBILE ANALYSIS:")
    console.log(`Viewport Configured: ${result.mobileFriendliness.viewportConfigured ? "Yes" : "No"}`)
    console.log(`Responsive Design: ${result.mobileFriendliness.responsiveDesign ? "Yes" : "No"}`)
    console.log(`Mobile Optimized: ${result.mobileFriendliness.mobileOptimized ? "Yes" : "No"}`)

    console.log("\n🔗 LINK ANALYSIS:")
    console.log(`Internal Links: ${result.links.internalLinks}`)
    console.log(`External Links: ${result.links.externalLinks}`)
    console.log(`Nofollow Links: ${result.links.nofollowLinks}`)
    console.log(`Email Links: ${result.links.emailLinks}`)
    console.log(`Phone Links: ${result.links.phoneLinks}`)
    if (result.links.socialMediaLinks.length > 0) {
      console.log("Social Media Links:")
      result.links.socialMediaLinks.forEach((link) => {
        console.log(`  - ${link}`)
      })
    }

    console.log("\n⚡ PERFORMANCE DETAILS:")
    console.log(`Page Size: ${result.performance.pageSize} KB`)
    console.log(`HTTP Requests: ${result.performance.httpRequests}`)
    console.log(`Load Time: ${result.performance.loadTime || "Unknown"}ms`)
    console.log(`Compression: ${result.performance.compressionEnabled ? "Enabled" : "Disabled"}`)
    console.log(`Caching: ${result.performance.cachingEnabled ? "Enabled" : "Disabled"}`)
    console.log("Resource Breakdown:")
    console.log(`  - CSS Files: ${result.performance.resourceCounts.css}`)
    console.log(`  - JS Files: ${result.performance.resourceCounts.js}`)
    console.log(`  - Images: ${result.performance.resourceCounts.images}`)
    console.log(`  - Fonts: ${result.performance.resourceCounts.fonts}`)
    console.log(`  - Videos: ${result.performance.resourceCounts.videos}`)

    console.log("\n🏢 BUSINESS INFO:")
    console.log(`Industry: ${result.businessInfo.industry || "Not detected"}`)
    console.log(`Business Type: ${result.businessInfo.businessType || "Not detected"}`)
    console.log(`Email: ${result.businessInfo.contactInfo.email || "Not found"}`)
    console.log(`Phone: ${result.businessInfo.contactInfo.phone || "Not found"}`)
    if (Object.keys(result.businessInfo.contactInfo.socialMedia).length > 0) {
      console.log("Social Media Profiles:")
      Object.entries(result.businessInfo.contactInfo.socialMedia).forEach(([platform, url]) => {
        console.log(`  - ${platform}: ${url}`)
      })
    }

    console.log("\n📝 ENHANCED METADATA:")
    console.log(`Title: ${result.metadata.title}`)
    console.log(`Description: ${result.metadata.description}`)
    console.log(`Language: ${result.metadata.language || "Not specified"}`)
    console.log(`Author: ${result.metadata.author || "Not specified"}`)
    console.log(`Generator: ${result.metadata.generator || "Not specified"}`)
    console.log(`Canonical URL: ${result.metadata.canonicalUrl || "Not specified"}`)
    console.log(`Robots: ${result.metadata.robots || "Not specified"}`)
    console.log(`Viewport: ${result.metadata.viewport || "Not specified"}`)
    console.log(`Theme Color: ${result.metadata.themeColor || "Not specified"}`)
    console.log(`OG Title: ${result.metadata.ogTitle || "Not specified"}`)
    console.log(`OG Description: ${result.metadata.ogDescription || "Not specified"}`)
    console.log(`OG Image: ${result.metadata.ogImage || "Not specified"}`)
    console.log(`Twitter Card: ${result.metadata.twitterCard || "Not specified"}`)
    console.log(`Favicon: ${result.metadata.favicon || "Not found"}`)

    console.log("\n🎯 KEY INSIGHTS:")
    result.key_points.forEach((point, index) => {
      console.log(`${index + 1}. ${point}`)
    })

    console.log("\n🚀 TOP IMPROVEMENTS:")
    result.improvements.slice(0, 5).forEach((improvement, index) => {
      console.log(`${index + 1}. ${improvement}`)
    })

    console.log("\n📊 CONTENT STRUCTURE:")
    if (result.contentAnalysis.headingsStructure) {
      Object.entries(result.contentAnalysis.headingsStructure).forEach(([level, headings]) => {
        console.log(`${level.toUpperCase()}: ${headings.length} headings`)
        headings.slice(0, 3).forEach((heading) => {
          console.log(`  - ${heading.text.substring(0, 60)}...`)
        })
      })
    }

    console.log("\n" + "=".repeat(50))
    console.log("✅ ENHANCED ANALYSIS COMPLETE!")
    console.log(`📊 Total data points collected: ${Object.keys(result).length}`)
    console.log(`🔍 Analysis depth: Comprehensive (8 scoring dimensions)`)
    console.log(`⏱️ Processing time: ${analysisTime}ms`)
    console.log("=".repeat(50))
  } catch (error) {
    console.error("❌ Analysis failed:", error)
    console.error("Error details:", error instanceof Error ? error.message : "Unknown error")
  }
}

// Run the test
testEnhancedAnalysis()
