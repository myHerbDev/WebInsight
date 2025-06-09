// This file was already provided in the user's context and seems mostly fine.
// I will use the existing one and ensure it integrates.
// Key changes:
// - Ensure it returns status code for better error handling.
// - Minor logging improvements.
export interface SafeFetchOptions extends RequestInit {
  // Extend RequestInit
  timeout?: number
  retries?: number
  validateJson?: boolean // If true, expects JSON and parses it. If false, returns text.
}

export interface SafeFetchResult<T = any> {
  success: boolean
  data?: T
  error?: string
  status?: number // HTTP status code
}

export async function safeFetch<T = any>(url: string, options: SafeFetchOptions = {}): Promise<SafeFetchResult<T>> {
  const { timeout = 30000, retries = 1, validateJson = true, ...fetchOptions } = options
  let lastError: string | undefined
  let lastStatus: number | undefined

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // console.log(`Fetch attempt ${attempt + 1} for ${url}`)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      lastStatus = response.status

      if (!response.ok) {
        let errorText = `HTTP ${response.status}: ${response.statusText || "Failed request"}`
        try {
          const body = await response.text()
          if (body) {
            const errDetails = JSON.parse(body) // Try to parse error details
            errorText = errDetails.error || errDetails.message || body.substring(0, 100)
          }
        } catch (e) {
          /* Ignore if body isn't JSON or empty */
        }
        lastError = errorText
        if (attempt === retries) {
          // If last attempt, return error
          return { success: false, error: errorText, status: response.status }
        }
        // Optional: Add delay before retrying for certain errors (e.g. 429, 5xx)
        if (response.status === 429 || response.status >= 500) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)))
        }
        continue // Retry
      }

      const responseText = await response.text()
      if (!responseText.trim() && validateJson) {
        // Empty response but expected JSON
        lastError = "Empty JSON response from server"
        if (attempt === retries) return { success: false, error: lastError, status: response.status }
        continue
      }

      if (validateJson) {
        try {
          const data = JSON.parse(responseText)
          return { success: true, data, status: response.status }
        } catch (parseError: any) {
          lastError = `Invalid JSON response: ${parseError.message.substring(0, 100)}`
          if (attempt === retries) return { success: false, error: lastError, status: response.status }
          continue
        }
      } else {
        // If not validating JSON, return text directly
        return { success: true, data: responseText as unknown as T, status: response.status }
      }
    } catch (error: any) {
      // console.error(`Fetch attempt ${attempt + 1} for ${url} failed:`, error.message)
      if (error.name === "AbortError") {
        lastError = "Request timeout"
      } else {
        lastError = error.message || "Network error"
      }
      lastStatus = lastStatus || 500 // Generic server/network error status

      if (attempt === retries) {
        return { success: false, error: lastError, status: lastStatus }
      }
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1))) // Shorter delay for general errors
    }
  }
  // Should not be reached if retries >= 0
  return { success: false, error: lastError || "Max retries exceeded without specific error", status: lastStatus }
}
