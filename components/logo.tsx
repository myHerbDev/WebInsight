import Link from "next/link"
import { Search, Zap } from "lucide-react"

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg p-1"
      aria-label="WSfynder - Go to homepage"
    >
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-green-600 rounded-xl flex items-center justify-center shadow-md">
          <Search className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
          <Zap className="h-2.5 w-2.5 text-white" aria-hidden="true" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
          WSfynder
        </span>
        <span className="text-xs text-muted-foreground leading-none">Website Intelligence</span>
      </div>
    </Link>
  )
}
