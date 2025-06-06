// Test script to verify all content categories generate properly
const contentCategories = [
  // Research & Academic
  "sustainability-research",
  "scholar-document",
  "technical-audit",
  "case-study",

  // Business & Strategy
  "executive-summary",
  "business-proposal",
  "market-analysis",
  "roi-report",

  // Content Marketing
  "blog-post",
  "newsletter",
  "press-release",
  "white-paper",

  // Social Media
  "social-media-posts",
  "instagram-captions",
  "linkedin-article",
  "twitter-thread",

  // Creative Content
  "poetry",
  "storytelling",
  "video-script",
  "podcast-outline",

  // Technical Documentation
  "api-documentation",
  "user-guide",
  "troubleshooting",
  "changelog",
]

const testWebsiteData = {
  url: "https://example.com",
  title: "Example Website",
  summary: "A test website for demonstration purposes",
  performance_score: 75,
  sustainability_score: 68,
}

async function testContentGeneration() {
  console.log("🧪 Testing content generation for all categories...")

  const results = {
    successful: [],
    failed: [],
    total: contentCategories.length,
  }

  for (const contentType of contentCategories) {
    try {
      console.log(`\n📝 Testing: ${contentType}`)

      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentType,
          websiteData: testWebsiteData,
          tone: "professional",
          customPrompt: "",
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        console.log(`✅ ${contentType}: SUCCESS`)
        console.log(`   - Title: ${data.content.title}`)
        console.log(`   - Word Count: ${data.content.wordCount}`)
        console.log(`   - Sections: ${data.content.sections?.length || 0}`)
        results.successful.push(contentType)
      } else {
        console.log(`❌ ${contentType}: FAILED`)
        console.log(`   - Error: ${data.error || "Unknown error"}`)
        results.failed.push({ type: contentType, error: data.error })
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.log(`💥 ${contentType}: ERROR`)
      console.log(`   - Exception: ${error.message}`)
      results.failed.push({ type: contentType, error: error.message })
    }
  }

  // Summary
  console.log("\n📊 TEST RESULTS SUMMARY")
  console.log("=" * 50)
  console.log(`Total Categories: ${results.total}`)
  console.log(`Successful: ${results.successful.length}`)
  console.log(`Failed: ${results.failed.length}`)
  console.log(`Success Rate: ${((results.successful.length / results.total) * 100).toFixed(1)}%`)

  if (results.successful.length > 0) {
    console.log("\n✅ SUCCESSFUL CATEGORIES:")
    results.successful.forEach((type) => console.log(`   - ${type}`))
  }

  if (results.failed.length > 0) {
    console.log("\n❌ FAILED CATEGORIES:")
    results.failed.forEach((item) => {
      console.log(`   - ${item.type}: ${item.error}`)
    })
  }

  console.log("\n🎯 RECOMMENDATIONS:")
  if (results.failed.length === 0) {
    console.log("   🎉 All content categories are working perfectly!")
  } else if (results.successful.length > results.failed.length) {
    console.log("   ⚠️  Most categories work, fix the failing ones")
  } else {
    console.log("   🚨 Major issues detected, review API implementation")
  }

  return results
}

// Run the test
testContentGeneration()
  .then((results) => {
    console.log("\n✨ Content generation testing completed!")
  })
  .catch((error) => {
    console.error("💥 Test execution failed:", error)
  })
