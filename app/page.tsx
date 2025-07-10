"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MagicalWebsiteInput } from "@/components/magical-website-input"
import { ResultsSection } from "@/components/results-section"
import { SocialShare } from "@/components/social-share"
import { LoginModal } from "@/components/login-modal"
import { UserProfileButton } from "@/components/user-profile-button"
import { Logo } from "@/components/logo"
import { Zap, Leaf, Shield, Search, Eye, Brain, BarChart3, Globe, Sparkles, TrendingUp, Award } from "lucide-react"
import type { WebsiteData } from "@/types/website-data"

export default function HomePage() {
  const [analysisData, setAnalysisData] = useState<WebsiteData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleAnalysisComplete = (data: WebsiteData) => {
    setAnalysisData(data)
    setIsAnalyzing(false)
  }

  const handleAnalysisStart = () => {
    setIsAnalyzing(true)
    setAnalysisData(null)
  }

  const handleAnalysisError = () => {
    setIsAnalyzing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-purple-100/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Logo />
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                  WebInSight
                </h1>
                <p className="text-sm text-gray-600">AI-Powered Website Analysis</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <a href="/hosting" className="text-gray-600 hover:text-purple-600 transition-colors">
                Hosting
              </a>
              <a href="/recommendations" className="text-gray-600 hover:text-purple-600 transition-colors">
                Recommendations
              </a>
              <a href="/docs" className="text-gray-600 hover:text-purple-600 transition-colors">
                Docs
              </a>
              <a href="/blog" className="text-gray-600 hover:text-purple-600 transition-colors">
                Blog
              </a>
            </nav>

            <div className="flex items-center space-x-3">
              <UserProfileButton onLoginClick={() => setShowLoginModal(true)} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-blue-600/5 to-green-600/5" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-300/20 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-6 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Website Analysis Platform
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent leading-tight">
              Unlock Your Website's
              <span className="block bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Full Potential
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Get comprehensive insights into your website's performance, sustainability, security, and SEO with our
              advanced AI-powered analysis platform.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-purple-100">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Performance Analysis</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-green-100">
                <Leaf className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Sustainability Insights</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-100">
                <Brain className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">AI Recommendations</span>
              </div>
            </div>

            {/* Website Input */}
            <div className="max-w-2xl mx-auto">
              <MagicalWebsiteInput
                onAnalysisComplete={handleAnalysisComplete}
                onAnalysisStart={handleAnalysisStart}
                onAnalysisError={handleAnalysisError}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {(analysisData || isAnalyzing) && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <ResultsSection data={analysisData} isLoading={isAnalyzing} />
            {analysisData && (
              <div className="mt-8 flex justify-center">
                <SocialShare
                  url={typeof window !== "undefined" ? window.location.href : ""}
                  title={`Check out the analysis of ${analysisData.title}`}
                  description={analysisData.summary}
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Why WSfynder Section */}
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
              Our AI-powered platform provides deep insights across all aspects of your website, helping you optimize
              for performance, sustainability, and user experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Blazing Performance */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Blazing Performance</h3>
                <p className="text-gray-600 leading-relaxed">
                  Uncover speed bottlenecks & optimize Core Web Vitals for a lightning-fast UX.
                </p>
              </CardContent>
            </Card>

            {/* Eco-Friendly Insights */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Eco-Friendly Insights</h3>
                <p className="text-gray-600 leading-relaxed">
                  Analyze sustainability, reduce your carbon footprint, and find greener hosting.
                </p>
              </CardContent>
            </Card>

            {/* Robust Security */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Robust Security</h3>
                <p className="text-gray-600 leading-relaxed">
                  Assess SSL, headers, and common vulnerabilities to fortify your site.
                </p>
              </CardContent>
            </Card>

            {/* SEO & Content Strategy */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">SEO & Content Strategy</h3>
                <p className="text-gray-600 leading-relaxed">
                  Audit SEO best practices and generate AI-driven content ideas.
                </p>
              </CardContent>
            </Card>

            {/* Accessibility Audits */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Accessibility Audits</h3>
                <p className="text-gray-600 leading-relaxed">
                  Ensure your website is inclusive and usable by everyone.
                </p>
              </CardContent>
            </Card>

            {/* AI-Powered Recommendations */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">AI-Powered Recommendations</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get actionable, intelligent suggestions tailored to your website's needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">10K+</div>
              <div className="text-purple-100">Websites Analyzed</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">95%</div>
              <div className="text-blue-100">Accuracy Rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">2.5M</div>
              <div className="text-green-100">CO2 Saved (kg)</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">24/7</div>
              <div className="text-purple-100">AI Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Ready to Optimize Your Website?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of developers and businesses who trust WebInSight for comprehensive website analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
                onClick={() => document.querySelector('input[placeholder*="Enter"]')?.focus()}
              >
                <Globe className="w-5 h-5 mr-2" />
                Analyze Your Website
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

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignUp={() => {
          setShowLoginModal(false)
        }}
      />
    </div>
  )
}
