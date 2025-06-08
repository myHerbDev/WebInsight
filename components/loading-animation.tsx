"use client"

import { useEffect, useState } from "react"

export function LoadingAnimation() {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    "Fetching website data...",
    "Analyzing performance metrics...",
    "Scanning security headers...",
    "Detecting technologies...",
    "Calculating sustainability scores...",
    "Generating insights...",
    "Finalizing analysis...",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 8 + 2
        if (newProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return newProgress
      })
    }, 300)

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 1200)

    return () => {
      clearInterval(interval)
      clearInterval(stepInterval)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-16 px-8">
      {/* Main Loading Animation */}
      <div className="relative w-32 h-32 mb-8">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gradient-to-r from-blue-200 to-purple-200"></div>

        {/* Animated Rings */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
        <div
          className="absolute inset-2 rounded-full border-4 border-transparent border-r-purple-500 animate-spin animate-reverse"
          style={{ animationDuration: "1.5s" }}
        ></div>
        <div
          className="absolute inset-4 rounded-full border-4 border-transparent border-b-teal-500 animate-spin"
          style={{ animationDuration: "2s" }}
        ></div>
        <div
          className="absolute inset-6 rounded-full border-4 border-transparent border-l-orange-500 animate-spin animate-reverse"
          style={{ animationDuration: "2.5s" }}
        ></div>

        {/* Center Pulse */}
        <div className="absolute inset-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>

        {/* Floating Particles */}
        <div
          className="absolute -top-2 -left-2 w-3 h-3 bg-blue-400 rounded-full animate-bounce"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute -top-2 -right-2 w-2 h-2 bg-purple-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute -bottom-2 -left-2 w-2 h-2 bg-teal-400 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute -bottom-2 -right-2 w-3 h-3 bg-orange-400 rounded-full animate-bounce"
          style={{ animationDelay: "1.5s" }}
        ></div>

        {/* Orbiting Elements */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3s" }}>
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>
        <div className="absolute inset-0 animate-spin animate-reverse" style={{ animationDuration: "4s" }}>
          <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-gradient-to-r from-purple-500 to-teal-500 rounded-full"></div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Analyzing Website</span>
          <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 rounded-full transition-all duration-300 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Status Text */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">WSfynder Analysis in Progress</h3>
        <p className="text-lg text-primary font-medium mb-1 animate-pulse">{steps[currentStep]}</p>
        <p className="text-sm text-gray-500">Performing comprehensive website analysis with AI-powered insights</p>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 text-blue-400 animate-float" style={{ animationDelay: "0s" }}>
          🔍
        </div>
        <div className="absolute top-1/3 right-1/4 text-purple-400 animate-float" style={{ animationDelay: "1s" }}>
          ⚡
        </div>
        <div className="absolute bottom-1/3 left-1/3 text-teal-400 animate-float" style={{ animationDelay: "2s" }}>
          🛡️
        </div>
        <div className="absolute bottom-1/4 right-1/3 text-orange-400 animate-float" style={{ animationDelay: "3s" }}>
          🌱
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-reverse {
          animation-direction: reverse;
        }
      `}</style>
    </div>
  )
}
