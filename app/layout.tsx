import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Roboto_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary"
import { AuthProvider } from "@/components/auth-provider"
import { cn } from "@/lib/utils"
import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ParticleBackground } from "@/components/particle-background"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const robotoMono = Roboto_Mono({
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
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" }, // Darker blue-gray
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL("https://wscrapierr.vercel.app"), // Replace with your actual domain
  title: {
    default: "WScrapierr - Intelligent Web Scraping & Content Platform",
    template: "%s | WScrapierr",
  },
  description:
    "WScrapierr offers intelligent web scraping, data analysis, and AI-powered content generation with a Google-inspired, magic-like interface.",
  keywords: [
    "web scraping",
    "data extraction",
    "content generation",
    "AI platform",
    "WScrapierr",
    "automation",
    "data analysis",
    "hosting information",
  ],
  authors: [{ name: "WScrapierr Team", url: "https://wscrapierr.vercel.app" }],
  creator: "WScrapierr",
  publisher: "WScrapierr",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://wscrapierr.vercel.app",
    siteName: "WScrapierr",
    title: "WScrapierr - Intelligent Web Scraping & Content Platform",
    description: "Experience the magic of intelligent web scraping and AI content generation with WScrapierr.",
    images: [
      {
        url: "/og-image.png", // Will need to create this
        width: 1200,
        height: 630,
        alt: "WScrapierr Platform Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WScrapierr - Intelligent Web Scraping & Content Platform",
    description: "Unlock the power of the web with WScrapierr's magical scraping and content tools.",
    images: ["/og-image.png"], // Will need to create this
    // creator: "@wscrapierr_handle", // Replace with actual Twitter handle
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico", // Will need to create this
    apple: "/apple-touch-icon.png", // Will need to create this
  },
  manifest: "/manifest.json", // Will need to create this
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(inter.variable, robotoMono.variable)}>
      <head />
      <body className={cn("min-h-screen bg-background font-sans antialiased flex flex-col")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="wscrapierr-theme"
        >
          <AuthProvider>
            <ErrorBoundary fallback={<p>Something went wrong. Please try refreshing.</p>}>
              <ParticleBackground />
              <Header />
              <main className="flex-1 relative z-10">
                <Suspense
                  fallback={
                    <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  }
                >
                  {children}
                </Suspense>
              </main>
              <Footer />
            </ErrorBoundary>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
