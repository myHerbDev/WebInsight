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
  metadataBase: new URL("https://wsfynder.vercel.app"), // Replace with your actual domain
  title: {
    default: "WSfynder - Intelligent Website Analysis & Content Platform",
    template: "%s | WSfynder",
  },
  description:
    "WSfynder offers intelligent website analysis, comprehensive data insights, and AI-powered content generation with professional-grade accuracy.",
  keywords: [
    "website analysis",
    "website finder",
    "data extraction",
    "content generation",
    "AI platform",
    "WSfynder",
    "website insights",
    "data analysis",
    "hosting information",
    "website intelligence",
  ],
  authors: [{ name: "WScrapierr Team", url: "https://wscrapierr.vercel.app" }],
  creator: "WScrapierr",
  publisher: "WScrapierr",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://wsfynder.vercel.app",
    siteName: "WSfynder",
    title: "WSfynder - Intelligent Website Analysis & Content Platform",
    description:
      "Discover comprehensive website insights and generate professional content with WSfynder's advanced AI-powered analysis platform.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WSfynder Platform Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WSfynder - Intelligent Website Analysis & Content Platform",
    description:
      "Unlock comprehensive website insights with WSfynder's intelligent analysis and content generation tools.",
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
          storageKey="wsfynder-theme"
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
