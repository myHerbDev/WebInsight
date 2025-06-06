"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MagicalWebsiteInput } from "@/components/magical-website-input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnhancedAIGenerator } from "@/components/enhanced-ai-generator"
import { SignUpModal } from "@/components/sign-up-modal"
import { LoginModal } from "@/components/login-modal"
import { Footer } from "@/components/footer"
import { UserProfileButton } from "@/components/user-profile-button"
import {
  FileText,
  BookOpen,
  FileCode,
  MessageSquare,
  PenTool,
  Lightbulb,
  Brain,
  ArrowLeft,
  History,
  Settings,
} from "lucide-react"
import { motion } from "framer-motion"
import type { WebsiteData } from "@/types/website-data"

const CONTENT_TYPES = [
  {
    id: "research",
    name: "Research & Analysis",
    description: "In-depth research documents and analytical reports",
    icon: <BookOpen className="h-5 w-5" />,
    formats: ["Research Paper", "Case Study", "White Paper", "Industry Report", "Literature Review"],
    recommendedTones: ["Academic", "Analytical", "Technical", "Informative"],
    recommendedStyles: ["Analytical", "Formal", "Technical"],
  },
  {
    id: "business",
    name: "Business Documents",
    description: "Professional business content and documentation",
    icon: <FileText className="h-5 w-5" />,
    formats: ["Business Plan", "Executive Summary", "Proposal", "Report", "Policy Document"],
    recommendedTones: ["Professional", "Authoritative", "Informative"],
    recommendedStyles: ["Formal", "Analytical", "Instructional"],
  },
  {
    id: "marketing",
    name: "Marketing Content",
    description: "Engaging content for marketing and promotion",
    icon: <PenTool className="h-5 w-5" />,
    formats: ["Blog Post", "Landing Page", "Email Campaign", "Product Description", "Press Release"],
    recommendedTones: ["Persuasive", "Engaging", "Creative", "Conversational"],
    recommendedStyles: ["Persuasive", "Descriptive", "Conversational"],
  },
  {
    id: "social",
    name: "Social & Communication",
    description: "Content for social media and communication",
    icon: <MessageSquare className="h-5 w-5" />,
    formats: ["Social Media Posts", "Newsletter", "Community Update", "FAQ", "Announcement"],
    recommendedTones: ["Conversational", "Engaging", "Humorous", "Creative"],
    recommendedStyles: ["Conversational", "Creative", "Narrative"],
  },
  {
    id: "technical",
    name: "Technical Content",
    description: "Specialized technical documentation and guides",
    icon: <FileCode className="h-5 w-5" />,
    formats: ["Technical Documentation", "API Guide", "Tutorial", "Troubleshooting Guide", "Specification"],
    recommendedTones: ["Technical", "Informative", "Professional"],
    recommendedStyles: ["Technical", "Instructional", "Analytical"],
  },
  {
    id: "educational",
    name: "Educational Content",
    description: "Content designed for learning and instruction",
    icon: <Lightbulb className="h-5 w-5" />,
    formats: ["Course Material", "Learning Guide", "Educational Article", "Explainer", "How-To Guide"],
    recommendedTones: ["Informative", "Conversational", "Engaging"],
    recommendedStyles: ["Instructional", "Conversational", "Descriptive"],
  },
]

const TONES = [
  { id: "professional", name: "Professional", description: "Formal business communication" },
  { id: "academic", name: "Academic", description: "Scholarly with research focus" },
  { id: "technical", name: "Technical", description: "Precise for technical audiences" },
  { id: "conversational", name: "Conversational", description: "Friendly and approachable" },
  { id: "creative", name: "Creative", description: "Imaginative and artistic" },
  { id: "persuasive", name: "Persuasive", description: "Compelling and action-oriented" },
  { id: "informative", name: "Informative", description: "Clear and educational" },
  { id: "engaging", name: "Engaging", description: "Captivating for audience retention" },
  { id: "authoritative", name: "Authoritative", description: "Expert and credible" },
  { id: "humorous", name: "Humorous", description: "Light-hearted and entertaining" },
]

