import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Eye, Lock, Users, Globe, Clock, Mail, Info, CheckCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              How we collect, use, and protect your information
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Last updated: January 15, 2024</span>
              </div>
              <Badge variant="outline">GDPR Compliant</Badge>
              <Badge variant="outline">CCPA Compliant</Badge>
            </div>
          </div>

          {/* Quick Summary */}
          <Alert className="mb-8">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Quick Summary:</strong> We collect minimal data necessary to provide our website analysis service.
              We don't sell your data, use it for advertising, or share it with third parties except as described below.
              You have full control over your data and can delete it at any time.
            </AlertDescription>
          </Alert>

          <div className="space-y-8">
            {/* Information We Collect */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-500" />
                  Information We Collect
                </CardTitle>
                <CardDescription>Types of data we collect and how we collect it</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Information You Provide Directly</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <strong>Account Information:</strong> Email address, name, and password when you create an
                        account
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <strong>Website URLs:</strong> URLs of websites you submit for analysis
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <strong>Support Communications:</strong> Messages you send through our support channels
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <strong>Preferences:</strong> Settings and preferences you configure in your account
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Information We Collect Automatically</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <strong>Usage Data:</strong> How you interact with our service, features used, and time spent
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <strong>Technical Data:</strong> IP address, browser type, device information, and operating
                        system
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <strong>Performance Data:</strong> Error logs and performance metrics to improve our service
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <strong>Cookies:</strong> Essential cookies for functionality and optional analytics cookies
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Website Analysis Data</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <strong>Public Website Content:</strong> Publicly accessible content from websites you analyze
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <strong>Analysis Results:</strong> Performance metrics, security scores, and sustainability data
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <strong>Generated Content:</strong> AI-generated content based on analysis results
                      </div>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  How We Use Your Information
                </CardTitle>
                <CardDescription>The purposes for which we process your data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Service Provision</h3>
                    <ul className="space-y-1 text-sm">
                      <li>• Perform website analysis</li>
                      <li>• Generate reports and insights</li>
                      <li>• Provide AI content generation</li>
                      <li>• Save and organize your analyses</li>
                      <li>• Enable comparison features</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Account Management</h3>
                    <ul className="space-y-1 text-sm">
                      <li>• Create and maintain your account</li>
                      <li>• Authenticate your identity</li>
                      <li>• Process subscription payments</li>
                      <li>• Send important account notifications</li>
                      <li>• Provide customer support</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Service Improvement</h3>
                    <ul className="space-y-1 text-sm">
                      <li>• Analyze usage patterns</li>
                      <li>• Fix bugs and technical issues</li>
                      <li>• Develop new features</li>
                      <li>• Improve analysis accuracy</li>
                      <li>• Optimize performance</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Communication</h3>
                    <ul className="space-y-1 text-sm">
                      <li>• Send service updates</li>
                      <li>• Respond to support requests</li>
                      <li>• Share product announcements</li>
                      <li>• Send optional newsletters</li>
                      <li>• Notify about security issues</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Sharing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-teal-500" />
                  How We Share Information
                </CardTitle>
                <CardDescription>When and with whom we share your data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>We do not sell your personal data.</strong> We only share information in the limited
                    circumstances described below.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Service Providers</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      We work with trusted third-party service providers who help us operate our service:
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li>
                        • <strong>Hosting Services:</strong> Vercel (website hosting) and Neon (database hosting)
                      </li>
                      <li>
                        • <strong>AI Services:</strong> Groq (AI content generation)
                      </li>
                      <li>
                        • <strong>Analytics:</strong> Privacy-focused analytics to understand usage patterns
                      </li>
                      <li>
                        • <strong>Payment Processing:</strong> Stripe for subscription billing (if applicable)
                      </li>
                      <li>
                        • <strong>Email Services:</strong> For transactional emails and support communications
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Legal Requirements</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We may disclose information if required by law, court order, or government request, or to protect
                      our rights, property, or safety.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Business Transfers</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      In the event of a merger, acquisition, or sale of assets, your information may be transferred as
                      part of that transaction.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Aggregated Data</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We may share aggregated, anonymized data that cannot identify you for research, industry reports,
                      or service improvement.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-green-500" />
                  Data Security
                </CardTitle>
                <CardDescription>How we protect your information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We implement industry-standard security measures to protect your data:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Technical Safeguards</h3>
                    <ul className="space-y-1 text-sm">
                      <li>• SSL/TLS encryption for data in transit</li>
                      <li>• Encryption at rest for sensitive data</li>
                      <li>• Secure database configurations</li>
                      <li>• Regular security updates and patches</li>
                      <li>• Access controls and authentication</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Operational Safeguards</h3>
                    <ul className="space-y-1 text-sm">
                      <li>• Limited access on a need-to-know basis</li>
                      <li>• Regular security training for staff</li>
                      <li>• Incident response procedures</li>
                      <li>• Regular security audits</li>
                      <li>• Secure development practices</li>
                    </ul>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    While we implement strong security measures, no system is 100% secure. We encourage you to use
                    strong passwords and keep your account information confidential.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-orange-500" />
                  Your Rights and Choices
                </CardTitle>
                <CardDescription>How you can control your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Access and Control</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <div>
                          <strong>Access:</strong> Request a copy of your personal data
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <div>
                          <strong>Correction:</strong> Update or correct inaccurate information
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <div>
                          <strong>Deletion:</strong> Request deletion of your account and data
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <div>
                          <strong>Portability:</strong> Export your data in a machine-readable format
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Communication Preferences</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <div>
                          <strong>Email Preferences:</strong> Opt out of marketing emails
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <div>
                          <strong>Notifications:</strong> Control account and service notifications
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <div>
                          <strong>Cookies:</strong> Manage cookie preferences in your browser
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <div>
                          <strong>Analytics:</strong> Opt out of analytics tracking
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">How to Exercise Your Rights</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    To exercise any of these rights, please contact us at:
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-purple-600" />
                    <a href="mailto:privacy@webinsight.com" className="text-purple-600 hover:underline">
                      privacy@webinsight.com
                    </a>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    We will respond to your request within 30 days as required by applicable law.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-indigo-500" />
                  Data Retention
                </CardTitle>
                <CardDescription>How long we keep your information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Account Data</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We retain your account information and analysis data for as long as your account is active. When
                      you delete your account, we will delete your personal data within 30 days, except where we need to
                      retain it for legal compliance.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Analysis Data</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Website analysis results are retained to provide historical data and improve our service. You can
                      delete individual analyses at any time from your account dashboard.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Technical Data</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Log files and technical data are typically retained for 90 days for security and performance
                      monitoring purposes.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Legal Requirements</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Some data may be retained longer if required by law, for legal proceedings, or to protect our
                      rights and interests.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* International Transfers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  International Data Transfers
                </CardTitle>
                <CardDescription>How we handle data across borders</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Our service is hosted primarily in the United States. If you are located outside the US, your
                  information may be transferred to and processed in the US or other countries where our service
                  providers operate.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We ensure that any international transfers comply with applicable data protection laws and implement
                  appropriate safeguards, such as standard contractual clauses or adequacy decisions.
                </p>
              </CardContent>
            </Card>

            {/* Children's Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-pink-500" />
                  Children's Privacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Our service is not intended for children under 13 years of age. We do not knowingly collect personal
                  information from children under 13. If you are a parent or guardian and believe your child has
                  provided us with personal information, please contact us immediately.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  Changes to This Policy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or applicable
                  law. We will notify you of any material changes by:
                </p>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <li>• Posting the updated policy on our website</li>
                  <li>• Sending an email notification to registered users</li>
                  <li>• Displaying a prominent notice on our service</li>
                </ul>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your continued use of our service after the effective date of the updated policy constitutes
                  acceptance of the changes.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-gradient-to-br from-purple-50 to-teal-50 dark:from-purple-900/20 dark:to-teal-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-purple-600" />
                  Contact Us
                </CardTitle>
                <CardDescription>Questions about this Privacy Policy</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-purple-600" />
                    <span>Email: </span>
                    <a href="mailto:privacy@webinsight.com" className="text-purple-600 hover:underline">
                      privacy@webinsight.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-purple-600" />
                    <span>Website: </span>
                    <a href="/support" className="text-purple-600 hover:underline">
                      webinsight.com/support
                    </a>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  We will respond to privacy-related inquiries within 30 days.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
