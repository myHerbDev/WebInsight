"use client"

import { GoogleMagicLoading } from "./google-magic-loading"

interface LoadingAnimationProps {
  message?: string
  className?: string
}

export function LoadingAnimation({ message, className }: LoadingAnimationProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center">
        <GoogleMagicLoading className={className} />
        {message && <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">{message}</p>}
      </div>
    </div>
  )
}
