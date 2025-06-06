import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Lock, Database, Mail, Calendar } from "lucide-react"

export default function PrivacyPage() {
  const lastUpdated = "December 2024"

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold bg-primary-gradient bg-clip-text text-transparent mb-4">
              Privacy Policy
            </h1>
            <p className="text-slate-600 dark:text-slate-400 flex items-center justify-center">
              <Calendar className="h-4 w-4 mr-2" />
              Last updated: {lastUpdated}
            </p>
          </div>

          <Card className="mb-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-3 text-primary-gradient-start" />
                Our Commitment to Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p>
                At WebInSight, we take your privacy seriously. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use our website analysis service.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-3 text-primary-gradient-start" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Website URLs</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  We collect the URLs you submit for analysis to provide our website evaluation services.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Analysis Data</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  We temporarily store website content and metadata during the analysis process to generate
                  comprehensive reports.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Usage Information</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  We collect information about how you interact with our service, including pages visited and features
                  used.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Account Information (Optional)
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  If you create an account, we collect your email address and any profile information you provide.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-3 text-primary-gradient-start" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-gradient-start rounded-full mt-2 mr-3 shrink-0"></span>
                  To provide website analysis and generate comprehensive reports
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-gradient-start rounded-full mt-2 mr-3 shrink-0"></span>
                  To improve our AI algorithms and analysis accuracy
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-gradient-start rounded-full mt-2 mr-3 shrink-0"></span>
                  To communicate with you about our services (if you've provided contact information)
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-gradient-start rounded-full mt-2 mr-3 shrink-0"></span>
                  To maintain and improve our service performance
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-gradient-start rounded-full mt-2 mr-3 shrink-0"></span>
                  To comply with legal obligations and protect our rights
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-3 text-primary-gradient-start" />
                Data Security & Retention
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Security Measures</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  We implement industry-standard security measures to protect your data, including encryption in transit
                  and at rest, secure servers, and regular security audits.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Data Retention</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Website analysis data is typically retained for 30 days to allow you to access your reports. Account
                  information is retained until you request deletion.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Data Deletion</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  You can request deletion of your data at any time by contacting us. We will process deletion requests
                  within 30 days.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
            <CardHeader>
              <CardTitle>Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400">
                We use the following third-party services to provide our functionality:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>
                  <strong>Groq AI:</strong> For AI-powered analysis and content generation
                </li>
                <li>
                  <strong>Vercel:</strong> For hosting and deployment
                </li>
                <li>
                  <strong>Neon:</strong> For database services
                </li>
              </ul>
              <p className="text-slate-600 dark:text-slate-400">
                These services have their own privacy policies, and we encourage you to review them.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400">
                Depending on your location, you may have the following rights regarding your personal data:
              </p>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-gradient-start rounded-full mt-2 mr-3 shrink-0"></span>
                  Right to access your personal data
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-gradient-start rounded-full mt-2 mr-3 shrink-0"></span>
                  Right to correct inaccurate data
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-gradient-start rounded-full mt-2 mr-3 shrink-0"></span>
                  Right to delete your data
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-gradient-start rounded-full mt-2 mr-3 shrink-0"></span>
                  Right to data portability
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-gradient-start rounded-full mt-2 mr-3 shrink-0"></span>
                  Right to object to processing
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-primary-gradient-start" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-slate-600 dark:text-slate-400">
                <p>
                  <strong>Email:</strong> privacy@myherb.co.il
                </p>
                <p>
                  <strong>Website:</strong>{" "}
                  <a href="https://myherb.co.il" className="text-primary-gradient-start hover:underline">
                    myherb.co.il
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this
                Privacy Policy periodically for any changes.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
