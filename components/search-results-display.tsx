import React from "react"
import type { WebsiteData } from "@/types/website-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Globe,
  Server,
  ShieldCheck,
  Zap,
  Leaf,
  BarChart3,
  Users,
  LinkIcon,
  AlertTriangle,
  CheckCircle,
  Info,
  FileText,
  Palette,
  Keyboard,
  Smartphone,
  Share2,
  Cpu,
  Eye,
  ZoomIn,
  Anchor,
  CodeXml,
  ListChecks,
  Rss,
} from "lucide-react"
import { format, parseISO } from "date-fns"
import { Progress } from "@/components/ui/progress"

interface SearchResultsDisplayProps {
  results: WebsiteData | null
  isLoading: boolean
  error: string | null
}

const IconMap = {
  Globe: <Globe className="h-5 w-5 text-blue-500" />,
  Server: <Server className="h-5 w-5 text-green-500" />,
  ShieldCheck: <ShieldCheck className="h-5 w-5 text-red-500" />,
  Zap: <Zap className="h-5 w-5 text-yellow-500" />,
  Leaf: <Leaf className="h-5 w-5 text-emerald-500" />,
  BarChart3: <BarChart3 className="h-5 w-5 text-purple-500" />,
  Users: <Users className="h-5 w-5 text-teal-500" />,
  LinkIcon: <LinkIcon className="h-5 w-5 text-indigo-500" />,
  AlertTriangle: <AlertTriangle className="h-5 w-5 text-orange-500" />,
  CheckCircle: <CheckCircle className="h-5 w-5 text-green-600" />,
  Info: <Info className="h-5 w-5 text-sky-500" />,
  FileText: <FileText className="h-5 w-5 text-slate-500" />,
  Palette: <Palette className="h-5 w-5 text-pink-500" />,
  Keyboard: <Keyboard className="h-5 w-5 text-gray-500" />,
  Smartphone: <Smartphone className="h-5 w-5 text-cyan-500" />,
  Share2: <Share2 className="h-5 w-5 text-lime-500" />,
  Cpu: <Cpu className="h-5 w-5 text-fuchsia-500" />,
  Eye: <Eye className="h-5 w-5 text-rose-500" />,
  ZoomIn: <ZoomIn className="h-5 w-5 text-amber-500" />,
  Anchor: <Anchor className="h-5 w-5 text-violet-500" />,
  CodeXml: <CodeXml className="h-5 w-5 text-orange-600" />,
  ListChecks: <ListChecks className="h-5 w-5 text-blue-600" />,
  Rss: <Rss className="h-5 w-5 text-red-600" />,
}

const DetailItem: React.FC<{
  label: string
  value?: string | number | boolean | null | undefined | React.ReactNode
  icon?: keyof typeof IconMap
  className?: string
  isBoolean?: boolean
  unit?: string
  link?: string
  subItems?: React.ReactNode // For nested lists or complex values
}> = ({ label, value, icon, className, isBoolean, unit, link, subItems }) => {
  if (value === undefined || value === null || value === "") {
    if (!isBoolean && !subItems) return null // Allow boolean false to be shown
  }

  let displayValue: React.ReactNode = value as React.ReactNode
  if (isBoolean) {
    displayValue = value ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <AlertTriangle className="h-5 w-5 text-red-500" />
    )
  } else if (typeof value === "string" && (value.startsWith("http://") || value.startsWith("https://"))) {
    displayValue = (
      <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
        {value}
      </a>
    )
  } else if (link && typeof value === "string") {
    displayValue = (
      <a href={link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
        {value}
      </a>
    )
  } else if (typeof value === "number" && unit) {
    displayValue = `${value.toLocaleString()} ${unit}`
  } else if (Array.isArray(value)) {
    displayValue = (
      <div className="flex flex-wrap gap-1">
        {value.map((item, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {String(item)}
          </Badge>
        ))}
      </div>
    )
  } else if (typeof value === "object" && value !== null && !React.isValidElement(value)) {
    // Simple object rendering
    displayValue = (
      <pre className="text-xs whitespace-pre-wrap break-all bg-muted p-2 rounded-md">
        {JSON.stringify(value, null, 2)}
      </pre>
    )
  }

  return (
    <div className={`py-3 sm:grid sm:grid-cols-3 sm:gap-4 ${className}`}>
      <dt className="text-sm font-medium text-muted-foreground flex items-center">
        {icon && IconMap[icon] && <span className="mr-2 shrink-0">{IconMap[icon]}</span>}
        {label}
      </dt>
      <dd className="mt-1 text-sm text-foreground sm:mt-0 sm:col-span-2 break-words">
        {displayValue}
        {subItems}
      </dd>
    </div>
  )
}

