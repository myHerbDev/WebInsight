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
    <div className="flex flex-col items-center justify-center space-y-8 py-12">
      {/* Main Loading Animation with Enhanced Gradients */}
      <div className="relative">
        {/* Outer Ring with Gradient */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 p-1 animate-spin">
          <div className="w-full h-full bg-white rounded-full"></div>
        </div>

        {/* Animated Rings */}
        <div
          className="absolute inset-2 w-28 h-28 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 animate-spin"
          style={{ animationDuration: "2s" }}
        >
          <div className="w-full h-full bg-white rounded-full"></div>
        </div>

        <div
          className="absolute inset-4 w-24 h-24 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 p-1 animate-spin"
          style={{ animationDuration: "1.5s", animationDirection: "reverse" }}
        >
          <div className="w-full h-full bg-white rounded-full"></div>
        </div>

        {/* Center Core with Pulsing Gradient */}
        <div className="absolute inset-8 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse shadow-lg flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-bounce"></div>
          </div>
        </div>

        {/* Floating Particles with Gradients */}
        <div className="absolute -inset-8">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-bounce opacity-70"
              style={{
                left: `${20 + ((i * 45) % 360)}%`,
                top: `${30 + ((i * 60) % 360)}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${2 + (i % 2)}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Progress Bar */}
      <div className="w-80 max-w-full">
        <div className="bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-pulse"></div>
          </div>
        </div>
        <div className="flex justify-between text-sm font-medium text-gray-600 mt-3">
          <span>Analyzing Website...</span>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
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
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            WSfynder Analysis
          </h3>
        </div>

        <p className="text-gray-600 text-lg max-w-md mx-auto font-medium">{steps[currentStep].text}</p>

        <div className="flex justify-center space-x-2 mt-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 scale-125"
                  : index < currentStep
                    ? "bg-gradient-to-r from-emerald-400 to-green-500"
                    : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {["🚀", "⚡", "🔍", "📊", "🎯", "✨"].map((emoji, i) => (
          <div
            key={i}
            className="absolute text-3xl opacity-20 animate-bounce"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + i * 10}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${4 + (i % 2)}s`,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>
    </div>
  )
}
