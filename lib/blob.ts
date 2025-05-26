import { put } from "@vercel/blob"
import { nanoid } from "nanoid"

// Check if Blob token exists
export const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN

/**
 * Saves a screenshot to Vercel Blob
 * @param url URL of the website
 * @param imageBuffer Buffer containing the screenshot image
 * @returns URL of the saved blob
 */
export async function saveScreenshot(url: string, imageBuffer: Buffer): Promise<string | null> {
  if (!hasBlobToken) {
    console.warn("Blob token not configured, skipping screenshot")
    return null
  }

  try {
    // Create a unique filename based on the URL and timestamp
    const hostname = new URL(url).hostname
    const filename = `${hostname.replace(/\./g, "-")}-${nanoid(6)}-${Date.now()}.png`

    // Upload to Vercel Blob
    const blob = await put(filename, imageBuffer, {
      access: "public",
      contentType: "image/png",
    })

    return blob.url
  } catch (error) {
    console.error("Error saving screenshot to Blob:", error)
    return null
  }
}

/**
 * Generates a placeholder URL if Blob is not available
 */
export function getPlaceholderScreenshot(url: string): string {
  try {
    const hostname = new URL(url).hostname
    return `https://placehold.co/800x600/f5f5f5/666666?text=${hostname}`
  } catch {
    return `https://placehold.co/800x600/f5f5f5/666666?text=Website+Screenshot`
  }
}
