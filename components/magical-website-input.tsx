"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Globe, Sparkles, Zap, TrendingUp, Shield, Leaf } from "lucide-react"
import { motion, useAnimation } from "framer-motion"
import { ClientOnly } from "./client-only"

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
    <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(20,184,166,0.1),transparent_50%)]" />
      </div>

      {/* Floating Particles - Client Only */}
      <ClientOnly>
        {isMounted && (
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                initial={{
                  x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
                  y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
                }}
                animate={{
                  y: [null, -100],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        )}
      </ClientOnly>

      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, delay, color }, index) => (
        <motion.div
          key={index}
          className={`absolute ${color} opacity-20`}
          initial={{ scale: 0, rotate: 0 }}
          animate={{
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
            x: [0, Math.random() * 200 - 100],
            y: [0, Math.random() * 200 - 100],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            delay: delay,
            ease: "easeInOut",
          }}
          style={{
            left: `${20 + index * 15}%`,
            top: `${20 + index * 10}%`,
          }}
        >
          <Icon size={24} />
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          {/* Magical Title */}
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-teal-500/20 border border-purple-500/30"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">AI-Powered Analysis</span>
              <Sparkles className="w-4 h-4 text-teal-400" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold leading-tight"
            >
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                Unlock Your Website's
              </span>
              <br />
              <span className="bg-gradient-to-r from-teal-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Hidden Potential
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Discover sustainability insights, performance metrics, and AI-powered recommendations to transform your
              digital presence
            </motion.p>
          </div>

          {/* Magical Input Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="relative max-w-2xl mx-auto"
          >
            {/* Glowing Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-teal-500/20 rounded-2xl blur-xl" />

            {/* Form Container */}
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
              {/* Rotating Border Effect - Client Only */}
              <ClientOnly>
                <motion.div
                  animate={controls}
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 opacity-20"
                  style={{
                    background: "conic-gradient(from 0deg, #8B5CF6, #3B82F6, #14B8A6, #8B5CF6)",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "xor",
                    padding: "2px",
                  }}
                />
              </ClientOnly>

              <form onSubmit={handleSubmit} className="relative space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-200">Enter Website URL</label>

                  <div className="relative group">
                    {/* Input Glow Effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-purple-500/30 to-teal-500/30 rounded-xl blur transition-all duration-300 ${
                        isFocused ? "opacity-100 scale-105" : "opacity-0 scale-100"
                      }`}
                    />

                    <div className="relative flex items-center">
                      <Globe
                        className={`absolute left-4 w-5 h-5 transition-colors duration-300 ${
                          isFocused ? "text-purple-400" : "text-gray-400"
                        }`}
                      />

                      <Input
                        ref={inputRef}
                        type="text"
                        placeholder="example.com or https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="pl-12 pr-4 py-4 h-14 bg-white/5 border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                        disabled={isLoading}
                      />

                      {/* Magic Sparkle Effect */}
                      {isFocused && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4">
                          <Sparkles className="w-5 h-5 text-purple-400" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Magical Submit Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    disabled={!url.trim() || isLoading}
                    className="w-full h-14 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 hover:from-purple-700 hover:via-blue-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                  >
                    {/* Button Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                    <div className="relative flex items-center justify-center space-x-2">
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          >
                            <Sparkles className="w-5 h-5" />
                          </motion.div>
                          <span>Analyzing Magic...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          <span>Analyze Website</span>
                          <motion.div
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                          >
                            →
                          </motion.div>
                        </>
                      )}
                    </div>
                  </Button>
                </motion.div>
              </form>

              {/* Feature Pills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="flex flex-wrap justify-center gap-3 mt-6"
              >
                {[
                  { icon: TrendingUp, text: "Performance", color: "from-green-400 to-emerald-400" },
                  { icon: Shield, text: "Security", color: "from-blue-400 to-cyan-400" },
                  { icon: Leaf, text: "Sustainability", color: "from-emerald-400 to-teal-400" },
                ].map(({ icon: Icon, text, color }, index) => (
                  <motion.div
                    key={text}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r ${color} bg-opacity-20 border border-white/20`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-400"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Real-time Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI-Powered Insights</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
