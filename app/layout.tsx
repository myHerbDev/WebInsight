import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
// Removed AuthProvider for now to ensure stability, can be re-added carefully later

export const metadata: Metadata = {
  title: "WebInSight - Advanced Website Analytics & AI Content Generation",
  description:
    "Analyze your website for sustainability, performance, and security. Generate AI-powered content based on insights.",
  keywords:
    "website analysis, sustainability, carbon footprint, web performance, SEO, AI content generation, green hosting",
  authors: [{ name: "WebInSight Team" }],
  creator: "WebInSight",
  publisher: "WebInSight",
  robots: "index, follow",
  openGraph: {
    title: "WebInSight - Advanced Website Analytics",
    description: "Analyze your website and generate AI-powered content.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "WebInSight - Advanced Website Analytics",
    description: "Analyze your website and generate AI-powered content.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
