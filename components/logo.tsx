"use client"

import { cn } from "@/lib/utils"
import { Brain } from "lucide-react"
import { useEffect, useRef } from "react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
  iconOnly?: boolean
}

export function Logo({ size = "md", showText = true, className = "", iconOnly = false }: LogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const iconContainerSizeClasses = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  const iconSizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  const textSizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect()
      if (width === 0 || height === 0) return
      canvas.width = width * window.devicePixelRatio
      canvas.height = height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const particles: { x: number; y: number; size: number; speedX: number; speedY: number; hue: number }[] = []
    const particleCount = 20

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * (canvas.width / window.devicePixelRatio),
        y: Math.random() * (canvas.height / window.devicePixelRatio),
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        hue: Math.random() * 60 + 220,
      })
    }

    const animate = () => {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const displayWidth = canvas.width / window.devicePixelRatio
      const displayHeight = canvas.height / window.devicePixelRatio

      particles.forEach((particle) => {
        ctx.fillStyle = `hsla(${particle.hue}, 100%, 70%, 0.8)`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0 || particle.x > displayWidth) particle.speedX *= -1
        if (particle.y < 0 || particle.y > displayHeight) particle.speedY *= -1
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className={cn("flex items-center", className)}>
      <div className={cn(iconContainerSizeClasses[size], "rounded-2xl relative overflow-hidden shadow-lg")}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/80 to-purple-600/80 rounded-2xl"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain className={cn(iconSizeClasses[size], "text-white drop-shadow-md relative z-10")} />
        </div>
        <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl opacity-30 blur-xl"></div>
      </div>

      {!iconOnly && showText && (
        <div className="ml-3">
          <h1 className={cn(textSizeClasses[size], "font-bold tracking-tight")}>
            <span className="text-gray-800 dark:text-white">WS</span>
            <span className="bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">fynder</span>
          </h1>
        </div>
      )}
    </div>
  )
}
