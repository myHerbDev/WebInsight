export function AnalyticsGraphic({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Background grid */}
        <rect width="500" height="400" fill="url(#grid-pattern)" opacity="0.1" />

        {/* Main dashboard frame */}
        <rect
          x="50"
          y="50"
          width="400"
          height="300"
          rx="12"
          fill="url(#panel-gradient)"
          stroke="#8B5CF6"
          strokeWidth="2"
        />

        {/* Header bar */}
        <rect x="50" y="50" width="400" height="40" rx="12" fill="#8B5CF6" />
        <circle cx="75" cy="70" r="8" fill="#14B8A6" />
        <circle cx="100" cy="70" r="8" fill="#FBBF24" />
        <circle cx="125" cy="70" r="8" fill="#F87171" />

        {/* Left sidebar */}
        <rect x="50" y="90" width="100" height="260" fill="url(#sidebar-gradient)" />

        {/* Menu items */}
        <rect x="65" y="110" width="70" height="10" rx="2" fill="#8B5CF6" opacity="0.7" />
        <rect x="65" y="130" width="70" height="10" rx="2" fill="#8B5CF6" opacity="0.5" />
        <rect x="65" y="150" width="70" height="10" rx="2" fill="#8B5CF6" opacity="0.5" />
        <rect x="65" y="170" width="70" height="10" rx="2" fill="#8B5CF6" opacity="0.5" />

        {/* Main content area */}
        <rect x="160" y="100" width="280" height="240" rx="8" fill="white" fillOpacity="0.1" />

        {/* Charts and graphs */}
        {/* Line chart */}
        <path
          d="M180,280 Q200,200 220,240 Q240,280 260,180 Q280,80 300,140 Q320,200 340,160 Q360,120 380,180 Q400,240 420,200"
          stroke="#14B8A6"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M180,280 Q200,200 220,240 Q240,280 260,180 Q280,80 300,140 Q320,200 340,160 Q360,120 380,180 Q400,240 420,200"
          stroke="url(#line-gradient)"
          strokeWidth="3"
          strokeDasharray="2 2"
          fill="none"
        />

        {/* Bar chart */}
        <rect x="180" y="180" width="15" height="100" rx="2" fill="url(#bar1-gradient)" />
        <rect x="205" y="220" width="15" height="60" rx="2" fill="url(#bar2-gradient)" />
        <rect x="230" y="200" width="15" height="80" rx="2" fill="url(#bar1-gradient)" />
        <rect x="255" y="160" width="15" height="120" rx="2" fill="url(#bar2-gradient)" />

        {/* Donut chart */}
        <circle cx="350" cy="160" r="40" stroke="#8B5CF6" strokeWidth="15" strokeDasharray="188.5 251.3" />
        <circle
          cx="350"
          cy="160"
          r="40"
          stroke="#14B8A6"
          strokeWidth="15"
          strokeDasharray="62.8 377"
          strokeDashoffset="-188.5"
        />

        {/* Data points */}
        <circle cx="220" cy="240" r="5" fill="#14B8A6" />
        <circle cx="260" cy="180" r="5" fill="#14B8A6" />
        <circle cx="300" cy="140" r="5" fill="#14B8A6" />
        <circle cx="340" cy="160" r="5" fill="#14B8A6" />
        <circle cx="380" cy="180" r="5" fill="#14B8A6" />

        {/* Stats cards */}
        <rect x="180" y="110" width="80" height="50" rx="6" fill="url(#card1-gradient)" />
        <rect x="270" y="110" width="80" height="50" rx="6" fill="url(#card2-gradient)" />
        <rect x="360" y="110" width="80" height="50" rx="6" fill="url(#card3-gradient)" />

        {/* Card content */}
        <rect x="190" y="120" width="40" height="8" rx="2" fill="white" fillOpacity="0.7" />
        <rect x="190" y="135" width="60" height="15" rx="2" fill="white" fillOpacity="0.9" />

        <rect x="280" y="120" width="40" height="8" rx="2" fill="white" fillOpacity="0.7" />
        <rect x="280" y="135" width="60" height="15" rx="2" fill="white" fillOpacity="0.9" />

        <rect x="370" y="120" width="40" height="8" rx="2" fill="white" fillOpacity="0.7" />
        <rect x="370" y="135" width="60" height="15" rx="2" fill="white" fillOpacity="0.9" />

        {/* Animated elements */}
        <circle cx="220" cy="240" r="5" fill="#14B8A6">
          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="300" cy="140" r="5" fill="#14B8A6">
          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="0.5s" />
        </circle>
        <circle cx="380" cy="180" r="5" fill="#14B8A6">
          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="1s" />
        </circle>

        {/* Gradients and patterns */}
        <defs>
          <pattern id="grid-pattern" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
            <rect width="20" height="20" fill="none" />
            <path d="M 20 0 L 0 0 0 20" stroke="#8B5CF6" strokeWidth="0.5" fill="none" />
          </pattern>

          <linearGradient id="panel-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <linearGradient id="sidebar-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#14B8A6" />
          </linearGradient>

          <linearGradient id="bar1-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6D28D9" />
          </linearGradient>

          <linearGradient id="bar2-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#14B8A6" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>

          <linearGradient id="card1-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6D28D9" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="card2-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0D9488" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="card3-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
