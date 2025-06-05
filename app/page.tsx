import { Logo } from "@/components/logo"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <section className="hero">
        <div className="text-center space-y-8">
          <div className="flex justify-center mb-8">
            <Logo size="lg" showText={true} />
          </div>
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                Analyze Your Website's
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">Sustainability & Performance</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Get insights into your website's environmental impact and performance metrics.
            </p>
            <div className="flex justify-center">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="features py-16">
        <h2 className="text-3xl font-semibold text-center mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="feature-item">
            <h3 className="text-xl font-semibold mb-2">Sustainability Analysis</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Evaluate your website's carbon footprint and identify areas for improvement.
            </p>
          </div>
          <div className="feature-item">
            <h3 className="text-xl font-semibold mb-2">Performance Metrics</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Track key performance indicators such as page speed, load times, and user experience.
            </p>
          </div>
          <div className="feature-item">
            <h3 className="text-xl font-semibold mb-2">Actionable Insights</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Receive personalized recommendations to optimize your website for sustainability and performance.
            </p>
          </div>
        </div>
      </section>

      <section className="cta py-16">
        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-8">Ready to get started?</h2>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Sign Up Now
          </button>
        </div>
      </section>
    </div>
  )
}
