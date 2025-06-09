// Safe fetch utility with comprehensive error handling
export interface SafeFetchOptions {
  timeout?: number
  retries?: number
  validateJson?: boolean
}

export interface SafeFetchResult<T = any> {
  success: boolean
  data?: T
  error?: string
  status?: number
}

export async function safeFetch<T = any>(
  url: string,
  options: RequestInit & SafeFetchOptions = {},
): Promise<SafeFetchResult<T>> {
  const { timeout = 10000, retries = 1, validateJson = true, ...fetchOptions } = options

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log(`Fetch attempt ${attempt + 1} for ${url}`)

      // Create abort controller for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error")
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText}`,
          status: response.status,
        }
      }

      // Get response text
      const responseText = await response.text()

      // Handle empty responses
      if (!responseText || !responseText.trim()) {
        if (validateJson) {
          return {
            success: false,
            error: "Empty response from server",
          }
        }
        return {
          success: true,
          data: null as T,
        }
      }

      // Parse JSON if requested
      if (validateJson) {
        try {
          // Validate JSON structure before parsing
          const trimmed = responseText.trim()
          if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
            return {
              success: false,
              error: "Response is not valid JSON",
            }
          }

          const data = JSON.parse(responseText)
          return {
            success: true,
            data,
          }
        } catch (parseError: any) {
          console.error("JSON parse error:", parseError.message)
          return {
            success: false,
            error: `Invalid JSON response: ${parseError.message}`,
          }
        }
      }

      return {
        success: true,
        data: responseText as T,
      }
    } catch (error: any) {
      console.error(`Fetch attempt ${attempt + 1} failed:`, error.message)

      if (error.name === "AbortError") {
        return {
          success: false,
          error: "Request timeout",
        }
      }

      // If this is the last attempt, return the error
      if (attempt === retries) {
        return {
          success: false,
          error: error.message || "Network error",
        }
      }

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)))
    }
  }

  return {
    success: false,
    error: "Max retries exceeded",
  }
}

// Safe JSON parsing utility
export function safeJsonParse<T = any>(text: string, fallback: T): T {
  try {
    if (!text || !text.trim()) {
      console.warn("Empty text provided to safeJsonParse")
      return fallback
    }

    const trimmed = text.trim()
    if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
      console.warn("Text does not appear to be JSON")
      return fallback
    }

    return JSON.parse(trimmed)
  } catch (error) {
    console.error("JSON parse error:", error)
    return fallback
  }
}

// Safe JSON stringify utility
export function safeJsonStringify(obj: any, fallback = "{}"): string {
  try {
    if (obj === null || obj === undefined) {
      return fallback
    }
    return JSON.stringify(obj)
  } catch (error) {
    console.error("JSON stringify error:", error)
    return fallback
  }
}
