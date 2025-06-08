"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface LoadingAnimationProps {
  className?: string
}

export function LoadingAnimation({ className }: LoadingAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const steps = [
    { text: "🔍 Scanning website structure...", emoji: "🔍" },
    { text: "⚡ Analyzing performance metrics...", emoji: "⚡" },
    { text: "🔒 Evaluating security measures...", emoji: "🔒" },
    { text: "📊 Processing SEO data...", emoji: "📊" },
    { text: "🎨 Reviewing design elements...", emoji: "🎨" },
    { text: "📱 Testing mobile compatibility...", emoji: "📱" },
    { text: "🌱 Calculating sustainability impact...", emoji: "🌱" },
    { text: "✨ Generating insights...", emoji: "✨" },
  ]

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 2000)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95
        return prev + Math.random() * 8
      })
    }, 300)

    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
    }
  }, [steps.length])

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-8 py-12", className)}>
      {/* Main Loading Animation */}
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-32 h-32 border-4 border-blue-200 rounded-full animate-spin-slow">
          <div className="absolute top-0 left-0 w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
        </div>

        {/* Middle Ring */}
        <div className="absolute inset-4 w-24 h-24 border-4 border-purple-200 rounded-full animate-spin-reverse">
          <div className="absolute top-0 right-0 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
        </div>

        {/* Inner Ring */}
        <div className="absolute inset-8 w-16 h-16 border-4 border-pink-200 rounded-full animate-spin">
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-pink-500 rounded-full animate-ping"></div>
        </div>

        {/* Center Core */}
        <div className="absolute inset-12 w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse shadow-lg">
          <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"></div>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute -inset-8">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full animate-float opacity-60"
              style={{
                left: `${20 + ((i * 45) % 360)}%`,
                top: `${30 + ((i * 60) % 360)}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + (i % 3)}s`,
              }}
            />
          ))}
        </div>

        {/* Orbiting Elements */}
        <div className="absolute inset-0 animate-spin-slow">
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full shadow-lg animate-bounce"></div>
        </div>
        <div className="absolute inset-0 animate-spin-reverse">
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg animate-pulse"></div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-80 max-w-full">
        <div className="bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>Analyzing...</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Status Text */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <span className="text-4xl animate-bounce" style={{ animationDelay: "0.1s" }}>
            {steps[currentStep].emoji}
          </span>
          <h3 className="text-xl font-semibold text-gray-800 animate-fade-in">Analyzing Website</h3>
        </div>

        <p className="text-gray-600 animate-fade-in max-w-md">{steps[currentStep].text}</p>

        <div className="flex justify-center space-x-2 mt-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentStep ? "bg-blue-500 scale-125" : index < currentStep ? "bg-green-500" : "bg-gray-300",
              )}
            />
          ))}
        </div>
      </div>

      {/* Floating Emojis */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {["🚀", "⚡", "🔍", "📊", "🎯", "✨"].map((emoji, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-float opacity-20"
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
