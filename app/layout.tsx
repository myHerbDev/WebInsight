import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ParticleBackground } from "@/components/particle-background"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "WebInSight: AI-Powered Website Analysis & Optimization",
  description:
    "Elevate your website with WebInSight. AI-driven analysis for peak performance, SEO, content strategy, and sustainability. Actionable insights for developers & marketers.",
  generator: "v0.dev",
  keywords: [
    "AI Website Analyzer",
    "SEO Audit Tool",
    "Website Performance",
    "Content Optimization",
    "Sustainability Score",
    "WebInSight",
    "Gradient Design",
    "Modern Web App",
  ],
  openGraph: {
    title: "WebInSight: AI-Powered Website Analysis & Optimization",
    description:
      "Elevate your website with WebInSight. AI-driven analysis for peak performance, SEO, content strategy, and sustainability.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WebInSight: AI-Powered Website Analysis & Optimization",
    description:
      "Elevate your website with WebInSight. AI-driven analysis for peak performance, SEO, content strategy, and sustainability.",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "hsl(220 20% 97%)" },
    { media: "(prefers-color-scheme: dark)", color: "hsl(220 25% 8%)" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ParticleBackground />
          <div className="relative flex min-h-screen flex-col">{children}</div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
