import Link from "next/link"
import { Logo } from "@/components/logo"
import { ExternalLink, Heart, Github, Twitter, Linkedin } from "lucide-react"

const footerLinks = {
  product: [
    { name: "Features", href: "/features" },
    { name: "Content Studio", href: "/content-studio" },
    { name: "Hosting Analysis", href: "/hosting" },
    { name: "Pricing", href: "/pricing" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
    { name: "Status", href: "/status" },
  ],
  resources: [
    { name: "Community", href: "/community" },
    { name: "Tutorials", href: "/tutorials" },
    { name: "API Documentation", href: "/docs" },
    { name: "Integrations", href: "/integrations" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Acceptable Use", href: "/acceptable-use" },
  ],
}

const socialLinks = [
  { name: "GitHub", href: "https://github.com/wsfynder", icon: Github },
  { name: "Twitter", href: "https://twitter.com/wsfynder", icon: Twitter },
  { name: "LinkedIn", href: "https://linkedin.com/company/wsfynder", icon: Linkedin },
]

export function Footer() {
  return (
    <footer className="border-t bg-background" role="contentinfo">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Intelligent website discovery and analysis platform powered by advanced AI technology. Analyze
              performance, SEO, security, and generate content instantly.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm p-1"
                  aria-label={`Follow WSfynder on ${social.name}`}
                >
                  <social.icon className="h-5 w-5" aria-hidden="true" />
                </Link>
              ))}
            </div>

            {/* Sponsor Button */}
            <div className="mt-4">
              <iframe
                src="https://github.com/sponsors/myHerbDev/button"
                title="Sponsor myHerbDev"
                height="32"
                width="114"
                style={{ border: 0, borderRadius: "6px" }}
                className="rounded-md"
              />
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-sm mb-4 capitalize">{category}</h3>
              <ul className="space-y-2" role="list">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} WSfynder. All rights reserved.
              </p>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <span>Made by</span>
                <Link
                  href="https://www.myherb.co.il"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline inline-flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                >
                  <span>myHerb</span>
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </Link>
                <span>(DevSphere project)</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="https://github.com/sponsors/myHerbDev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
              >
                <Heart className="h-4 w-4" aria-hidden="true" />
                <span>Sponsor</span>
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </Link>
              <p className="text-sm text-muted-foreground">Built with ❤️ for intelligent website discovery</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
