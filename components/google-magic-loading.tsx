"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Globe, Brain, Gauge, Shield, Leaf, Eye, Lightbulb, CheckCircle, Sparkles } from "lucide-react"

interface LoadingStep {
  id: string
  label: string
  icon: React.ReactNode
  color: string
  gradient: string
}

const loadingSteps: LoadingStep[] = [
  {
    id: "fetch",
    label: "Fetching website content",
    icon: <Globe className="h-6 w-6" />,
    color: "text-blue-500",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "ai-analysis",
    label: "Analyzing with AI",
    icon: <Brain className="h-6 w-6" />,
    color: "text-purple-500",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "performance",
    label: "Calculating performance metrics",
    icon: <Gauge className="h-6 w-6" />,
    color: "text-green-500",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: "security",
    label: "Checking security features",
    icon: <Shield className="h-6 w-6" />,
    color: "text-red-500",
    gradient: "from-red-500 to-orange-500",
  },
  {
    id: "sustainability",
    label: "Analyzing sustainability",
    icon: <Leaf className="h-6 w-6" />,
    color: "text-green-600",
    gradient: "from-green-600 to-lime-500",
  },
  {
    id: "accessibility",
    label: "Evaluating accessibility",
    icon: <Eye className="h-6 w-6" />,
    color: "text-indigo-500",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    id: "insights",
    label: "Generating insights",
    icon: <Lightbulb className="h-6 w-6" />,
    color: "text-yellow-500",
    gradient: "from-yellow-500 to-amber-500",
  },
  {
    id: "complete",
    label: "Finalizing analysis",
    icon: <CheckCircle className="h-6 w-6" />,
    color: "text-emerald-500",
    gradient: "from-emerald-500 to-green-500",
  },
]

interface GoogleMagicLoadingProps {
  className?: string
}

export function GoogleMagicLoading({ className }: GoogleMagicLoadingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [dots, setDots] = useState("")

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1
        }
        return 0 // Loop back to start
      })
    }, 2500)

    return () => clearInterval(stepInterval)
  }, [])

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const targetProgress = ((currentStep + 1) / loadingSteps.length) * 100
        if (prev < targetProgress) {
          return Math.min(prev + 2, targetProgress)
        }
        return prev
      })
    }, 50)

    return () => clearInterval(progressInterval)
  }, [currentStep])

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return ""
        return prev + "."
      })
    }, 500)

    return () => clearInterval(dotsInterval)
  }, [])

  const currentStepData = loadingSteps[currentStep]

  return (
    <div className={cn("flex flex-col items-center justify-center p-8", className)}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Loading Container */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Rotating Rings */}
        <div className="relative">
          {/* Outer Ring */}
          <div className="w-32 h-32 rounded-full border-4 border-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 animate-spin-slow">
            <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 m-1"></div>
          </div>

          {/* Middle Ring */}
          <div className="absolute inset-2 w-28 h-28 rounded-full border-4 border-transparent bg-gradient-to-r from-teal-500 via-purple-500 to-blue-500 animate-spin-reverse">
            <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 m-1"></div>
          </div>

          {/* Inner Ring */}
          <div className="absolute inset-4 w-24 h-24 rounded-full border-4 border-transparent bg-gradient-to-r from-blue-500 via-teal-500 to-purple-500 animate-spin">
            <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 m-1"></div>
          </div>

          {/* Center Icon */}
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-all duration-500",
              currentStepData.color,
            )}
          >
            <div className="relative">
              <div
                className={cn("p-4 rounded-full bg-gradient-to-r shadow-lg animate-pulse", currentStepData.gradient)}
              >
                <div className="text-white">{currentStepData.icon}</div>
              </div>

              {/* Sparkles */}
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-ping" />
              <Sparkles className="absolute -bottom-1 -left-1 h-3 w-3 text-blue-400 animate-ping animation-delay-1000" />
            </div>
          </div>

          {/* Orbiting Particles */}
          <div className="absolute inset-0 animate-spin-slow">
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1"></div>
            <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2 translate-y-1"></div>
            <div className="absolute left-0 top-1/2 w-2 h-2 bg-teal-500 rounded-full transform -translate-y-1/2 -translate-x-1"></div>
            <div className="absolute right-0 top-1/2 w-2 h-2 bg-pink-500 rounded-full transform -translate-y-1/2 translate-x-1"></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-80 max-w-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={cn("h-2 rounded-full transition-all duration-300 bg-gradient-to-r", currentStepData.gradient)}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Current Step */}
        <div className="text-center space-y-2">
          <div className={cn("text-lg font-semibold transition-colors duration-500", currentStepData.color)}>
            {currentStepData.label}
            {dots}
          </div>

          {/* Step Indicators */}
          <div className="flex space-x-2 justify-center">
            {loadingSteps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index <= currentStep ? `bg-gradient-to-r ${step.gradient}` : "bg-gray-300 dark:bg-gray-600",
                )}
              />
            ))}
          </div>
        </div>

        {/* WSfynder Branding */}
        <div className="text-center mt-8">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Powered by</div>
          <div className="font-bold text-xl bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
            WSfynder
          </div>
        </div>
      </div>
    </div>
  )
}
