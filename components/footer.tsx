import Link from "next/link"
import { Logo } from "@/components/logo"
import { Github, Twitter, Linkedin, Rss, MessageSquare } from "lucide-react" // Added Rss, MessageSquare

export function Footer() {
  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/features" },
        { label: "Pricing", href: "/pricing" },
        { label: "Integrations", href: "/integrations" },
        { label: "API Status", href: "/status" },
        { label: "Content Studio", href: "/content-studio" }, // Added
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Blog", href: "/blog" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "/docs" },
        { label: "Support Center", href: "/support" },
        { label: "Community Forum", href: "/community" },
        { label: "Tutorials", href: "/tutorials" },
        { label: "Hosting Reviews", href: "/hosting" }, // Added
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "Acceptable Use", href: "/acceptable-use" },
      ],
    },
  ]

  const socialLinks = [
    { label: "GitHub", href: "https://github.com/myHerbDev/wscrapierr", icon: Github }, // Example actual link
    { label: "Twitter", href: "https://twitter.com/wscrapierr", icon: Twitter }, // Example actual link
    { label: "LinkedIn", href: "https://linkedin.com/company/wscrapierr", icon: Linkedin }, // Example actual link
    { label: "Blog RSS", href: "/blog/rss.xml", icon: Rss }, // Example
    { label: "Community", href: "/community", icon: MessageSquare }, // Example
  ]

  return (
    <footer className="border-t bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70 relative z-10 mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-8">
          <div className="col-span-2 lg:col-span-2">
            <Logo size="md" className="mb-4" />
            <p className="text-muted-foreground text-sm max-w-xs">
              Intelligent web scraping and content generation, magically simplified.
            </p>
          </div>
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-foreground mb-3 tracking-wider uppercase">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} WScrapierr. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : "_self"}
                rel={social.href.startsWith("http") ? "noopener noreferrer" : ""}
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
