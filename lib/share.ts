export interface ShareData {
  title: string
  url: string
  summary: string
  analysisUrl?: string
}

export function shareToTwitter(data: ShareData) {
  const twitterHandle = "WebInSightApp" // Optional: your app's Twitter handle
  const baseUrl = "https://twitter.com/intent/tweet"
  const via = twitterHandle ? `&via=${twitterHandle}` : ""

  const urlToShare = data.analysisUrl || data.url
  const baseText = `🔍 Analysis: ${data.title}`
  const hashtags = "#WebInSight #WebsiteAnalysis" // Approx 25 chars

  // Max length for tweet text is 280. URL is t.co shortened to ~23 chars.
  const maxTextLength = 280 - 23 - hashtags.length - via.length - 10 // 10 for spacing and "..."

  let summaryText = data.summary
  if (baseText.length + summaryText.length + 2 > maxTextLength) {
    // +2 for "\n\n"
    summaryText = data.summary.substring(0, maxTextLength - baseText.length - 5) + "..." // -5 for "\n\n..."
  }

  const text = `${baseText}\n\n${summaryText}\n\n${hashtags}`
  const twitterUrl = `${baseUrl}?text=${encodeURIComponent(text)}&url=${encodeURIComponent(urlToShare)}${via}`
  window.open(twitterUrl, "_blank", "width=550,height=420")
}

export function shareToLinkedIn(data: ShareData) {
  // This directly shares the URL. LinkedIn doesn't allow pre-filling extensive post text via URL.
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.analysisUrl || data.url)}`
  window.open(linkedInUrl, "_blank", "width=550,height=420")
}

export function generateLinkedInPost(data: ShareData): string {
  const hashtags = ["#WebInSight", "#WebsiteAnalysis", "#DigitalStrategy", "#TechInsights", "#Optimization"]
  // Select a few relevant hashtags
  const selectedHashtags = hashtags.slice(0, 3).join(" ")

  let postText = `Excited to share insights from the analysis of "${data.title}" conducted using WebInSight!\n\n`
  postText += `Key takeaway: "${data.summary.substring(0, 180)}${data.summary.length > 180 ? "..." : ""}"\n\n`
  postText += `This analysis highlights crucial areas for web optimization and sustainability.\n\n`
  postText += `View the full analysis or explore more: ${data.analysisUrl || data.url}\n\n`
  postText += selectedHashtags
  return postText
}

export function shareToFacebook(data: ShareData) {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.analysisUrl || data.url)}&quote=${encodeURIComponent(`Analysis of ${data.title}: ${data.summary}`)}`
  window.open(facebookUrl, "_blank", "width=550,height=420")
}

export function shareViaGmail(data: ShareData) {
  const subject = `Website Analysis: ${data.title}`
  const body = `Hi,

I wanted to share this website analysis with you:

Website: ${data.title}
URL: ${data.url}

Summary: ${data.summary}

${data.analysisUrl ? `View full analysis: ${data.analysisUrl}` : ""}

Best regards`

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.open(gmailUrl, "_blank")
}

export function createGoogleDoc(content: string, title: string) {
  // Create a downloadable text file that can be uploaded to Google Docs
  const blob = new Blob([content], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${title.replace(/[^a-z0-9]/gi, "_")}_analysis.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (!navigator.clipboard) {
    // Fallback for browsers that don't support navigator.clipboard (e.g., insecure contexts)
    try {
      const textArea = document.createElement("textarea")
      textArea.value = text
      textArea.style.position = "fixed" // Prevent scrolling to bottom
      textArea.style.top = "0"
      textArea.style.left = "0"
      textArea.style.width = "1px" // Make it tiny
      textArea.style.height = "1px"
      textArea.style.opacity = "0" // Make it invisible
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const successful = document.execCommand("copy")
      document.body.removeChild(textArea)
      return successful
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err)
      return false
    }
  }
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error("Async: Could not copy text: ", err)
    return false
  }
}

export function shareViaWhatsApp(data: ShareData) {
  const text = `🔍 Website Analysis: ${data.title}\n\n${data.summary}\n\nWebsite: ${data.url}\n\n${data.analysisUrl ? `Full analysis: ${data.analysisUrl}` : ""}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
  window.open(whatsappUrl, "_blank")
}

export function shareViaTelegram(data: ShareData) {
  const text = `🔍 Website Analysis: ${data.title}\n\n${data.summary}\n\nWebsite: ${data.url}\n\n${data.analysisUrl ? `Full analysis: ${data.analysisUrl}` : ""}`
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(data.analysisUrl || data.url)}&text=${encodeURIComponent(text)}`
  window.open(telegramUrl, "_blank")
}
