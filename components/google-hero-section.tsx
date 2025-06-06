"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { Search, Sparkles, TrendingUp, Shield, Leaf, Zap, Globe, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface GoogleHeroSectionProps {
  onAnalyze: (url: string) => void
  isLoading?: boolean
}

export function GoogleHeroSection({ onAnalyze, isLoading = false }: GoogleHeroSectionProps) {
  const [url, setUrl] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const controls = useAnimation()

  useEffect(() => {
    controls.start({
      rotate: [0, 360],
      transition: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
    })
  }, [controls])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      let formattedUrl = url.trim()
      if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
        formattedUrl = `https://${formattedUrl}`
      }
      onAnalyze(formattedUrl)
    }
  }

  const popularSites = ["google.com", "github.com", "vercel.com", "openai.com", "stripe.com", "netflix.com"]

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50/30 via-white to-green-50/30">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-green-400 rounded-full opacity-40" />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          {/* Google-style Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-7xl md:text-8xl font-light tracking-tight">
              <span className="text-blue-500">Web</span>
              <span className="text-red-500">In</span>
              <span className="text-yellow-500">S</span>
              <span className="text-blue-500">i</span>
              <span className="text-green-500">g</span>
              <span className="text-red-500">ht</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-normal">
              Analyze any website's performance, sustainability, and security with AI-powered insights
            </p>
          </motion.div>

          {/* Google-style Search Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative group">
                <div
                  className={`relative flex items-center bg-white rounded-full google-shadow-lg transition-all duration-300 ${
                    isFocused ? "google-shadow-xl scale-105" : ""
                  }`}
                >
                  <Search className="absolute left-6 w-5 h-5 text-gray-400" />

                  <Input
                    type="text"
                    placeholder="Enter website URL (e.g., example.com)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="pl-14 pr-24 py-6 h-16 bg-transparent border-none rounded-full text-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0"
                    disabled={isLoading}
                  />

                  <Button
                    type="submit"
                    disabled={!url.trim() || isLoading}
                    className="absolute right-3 h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-300 disabled:opacity-50 google-shadow"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <Sparkles className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </form>

            {/* Google-style Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4 mt-8"
            >
              <Button
                type="button"
                onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                disabled={!url.trim() || isLoading}
                className="google-button-secondary"
              >
                {isLoading ? "Analyzing Website..." : "Website Analysis"}
              </Button>

              <Button
                type="button"
                onClick={() => {
                  const randomSite = popularSites[Math.floor(Math.random() * popularSites.length)]
                  setUrl(randomSite)
                }}
                className="google-button-secondary"
              >
                I'm Feeling Lucky
              </Button>
            </motion.div>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {[
              { icon: TrendingUp, text: "Performance", color: "bg-green-50 text-green-700 border-green-200" },
              { icon: Shield, text: "Security", color: "bg-blue-50 text-blue-700 border-blue-200" },
              { icon: Leaf, text: "Sustainability", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
              { icon: Sparkles, text: "AI Content", color: "bg-purple-50 text-purple-700 border-purple-200" },
              { icon: Zap, text: "Speed Test", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
              { icon: Globe, text: "SEO Analysis", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
            ].map(({ icon: Icon, text, color }, index) => (
              <motion.div
                key={text}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.0 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${color} text-sm font-medium google-shadow hover:google-shadow-lg transition-all duration-200 cursor-default`}
              >
                <Icon className="w-4 h-4" />
                <span>{text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Real-time Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>AI-Powered Insights</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-purple-500" />
              <span>Instant Results</span>
            </div>
          </motion.div>

          {/* Popular Websites Quick Access */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="space-y-3"
          >
            <p className="text-sm text-gray-500">Try analyzing popular websites:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularSites.slice(0, 4).map((site, index) => (
                <motion.button
                  key={site}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setUrl(site)}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors duration-200"
                >
                  {site}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgb(66, 133, 244) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgb(52, 168, 83) 0%, transparent 50%)`,
          }}
        />
      </div>
    </div>
  )
}
