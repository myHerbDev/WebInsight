import Link from "next/link"

export function Header() {
  return (
    <header className="bg-background border-b">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="text-lg font-bold">
          WSfynder
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
