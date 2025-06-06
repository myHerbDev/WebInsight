import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider" // Assuming you have this for shadcn/ui
import { Toaster } from "@/components/ui/toaster"

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
    // url: 'https://yourdomain.com', // Replace with your actual domain
    // images: [{ url: 'https://yourdomain.com/og-image.png' }], // Replace with your OG image
  },
  twitter: {
    card: "summary_large_image",
    title: "WebInSight: AI-Powered Website Analysis & Optimization",
    description:
      "Elevate your website with WebInSight. AI-driven analysis for peak performance, SEO, content strategy, and sustainability.",
    // site: '@yourtwitterhandle', // Replace with your Twitter handle
    // images: ['https://yourdomain.com/twitter-image.png'], // Replace with your Twitter image
  },
  themeColor: [
    // For PWA and browser theming
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
          <div className="relative flex min-h-screen flex-col">
            {/* Optional: Aurora background effect */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-background">
              <div className="absolute bottom-0 left-0 right-0 top-0 bg-aurora-gradient bg-[length:200%_200%] opacity-30 dark:opacity-20 animate-aurora"></div>
            </div>
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
