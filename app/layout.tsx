import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-provider"

export const metadata: Metadata = {
  title: "WebInSight - Advanced Website Intelligence Platform",
  description:
    "Analyze and optimize your website for sustainability, performance, and security with AI-powered insights",
  generator: "v0.dev",
  keywords:
    "website sustainability, carbon footprint, web performance, SEO optimization, green hosting, AI content generation",
  authors: [{ name: "WebInSight Team" }],
  creator: "WebInSight",
  publisher: "WebInSight",
  robots: "index, follow",
  openGraph: {
    title: "WebInSight - Advanced Website Intelligence Platform",
    description: "Analyze and optimize your website for sustainability, performance, and security",
    type: "website",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "WebInSight Platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WebInSight - Advanced Website Intelligence Platform",
    description: "Analyze and optimize your website for sustainability, performance, and security",
    images: [{ url: "/og-image.png", alt: "WebInSight Platform" }],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/favicon.png", sizes: "any", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  metadataBase: new URL("https://webinsight.vercel.app"),
  verification: {
    vercel: "team_bcMJJbSeQs7En2myDnhQWgiG",
  },
  appleWebApp: {
    title: "WebInSight",
    statusBarStyle: "black-translucent",
  },
  applicationName: "WebInSight",
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="vercel-team" content="team_bcMJJbSeQs7En2myDnhQWgiG" />
        <meta name="vercel-id" content="meu5EDoHamgigwooq3u9tQJW" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
