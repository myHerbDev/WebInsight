"use client"

import { useEffect, useState } from "react"
import { Sparkles, Zap, Brain, Search, BarChart3, Shield, Leaf, Eye } from "lucide-react"

const loadingSteps = [
  {
    icon: Search,
    text: "Fetching website content",
    color: "text-blue-500",
    bgColor: "from-blue-500/20 to-blue-600/20",
  },
  { icon: Brain, text: "Analyzing with AI", color: "text-purple-500", bgColor: "from-purple-500/20 to-purple-600/20" },
  {
    icon: BarChart3,
    text: "Calculating performance metrics",
    color: "text-green-500",
    bgColor: "from-green-500/20 to-green-600/20",
  },
  { icon: Shield, text: "Checking security features", color: "text-red-500", bgColor: "from-red-500/20 to-red-600/20" },
  {
    icon: Leaf,
    text: "Analyzing sustainability",
    color: "text-emerald-500",
    bgColor: "from-emerald-500/20 to-emerald-600/20",
  },
  {
    icon: Eye,
    text: "Checking accessibility",
    color: "text-indigo-500",
    bgColor: "from-indigo-500/20 to-indigo-600/20",
  },
  {
    icon: Sparkles,
    text: "Generating insights",
    color: "text-yellow-500",
    bgColor: "from-yellow-500/20 to-yellow-600/20",
  },
  { icon: Zap, text: "Finalizing analysis", color: "text-orange-500", bgColor: "from-orange-500/20 to-orange-600/20" },
]

export function GoogleMagicLoading() {
  const [currentStep, setCurrentStep] = useState(0)
  const [dots, setDots] = useState("")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = (prev + 1) % loadingSteps.length
        setProgress(((next + 1) / loadingSteps.length) * 100)
        return next
      })
    }, 2500)

    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 400)

    return () => {
      clearInterval(stepInterval)
      clearInterval(dotsInterval)
    }
  }, [])

  const CurrentIcon = loadingSteps[currentStep].icon

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 relative overflow-hidden">
      {/* Background gradient animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-green-50/50 animate-pulse" />

      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full animate-ping"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main loading animation container */}
      <div className="relative z-10 mb-12">
        {/* Outer rotating rings */}
        <div className="relative w-40 h-40">
          {/* First ring */}
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-500/60 border-r-purple-500/60 rounded-full animate-spin" />

          {/* Second ring */}
          <div
            className="absolute inset-2 border-4 border-transparent border-b-green-500/60 border-l-red-500/60 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "3s" }}
          />

          {/* Third ring */}
          <div
            className="absolute inset-4 border-2 border-transparent border-t-yellow-500/60 border-r-indigo-500/60 rounded-full animate-spin"
            style={{ animationDuration: "4s" }}
          />

          {/* Center pulsing circle */}
          <div
            className={`absolute inset-8 bg-gradient-to-br ${loadingSteps[currentStep].bgColor} rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-2xl`}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-white/90 to-white/70 rounded-full flex items-center justify-center animate-pulse shadow-lg">
              <CurrentIcon className={`w-8 h-8 ${loadingSteps[currentStep].color} drop-shadow-sm`} />
            </div>
          </div>

          {/* Orbiting particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full animate-spin"
              style={{
                top: `${50 + Math.sin((i * 45 * Math.PI) / 180) * 45}%`,
                left: `${50 + Math.cos((i * 45 * Math.PI) / 180) * 45}%`,
                animationDuration: "6s",
                animationDelay: `${i * 0.2}s`,
              }}
            >
              <div
                className={`w-full h-full bg-gradient-to-r ${loadingSteps[currentStep].bgColor} rounded-full animate-ping`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Status content */}
      <div className="text-center space-y-6 relative z-10 max-w-md">
        {/* Main title */}
        <div className="space-y-2">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            Analyzing Your Website
          </h3>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto animate-pulse" />
        </div>

        {/* Current step */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className={`p-2 rounded-full bg-gradient-to-br ${loadingSteps[currentStep].bgColor}`}>
              <CurrentIcon className={`w-6 h-6 ${loadingSteps[currentStep].color}`} />
            </div>
            <p className="text-lg font-medium text-gray-700">
              {loadingSteps[currentStep].text}
              <span className="inline-block w-8 text-left font-bold text-blue-500">{dots}</span>
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Step indicators */}
          <div className="flex justify-center space-x-2">
            {loadingSteps.map((step, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? `bg-gradient-to-r ${step.bgColor.replace("/20", "")} scale-125 shadow-lg`
                    : index < currentStep
                      ? "bg-green-400 shadow-sm"
                      : "bg-gray-300"
                }`}
                title={step.text}
              />
            ))}
          </div>
        </div>

        {/* Magic sparkles section */}
        <div className="space-y-3">
          <div className="flex justify-center space-x-1">
            {[...Array(7)].map((_, i) => (
              <Sparkles
                key={i}
                className="w-5 h-5 text-yellow-400 animate-pulse drop-shadow-sm"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: "1.8s",
                }}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 font-medium">WSfynder AI is working its magic...</p>
        </div>

        {/* Fun facts */}
        <div className="text-xs text-gray-400 space-y-1">
          <p>✨ Analyzing {loadingSteps.length} different aspects</p>
          <p>🚀 Powered by advanced AI algorithms</p>
          <p>🌱 Checking sustainability metrics</p>
        </div>
      </div>
    </div>
  )
}
