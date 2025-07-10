"use client"

import type { LucideIcon } from "lucide-react"

interface FeatureBadgeProps {
  Icon: LucideIcon
  text: string
}

/**
 * A small pill-style badge used in the hero section to highlight key
 * capabilities (Performance, Sustainability, AI, …).
 */
export default function FeatureBadge({ Icon, text }: FeatureBadgeProps) {
  return (
    <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200 shadow-sm">
      <Icon className="w-5 h-5 text-purple-600 shrink-0" />
      <span className="text-sm font-medium text-gray-700">{text}</span>
    </div>
  )
}
