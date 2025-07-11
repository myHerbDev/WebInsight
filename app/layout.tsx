import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WSfynder - AI-Powered Website Analysis & Sustainability Insights",
  description:
    "Analyze your website's performance, sustainability, security, and SEO with AI-powered insights. Get actionable recommendations to improve your site's carbon footprint and user experience.",
  keywords: [
    "website analysis",
    "sustainability",
    "performance",
    "SEO",
    "security",
    "carbon footprint",
    "green hosting",
  ],
  authors: [{ name: "myHerb", url: "https://devSphere.com" }],
  creator: "myHerb (DevSphere Project)",
  publisher: "DevSphere",
  robots: "index, follow",
  openGraph: {
    title: "WSfynder - AI-Powered Website Analysis",
    description: "Analyze your website's performance, sustainability, and security with AI-powered insights.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "WSfynder - AI-Powered Website Analysis",
    description: "Get comprehensive insights into your website's performance and sustainability.",
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
              <div className="relative z-10 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
