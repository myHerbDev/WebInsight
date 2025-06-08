"use client"

import { useState, useEffect } from "react"

export function LoadingAnimation() {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const steps = [
    { text: "🔍 Scanning website structure...", emoji: "🔍" },
    { text: "⚡ Analyzing performance metrics...", emoji: "⚡" },
    { text: "🛡️ Evaluating security measures...", emoji: "🛡️" },
    { text: "📊 Processing SEO data...", emoji: "📊" },
    { text: "📱 Testing mobile responsiveness...", emoji: "📱" },
    { text: "♿ Checking accessibility features...", emoji: "♿" },
    { text: "🌱 Calculating sustainability impact...", emoji: "🌱" },
    { text: "🎨 Reviewing design patterns...", emoji: "🎨" },
    { text: "✨ Generating insights...", emoji: "✨" },
  ]

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 2000)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95
        return prev + Math.random() * 8 + 2
      })
    }, 300)

    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
    }
  }, [steps.length])

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-8">
      {/* Main Loading Animation with myHerb Gradients */}
      <div className="relative">
        {/* Outer Ring with Gradient */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-200 via-green-200 to-purple-200 p-1 animate-spin">
          <div className="w-full h-full bg-white rounded-full"></div>
        </div>

        {/* Animated Rings */}
        <div
          className="absolute inset-2 w-28 h-28 rounded-full bg-gradient-to-r from-purple-500 via-green-500 to-purple-500 p-1 animate-spin"
          style={{ animationDuration: "2s" }}
        >
          <div className="w-full h-full bg-white rounded-full"></div>
        </div>

        <div
          className="absolute inset-4 w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-green-500 p-1 animate-spin"
          style={{ animationDuration: "1.5s", animationDirection: "reverse" }}
        >
          <div className="w-full h-full bg-white rounded-full"></div>
        </div>

        {/* Center Core with Pulsing Gradient */}
        <div className="absolute inset-8 w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-green-500 animate-pulse shadow-md flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-green-500 animate-bounce"></div>
          </div>
        </div>
      </div>

      {/* Enhanced Progress Bar */}
      <div className="w-80 max-w-full">
        <div className="bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-green-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
          </div>
        </div>
        <div className="flex justify-between text-sm font-medium text-gray-600 mt-3">
          <span>Analyzing Website...</span>
          <span className="bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent font-bold">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Status Text with Gradients */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <span className="text-5xl animate-bounce" style={{ animationDelay: "0.1s" }}>
            {steps[currentStep].emoji}
          </span>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
            myHerb Insight
          </h3>
        </div>

        <p className="text-gray-600 text-lg max-w-md mx-auto font-medium">{steps[currentStep].text}</p>

        <div className="flex justify-center space-x-2 mt-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "bg-gradient-to-r from-purple-500 to-green-500 scale-125"
                  : index < currentStep
                    ? "bg-green-500"
                    : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
