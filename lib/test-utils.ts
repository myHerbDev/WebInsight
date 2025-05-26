/**
 * Testing utilities for the website analyzer
 */

export interface TestResult {
  name: string
  status: "pass" | "fail" | "warning"
  message: string
  details?: string
}

/**
 * Test website analysis functionality
 */
export async function testWebsiteAnalysis(url: string): Promise<TestResult[]> {
  const results: TestResult[] = []

  try {
    // Test URL validation
    try {
      new URL(url.startsWith("http") ? url : `https://${url}`)
      results.push({
        name: "URL Validation",
        status: "pass",
        message: "URL format is valid",
      })
    } catch {
      results.push({
        name: "URL Validation",
        status: "fail",
        message: "Invalid URL format",
      })
      return results
    }

    // Test API endpoint
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    })

    if (response.ok) {
      results.push({
        name: "API Endpoint",
        status: "pass",
        message: "Analysis API is responding",
      })

      const data = await response.json()

      // Test data completeness
      const requiredFields = ["title", "url", "summary", "keyPoints", "keywords", "sustainability"]
      const missingFields = requiredFields.filter((field) => !data[field])

      if (missingFields.length === 0) {
        results.push({
          name: "Data Completeness",
          status: "pass",
          message: "All required fields present",
        })
      } else {
        results.push({
          name: "Data Completeness",
          status: "fail",
          message: `Missing fields: ${missingFields.join(", ")}`,
        })
      }

      // Test screenshot
      if (data.screenshotUrl) {
        results.push({
          name: "Screenshot Capture",
          status: "pass",
          message: "Screenshot captured successfully",
        })
      } else {
        results.push({
          name: "Screenshot Capture",
          status: "warning",
          message: "No screenshot captured",
        })
      }
    } else {
      results.push({
        name: "API Endpoint",
        status: "fail",
        message: `API returned ${response.status}`,
      })
    }
  } catch (error) {
    results.push({
      name: "Analysis Test",
      status: "fail",
      message: error instanceof Error ? error.message : "Unknown error",
    })
  }

  return results
}

/**
 * Test content generation functionality
 */
export async function testContentGeneration(analysisId: string): Promise<TestResult[]> {
  const results: TestResult[] = []
  const contentTypes = ["research", "blog", "marketing", "social"]

  for (const contentType of contentTypes) {
    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysisId,
          contentType,
          tone: "professional",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.content && data.content.length > 100) {
          results.push({
            name: `${contentType} Generation`,
            status: "pass",
            message: "Content generated successfully",
            details: `${data.content.length} characters`,
          })
        } else {
          results.push({
            name: `${contentType} Generation`,
            status: "warning",
            message: "Content too short",
          })
        }
      } else {
        results.push({
          name: `${contentType} Generation`,
          status: "fail",
          message: `Failed with status ${response.status}`,
        })
      }
    } catch (error) {
      results.push({
        name: `${contentType} Generation`,
        status: "fail",
        message: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  return results
}

/**
 * Test export functionality
 */
export async function testExportFunctionality(analysisId: string): Promise<TestResult[]> {
  const results: TestResult[] = []
  const formats = ["markdown", "html", "plain", "pdf"]

  for (const format of formats) {
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysisId,
          format,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.content) {
          results.push({
            name: `${format} Export`,
            status: "pass",
            message: "Export successful",
            details: `${data.content.length} characters`,
          })
        } else {
          results.push({
            name: `${format} Export`,
            status: "fail",
            message: "No content in export",
          })
        }
      } else {
        results.push({
          name: `${format} Export`,
          status: "fail",
          message: `Failed with status ${response.status}`,
        })
      }
    } catch (error) {
      results.push({
        name: `${format} Export`,
        status: "fail",
        message: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  return results
}
