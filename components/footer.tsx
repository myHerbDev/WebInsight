import { Github, Twitter, Linkedin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto text-center">
        <div className="flex justify-center space-x-4 mb-4">
          <a href="#" className="hover:text-gray-500">
            <Github className="h-6 w-6" />
          </a>
          <a href="#" className="hover:text-gray-500">
            <Twitter className="h-6 w-6" />
          </a>
          <a href="#" className="hover:text-gray-500">
            <Linkedin className="h-6 w-6" />
          </a>
          <a href="#" className="hover:text-gray-500">
            <Mail className="h-6 w-6" />
          </a>
        </div>
        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </div>
    </footer>
  )
}
