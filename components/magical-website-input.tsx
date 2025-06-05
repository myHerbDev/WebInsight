"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Globe, Sparkles, Zap, Search, TrendingUp, Shield, Leaf } from "lucide-react"
import { motion, useAnimation } from "framer-motion"

interface MagicalWebsiteInputProps {
  onAnalyze: (url: string) => void
  isLoading?: boolean
}

export function MagicalWebsiteInput({ onAnalyze, isLoading = false }: MagicalWebsiteInputProps) {
  const [url, setUrl] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const controls = useAnimation()

  useEffect(() => {
    setIsMounted(true)
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

  const floatingIcons = [
    { Icon: Globe, delay: 0, color: "text-blue-400" },
    { Icon: Sparkles, delay: 0.5, color: "text-purple-400" },
    { Icon: Zap, delay: 1, color: "text-yellow-400" },
    { Icon: TrendingUp, delay: 1.5, color: "text-green-400" },
    { Icon: Shield, delay: 2, color: "text-red-400" },
    { Icon: Leaf, delay: 2.5, color: "text-emerald-400" },
  ]

  return (
    <div className="relative min-h-[500px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30 rounded-3xl">
      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, delay, color }, index) => (
        <motion.div
          key={index}
          className={`absolute ${color} opacity-10`}
          initial={{ scale: 0, rotate: 0 }}
          animate={{
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            delay: delay,
            ease: "easeInOut",
          }}
          style={{
            left: `${20 + index * 12}%`,
            top: `${30 + index * 8}%`,
          }}
        >
          <Icon size={32} />
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8"
        >
          {/* Google-style Logo and Title */}
          <div className="space-y-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="text-6xl font-light text-gray-700 tracking-wide">
                Web<span className="text-blue-500">In</span>
                <span className="text-green-500">Sight</span>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-gray-600 max-w-xl mx-auto"
            >
              Analyze any website's performance, sustainability, security, and generate AI-powered content
            </motion.p>
          </div>

          {/* Google-style Search Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="relative max-w-xl mx-auto"
          >
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative group">
                {/* Search Box */}
                <div
                  className={`relative flex items-center bg-white rounded-full border border-gray-300 hover:shadow-lg transition-all duration-300 ${
                    isFocused ? "shadow-lg border-blue-300" : "shadow-md"
                  }`}
                >
                  <Search className="absolute left-4 w-5 h-5 text-gray-400" />

                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter website URL (e.g., example.com)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="pl-12 pr-20 py-4 h-14 bg-transparent border-none rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0"
                    disabled={isLoading}
                  />

                  {/* Search Button */}
                  <Button
                    type="submit"
                    disabled={!url.trim() || isLoading}
                    className="absolute right-2 h-10 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all duration-300 disabled:opacity-50"
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

              {/* Google-style Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex justify-center space-x-4 mt-8"
              >
                <Button
                  type="submit"
                  disabled={!url.trim() || isLoading}
                  variant="outline"
                  className="bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-700 px-6 py-2 rounded-md transition-all duration-200 hover:shadow-md"
                >
                  {isLoading ? "Analyzing..." : "Website Analysis"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const randomSites = ["google.com", "github.com", "vercel.com", "openai.com", "stripe.com"]
                    const randomSite = randomSites[Math.floor(Math.random() * randomSites.length)]
                    setUrl(randomSite)
                  }}
                  className="bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-700 px-6 py-2 rounded-md transition-all duration-200 hover:shadow-md"
                >
                  I'm Feeling Lucky
                </Button>
              </motion.div>
            </form>
          </motion.div>

          {/* Feature Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {[
              { icon: TrendingUp, text: "Performance", color: "bg-green-50 text-green-700 border-green-200" },
              { icon: Shield, text: "Security", color: "bg-blue-50 text-blue-700 border-blue-200" },
              { icon: Leaf, text: "Sustainability", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
              { icon: Sparkles, text: "AI Content", color: "bg-purple-50 text-purple-700 border-purple-200" },
            ].map(({ icon: Icon, text, color }, index) => (
              <motion.div
                key={text}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border ${color} text-sm font-medium`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="flex flex-wrap justify-center items-center gap-6 text-xs text-gray-500"
          >
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span>Real-time Analysis</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3 text-blue-500" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-purple-500" />
              <span>AI-Powered</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
