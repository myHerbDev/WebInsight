import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-provider"

export const metadata: Metadata = {
  title: "WebInSight - Sustainable Website Analytics & Optimization",
  description:
    "Analyze and optimize your website for sustainability, performance, and security with AI-powered insights",
  generator: "v0.dev",
  keywords: "website sustainability, carbon footprint, web performance, SEO optimization, green hosting",
  authors: [{ name: "WebInSight Team" }],
  creator: "WebInSight",
  publisher: "WebInSight",
  robots: "index, follow",
  openGraph: {
    title: "WebInSight - Sustainable Website Analytics",
    description: "Analyze and optimize your website for sustainability, performance, and security",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "WebInSight - Sustainable Website Analytics",
    description: "Analyze and optimize your website for sustainability, performance, and security",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/favicon.png", sizes: "any", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
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
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
