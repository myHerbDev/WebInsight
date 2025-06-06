"use client"

import { useEffect, useState } from "react"
import { QuoteIcon } from "lucide-react"

const quotes = [
  {
    text: "The greenest energy is the energy we don't use. Optimize your code, optimize your impact.",
    author: "Digital Sustainability Principle",
  },
  {
    text: "Sustainable web design is not just a trend, it's a responsibility to our planet and future generations.",
    author: "Web Sustainability Guidelines (WSG)",
  },
  {
    text: "Every byte transmitted has an environmental cost. Let's build a lighter, faster, and greener web.",
    author: "Inspired by Gerry McGovern",
  },
  {
    text: "Choosing green hosting is a powerful step towards decarbonizing the internet.",
    author: "The Green Web Foundation",
  },
  {
    text: "Technology gives us the power to create a more sustainable future. Let's use it wisely.",
    author: "Tech for Good Movement",
  },
  {
    text: "Performance is a feature, and often, a sustainable one. Faster sites consume less energy.",
    author: "Web Performance Advocates",
  },
]

export function SustainabilityQuote() {
  const [currentQuote, setCurrentQuote] = useState<{ text: string; author?: string } | null>(null)

  useEffect(() => {
    setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)])
  }, [])

  if (!currentQuote) return null

  return (
    <div className="my-8 sm:my-10 text-center max-w-2xl mx-auto px-4">
      <QuoteIcon className="h-8 w-8 text-primary-gradient-middle mx-auto mb-3 opacity-70" />
      <p className="text-lg sm:text-xl italic text-foreground/80 dark:text-foreground/70 leading-relaxed">
        "{currentQuote.text}"
      </p>
      {currentQuote.author && <p className="mt-3 text-sm text-muted-foreground">- {currentQuote.author}</p>}
    </div>
  )
}
