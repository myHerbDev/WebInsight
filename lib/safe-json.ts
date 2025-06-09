// Enhanced JSON safety utilities
export function safeJsonParse<T = any>(text: string, fallback: T): T {
  try {
    // Validate input
    if (!text || typeof text !== "string") {
      console.warn("Invalid input to safeJsonParse:", typeof text)
      return fallback
    }

    const trimmed = text.trim()
    if (!trimmed) {
      console.warn("Empty string provided to safeJsonParse")
      return fallback
    }

    // Check for basic JSON structure
    if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
      console.warn("Text does not appear to be JSON:", trimmed.substring(0, 50))
      return fallback
    }

    // Attempt to parse
    const parsed = JSON.parse(trimmed)

    // Validate parsed result
    if (parsed === null || parsed === undefined) {
      console.warn("JSON parsed to null/undefined")
      return fallback
    }

    return parsed
  } catch (error: any) {
    console.error("JSON parse error:", error.message)
    console.error("Failed text:", text?.substring(0, 100))
    return fallback
  }
}

export function safeJsonStringify(obj: any, fallback = "{}"): string {
  try {
    if (obj === null || obj === undefined) {
      return fallback
    }

    const result = JSON.stringify(obj)
    return result || fallback
  } catch (error: any) {
    console.error("JSON stringify error:", error.message)
    return fallback
  }
}

export function validateJsonStructure(text: string): boolean {
  try {
    if (!text || typeof text !== "string") return false

    const trimmed = text.trim()
    if (!trimmed) return false

    // Basic structure check
    if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return false
    if (!trimmed.endsWith("}") && !trimmed.endsWith("]")) return false

    // Try to parse
    JSON.parse(trimmed)
    return true
  } catch {
    return false
  }
}
