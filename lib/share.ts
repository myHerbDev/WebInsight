export interface ShareData {
  title: string
  url: string
  summary: string
  analysisUrl?: string
}

export function shareToTwitter(data: ShareData) {
  const text = `🔍 Just analyzed ${data.title}!\n\n${data.summary.substring(0, 100)}...\n\nCheck it out: ${data.url}\n\n#WebsiteAnalysis #DigitalMarketing`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
  window.open(twitterUrl, "_blank", "width=550,height=420")
}

export function shareToLinkedIn(data: ShareData) {
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.analysisUrl || data.url)}`
  window.open(linkedInUrl, "_blank", "width=550,height=420")
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
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement("textarea")
      textArea.value = text
      textArea.style.position = "fixed"
      textArea.style.left = "-999999px"
      textArea.style.top = "-999999px"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const result = document.execCommand("copy")
      document.body.removeChild(textArea)
      return result
    }
  } catch (error) {
    console.error("Failed to copy to clipboard:", error)
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
