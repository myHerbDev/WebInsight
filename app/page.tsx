"use client"

import { useState } from "react"
import { Zap, Leaf, Shield, Search, Eye, Brain, BarChart3, Globe, Sparkles, TrendingUp, Award } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MagicalWebsiteInput } from "@/components/magical-website-input"
import { ResultsSection } from "@/components/results-section"
import { SocialShare } from "@/components/social-share"
import type { WebsiteData, AnalysisOptions } from "@/types/website-data"
import { safeFetch } from "@/lib/safe-fetch"
import FeatureBadge from "./FeatureBadge" // Import FeatureBadge component

export default function HomePage() {
  const [analysisData, setAnalysisData] = useState<WebsiteData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  /** Triggered when the user submits a URL in MagicalWebsiteInput */
  const handleAnalyzeWebsite = async (urlToAnalyze: string) => {
    if (!urlToAnalyze.trim()) return

    // Ensure URL has a protocol for the backend
    let formattedUrl = urlToAnalyze.trim()
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`
    }

    setIsLoading(true)
    setAnalysisData(null)

    // Default analysis options – tweak as desired
    const analysisOptions: AnalysisOptions = {
      includeAdvancedMetrics: true,
      analyzeSEO: true,
      checkAccessibility: true,
      analyzePerformance: true,
      checkSecurity: true,
      analyzeSustainability: true,
      includeContentAnalysis: true,
      checkMobileOptimization: true,
      analyzeLoadingSpeed: true,
      checkSocialMedia: true,
    }

    try {
      const { success, data, error } = await safeFetch<WebsiteData>("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formattedUrl, ...analysisOptions }),
        timeout: 45_000,
      })

      if (!success || !data) throw new Error(error || "Unknown analysis error")
      setAnalysisData(data)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Analysis failed:", err)
      alert("Analysis failed.\nPlease check the URL or try again in a moment.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* ---------------- HERO ---------------- */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-blue-600/5 to-green-600/5" />
        {/* blurred blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-300/20 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <Badge
            variant="secondary"
            className="mb-6 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Website Analysis Platform
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent leading-tight">
            Unlock Your Website&apos;s
            <span className="block bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Full Potential
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Get comprehensive insights into your site&rsquo;s performance, sustainability, security, and SEO with our
            advanced AI analysis.
          </p>

          {/* quick badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <FeatureBadge Icon={BarChart3} text="Performance Analysis" />
            <FeatureBadge Icon={Leaf} text="Sustainability Insights" />
            <FeatureBadge Icon={Brain} text="AI Recommendations" />
          </div>

          {/* INPUT */}
          <div className="max-w-2xl mx-auto">
            <MagicalWebsiteInput onAnalyze={handleAnalyzeWebsite} isLoading={isLoading} />
          </div>
        </div>
      </section>

      {/* --------------- RESULTS --------------- */}
      {(analysisData || isLoading) && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <ResultsSection data={analysisData} isLoading={isLoading} />
            {analysisData && (
              <div className="mt-8 flex justify-center">
                <SocialShare
                  url={typeof window !== "undefined" ? window.location.href : ""}
                  title={`Analysis report for ${analysisData.title}`}
                  description={analysisData.summary}
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* ------------- FEATURES --------------- */}
      <FeaturesSection />

      {/* -------------- STATS ----------------- */}
      <StatsSection />

      {/* --------------- CTA ------------------ */}
      <CTASection />
    </div>
  )
}

/* ---------- extracted large sections for clarity ---------- */

function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Blazing Performance",
      desc: "Uncover speed bottlenecks & optimize Core Web Vitals for a lightning-fast UX.",
      gradient: "from-orange-500 to-red-500",
      bg: "from-orange-50 to-red-50",
    },
    {
      icon: Leaf,
      title: "Eco-Friendly Insights",
      desc: "Analyze sustainability, reduce your carbon footprint, and find greener hosting.",
      gradient: "from-green-500 to-emerald-500",
      bg: "from-green-50 to-emerald-50",
    },
    {
      icon: Shield,
      title: "Robust Security",
      desc: "Assess SSL, headers, and common vulnerabilities to fortify your site.",
      gradient: "from-blue-500 to-indigo-500",
      bg: "from-blue-50 to-indigo-50",
    },
    {
      icon: Search,
      title: "SEO & Content Strategy",
      desc: "Audit SEO best practices and generate AI-driven content ideas.",
      gradient: "from-purple-500 to-pink-500",
      bg: "from-purple-50 to-pink-50",
    },
    {
      icon: Eye,
      title: "Accessibility Audits",
      desc: "Ensure your website is inclusive and usable by everyone.",
      gradient: "from-teal-500 to-cyan-500",
      bg: "from-teal-50 to-cyan-50",
    },
    {
      icon: Brain,
      title: "AI-Powered Recommendations",
      desc: "Get actionable, intelligent suggestions tailored to your website’s needs.",
      gradient: "from-violet-500 to-purple-500",
      bg: "from-violet-50 to-purple-50",
    },
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <Badge
            variant="secondary"
            className="mb-4 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200"
          >
            <Award className="w-4 h-4 mr-2" />
            Why Choose WebInSight?
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Comprehensive Website Analysis
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform provides deep insights across all aspects of your site, helping you optimise
            performance, sustainability and UX.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <Card
              key={f.title}
              className={`group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br ${f.bg} hover:${f.bg.replace(
                "50",
                "100",
              )}`}
            >
              <CardContent className="p-8">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${f.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <f.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatsSection() {
  const stats = [
    { value: "10K+", label: "Websites Analyzed" },
    { value: "95%", label: "Accuracy Rate" },
    { value: "2.5M", label: "CO₂ Saved (kg)" },
    { value: "24/7", label: "AI Monitoring" },
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600">
      <div className="container mx-auto grid md:grid-cols-4 gap-8 text-center text-white">
        {stats.map((s) => (
          <div key={s.label} className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold">{s.value}</div>
            <div className="text-purple-100">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Ready to Optimise Your Website?
          </h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands who trust WebInSight for comprehensive analysis.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
              onClick={() => document.querySelector<HTMLInputElement>('input[placeholder*="http"]')?.focus() ?? null}
            >
              <Globe className="w-5 h-5 mr-2" />
              Analyse Your Website
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-purple-200 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg bg-transparent"
              onClick={() => window.open("/docs", "_blank")}
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              View Documentation
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
