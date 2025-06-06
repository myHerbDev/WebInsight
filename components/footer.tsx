import { Github, Heart, ExternalLink, Linkedin, Twitter } from "lucide-react"
import { Logo } from "@/components/logo"
import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const footerLinks = [
    { href: "/about", label: "About Us" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/contact", label: "Contact" },
  ]
  const legalLinks = [
    { href: "/legal", label: "Legal Information" },
    { href: "/complaints", label: "File a Complaint" },
  ]
  const socialLinks = [
    { href: "https://github.com/myHerbDev", label: "GitHub", icon: Github },
    { href: "https://x.com/myherb1", label: "Twitter", icon: Twitter },
    { href: "https://linkedin.com/company/myherb/", label: "LinkedIn", icon: Linkedin },
  ]

  return (
    <footer className="bg-secondary/50 border-t border-border/60 dark:bg-background/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          <div className="md:col-span-2 space-y-4">
            <Logo size="md" showText={true} />
            <p className="text-sm text-muted-foreground max-w-md">
              WebInSight provides AI-driven analysis to optimize your website's performance, sustainability, and content
              strategy. Built with cutting-edge technology for modern web developers and marketers.
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-foreground mb-3.5">Quick Links</h5>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary-gradient-start hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-foreground mb-3.5">Legal</h5>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary-gradient-start hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-foreground mb-3.5">Connect</h5>
            <ul className="space-y-2.5">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary-gradient-start hover:underline flex items-center transition-colors"
                    >
                      <Icon className="h-4 w-4 mr-2.5" /> {link.label}
                    </a>
                  </li>
                )
              })}
              <li>
                <a
                  href="https://myherb.co.il"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary-gradient-start hover:underline flex items-center transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2.5" /> myHerb.co.il
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/70 pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} WebInSight by myHerb (A DevSphere Project).
            <br className="sm:hidden" />
            Powered by Groq AI, Vercel, and Neon. Designed with <Heart className="inline h-3 w-3 text-red-500 mx-0.5" />{" "}
            for innovation.
          </p>
        </div>
      </div>
    </footer>
  )
}