const SectionCard: React.FC<{
  title: string
  icon?: keyof typeof IconMap
  children: React.ReactNode
  description?: string
}> = ({ title, icon, children, description }) => (
  <Card className="shadow-md">
    <CardHeader>
      <CardTitle className="flex items-center text-xl">
        {icon && IconMap[icon] && <span className="mr-3">{IconMap[icon]}</span>}
        {title}
      </CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
    <CardContent>
      <dl className="divide-y divide-border">{children}</dl>
    </CardContent>
  </Card>
)

const ScoreDisplay: React.FC<{ score: number | null | undefined; label: string; max?: number }> = ({
  score,
  label,
  max = 100,
}) => {
  if (score === null || score === undefined) return <DetailItem label={label} value="N/A" />
  const percentage = (score / max) * 100
  let colorClass = "bg-green-500"
  if (percentage < 40) colorClass = "bg-red-500"
  else if (percentage < 70) colorClass = "bg-yellow-500"

  return (
    <div className="py-3">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={`text-sm font-semibold ${colorClass.replace("bg-", "text-")}`}>
          {score}/{max}
        </span>
      </div>
      <Progress value={percentage} className={`h-2 ${colorClass}`} indicatorClassName={colorClass} />
    </div>
  )
}

export const SearchResultsDisplay: React.FC<SearchResultsDisplayProps> = ({ results, isLoading, error }) => {
  if (isLoading) return null // Main page handles loading state

  if (error) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8 border-destructive bg-destructive/10">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center">
            <AlertTriangle className="h-6 w-6 mr-2" /> Analysis Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive/80">{error}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Please check the URL. The website might be inaccessible or blocking automated analysis.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!results) return null

  const {
    url,
    analysisDate,
    metadata,
    hosting,
    performance,
    security,
    sustainability,
    technologies,
    domain,
    links,
    contentAnalysis,
    accessibility,
    mobileFriendliness,
    socialPresence,
    traffic,
  } = results

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 mb-12">
      <Card className="shadow-lg mb-6">
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4">
            {metadata?.favicon ? (
              <img
                src={metadata.favicon || "/placeholder.svg"}
                alt="Favicon"
                className="h-12 w-12 rounded-md mb-2 sm:mb-0 border"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ) : (
              <Globe className="h-12 w-12 text-primary mb-2 sm:mb-0" />
            )}
            <div className="flex-grow">
              <CardTitle className="text-2xl font-semibold text-foreground break-all">
                {metadata?.title || "Website Analysis"}
              </CardTitle>
              <CardDescription className="text-primary hover:underline break-all">
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </a>
              </CardDescription>
            </div>
          </div>
          {analysisDate && (
            <p className="text-xs text-muted-foreground pt-2 mt-2 border-t">
              Analyzed on: {format(parseISO(analysisDate), "PPP p")}
            </p>
          )}
        </CardHeader>
        {metadata?.description && (
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">{metadata.description}</p>
          </CardContent>
        )}
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 h-auto flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content & SEO</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="tech">Technologies</TabsTrigger>
          <TabsTrigger value="hosting">Hosting & Domain</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="mobile">Mobile</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          {/* <TabsTrigger value="sustainability">Sustainability</TabsTrigger> */}
          {/* <TabsTrigger value="traffic">Traffic (Ext. API)</TabsTrigger> */}
        </TabsList>

        <div className="mt-4 space-y-6">
          <TabsContent value="overview">
            <SectionCard title="General Information" icon="Info">
              <DetailItem label="Main Title" value={metadata?.title} />
              <DetailItem label="Language" value={metadata?.language} />
              <DetailItem label="Character Set" value={metadata?.charSet} />
              <DetailItem label="Viewport" value={metadata?.viewport} />
              <DetailItem label="Theme Color" value={metadata?.themeColor} />
              <DetailItem label="Generator" value={metadata?.generator} />
              <DetailItem label="Robots Meta Tag" value={metadata?.robots} />
              <DetailItem label="Canonical URL" value={metadata?.canonicalUrl} />
            </SectionCard>
            {performance?.lighthouseScore && (
              <SectionCard
                title="Lighthouse Scores (Estimated)"
                icon="Zap"
                description="Scores from 0-100, higher is better."
              >
                <ScoreDisplay score={performance.lighthouseScore.performance} label="Performance" />
                <ScoreDisplay score={performance.lighthouseScore.accessibility} label="Accessibility" />
                <ScoreDisplay score={performance.lighthouseScore.bestPractices} label="Best Practices" />
                <ScoreDisplay score={performance.lighthouseScore.seo} label="SEO" />
              </SectionCard>
            )}
          </TabsContent>

          <TabsContent value="content">
            <SectionCard
              title="Content Analysis"
              icon="FileText"
              description="Analysis of the textual content and structure."
            >
              <DetailItem label="Word Count" value={contentAnalysis?.wordCount} />
              <DetailItem label="Character Count" value={contentAnalysis?.charCount} />
              <DetailItem label="Images Count" value={contentAnalysis?.imagesCount} />
              <DetailItem label="Images Missing Alt Text" value={contentAnalysis?.imagesMissingAlt} />
              <DetailItem label="Videos Count" value={contentAnalysis?.videosCount} />
              <DetailItem
                label="Readability (Flesch-Kincaid Grade)"
                value={contentAnalysis?.readabilityScore?.fleschKincaidGrade}
              />
              <DetailItem label="Sentiment Score" value={contentAnalysis?.sentiment?.score} />
              <DetailItem label="Sentiment Label" value={contentAnalysis?.sentiment?.label} />
              <DetailItem label="Detected Languages" value={contentAnalysis?.languageVariety} />
            </SectionCard>
            <SectionCard title="SEO Elements" icon="ZoomIn" description="Key on-page SEO factors.">
              <DetailItem label="Meta Keywords" value={metadata?.keywords} />
              <DetailItem
                label="Robots.txt Rules"
                value={contentAnalysis?.robotsTxtRules}
                isBoolean={false}
                subItems={
                  contentAnalysis?.hasRobotsTxt === false ? (
                    <span className="text-xs text-muted-foreground ml-2">(robots.txt not found or inaccessible)</span>
                  ) : null
                }
              />
              <DetailItem
                label="Sitemap.xml Entries"
                value={contentAnalysis?.sitemapEntries}
                isBoolean={false}
                subItems={
                  contentAnalysis?.hasSitemapXml === false ? (
                    <span className="text-xs text-muted-foreground ml-2">(sitemap.xml not found or inaccessible)</span>
                  ) : null
                }
              />
              <DetailItem
                label="Duplicate Content % (Est.)"
                value={contentAnalysis?.duplicateContentPercentage}
                unit="%"
              />
            </SectionCard>
            {contentAnalysis?.headingsStructure && Object.keys(contentAnalysis.headingsStructure).length > 0 && (
              <SectionCard title="Headings Structure" icon="ListChecks">
                {Object.entries(contentAnalysis.headingsStructure).map(([level, headings]) => (
                  <div key={level} className="py-2">
                    <dt className="text-sm font-medium text-muted-foreground uppercase">{level}</dt>
                    <dd className="mt-1 text-sm text-foreground">
                      <ul className="list-disc pl-5 space-y-1">
                        {headings.map((h, i) => (
                          <li key={i} className="truncate" title={h.text}>
                            {h.text}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                ))}
              </SectionCard>
            )}
            {metadata?.jsonLd && metadata.jsonLd.length > 0 && (
              <SectionCard title="JSON-LD Structured Data" icon="CodeXml">
                {metadata.jsonLd.map((item, index) => (
                  <pre key={index} className="text-xs whitespace-pre-wrap break-all bg-muted p-2 rounded-md mb-2">
                    {JSON.stringify(item, null, 2)}
                  </pre>
                ))}
              </SectionCard>
            )}
          </TabsContent>

          <TabsContent value="performance">
            <SectionCard
              title="Performance Metrics"
              icon="Zap"
              description="Data related to website speed and resource loading. Some metrics require browser-based tools for accuracy."
            >
              <DetailItem label="Page Size (HTML)" value={performance?.pageSize} unit="KB" />
              <DetailItem label="HTTP Requests (Est.)" value={performance?.httpRequests} />
              <DetailItem label="Time to First Byte (TTFB)" value={performance?.ttfb} unit="ms" />
              <DetailItem label="First Contentful Paint (FCP)" value={performance?.fcp} unit="ms" />
              <DetailItem label="Largest Contentful Paint (LCP)" value={performance?.lcp} unit="ms" />
              <DetailItem label="Cumulative Layout Shift (CLS)" value={performance?.cls} />
              <DetailItem label="Speed Index" value={performance?.speedIndex} unit="ms" />
              <DetailItem label="Time to Interactive" value={performance?.interactiveTime} unit="ms" />
            </SectionCard>
            <SectionCard title="Resource Counts" icon="BarChart3">
              <DetailItem label="HTML Documents" value={performance?.resourceCounts?.html} />
              <DetailItem label="CSS Files" value={performance?.resourceCounts?.css} />
              <DetailItem label="JavaScript Files" value={performance?.resourceCounts?.js} />
              <DetailItem label="Images" value={performance?.resourceCounts?.images} />
              <DetailItem label="Fonts" value={performance?.resourceCounts?.fonts} />
              <DetailItem label="Videos" value={performance?.resourceCounts?.videos} />
            </SectionCard>
            <SectionCard title="Optimization Factors" icon="Cpu">
              <DetailItem label="Uses Gzip Compression" value={performance?.compression?.usesGzip} isBoolean />
              <DetailItem label="Uses Brotli Compression" value={performance?.compression?.usesBrotli} isBoolean />
              <DetailItem label="Caching Headers Present" value={performance?.caching?.hasCachingHeaders} isBoolean />
              <DetailItem label="Cache Policy" value={performance?.caching?.cachePolicy} />
              <DetailItem label="Optimizable Images Found" value={performance?.imageOptimization?.optimizableImages} />
              <DetailItem
                label="Potential Savings from Images"
                value={performance?.imageOptimization?.potentialSavingsKb}
                unit="KB"
              />
            </SectionCard>
          </TabsContent>

          <TabsContent value="security">
            <SectionCard
              title="Security Analysis"
              icon="ShieldCheck"
              description="Assessment of website security features."
            >
              <DetailItem label="HTTPS Enabled" value={security?.httpsEnabled} isBoolean />
              <DetailItem label="SSL Issuer" value={security?.sslIssuer} />
              <DetailItem
                label="SSL Valid From"
                value={security?.sslValidFrom ? format(parseISO(security.sslValidFrom), "PPP") : "N/A"}
              />
              <DetailItem
                label="SSL Expiry Date"
                value={security?.sslExpiryDate ? format(parseISO(security.sslExpiryDate), "PPP") : "N/A"}
              />
              <DetailItem label="TLS Version" value={security?.tlsVersion} />
              <DetailItem label="Mixed Content Found" value={security?.mixedContent} isBoolean />
              <DetailItem label="Server Signature" value={security?.serverSignature} />
              <DetailItem
                label="Content Security Policy (CSP)"
                value={security?.csp ? "Present" : "Not Found"}
                subItems={
                  security?.csp && (
                    <pre className="text-xs whitespace-pre-wrap break-all bg-muted p-2 rounded-md mt-1">
                      {security.csp}
                    </pre>
                  )
                }
              />
              <DetailItem label="HSTS Enabled" value={security?.hsts} isBoolean />
              <DetailItem label="DNSSEC Enabled" value={security?.dnssecEnabled} isBoolean />
            </SectionCard>
            {security?.httpHeaders && Object.keys(security.httpHeaders).length > 0 && (
              <SectionCard title="Key Security Headers" icon="ListChecks">
                {Object.entries(security.httpHeaders).map(([key, val]) => (
                  <DetailItem key={key} label={key} value={String(val)} />
                ))}
              </SectionCard>
            )}
            {security?.cookies && security.cookies.length > 0 && (
              <SectionCard title="Cookie Security" icon="Info">
                {security.cookies.map((cookie, index) => (
                  <div key={index} className="py-2 border-b last:border-b-0">
                    <p className="font-medium text-sm">{cookie.name}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mt-1">
                      <DetailItem label="Secure" value={cookie.secure} isBoolean className="py-0" />
                      <DetailItem label="HttpOnly" value={cookie.httpOnly} isBoolean className="py-0" />
                      <DetailItem label="SameSite" value={cookie.sameSite || "N/A"} className="py-0" />
                    </div>
                  </div>
                ))}
              </SectionCard>
            )}
            {security?.vulnerabilitiesFound && security.vulnerabilities && security.vulnerabilities.length > 0 && (
              <SectionCard title="Potential Vulnerabilities (Basic Scan)" icon="AlertTriangle">
                {security.vulnerabilities.map((vuln, index) => (
                  <DetailItem key={index} label={vuln.name} value={`Severity: ${vuln.severity}`} />
                ))}
              </SectionCard>
            )}
          </TabsContent>

          <TabsContent value="tech">
            <SectionCard
              title="Detected Technologies"
              icon="Cpu"
              description="Software and tools identified on the website."
            >
              {technologies && technologies.length > 0 ? (
                technologies.map((tech, index) => (
                  <DetailItem
                    key={index}
                    label={tech.name}
                    value={`${tech.category}${tech.version ? ` (v${tech.version})` : ""}${tech.confidence ? ` - ${tech.confidence}% conf.` : ""}`}
                  />
                ))
              ) : (
                <p className="text-muted-foreground">No specific technologies detected with high confidence.</p>
              )}
            </SectionCard>
          </TabsContent>

          <TabsContent value="hosting">
            <SectionCard title="Hosting Information" icon="Server">
              <DetailItem label="Hosting Provider" value={hosting?.provider} />
              <DetailItem label="IP Address" value={hosting?.ipAddress} />
              <DetailItem label="IP Organization" value={hosting?.ipOrganization} />
              <DetailItem label="ASN" value={hosting?.asn} />
              <DetailItem label="Server Location" value={hosting?.location} />
              <DetailItem label="Country Code" value={hosting?.countryCode} />
              <DetailItem label="Server Software" value={hosting?.serverType} />
            </SectionCard>
            <SectionCard
              title="Domain Information"
              icon="Globe"
              description="Details about the domain registration (requires WHOIS data)."
            >
              <DetailItem label="Registrar" value={domain?.registrar} />
              <DetailItem
                label="Registration Date"
                value={domain?.registrationDate ? format(parseISO(domain.registrationDate), "PPP") : "N/A"}
              />
              <DetailItem
                label="Expiry Date"
                value={domain?.expiryDate ? format(parseISO(domain.expiryDate), "PPP") : "N/A"}
              />
              <DetailItem label="Domain Age" value={domain?.domainAge} />
              <DetailItem label="Nameservers" value={domain?.nameservers} />
              <DetailItem label="Domain Status" value={domain?.status} />
            </SectionCard>
            {domain?.dnsRecords && (
              <SectionCard title="Basic DNS Records" icon="Rss">
                <DetailItem label="A Records" value={domain.dnsRecords.A} />
                <DetailItem label="AAAA Records" value={domain.dnsRecords.AAAA} />
                <DetailItem label="CNAME Record" value={domain.dnsRecords.CNAME} />
                <DetailItem
                  label="MX Records"
                  value={domain.dnsRecords.MX?.map((mx) => `${mx.priority} ${mx.exchange}`).join(", ")}
                />
                <DetailItem label="NS Records" value={domain.dnsRecords.NS} />
                <DetailItem label="TXT Records" value={domain.dnsRecords.TXT} />
              </SectionCard>
            )}
          </TabsContent>

          <TabsContent value="links">
            <SectionCard title="Link Analysis" icon="Anchor" description="Overview of internal and external links.">
              <DetailItem label="Internal Links" value={links?.internalLinks} />
              <DetailItem label="External Links" value={links?.externalLinks} />
              <DetailItem label="Nofollow Links" value={links?.nofollowLinks} />
              <DetailItem
                label="Broken Links (Est.)"
                value={links?.brokenLinks}
                icon={links && links.brokenLinks && links.brokenLinks > 0 ? "AlertTriangle" : "CheckCircle"}
              />
            </SectionCard>
          </TabsContent>

          <TabsContent value="mobile">
            <SectionCard
              title="Mobile Friendliness"
              icon="Smartphone"
              description="Basic checks for mobile usability. Full audit requires dedicated tools."
            >
              <DetailItem label="Viewport Meta Present" value={mobileFriendliness?.viewportMetaPresent} isBoolean />
              <DetailItem
                label="Is Mobile Friendly (Basic Check)"
                value={mobileFriendliness?.isMobileFriendly}
                isBoolean
              />
              <DetailItem
                label="Adequate Tap Target Sizes (Conceptual)"
                value={mobileFriendliness?.tapTargetSizeAdequate}
                isBoolean
              />
              <DetailItem
                label="Adequate Font Sizes (Conceptual)"
                value={mobileFriendliness?.fontSizeAdequate}
                isBoolean
              />
            </SectionCard>
          </TabsContent>

          <TabsContent value="accessibility">
            <SectionCard
              title="Accessibility (Basic Checks)"
              icon="Eye"
              description="Initial checks for web accessibility. Full audit requires dedicated tools."
            >
              <DetailItem label="ARIA Attributes Present" value={accessibility?.ariaAttributesPresent} isBoolean />
              <DetailItem label="Image Alt Text Coverage" value={accessibility?.imageAltTextCoverage} unit="%" />
              <DetailItem label="Form Label Coverage (Est.)" value={accessibility?.formLabelCoverage} unit="%" />
              <DetailItem label="Keyboard Navigable (Conceptual)" value={accessibility?.keyboardNavigable} isBoolean />
              <DetailItem label="WCAG Conformance (Est.)" value={accessibility?.wcagConformanceLevel} />
              <DetailItem label="Contrast Ratio Issues (Conceptual)" value={accessibility?.contrastRatioIssues} />
            </SectionCard>
          </TabsContent>

          <TabsContent value="social">
            <SectionCard title="Social Presence" icon="Share2" description="Detected links to social media profiles.">
              <DetailItem label="Facebook" value={socialPresence?.facebook} />
              <DetailItem label="Twitter / X" value={socialPresence?.twitter} />
              <DetailItem label="LinkedIn" value={socialPresence?.linkedin} />
              <DetailItem label="Instagram" value={socialPresence?.instagram} />
              <DetailItem label="YouTube" value={socialPresence?.youtube} />
              {/* Add more social platforms if included in SocialPresence type */}
            </SectionCard>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
