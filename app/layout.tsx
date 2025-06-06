import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary"
import { Analytics } from "@/components/analytics-provider"
import { cn } from "@/lib/utils"
import { Suspense } from "react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL("https://insight.myherb.co.il"),
  title: {
    default: "WebInSight - Advanced Website Intelligence Platform",
    template: "%s | WebInSight",
  },
  description:
    "Analyze and optimize your website for sustainability, performance, and security with AI-powered insights. Get comprehensive reports on carbon footprint, SEO, and technical performance.",
  keywords: [
    "website analysis",
    "sustainability",
    "carbon footprint",
    "web performance",
    "SEO optimization",
    "green hosting",
    "AI content generation",
    "website intelligence",
    "performance monitoring",
    "security analysis",
  ],
  authors: [{ name: "WebInSight Team", url: "https://insight.myherb.co.il" }],
  creator: "WebInSight",
  publisher: "WebInSight",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://insight.myherb.co.il",
    siteName: "WebInSight",
    title: "WebInSight - Advanced Website Intelligence Platform",
    description:
      "Analyze and optimize your website for sustainability, performance, and security with AI-powered insights.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WebInSight Platform - Website Intelligence Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WebInSight - Advanced Website Intelligence Platform",
    description:
      "Analyze and optimize your website for sustainability, performance, and security with AI-powered insights.",
    images: ["/og-image.png"],
    creator: "@webinsight",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/favicon.png", sizes: "any", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5bbad5",
      },
    ],
  },
  manifest: "/manifest.json",
  category: "technology",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(inter.variable, jetbrainsMono.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//api.groq.com" />
        <link rel="dns-prefetch" href="//vercel.com" />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="webinsight-theme"
        >
          <Suspense fallback={<div>Loading...</div>}>
            <ErrorBoundary>
              <div className="relative flex min-h-screen flex-col">
                <div className="flex-1">{children}</div>
              </div>
            </ErrorBoundary>
          </Suspense>
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
