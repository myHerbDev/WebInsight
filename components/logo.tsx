import Link from "next/link"
import { Zap } from "lucide-react"

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2 group">
      <div className="relative">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <div className="absolute -inset-1 bg-gradient-to-br from-purple-600 to-teal-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity duration-200"></div>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
          WSfynder
        </span>
        <span className="text-xs text-gray-500 -mt-1">Website Insights</span>
      </div>
    </Link>
  )
}
