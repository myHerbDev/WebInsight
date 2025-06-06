import type React from "react"

interface Result {
  id: number
  title: string
  description: string
  score: number
}

interface ResultsSectionProps {
  results: Result[]
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ results }) => {
  return (
    <section className="py-12">
      <div className="container mx-auto">
        <h2 className="text-3xl font-semibold mb-8 text-center">Search Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result) => (
            <Card key={result.id} result={result} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface CardProps {
  result: Result
}

const Card: React.FC<CardProps> = ({ result }) => {
  return (
    <div className="glass-morphism card-hover-lift rounded-xl border border-slate-200/60 dark:border-slate-800/60 transition-all duration-300 hover:shadow-lg">
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{result.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{result.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-500">Score:</span>
          </div>
          <div className="relative">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 text-white font-bold transition-all duration-300 hover:scale-105 shadow-md">
              {result.score}
            </div>
            <div className="absolute top-0 left-0 w-full h-full rounded-full bg-white/20 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { ResultsSection }
export default ResultsSection
