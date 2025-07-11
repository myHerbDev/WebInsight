"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Sparkles, Globe, Zap, Shield, Leaf, Eye, Lightbulb, CheckCircle } from "lucide-react"

interface LoadingStep {
  id: number
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  gradient: string
}

const loadingSteps: LoadingStep[] = [
  {
    id: 1,
    title: "Fetching Website",
    description: "Retrieving website content and structure",
    icon: Globe,
    color: "text-blue-500",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "AI Analysis",
    description: "Analyzing content with advanced AI",
    icon: Sparkles,
    color: "text-purple-500",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    title: "Performance Check",
    description: "Measuring speed and optimization",
    icon: Zap,
    color: "text-yellow-500",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    id: 4,
    title: "Security Scan",
    description: "Checking security headers and SSL",
    icon: Shield,
    color: "text-red-500",
    gradient: "from-red-500 to-pink-500",
  },
  {
    id: 5,
    title: "Sustainability",
    description: "Calculating environmental impact",
    icon: Leaf,
    color: "text-green-500",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: 6,
    title: "Accessibility",
    description: "Evaluating user accessibility",
    icon: Eye,
    color: "text-indigo-500",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    id: 7,
    title: "Generating Insights",
    description: "Creating personalized recommendations",
    icon: Lightbulb,
    color: "text-amber-500",
    gradient: "from-amber-500 to-yellow-500",
  },
  {
    id: 8,
    title: "Finalizing",
    description: "Preparing your comprehensive report",
    icon: CheckCircle,
    color: "text-emerald-500",
    gradient: "from-emerald-500 to-green-500",
  },
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
        if (prev < loadingSteps.length - 1) {
          return prev + 1
        } else {
          clearInterval(stepInterval)
          setTimeout(() => onComplete?.(), 1000)
          return prev
        }
      })
    }, 2000)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const targetProgress = ((currentStep + 1) / loadingSteps.length) * 100
        if (prev < targetProgress) {
          return Math.min(prev + 2, targetProgress)
        }
        return prev
      })
    }, 50)

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
  const CurrentIcon = currentStepData.icon

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Main Loading Animation */}
        <div className="relative flex items-center justify-center mb-8">
          {/* Outer rotating ring */}
          <div className="absolute w-32 h-32 border-4 border-transparent border-t-purple-500 border-r-blue-500 rounded-full animate-spin" />

          {/* Middle counter-rotating ring */}
          <div className="absolute w-24 h-24 border-4 border-transparent border-b-teal-500 border-l-green-500 rounded-full animate-spin-reverse" />

          {/* Inner pulsing ring */}
          <div className="absolute w-16 h-16 border-2 border-purple-300 rounded-full animate-pulse" />

          {/* Center icon */}
          <div className={`relative z-10 p-4 rounded-full bg-gradient-to-r ${currentStepData.gradient} shadow-lg`}>
            <CurrentIcon className="h-8 w-8 text-white animate-pulse" />
          </div>

          {/* Floating particles */}
          <div
            className="absolute w-2 h-2 bg-purple-400 rounded-full animate-ping"
            style={{ top: "10%", left: "20%" }}
          />
          <div
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping animation-delay-300"
            style={{ top: "80%", right: "15%" }}
          />
          <div
            className="absolute w-1.5 h-1.5 bg-teal-400 rounded-full animate-ping animation-delay-700"
            style={{ bottom: "20%", left: "10%" }}
          />
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Step {currentStep + 1} of {loadingSteps.length}
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-teal-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Step Info */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {currentStepData.title}
            {dots}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{currentStepData.description}</p>
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
                    ? `bg-gradient-to-r ${step.gradient} text-white shadow-lg scale-110`
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                }`}
              >
                <StepIcon className="h-4 w-4" />
              </div>
            )
          })}
        </div>

        {/* WSfynder Branding */}
        <div className="text-center mt-6">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
              WSfynder
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Analyzing your website with AI magic</p>
        </div>
      </div>
    </div>
  )
}
