"use client"

import { useEffect, useRef, useCallback } from "react"
import { useTheme } from "next-themes"

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  const drawParticles = useCallback((): (() => void) | undefined => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    interface Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
    }

    const particlesArray: Particle[] = []
    const numberOfParticles = 50 // Reduced for performance

    const particleColor = theme === "dark" ? "rgba(255, 255, 255, 0.3)" : "rgba(100, 100, 200, 0.3)" // Adjusted for theme

    for (let i = 0; i < numberOfParticles; i++) {
      const size = Math.random() * 2 + 1 // Smaller particles
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const speedX = Math.random() * 0.4 - 0.2 // Slower speed
      const speedY = Math.random() * 0.4 - 0.2
      particlesArray.push({ x, y, size, speedX, speedY, color: particleColor })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < particlesArray.length; i++) {
        const p = particlesArray[i]
        p.x += p.speedX
        p.y += p.speedY

        if (p.x > canvas.width || p.x < 0) p.speedX *= -1
        if (p.y > canvas.height || p.y < 0) p.speedY *= -1

        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [theme])

  useEffect(() => {
    const cleanup = drawParticles()
    return () => {
      if (cleanup) cleanup()
    }
  }, [drawParticles])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-70" // Ensure it's behind content
    />
  )
}
