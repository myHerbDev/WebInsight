import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <Loader2 className="h-12 w-12 animate-spin text-brand-DEFAULT mb-4" />
      <p className="text-slate-600 dark:text-slate-400">Loading recommendations...</p>
    </div>
  )
}
