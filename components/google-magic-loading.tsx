"use client"

import { useEffect, useState } from "react"
import { Sparkles, Zap, Brain, Search, BarChart3, Shield } from "lucide-react"

const loadingSteps = [
  { icon: Search, text: "Fetching website content...", color: "text-blue-500" },
  { icon: Brain, text: "Analyzing with AI...", color: "text-purple-500" },
  { icon: BarChart3, text: "Calculating performance metrics...", color: "text-green-500" },
  { icon: Shield, text: "Checking security features...", color: "text-red-500" },
  { icon: Sparkles, text: "Generating insights...", color: "text-yellow-500" },
  { icon: Zap, text: "Finalizing analysis...", color: "text-indigo-500" },
]

export function GoogleMagicLoading() {
  const [currentStep, setCurrentStep] = useState(0)
  const [dots, setDots] = useState("")

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length)
    }, 2000)

    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)

    return () => {
      clearInterval(stepInterval)
      clearInterval(dotsInterval)
    }
  }, [])

  const CurrentIcon = loadingSteps[currentStep].icon

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Main loading animation */}
      <div className="relative mb-8">
        {/* Outer rotating ring */}
        <div className="w-32 h-32 border-4 border-gray-200 rounded-full animate-spin">
          <div
            className="w-full h-full border-4 border-transparent border-t-blue-500 border-r-purple-500 border-b-green-500 border-l-red-500 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "3s" }}
          />
        </div>

        {/* Inner pulsing circle */}
        <div className="absolute inset-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 rounded-full flex items-center justify-center animate-pulse">
            <CurrentIcon className={`w-8 h-8 text-white ${loadingSteps[currentStep].color}`} />
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping"
              style={{
                top: `${20 + Math.sin((i * 60 * Math.PI) / 180) * 40}%`,
                left: `${50 + Math.cos((i * 60 * Math.PI) / 180) * 40}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: "2s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Status text */}
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
          Analyzing Your Website
        </h3>

        <div className="flex items-center justify-center space-x-3">
          <CurrentIcon className={`w-5 h-5 ${loadingSteps[currentStep].color}`} />
          <p className="text-lg text-gray-600">
            {loadingSteps[currentStep].text}
            <span className="inline-block w-8 text-left">{dots}</span>
          </p>
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center space-x-2 mt-6">
          {loadingSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 scale-125"
                  : index < currentStep
                    ? "bg-green-400"
                    : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Magic sparkles */}
        <div className="relative mt-8">
          <div className="flex justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Sparkles
                key={i}
                className="w-4 h-4 text-yellow-400 animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1.5s",
                }}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">Our AI is working its magic...</p>
        </div>
      </div>
    </div>
  )
}
