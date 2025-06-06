import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Scale } from "lucide-react"

export default function LegalPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center text-3xl">
                <Scale className="h-8 w-8 mr-4 text-primary-gradient-start" />
                Legal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                This page contains important legal information regarding the use of WebInSight. Please review our{" "}
                <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a> for detailed
                information.
              </p>
              <h2 id="disclaimer">Disclaimer</h2>
              <p>
                The information and analysis provided by WebInSight are for informational purposes only and should not
                be considered professional advice. We strive for accuracy, but we make no warranties or guarantees about
                the completeness, reliability, or accuracy of this information.
              </p>
              <h2 id="ip">Intellectual Property</h2>
              <p>
                All content, branding, and technology on this site are the intellectual property of myHerb and its
                licensors. Unauthorized use, reproduction, or distribution is strictly prohibited.
              </p>
              <p>
                For any legal inquiries, please <a href="/contact">contact us</a>.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
