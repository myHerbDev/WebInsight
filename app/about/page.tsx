"use client"

import { Logo } from "@/components/logo"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Users, Target, Zap, Leaf, Shield, Brain, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="futuristic-bg min-h-[calc(100vh-var(--header-height,64px)-var(--footer-height,64px))]">
          <div className="grid-pattern"></div>
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>

          <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block mb-6">
                <Logo size="lg" showText={true} />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6" data-text="About WSfynder">
                About WSfynder
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Empowering you to build a faster, greener, and more secure web.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="space-y-6">
                <h2 className="text-3xl font-semibold text-white">Our Mission</h2>
                <p className="text-lg text-gray-400 leading-relaxed">
                  At WSfynder, we believe in a web that is not only performant and secure but also sustainable. Our
                  mission is to provide developers, businesses, and individuals with the tools and insights needed to
                  make informed decisions about their digital infrastructure. We aim to simplify complexity and promote
                  best practices for a better online ecosystem.
                </p>
                <p className="text-lg text-gray-400 leading-relaxed">
                  By leveraging cutting-edge AI and comprehensive data analysis, WSfynder helps you understand your
                  website's impact and potential across crucial dimensions: performance, SEO, security, accessibility,
                  and environmental sustainability.
                </p>
              </div>
              <div className="futuristic-card glassmorphism-effect p-8 rounded-xl">
                <Target className="w-24 h-24 text-purple-400 mx-auto mb-6" />
                <p className="text-center text-lg text-gray-300">
                  "Our goal is to make advanced web analytics accessible and actionable for everyone, fostering a web
                  that works better for people and the planet."
                </p>
                <p className="text-center text-sm text-purple-400 mt-4">- The WSfynder Team</p>
              </div>
            </div>

            <h2 className="text-3xl font-semibold text-white text-center mb-12">Core Features & Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Performance Optimization",
                  description: "Identify and fix speed bottlenecks for superior user experiences.",
                },
                {
                  icon: Leaf,
                  title: "Sustainability Focus",
                  description: "Measure and improve your website's carbon footprint with actionable insights.",
                },
                {
                  icon: Shield,
                  title: "Security Analysis",
                  description: "Detect vulnerabilities and implement best practices to protect your data.",
                },
                {
                  icon: Users,
                  title: "Accessibility First",
                  description: "Ensure your website is inclusive and usable by people of all abilities.",
                },
                {
                  icon: Brain,
                  title: "AI-Driven Insights",
                  description: "Leverage artificial intelligence for smart recommendations and content ideas.",
                },
                {
                  icon: Globe,
                  title: "Comprehensive SEO Audits",
                  description: "Boost your visibility and reach with in-depth SEO analysis.",
                },
              ].map((item) => (
                <div key={item.title} className="futuristic-card glassmorphism-effect p-6 rounded-lg text-center">
                  <div className="inline-block p-3 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-full mb-4">
                    <item.icon className="h-8 w-8 text-purple-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-20">
              <h2 className="text-3xl font-semibold text-white mb-6">Join Us on Our Journey</h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
                WSfynder is constantly evolving. We're committed to innovation and to providing the best possible tools
                for our users. Stay tuned for exciting new features and integrations!
              </p>
              {/* You could add a call to action here, like a newsletter signup or link to a roadmap */}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
