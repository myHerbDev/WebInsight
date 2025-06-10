"use client"
import { useState, useEffect } from "react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ResultsSection } from "@/components/results-section"
import { SignUpModal } from "@/components/sign-up-modal"
import { toast } from "@/components/ui/use-toast"
import type { WebsiteData, AnalysisOptions } from "@/types/website-data"
import { AlertCircle, Globe, Zap, Shield, Leaf, BarChart3, Brain } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LoadingAnimation } from "@/components/loading-animation"
import { Logo } from "@/components/logo"
import { safeFetch } from "@/lib/safe-fetch"
import { MagicalWebsiteInput } from "@/components/magical-website-input" // Import the new input

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  // Removed 'url' state as it's managed within MagicalWebsiteInput
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleAnalyzeWebsite = async (urlToAnalyze: string) => {
    // Renamed 'url' to 'urlToAnalyze'
    if (!isClient || !urlToAnalyze.trim()) return

    let formattedUrl = urlToAnalyze.trim()
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`
    }

    setIsLoading(true)
    setWebsiteData(null)
    setError(null)

    try {
      const analysisOptions: AnalysisOptions = {
        includeAdvancedMetrics: true,
        analyzeSEO: true,
        checkAccessibility: true,
        analyzePerformance: true,
        checkSecurity: true,
        analyzeSustainability: true,
        includeContentAnalysis: true,
        checkMobileOptimization: true,
        analyzeLoadingSpeed: true,
        checkSocialMedia: true,
      }

      const {
        success,
        data,
        error: fetchError,
      } = await safeFetch<WebsiteData>("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formattedUrl, ...analysisOptions }),
        timeout: 45000,
      })

      if (!success || !data) {
        throw new Error(fetchError || "Analysis failed due to an unknown error.")
      }
      if (!data._id || !data.url) {
        throw new Error("Received incomplete analysis data from server.")
      }

      setWebsiteData(data)
      toast({ title: "Analysis Complete!", description: `Successfully analyzed ${data.url}` })
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred during analysis."
      setError(errorMessage)
      toast({ title: "Analysis Failed", description: errorMessage, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveAnalysis = async (type: "save" | "favorite") => {
    if (!websiteData) return
    toast({
      title: "Feature Coming Soon",
      description: `${type === "favorite" ? "Favoriting" : "Saving"} analyses will be available with user accounts.`,
    })
  }

  const handleSignUp = (tempUserId?: string) => {
    if (tempUserId) setUserId(tempUserId)
    setShowSignUpModal(true)
  }

  if (!isClient) {
    return (
      <>
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-20">
          <div className="text-center">
            <LoadingAnimation />
            <p className="text-xl mt-4">Initializing WSfynder...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col items-center px-4 pt-12 pb-20 sm:pt-20 sm:pb-28">
        {" "}
        {/* Adjusted padding */}
        <div className="w-full max-w-3xl text-center mb-12">
          <div className="flex justify-center mb-8">
            <Logo size="lg" showText={true} />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            Discover Your Website's
            <span className="gradient-text block mt-2" data-text="Full Potential">
              Full Potential
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            WSfynder: AI-powered analysis for performance, SEO, and sustainability optimization.
          </p>

          <MagicalWebsiteInput onAnalyze={handleAnalyzeWebsite} isLoading={isLoading} />
        </div>
        {/* Feature cards - New Style */}
        {!isLoading && !websiteData && !error && (
          <div className="w-full max-w-5xl mt-16 mb-12">
            <h2 className="text-3xl font-bold text-center mb-10">Why WSfynder?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Blazing Performance",
                  description: "Uncover speed bottlenecks & optimize Core Web Vitals for a lightning-fast UX.",
                  gradient: "from-blue-500 to-cyan-400",
                },
                {
                  icon: Leaf,
                  title: "Eco-Friendly Insights",
                  description: "Analyze sustainability, reduce your carbon footprint, and find greener hosting.",
                  gradient: "from-green-500 to-emerald-400",
                },
                {
                  icon: Shield,
                  title: "Robust Security",
                  description: "Assess SSL, headers, and common vulnerabilities to fortify your site.",
                  gradient: "from-purple-500 to-pink-500",
                },
                {
                  icon: BarChart3,
                  title: "SEO & Content Strategy",
                  description: "Audit SEO best practices and generate AI-driven content ideas.",
                  gradient: "from-orange-500 to-red-400",
                },
                {
                  icon: Globe,
                  title: "Accessibility Audits",
                  description: "Ensure your website is inclusive and usable by everyone.",
                  gradient: "from-teal-500 to-sky-400",
                },
                {
                  icon: Brain,
                  title: "AI-Powered Recommendations",
                  description: "Get actionable, intelligent suggestions tailored to your website's needs.",
                  gradient: "from-indigo-500 to-violet-400",
                },
              ].map((feature, i) => (
                <div key={i} className="futuristic-card p-6 group glassmorphism-effect">
                  <div className="mb-4 relative inline-block">
                    <div
                      className={`absolute -inset-2 rounded-full bg-gradient-to-br ${feature.gradient} opacity-30 blur-lg group-hover:opacity-50 transition-all duration-300 animate-pulse-slow`}
                    ></div>
                    <div
                      className={`h-12 w-12 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg relative z-10`}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="w-full max-w-4xl mt-8">
          {" "}
          {/* Added margin-top */}
          {isLoading && !websiteData && <LoadingAnimation />}
          {error && !isLoading && (
            <Alert variant="destructive" className="shadow-lg rounded-xl p-6 futuristic-card glassmorphism-effect">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="font-semibold">Analysis Failed</AlertTitle>
              <AlertDescription>{error} Please check the URL or try a different website.</AlertDescription>
            </Alert>
          )}
          {websiteData && !isLoading && (
            <div className="mt-0">
              <ResultsSection
                data={websiteData}
                onSignUpClick={handleSignUp}
                onSave={() => handleSaveAnalysis("save")}
                onFavorite={() => handleSaveAnalysis("favorite")}
                userId={userId}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
      {showSignUpModal && (
        <SignUpModal
          onClose={() => setShowSignUpModal(false)}
          tempUserId={userId}
          onSignUpSuccess={(newUserId) => {
            setUserId(newUserId)
            setShowSignUpModal(false)
            toast({ title: "Account Created", description: "You've successfully signed up!" })
          }}
        />
      )}
    </>
  )
}
