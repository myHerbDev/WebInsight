import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css" // Ensure this is your primary global styles
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Ensure your Tailwind config uses this variable
})

export const metadata: Metadata = {
  title: "WebInSight - Advanced Website Analytics & AI Content Generation",
  description:
    "Analyze your website for sustainability, performance, and security. Generate AI-powered content based on insights.",
  keywords: [
    "website analysis",
    "sustainability",
    "carbon footprint",
    "web performance",
    "SEO",
    "AI content generation",
    "green hosting",
    "WebInSight",
  ],
  authors: [{ name: "WebInSight Team" }],
  creator: "WebInSight",
  publisher: "WebInSight",
  robots: "index, follow",
  openGraph: {
    title: "WebInSight - Advanced Website Analytics",
    description: "Analyze your website and generate AI-powered content.",
    type: "website",
    locale: "en_US",
    // url: 'https://yourdomain.com', // Replace with your actual domain
    // images: [{ url: 'https://yourdomain.com/og-image.png' }], // Replace with your OG image
  },
  twitter: {
    card: "summary_large_image",
    title: "WebInSight - Advanced Website Analytics",
    description: "Analyze your website and generate AI-powered content.",
    // site: '@yourtwitterhandle', // Replace with your Twitter handle
    // images: ['https://yourdomain.com/twitter-image.png'], // Replace with your Twitter image
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "hsl(220 20% 97%)" }, // Example light theme color
    { media: "(prefers-color-scheme: dark)", color: "hsl(220 25% 8%)" }, // Example dark theme color
  ],
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange // Added this prop, often helpful
        >
          <div className="relative flex min-h-screen flex-col">
            {/* ParticleBackground component removed for stability testing */}
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
