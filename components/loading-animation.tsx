const enhancedStatusMessages = [
  { text: "🔍 Scanning website architecture...", emoji: "🔍" },
  { text: "⚡ Analyzing performance metrics...", emoji: "⚡" },
  { text: "🛡️ Evaluating security measures...", emoji: "🛡️" },
  { text: "📊 Processing SEO data...", emoji: "📊" },
  { text: "📱 Testing mobile responsiveness...", emoji: "📱" },
  { text: "♿ Checking accessibility features...", emoji: "♿" },
  { text: "🌱 Calculating sustainability impact...", emoji: "🌱" },
  { text: "🎨 Reviewing design patterns...", emoji: "🎨" },
  { text: "🔗 Mapping link structure...", emoji: "🔗" },
  { text: "📈 Generating insights...", emoji: "📈" },
  { text: "✨ Finalizing analysis...", emoji: "✨" },
]

// Add fallback for when animation fails to load
const FallbackLoader = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    <span className="ml-4 text-lg font-medium">Analyzing website...</span>
  </div>
)

const LoadingAnimation = () => {
  return <FallbackLoader />
}

export default LoadingAnimation
