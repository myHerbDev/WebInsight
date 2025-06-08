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
  preload: true,
})

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL("https://wsfynder.com"),
  title: {
    default: "WSfynder - Advanced Website Analysis & Intelligence Platform",
    template: "%s | WSfynder",
  },
  description:
    "WSfynder is the ultimate website analysis platform providing comprehensive insights into performance, SEO, security, accessibility, and sustainability. Get detailed reports, AI-powered content generation, and actionable recommendations to optimize your website.",
  keywords: [
    "website analysis",
    "website analyzer",
    "SEO analysis",
    "website performance",
    "security audit",
    "accessibility testing",
    "sustainability metrics",
    "website intelligence",
    "site optimization",
    "web analytics",
    "WSfynder",
    "website insights",
    "performance monitoring",
    "technical SEO",
    "website audit",
    "digital marketing tools",
    "web development tools",
    "site speed test",
    "mobile optimization",
    "content analysis",
  ],
  authors: [{ name: "WSfynder Team", url: "https://wsfynder.com" }, { name: "Website Intelligence Solutions" }],
  creator: "WSfynder",
  publisher: "WSfynder",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://wsfynder.com",
    siteName: "WSfynder",
    title: "WSfynder - Advanced Website Analysis & Intelligence Platform",
    description:
      "Discover comprehensive website insights with WSfynder's advanced analysis platform. Get detailed reports on performance, SEO, security, accessibility, and sustainability metrics.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WSfynder - Website Analysis Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WSfynder - Advanced Website Analysis & Intelligence Platform",
    description: "Unlock comprehensive website insights with WSfynder's intelligent analysis and optimization tools.",
    images: ["/twitter-image.png"],
    creator: "@wsfynder",
    site: "@wsfynder",
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
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: "https://wsfynder.com",
    languages: {
      "en-US": "https://wsfynder.com",
      "es-ES": "https://wsfynder.com/es",
      "fr-FR": "https://wsfynder.com/fr",
    },
  },
  category: "technology",
  classification: "Website Analysis Tools",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "WSfynder",
    "application-name": "WSfynder",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#8b5cf6",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#8b5cf6",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(inter.variable, robotoMono.variable)}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased flex flex-col")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="wsfynder-theme"
        >
          <AuthProvider>
            <ErrorBoundary fallback={<div>Something went wrong. Please try refreshing.</div>}>
              <ParticleBackground />
              <Header />
              <main className="flex-1 relative z-10" role="main">
                <Suspense
                  fallback={
                    <div
                      className="flex h-[calc(100vh-8rem)] items-center justify-center"
                      role="status"
                      aria-label="Loading"
                    >
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      <span className="sr-only">Loading...</span>
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