const WRITING_STYLES = [
  { id: "analytical", name: "Analytical", description: "Data-driven with logical structure" },
  { id: "narrative", name: "Narrative", description: "Story-driven format" },
  { id: "instructional", name: "Instructional", description: "Step-by-step guidance" },
  { id: "persuasive", name: "Persuasive", description: "Argument-based structure" },
  { id: "descriptive", name: "Descriptive", description: "Detailed vivid descriptions" },
  { id: "conversational", name: "Conversational", description: "Natural dialogue-like flow" },
  { id: "formal", name: "Formal", description: "Traditional academic/business writing" },
  { id: "creative", name: "Creative", description: "Artistic and innovative" },
  { id: "technical", name: "Technical", description: "Specification-focused" },
  { id: "journalistic", name: "Journalistic", description: "News-style structure" },
]

export default function AIContentPage() {
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [activeTab, setActiveTab] = useState("generate")
  const router = useRouter()

  useEffect(() => {
    // Load website data from localStorage
    try {
      const storedData = localStorage.getItem("latest-website-analysis")
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        if (parsedData && typeof parsedData === "object" && parsedData.url) {
          setWebsiteData(parsedData)
          setAnalysisData(parsedData)
          setUrl(parsedData.url || "")
          setActiveTab("generate")
        }
      }
    } catch (error) {
      console.error("Error loading website data:", error)
    }
  }, [])

  const handleAnalyze = async (inputUrl: string) => {
    if (!inputUrl) return

    setUrl(inputUrl)
    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: inputUrl }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to analyze website")
      }

      const data = await response.json()
      setAnalysisData(data)
      setWebsiteData(data)
      localStorage.setItem("latest-website-analysis", JSON.stringify(data))
      setActiveTab("generate")
    } catch (err: any) {
      console.error("Analysis error:", err)
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSignUpClick = () => {
    setShowSignUpModal(true)
  }

  const handleLoginClick = () => {
    setShowLoginModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Logo size="sm" />
            <div className="hidden md:block h-6 w-px bg-gray-300"></div>
            <h1 className="text-xl font-semibold text-gray-800">AI Content Generator</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => (window.location.href = "/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Analysis
            </Button>
            <UserProfileButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-purple-600" />
                AI Content Generator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="generate" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Content
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center">
                    <History className="h-4 w-4 mr-2" />
                    Content History
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="generate">
                  {websiteData ? (
                    <EnhancedAIGenerator websiteData={websiteData} onSignUpClick={handleSignUpClick} />
                  ) : (
                    <div className="max-w-3xl mx-auto">
                      <h2 className="text-2xl font-bold mb-4 text-center">Analyze Website</h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                        Enter a website URL to analyze and generate content based on the results
                      </p>
                      <MagicalWebsiteInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} error={error} />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="history">
                  <div className="text-center py-12">
                    <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Content History</h3>
                    <p className="text-gray-600 mb-4">Your generated content history will appear here.</p>
                    <Button onClick={() => setActiveTab("generate")} variant="outline">
                      Generate Your First Content
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="settings">
                  <div className="text-center py-12">
                    <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Generator Settings</h3>
                    <p className="text-gray-600 mb-4">Customize your content generation preferences.</p>
                    <Button onClick={handleSignUpClick} variant="outline">
                      Sign Up to Save Settings
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {!websiteData && (
            <Card className="mb-8 border-amber-200 bg-amber-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Brain className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">No Website Analysis Data</h4>
                    <p className="text-sm text-gray-700">
                      You haven't analyzed a website yet. The AI content generator works best when it has website data
                      to work with.
                    </p>
                    <Button
                      variant="link"
                      className="text-amber-700 p-0 h-auto mt-2"
                      onClick={() => (window.location.href = "/")}
                    >
                      Analyze a website first
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <SignUpModal isOpen={showSignUpModal} onClose={() => setShowSignUpModal(false)} />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  )
}
