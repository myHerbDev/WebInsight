import Link from "next/link"
import { Zap } from "lucide-react"

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2 group">
      <div className="relative">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div className="absolute -inset-1 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-green-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:via-purple-700 group-hover:to-green-700 transition-all duration-300">
        WSfynder
      </span>
    </Link>
  )
}
