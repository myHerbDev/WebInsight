import Link from "next/link"
import { Zap } from "lucide-react"

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2 group">
      <div className="relative">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 via-blue-600 to-green-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-green-600 rounded-lg opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
        WSfynder
      </span>
    </Link>
  )
}
