import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Megaphone } from "lucide-react"

export default function ComplaintsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center text-3xl">
                <Megaphone className="h-8 w-8 mr-4 text-primary-gradient-start" />
                File a Complaint
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                We take all feedback seriously. If you have a complaint regarding our services, content, or any other
                matter, please use the form below to get in touch with our compliance team. We aim to respond within 5
                business days.
              </p>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john.doe@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="e.g., Issue with website analysis" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complaint">Detailed Complaint</Label>
                  <Textarea id="complaint" placeholder="Please describe your issue in detail..." rows={6} />
                </div>
                <div>
                  <Button type="submit" className="w-full sm:w-auto bg-primary-gradient hover:opacity-90 text-white">
                    Submit Complaint
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
