"use client"

import { useState, useEffect } from "react"
import { Search, Zap, Shield, TrendingUp, Leaf, Eye, Lightbulb, CheckCircle } from "lucide-react"

const loadingSteps = [
  { id: 1, text: "Fetching website content", icon: Search, color: "from-blue-500 to-cyan-500" },
  { id: 2, text: "Analyzing with AI", icon: Zap, color: "from-purple-500 to-pink-500" },
  { id: 3, text: "Calculating performance metrics", icon: TrendingUp, color: "from-green-500 to-emerald-500" },
  { id: 4, text: "Checking security features", icon: Shield, color: "from-red-500 to-orange-500" },
  { id: 5, text: "Evaluating sustainability", icon: Leaf, color: "from-teal-500 to-green-500" },
  { id: 6, text: "Assessing accessibility", icon: Eye, color: "from-indigo-500 to-purple-500" },
  { id: 7, text: "Generating insights", icon: Lightbulb, color: "from-yellow-500 to-orange-500" },
  { id: 8, text: "Finalizing analysis", icon: CheckCircle, color: "from-emerald-500 to-teal-500" },
]

interface GoogleMagicLoadingProps {
  isVisible: boolean
  onComplete?: () => void
}

export function GoogleMagicLoading({ isVisible, onComplete }: GoogleMagicLoadingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [dots, setDots] = useState("")

  useEffect(() => {
    if (!isVisible) return

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1
        if (next >= loadingSteps.length) {
          clearInterval(stepInterval)
          setTimeout(() => onComplete?.(), 500)
          return prev
        }
        return next
      })
    }, 2000)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.random() * 15 + 5
        const newProgress = Math.min(prev + increment, (currentStep + 1) * (100 / loadingSteps.length))
        return newProgress
      })
    }, 200)

    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)

    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
      clearInterval(dotsInterval)
    }
  }, [isVisible, currentStep, onComplete])

  if (!isVisible) return null

  const currentStepData = loadingSteps[currentStep]
  const CurrentIcon = currentStepData?.icon || Search

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        {/* Main Loading Animation */}
        <div className="relative flex items-center justify-center mb-8">
          {/* Outer Ring */}
          <div className="absolute w-32 h-32 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>

          {/* Animated Ring 1 */}
          <div className="absolute w-32 h-32 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>

          {/* Animated Ring 2 */}
          <div
            className="absolute w-24 h-24 rounded-full border-4 border-transparent border-t-teal-500 animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>

          {/* Center Icon */}
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-br ${currentStepData?.color || "from-purple-500 to-teal-500"} flex items-center justify-center animate-pulse`}
          >
            <CurrentIcon className="h-8 w-8 text-white" />
          </div>

          {/* Floating Particles */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-br from-purple-400 to-teal-400 rounded-full animate-ping"
              style={{
                top: `${20 + Math.sin((i * 60 * Math.PI) / 180) * 60}px`,
                left: `${20 + Math.cos((i * 60 * Math.PI) / 180) * 60}px`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: "2s",
              }}
            ></div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-teal-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Current Step */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {currentStepData?.text || "Initializing"}
            {dots}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            WSfynder is analyzing your website with AI-powered insights
          </p>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center space-x-2">
          {loadingSteps.map((step, index) => {
            const StepIcon = step.icon
            return (
              <div
                key={step.id}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  index <= currentStep
                    ? `bg-gradient-to-br ${step.color} text-white scale-110`
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400 scale-100"
                }`}
              >
                <StepIcon className="h-4 w-4" />
              </div>
            )
          })}
        </div>

        {/* Sparkle Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}
