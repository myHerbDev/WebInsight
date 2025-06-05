import { Github, Heart, Globe, Shield, Zap } from "lucide-react"
import { Logo } from "@/components/logo"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Logo size="lg" showText={true} className="mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              Comprehensive website analysis platform that evaluates performance, sustainability, security, and hosting
              quality. Get actionable insights to optimize your web presence and reduce environmental impact.
            </p>

            {/* Key Features */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Globe className="h-4 w-4 mr-2 text-blue-500" />
                Website Analysis
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                Performance Optimization
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Shield className="h-4 w-4 mr-2 text-green-500" />
                Security Assessment
              </div>
            </div>

            {/* Creator Attribution */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Created by </span>
                <Link
                  href="https://myherb.co.il"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                >
                  myHerb
                </Link>
                <span className="mx-2">•</span>
                <Link
                  href="https://github.com/sponsors/myHerbDev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  <Heart className="h-3 w-3 mr-1" />
                  DevSphere Project
                </Link>
              </div>
            </div>
          </div>

          {/* Features Column */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">Features</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Website Analysis
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Site Comparison
                </Link>
              </li>
              <li>
                <Link href="/hosting" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Hosting Providers
                </Link>
              </li>
              <li>
                <Link
                  href="/recommendations"
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Sustainability Tips
                </Link>
              </li>
              <li>Performance Metrics</li>
              <li>Security Assessment</li>
              <li>PDF Export</li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">Resources</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/docs" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/api" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
            <p>
              © 2024 WebInsight. All rights reserved.
              <span className="mx-2">•</span>
              <span className="font-medium">Created by myHerb (DevSphere Project)</span>
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="https://github.com/myHerbDev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            >
              <Github className="h-5 w-5" />
            </Link>
            <span className="text-sm text-gray-500 dark:text-gray-500">Powered by Groq AI • Vercel • Neon</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
