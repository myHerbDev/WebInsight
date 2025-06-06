import { Github, Heart, ExternalLink } from "lucide-react"
import { Logo } from "@/components/logo"
import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const footerLinks = [
    { href: "/about", label: "About Us" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-3">
            <Logo size="md" showText={true} />
            <p className="text-sm text-muted-foreground max-w-xs">
              Intelligent website analysis for performance, sustainability, and optimization.
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-foreground mb-3">Quick Links</h5>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-brand-text hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-foreground mb-3">Connect</h5>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://github.com/myHerbDev/websight-analyzer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-brand-text hover:underline flex items-center"
                >
                  <Github className="h-4 w-4 mr-2" /> GitHub Repository
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/sponsors/myHerbDev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-pink-500 hover:underline flex items-center"
                >
                  <Heart className="h-4 w-4 mr-2" /> Sponsor Project
                </Link>
              </li>
              <li>
                <Link
                  href="https://myherb.co.il"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-brand-text hover:underline flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" /> myHerb.co.il
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} WebInSight by myHerb (DevSphere Project). Powered by Groq AI, Vercel, and Neon.
          </p>
        </div>
      </div>
    </footer>
  )
}
