import { Github, Heart } from "lucide-react"
import { Logo } from "@/components/logo"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Logo size="sm" showText={true} />
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 text-center md:text-left">
            <p>© {new Date().getFullYear()} WebInSight. All rights reserved.</p>
            <p className="mt-1">
              A{" "}
              <Link
                href="https://myherb.co.il"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-DEFAULT hover:underline"
              >
                DevSphere
              </Link>{" "}
              Project by myHerb. Powered by Groq AI, Vercel, and Neon.
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link
              href="https://github.com/myHerbDev/websight-analyzer" // Example GitHub link
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-brand-DEFAULT dark:text-slate-400 dark:hover:text-brand-light transition-colors"
              aria-label="GitHub Repository"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link
              href="https://github.com/sponsors/myHerbDev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-pink-500 dark:text-slate-400 dark:hover:text-pink-400 transition-colors"
              aria-label="Sponsor myHerbDev"
            >
              <Heart className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
