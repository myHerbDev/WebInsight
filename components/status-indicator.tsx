"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, XCircle, Clock } from "lucide-react"

interface StatusIndicatorProps {
  status: "success" | "warning" | "error" | "pending"
  message: string
  details?: string
}

export function StatusIndicator({ status, message, details }: StatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "success":
        return {
          icon: CheckCircle,
          variant: "default" as const,
          className: "bg-green-100 text-green-800 border-green-200",
        }
      case "warning":
        return {
          icon: AlertCircle,
          variant: "secondary" as const,
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        }
      case "error":
        return {
          icon: XCircle,
          variant: "destructive" as const,
          className: "bg-red-100 text-red-800 border-red-200",
        }
      case "pending":
        return {
          icon: Clock,
          variant: "outline" as const,
          className: "bg-blue-100 text-blue-800 border-blue-200",
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <div className="flex items-center space-x-2">
      <Badge variant={config.variant} className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {message}
      </Badge>
      {details && <span className="text-sm text-gray-500">{details}</span>}
    </div>
  )
}
