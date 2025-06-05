export function safeJsonParse<T = any>(jsonString: string, fallback: T): T {
  try {
    if (!jsonString || !jsonString.trim()) {
      console.warn("Empty JSON string provided, using fallback")
      return fallback
    }

    const trimmed = jsonString.trim()
    if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
      console.warn("Invalid JSON format, using fallback")
      return fallback
    }

    return JSON.parse(trimmed)
  } catch (error) {
    console.error("JSON parsing error:", error)
    return fallback
  }
}

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

export async function safeResponseJson<T = any>(response: Response, fallback: T): Promise<T> {
  try {
    const text = await response.text()
    return safeJsonParse(text, fallback)
  } catch (error) {
    console.error("Response JSON parsing error:", error)
    return fallback
  }
}
