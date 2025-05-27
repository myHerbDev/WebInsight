import { Github, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold mb-4">Website Analyzer</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Analyze websites for performance, sustainability, and content quality. Get detailed insights and
              actionable recommendations to improve your web presence.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/sponsors/myHerbDev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
              >
                <Heart className="h-4 w-4 mr-2" />
                DevSphere Project
              </a>
              <a
                href="https://github.com/myHerbDev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <Github className="h-4 w-4 mr-2" />
                myHerb
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>Website Analysis</li>
              <li>Performance Metrics</li>
              <li>Content Generation</li>
              <li>Export & Sharing</li>
              <li>Sustainability Scoring</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>
                <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © 2024 Website Analyzer. Built with ❤️ by{" "}
            <a
              href="https://github.com/sponsors/myHerbDev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
            >
              DevSphere Project
            </a>
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-sm text-gray-500 dark:text-gray-500">Powered by Groq AI & Vercel</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
