import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google" // Assuming you are using Inter

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Make sure this matches your tailwind.config.ts
})

export const metadata: Metadata = {
  title: "WebInSight: AI-Powered Website Analysis & Optimization Tool",
  description:
    "Boost your website with WebInSight! Get AI-powered analysis of performance, SEO, content, and sustainability. Actionable insights & recommendations for developers & marketers.",
  generator: "v0.dev",
  keywords: [
    "Website Analyzer",
    "SEO Audit",
    "Performance Check",
    "Sustainability Score",
    "Content Analysis",
    "AI Website Tool",
    "WebInSight",
    "Website Optimization",
  ],
  openGraph: {
    title: "WebInSight: AI-Powered Website Analysis & Optimization Tool",
    description:
      "Boost your website with WebInSight! Get AI-powered analysis of performance, SEO, content, and sustainability.",
    type: "website",
    // url: 'https://yourdomain.com', // Replace with your actual domain
    // images: [{ url: 'https://yourdomain.com/og-image.png' }], // Replace with your OG image
  },
  twitter: {
    card: "summary_large_image",
    title: "WebInSight: AI-Powered Website Analysis & Optimization Tool",
    description:
      "Boost your website with WebInSight! Get AI-powered analysis of performance, SEO, content, and sustainability.",
    // site: '@yourtwitterhandle', // Replace with your Twitter handle
    // images: ['https://yourdomain.com/twitter-image.png'], // Replace with your Twitter image
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
