import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Scale,
  Shield,
  AlertTriangle,
  Users,
  CreditCard,
  Globe,
  Clock,
  Mail,
  Info,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              Legal terms and conditions for using WebInsight
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Last updated: January 15, 2024</span>
              </div>
              <Badge variant="outline">Effective Immediately</Badge>
            </div>
          </div>

          {/* Quick Summary */}
          <Alert className="mb-8">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Quick Summary:</strong> By using WebInsight, you agree to these terms. You can use our service to
              analyze websites, generate content, and access our features. We provide the service "as is" and you're
              responsible for how you use it. You can cancel anytime, and we can terminate accounts that violate these
              terms.
            </AlertDescription>
          </Alert>

          <div className="space-y-8">
            {/* Acceptance of Terms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-blue-500" />
                  Acceptance of Terms
                </CardTitle>
                <CardDescription>Agreement to these terms and conditions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  By accessing or using WebInsight ("the Service"), you agree to be bound by these Terms of Service
                  ("Terms"). If you disagree with any part of these terms, you may not access the Service.
                </p>

                <div className="space-y-2">
                  <h3 className="font-semibold">These Terms Apply To:</h3>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• All users of the WebInsight website and service</li>
                    <li>• Both free and premium account holders</li>
                    <li>• API users and developers</li>
                    <li>• Any interaction with our service or content</li>
                  </ul>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    You must be at least 13 years old to use this service. If you are under 18, you must have parental
                    consent.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Description of Service */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-purple-500" />
                  Description of Service
                </CardTitle>
                <CardDescription>What WebInsight provides and how it works</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  WebInsight is a website analysis platform that provides performance, security, and sustainability
                  metrics for websites. Our service includes but is not limited to:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Core Features</h3>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>• Website performance analysis</li>
                      <li>• Security assessment and scoring</li>
                      <li>• Sustainability metrics and recommendations</li>
                      <li>• Hosting provider analysis</li>
                      <li>• Website comparison tools</li>
                      <li>• Export and sharing capabilities</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Premium Features</h3>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>• AI-powered content generation</li>
                      <li>• Advanced analytics and insights</li>
                      <li>• API access for developers</li>
                      <li>• Priority customer support</li>
                      <li>• Bulk analysis capabilities</li>
                      <li>• Custom reporting options</li>
                    </ul>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    We reserve the right to modify, suspend, or discontinue any part of the service at any time with
                    reasonable notice.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* User Accounts and Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-teal-500" />
                  User Accounts and Responsibilities
                </CardTitle>
                <CardDescription>Your obligations when using our service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Account Security</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <strong>Accurate Information:</strong> Provide accurate and complete information when creating
                        your account
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <strong>Password Security:</strong> Maintain the confidentiality of your password and account
                        credentials
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <strong>Account Responsibility:</strong> You are responsible for all activities under your
                        account
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <strong>Unauthorized Access:</strong> Notify us immediately of any unauthorized use of your
                        account
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Acceptable Use</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2 text-green-600">✓ You May:</h4>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Analyze publicly accessible websites</li>
                        <li>• Use our service for legitimate business purposes</li>
                        <li>• Share analysis results with proper attribution</li>
                        <li>• Use our API within rate limits</li>
                        <li>• Export data for your own use</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-red-600">✗ You May Not:</h4>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Analyze websites without permission</li>
                        <li>• Use the service for illegal activities</li>
                        <li>• Attempt to reverse engineer our service</li>
                        <li>• Exceed API rate limits or abuse the service</li>
                        <li>• Share account credentials with others</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prohibited Uses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  Prohibited Uses
                </CardTitle>
                <CardDescription>Activities that are not allowed on our platform</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Violation of these prohibitions may result in immediate account termination and legal action.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Technical Violations</h3>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>• Attempting to hack or compromise our systems</li>
                      <li>• Using automated tools to scrape our service</li>
                      <li>• Overloading our servers with excessive requests</li>
                      <li>• Circumventing security measures or access controls</li>
                      <li>• Introducing malware, viruses, or harmful code</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Content and Conduct</h3>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>• Analyzing websites containing illegal content</li>
                      <li>• Using the service to harass or harm others</li>
                      <li>• Violating intellectual property rights</li>
                      <li>• Impersonating others or providing false information</li>
                      <li>• Spamming or sending unsolicited communications</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Terms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-500" />
                  Payment Terms and Billing
                </CardTitle>
                <CardDescription>Subscription and payment information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Free and Premium Services</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    WebInsight offers both free and premium subscription plans. Free users have access to basic features
                    with usage limits, while premium subscribers enjoy unlimited access and advanced features.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Billing Terms</h3>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>• Subscriptions are billed monthly or annually</li>
                      <li>• Payment is due in advance for each billing period</li>
                      <li>• All fees are non-refundable unless required by law</li>
                      <li>• Prices may change with 30 days notice</li>
                      <li>• Failed payments may result in service suspension</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Cancellation</h3>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>• Cancel your subscription anytime from your account</li>
                      <li>• Cancellation takes effect at the end of the billing period</li>
                      <li>• You retain access until the end of the paid period</li>
                      <li>• No refunds for partial billing periods</li>
                      <li>• Data may be deleted after account closure</li>
                    </ul>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    We use Stripe for secure payment processing. Your payment information is not stored on our servers.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  Intellectual Property Rights
                </CardTitle>
                <CardDescription>Ownership of content and technology</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Our Rights</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    WebInsight and its original content, features, and functionality are owned by myHerb and are
                    protected by international copyright, trademark, patent, trade secret, and other intellectual
                    property laws.
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• The WebInsight name, logo, and branding</li>
                    <li>• Our proprietary analysis algorithms and methodologies</li>
                    <li>• The user interface and website design</li>
                    <li>• Our database of hosting providers and sustainability metrics</li>
                    <li>• All software, code, and technical infrastructure</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Your Rights</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    You retain ownership of any content you provide to our service. However, you grant us certain rights
                    to provide our service:
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Right to analyze websites you submit</li>
                    <li>• Right to store and process your analysis data</li>
                    <li>• Right to use aggregated, anonymized data for service improvement</li>
                    <li>• Right to display your analysis results to you</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Generated Content</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Content generated by our AI features based on your website analysis belongs to you. However, you
                    acknowledge that similar content may be generated for other users analyzing the same or similar
                    websites.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Privacy and Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-teal-500" />
                  Privacy and Data Protection
                </CardTitle>
                <CardDescription>How we handle your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your privacy is important to us. Our collection and use of personal information is governed by our
                  Privacy Policy, which is incorporated into these Terms by reference.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Data We Collect</h3>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>• Account information (email, name)</li>
                      <li>• Website URLs you submit for analysis</li>
                      <li>• Usage data and analytics</li>
                      <li>• Technical information (IP address, browser)</li>
                      <li>• Communication with our support team</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Your Data Rights</h3>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>• Access your personal data</li>
                      <li>• Correct inaccurate information</li>
                      <li>• Delete your account and data</li>
                      <li>• Export your data</li>
                      <li>• Control communication preferences</li>
                    </ul>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    For complete details about our data practices, please review our{" "}
                    <a href="/privacy" className="text-purple-600 hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Disclaimers and Limitations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Disclaimers and Limitations of Liability
                </CardTitle>
                <CardDescription>Important limitations on our service and liability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> Please read this section carefully as it limits our liability and
                    affects your legal rights.
                  </AlertDescription>
                </Alert>

                <div>
                  <h3 className="font-semibold mb-3">Service Disclaimers</h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>
                      • <strong>"As Is" Service:</strong> WebInsight is provided "as is" without warranties of any kind
                    </li>
                    <li>
                      • <strong>Accuracy:</strong> We strive for accuracy but cannot guarantee the completeness or
                      correctness of analysis results
                    </li>
                    <li>
                      • <strong>Availability:</strong> We do not guarantee uninterrupted or error-free service
                    </li>
                    <li>
                      • <strong>Third-Party Content:</strong> We are not responsible for the content of websites you
                      analyze
                    </li>
                    <li>
                      • <strong>External Links:</strong> We are not responsible for external websites or services we
                      link to
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Limitation of Liability</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    To the maximum extent permitted by law, myHerb and WebInsight shall not be liable for:
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Indirect, incidental, special, or consequential damages</li>
                    <li>• Loss of profits, data, or business opportunities</li>
                    <li>• Damages resulting from use or inability to use the service</li>
                    <li>• Damages from unauthorized access to your account</li>
                    <li>• Any damages exceeding the amount you paid for the service in the past 12 months</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Indemnification</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You agree to indemnify and hold harmless WebInsight, myHerb, and our affiliates from any claims,
                    damages, or expenses arising from your use of the service, violation of these terms, or infringement
                    of any rights of another.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  Termination
                </CardTitle>
                <CardDescription>How accounts can be terminated</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Termination by You</h3>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>• Cancel your account anytime from your dashboard</li>
                      <li>• Cancellation is effective at the end of your billing period</li>
                      <li>• You can request immediate account deletion</li>
                      <li>• Export your data before cancellation</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Termination by Us</h3>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>• Violation of these Terms of Service</li>
                      <li>• Fraudulent or illegal activity</li>
                      <li>• Abuse of our service or systems</li>
                      <li>• Non-payment of subscription fees</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Effect of Termination</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Upon termination of your account:</p>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Your access to the service will be immediately suspended</li>
                    <li>• Your data may be deleted after a reasonable grace period</li>
                    <li>• Outstanding fees remain due and payable</li>
                    <li>• These Terms continue to apply to past use of the service</li>
                    <li>
                      • Certain provisions survive termination (e.g., intellectual property, limitations of liability)
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-indigo-500" />
                  Governing Law and Dispute Resolution
                </CardTitle>
                <CardDescription>Legal jurisdiction and dispute resolution procedures</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Governing Law</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    These Terms shall be governed by and construed in accordance with the laws of the State of Delaware,
                    United States, without regard to its conflict of law provisions.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Dispute Resolution</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    We encourage resolving disputes through direct communication. If that fails:
                  </p>
                  <ol className="space-y-1 text-sm text-gray-600 dark:text-gray-400 list-decimal list-inside">
                    <li>Contact our support team to attempt resolution</li>
                    <li>If unresolved, disputes may be subject to binding arbitration</li>
                    <li>Arbitration will be conducted under the rules of the American Arbitration Association</li>
                    <li>You waive the right to participate in class action lawsuits</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Jurisdiction</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Any legal action or proceeding shall be brought exclusively in the federal or state courts located
                    in Delaware, and you consent to the jurisdiction of such courts.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* General Provisions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-gray-500" />
                  General Provisions
                </CardTitle>
                <CardDescription>Additional terms and conditions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Entire Agreement</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      These Terms, together with our Privacy Policy, constitute the entire agreement between you and
                      WebInsight.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Severability</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      If any provision is found unenforceable, the remaining provisions will continue in full force and
                      effect.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Waiver</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Our failure to enforce any right or provision does not constitute a waiver of such right or
                      provision.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Assignment</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You may not assign these Terms without our consent. We may assign our rights and obligations
                      freely.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Changes to Terms</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    We may update these Terms from time to time. We will notify you of material changes by:
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Posting the updated Terms on our website</li>
                    <li>• Sending email notification to registered users</li>
                    <li>• Displaying a prominent notice in our service</li>
                  </ul>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                    Continued use of the service after changes become effective constitutes acceptance of the new Terms.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-gradient-to-br from-purple-50 to-teal-50 dark:from-purple-900/20 dark:to-teal-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-purple-600" />
                  Contact Information
                </CardTitle>
                <CardDescription>Questions about these Terms of Service</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-purple-600" />
                    <span>Email: </span>
                    <a href="mailto:legal@webinsight.com" className="text-purple-600 hover:underline">
                      legal@webinsight.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-purple-600" />
                    <span>Support: </span>
                    <a href="/support" className="text-purple-600 hover:underline">
                      webinsight.com/support
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span>Company: </span>
                    <span>myHerb (DevSphere Project)</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">We will respond to legal inquiries within 30 days.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
