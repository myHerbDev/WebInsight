import Link from "next/link"
import { Logo } from "@/components/logo"

export function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="border-t border-border/40 py-8 bg-background/80 backdrop-blur-sm relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Logo size="sm" showText={true} />
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              Your intelligent partner for discovering sustainable and high-performance web solutions. WSfynder helps
              you analyze and choose the best for your digital presence.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#analyze" className="text-muted-foreground hover:text-primary transition-colors">
                  Analyze Website
                </Link>
              </li>
              <li>
                <Link href="/hosting" className="text-muted-foreground hover:text-primary transition-colors">
                  Hosting Catalog
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-muted-foreground hover:text-primary transition-colors">
                  Compare Websites
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About WSfynder
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-muted-foreground hover:text-primary transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          &copy; {currentYear} WSfynder. All rights reserved. Built with passion and AI.
        </div>
      </div>
    </footer>
  )
}
