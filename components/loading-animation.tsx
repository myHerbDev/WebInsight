"use client"

import { GoogleMagicLoading } from "./google-magic-loading"

interface LoadingAnimationProps {
  isLoading: boolean
  onComplete?: () => void
}

export function LoadingAnimation({ isLoading, onComplete }: LoadingAnimationProps) {
  return <GoogleMagicLoading isVisible={isLoading} onComplete={onComplete} />
}
