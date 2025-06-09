import { Loader2 } from "lucide-react"

export function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Loader2 className="h-16 w-16 text-blue-600 dark:text-blue-400 animate-spin mb-6" />
      <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Analyzing Your Website...</h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md">
        Our AI is hard at work gathering insights. This might take a moment.
      </p>
    </div>
  )
}
