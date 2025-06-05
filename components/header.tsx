type HeaderProps = {}

const Logo = () => {
  return (
    <div>
      {/* Logo Placeholder */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="2" />
        <path
          d="M10.6667 21.3333L16 16L10.6667 10.6667"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21.3333 21.3333L16 16L21.3333 10.6667"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Logo />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">WebInSight</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sustainable Web Analytics</p>
            </div>
          </div>
          <div>{/* Navigation Links or User Profile */}</div>
        </div>
      </div>
    </header>
  )
}
