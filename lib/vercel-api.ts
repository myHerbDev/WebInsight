/**
 * Utility functions for interacting with the Vercel API
 */

// Vercel API key for WebInSight
const VERCEL_API_KEY = "meu5EDoHamgigwooq3u9tQJW"

/**
 * Fetches website metadata using Vercel's API
 * @param url The URL to fetch metadata for
 * @returns Website metadata including title, description, etc.
 */
export async function fetchWebsiteMetadata(url: string) {
  try {
    const normalizedUrl = normalizeUrl(url)

    const response = await fetch(`https://api.vercel.com/v1/meta?url=${encodeURIComponent(normalizedUrl)}`, {
      headers: {
        Authorization: `Bearer ${VERCEL_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Vercel API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching website metadata:", error)
    return null
  }
}

/**
 * Fetches just the title of a website using Vercel's API
 * @param url The URL to fetch the title for
 * @returns The website title or null if not found
 */
export async function fetchWebsiteTitle(url: string): Promise<string | null> {
  try {
    const metadata = await fetchWebsiteMetadata(url)
    return metadata?.title || null
  } catch (error) {
    console.error("Error fetching website title:", error)
    return null
  }
}

/**
 * Normalizes a URL by ensuring it has a protocol
 * @param url The URL to normalize
 * @returns The normalized URL
 */
function normalizeUrl(url: string): string {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`
  }
  return url
}
