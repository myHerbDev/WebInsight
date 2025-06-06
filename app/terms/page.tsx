import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Scale, AlertTriangle, Shield, Calendar, Gavel } from "lucide-react"

export default function TermsPage() {
  const lastUpdated = "December 2024"

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold bg-primary-gradient bg-clip-text text-transparent mb-4">
              Terms of Service
            </h1>
            <p className="text-slate-600 dark:text-slate-400 flex items-center justify-center">
              <Calendar className="h-4 w-4 mr-2" />
              Last updated: {lastUpdated}
            </p>
          </div>

          <Card className="mb-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-3 text-primary-gradient-start" />
                Agreement to Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                By accessing and using WebInSight, you accept and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="h-5 w-5 mr-3 text-primary-gradient-start" />
                Use License
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400">
                Permission is granted to temporarily use WebInSight for personal and commercial website analysis
                purposes. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 ml-4">
                <li>• Modify or copy the service materials</li>
                <li>• Use the materials for any commercial purpose or for any public display</li>
                <li>• Attempt to reverse engineer any software contained on the website</li>
                <li>• Remove any copyright or other proprietary notations from the materials</li>
                <li>• Use the service to analyze websites without proper authorization</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-3 text-primary-gradient-start" />
                Service Description
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">What We Provide</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  WebInSight provides AI-powered website analysis including performance metrics, SEO evaluation, content
                  analysis, and sustainability assessments.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Service Availability</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  We strive to maintain high service availability but do not guarantee uninterrupted access. Maintenance
                  windows and updates may temporarily affect service availability.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Analysis Accuracy</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  While we use advanced AI algorithms, analysis results are provided for informational purposes and
                  should not be considered as definitive assessments.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-3 text-primary-gradient-start" />
                Acceptable Use Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400">
                You agree not to use WebInSight for any of the following prohibited activities:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 ml-4">
                <li>• Analyzing websites without proper authorization from the website owner</li>
                <li>• Attempting to overwhelm our servers with excessive requests</li>
                <li>• Using the service for illegal activities or to violate any laws</li>
                <li>• Attempting to gain unauthorized access to our systems</li>
                <li>• Distributing malware or engaging in phishing activities</li>
                <li>• Violating the intellectual property rights of others</li>
                <li>• Harassing, abusing, or harming other users</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
            <CardHeader>
              <CardTitle>User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Account Responsibility</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  You are responsible for maintaining the confidentiality of your account credentials and for all
                  activities that occur under your account.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Account Termination</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  We reserve the right to terminate accounts that violate these terms or engage in prohibited
                  activities.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gavel className="h-5 w-5 mr-3 text-primary-gradient-start" />
                Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400">
                The materials on WebInSight are provided on an 'as is' basis. WebInSight makes no warranties, expressed
                or implied, and hereby disclaims and negates all other warranties including without limitation, implied
                warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of
                intellectual property or other violation of rights.
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                Further, WebInSight does not warrant or make any representations concerning the accuracy, likely
                results, or reliability of the use of the materials on its website or otherwise relating to such
                materials or on any sites linked to this site.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
            <CardHeader>
              <CardTitle>Limitations of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                In no event shall WebInSight or its suppliers be liable for any damages (including, without limitation,
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability
                to use the materials on WebInSight, even if WebInSight or a WebInSight authorized representative has
                been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not
                allow limitations on implied warranties, or limitations of liability for consequential or incidental
                damages, these limitations may not apply to you.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
            <CardHeader>
              <CardTitle>Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                These terms and conditions are governed by and construed in accordance with the laws of Israel, and you
                irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                We reserve the right to revise these terms of service at any time without notice. By using this website,
                you are agreeing to be bound by the then current version of these terms of service. Continued use of the
                service after changes constitutes acceptance of the new terms.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
