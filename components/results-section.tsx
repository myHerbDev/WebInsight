"use client"

import { Info, Loader2, XCircle } from "lucide-react"
import { useEffect, useState } from "react"

interface Result {
  id: string
  url: string
  title: string
  description: string
  keywords: string[]
  page_quality: {
    domain_authority: number
    spam_score: number
  }
  content_quality: {
    readability_score: number
    keyword_density: number
  }
  performance: {
    load_time: number
    page_size: number
  }
  security: {
    https: boolean
    ssl_expiry: string | null
  }
  accessibility: {
    accessibility_score: number
    mobile_friendliness: boolean
  }
  ranking_factors: {
    backlinks: number
    domain_age: number
  }
}

interface ResultsSectionProps {
  query: string
  results: Result[] | null
  isLoading: boolean
  error: string | null
}

export function ResultsSection({ query, results, isLoading, error }: ResultsSectionProps) {
  const [expandedResultId, setExpandedResultId] = useState<string | null>(null)

  useEffect(() => {
    setExpandedResultId(null) // Collapse all when results change
  }, [results])

  const toggleExpand = (id: string) => {
    setExpandedResultId((prevId) => (prevId === id ? null : id))
  }

  return (
    <section className="container mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Search Results for "{query}"</h2>

      {isLoading && (
        <div className="text-center">
          <Loader2 className="inline-block animate-spin mr-2" />
          Loading results...
        </div>
      )}

      {error && (
        <div className="text-red-500">
          <XCircle className="inline-block mr-2" />
          Error: {error}
        </div>
      )}

      {results === null && !isLoading && !error && query !== "" && (
        <div className="text-gray-500">
          <Info className="inline-block mr-2" />
          No results yet. Please initiate a search.
        </div>
      )}

      {results && results.length === 0 && !isLoading && !error && (
        <div className="text-gray-500">
          <Info className="inline-block mr-2" />
          No results found for "{query}".
        </div>
      )}

      {results && results.length > 0 && (
        <div className="space-y-4">
          {results.map((result) => (
            <div key={result.id} className="bg-white rounded-lg shadow-md p-4 relative">
              <h3 className="text-xl font-semibold mb-2">
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-blue-600"
                >
                  {result.title}
                </a>
              </h3>
              <p className="text-gray-700 mb-2">{result.description}</p>
              <button
                onClick={() => toggleExpand(result.id)}
                className="text-blue-500 hover:underline focus:outline-none absolute top-4 right-4"
              >
                {expandedResultId === result.id ? "Collapse" : "Expand"}
              </button>

              {expandedResultId === result.id && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="text-lg font-semibold mb-2">Details</h4>
                  <p>
                    <strong>URL:</strong>{" "}
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {result.url}
                    </a>
                  </p>
                  <p>
                    <strong>Keywords:</strong> {result.keywords.join(", ")}
                  </p>
                  <h5 className="text-md font-semibold mt-2">Page Quality</h5>
                  <p>
                    <strong>Domain Authority:</strong> {result.page_quality.domain_authority}
                  </p>
                  <p>
                    <strong>Spam Score:</strong> {result.page_quality.spam_score}
                  </p>
                  <h5 className="text-md font-semibold mt-2">Content Quality</h5>
                  <p>
                    <strong>Readability Score:</strong> {result.content_quality.readability_score}
                  </p>
                  <p>
                    <strong>Keyword Density:</strong> {result.content_quality.keyword_density}
                  </p>
                  <h5 className="text-md font-semibold mt-2">Performance</h5>
                  <p>
                    <strong>Load Time:</strong> {result.performance.load_time} seconds
                  </p>
                  <p>
                    <strong>Page Size:</strong> {result.performance.page_size} bytes
                  </p>
                  <h5 className="text-md font-semibold mt-2">Security</h5>
                  <p>
                    <strong>HTTPS:</strong> {result.security.https ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>SSL Expiry:</strong> {result.security.ssl_expiry || "N/A"}
                  </p>
                  <h5 className="text-md font-semibold mt-2">Accessibility</h5>
                  <p>
                    <strong>Accessibility Score:</strong> {result.accessibility.accessibility_score}
                  </p>
                  <p>
                    <strong>Mobile Friendliness:</strong> {result.accessibility.mobile_friendliness ? "Yes" : "No"}
                  </p>
                  <h5 className="text-md font-semibold mt-2">Ranking Factors</h5>
                  <p>
                    <strong>Backlinks:</strong> {result.ranking_factors.backlinks}
                  </p>
                  <p>
                    <strong>Domain Age:</strong> {result.ranking_factors.domain_age} years
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
