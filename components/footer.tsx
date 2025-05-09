import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-white/80 backdrop-blur-sm dark:bg-gray-950/80 py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Made by{" "}
          <Link
            href="https://myherb.co.il"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 dark:text-purple-400 hover:underline"
          >
            myHerb
          </Link>{" "}
          @ all rights reserved
        </p>
      </div>
    </footer>
  )
}
