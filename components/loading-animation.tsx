"use client"

import { useEffect, useState } from "react"

export function LoadingAnimation() {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("Initializing analysis...")

  useEffect(() => {
    const texts = [
      "Initializing analysis...",
      "Scanning website structure...",
      "Evaluating performance metrics...",
      "Analyzing SEO factors...",
      "Calculating sustainability score...",
      "Generating insights...",
    ]

    let currentTextIndex = 0
    const textInterval = setInterval(() => {
      currentTextIndex = (currentTextIndex + 1) % texts.length
      setLoadingText(texts[currentTextIndex])
    }, 2000)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return 95
        }
        return prev + Math.random() * 10
      })
    }, 800)

    return () => {
      clearInterval(textInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="futuristic-loader mb-8">
        <div className="loader-ring loader-ring-1"></div>
        <div className="loader-ring loader-ring-2"></div>
        <div className="loader-ring loader-ring-3"></div>
        <div className="loader-core"></div>
      </div>

      <div className="text-center">
        <p className="text-xl font-medium mb-4 gradient-text" data-text={loadingText}>
          {loadingText}
        </p>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-white/20 dark:bg-slate-700/30 rounded-full overflow-hidden mb-3 relative">
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(to right, hsl(var(--primary)), hsl(var(--accent)))`,
              transition: "width 0.5s ease-out",
              boxShadow: "0 0 10px rgba(var(--primary), 0.5)",
            }}
          ></div>

          {/* Animated glow effect */}
          <div
            className="absolute top-0 left-0 h-full w-20 bg-white/30"
            style={{
              transform: `translateX(${progress}%)`,
              filter: "blur(10px)",
              transition: "transform 0.5s ease-out",
            }}
          ></div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">{Math.round(progress)}% complete</p>
      </div>
    </div>
  )
}
