import Link from "next/link"
import { Logo } from "@/components/logo"

export function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="border-t border-border/40 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Logo className="h-8 w-8" />
              <span className="text-xl font-bold">WebInSight</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-powered website analysis for sustainability, performance, and security.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#analyze" className="text-muted-foreground hover:text-primary">
                  Analyze Website
                </Link>
              </li>
              {/* Add more links: Docs, Blog, About Us, Contact */}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              {/* Add links: Privacy Policy, Terms of Service */}
              <li>
                <span className="text-muted-foreground">Privacy Policy (Coming Soon)</span>
              </li>
              <li>
                <span className="text-muted-foreground">Terms of Service (Coming Soon)</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          &copy; {currentYear} WebInSight. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
