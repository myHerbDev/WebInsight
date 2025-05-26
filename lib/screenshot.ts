import type { Browser } from "puppeteer"
import { saveScreenshot, getPlaceholderScreenshot } from "./blob"

let puppeteerPromise: Promise<typeof import("puppeteer")> | null = null
let browserPromise: Promise<Browser> | null = null

/**
 * Lazy-loads Puppeteer to improve startup performance
 */
async function getPuppeteer() {
  if (!puppeteerPromise) {
    puppeteerPromise = import("puppeteer")
  }
  return puppeteerPromise
}

/**
 * Gets or creates a browser instance
 */
async function getBrowser() {
  if (!browserPromise) {
    const puppeteer = await getPuppeteer()
    browserPromise = puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    })
  }
  return browserPromise
}

/**
 * Captures a screenshot of a website
 * @param url URL to capture
 * @returns Buffer containing the screenshot or null if failed
 */
export async function captureScreenshot(url: string): Promise<Buffer | null> {
  try {
    const browser = await getBrowser()
    const page = await browser.newPage()

    // Set viewport size
    await page.setViewport({ width: 1280, height: 800 })

    // Navigate to the URL with a timeout
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 15000,
    })

    // Wait a bit for any animations or lazy-loaded content
    await page.waitForTimeout(1000)

    // Take screenshot
    const screenshot = await page.screenshot({ type: "png" })

    // Close the page to free resources
    await page.close()

    return screenshot
  } catch (error) {
    console.error(`Error capturing screenshot for ${url}:`, error)
    return null
  }
}

/**
 * Captures and saves a screenshot to Vercel Blob
 * @param url URL to capture
 * @returns URL of the saved screenshot or placeholder if failed
 */
export async function getWebsiteScreenshot(url: string): Promise<string> {
  try {
    const screenshot = await captureScreenshot(url)

    if (screenshot) {
      const blobUrl = await saveScreenshot(url, screenshot)
      if (blobUrl) return blobUrl
    }

    // Return placeholder if screenshot capture or save failed
    return getPlaceholderScreenshot(url)
  } catch (error) {
    console.error("Error in getWebsiteScreenshot:", error)
    return getPlaceholderScreenshot(url)
  }
}
