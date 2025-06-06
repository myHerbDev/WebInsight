"use client"

import { useEffect, useState } from "react"

export function LoadingAnimation() {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("Analyzing website...")

  useEffect(() => {
    const texts = [
      "Analyzing website...",
      "Checking performance...",
      "Evaluating SEO...",
      "Measuring sustainability...",
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
      {/* Google-style loading animation */}
      <div className="relative w-20 h-20 mb-8">
        <div className="absolute inset-0 border-4 border-t-blue-600 border-r-red-500 border-b-yellow-500 border-l-green-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-t-transparent border-r-transparent border-b-transparent border-l-blue-600 rounded-full animate-spin-slow"></div>
        <div className="absolute inset-4 border-4 border-t-green-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin-reverse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">{loadingText}</p>

        {/* Google-style progress bar */}
        <div className="w-64 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
            style={{ width: `${progress}%`, transition: "width 0.5s ease-out" }}
          ></div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">This may take a moment...</p>
      </div>
    </div>
  )
}
