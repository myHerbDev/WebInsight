import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Briefcase, Brain, Users, Sparkles } from "lucide-react"
import Link from "next/link"

const jobOpenings = [
  {
    title: "Senior Frontend Engineer (React/Next.js)",
    location: "Remote",
    department: "Engineering",
    description:
      "We're looking for an experienced Frontend Engineer to help build and scale WScrapierr's user interface, focusing on performance, usability, and cutting-edge features.",
    responsibilities: [
      "Develop and maintain responsive web applications using React, Next.js, and TypeScript.",
      "Collaborate with backend developers and UI/UX designers.",
      "Optimize applications for maximum speed and scalability.",
      "Write clean, maintainable, and well-documented code.",
    ],
    qualifications: [
      "5+ years of experience in frontend development.",
      "Strong proficiency in React, Next.js, TypeScript, and Tailwind CSS.",
      "Experience with state management libraries (e.g., Zustand, Redux).",
      "Familiarity with testing frameworks (e.g., Jest, React Testing Library).",
    ],
    applyLink: "/contact?subject=Application: Senior Frontend Engineer",
  },
  {
    title: "AI/ML Engineer (NLP Focus)",
    location: "Remote / Tel Aviv",
    department: "AI & Research",
    description:
      "Join our AI team to enhance WScrapierr's content generation capabilities and develop new intelligent features for web data analysis.",
    responsibilities: [
      "Design, train, and deploy machine learning models, particularly in NLP.",
      "Improve prompt engineering for LLMs.",
      "Research and implement new AI techniques for web scraping and analysis.",
      "Work with large datasets and cloud AI platforms.",
    ],
    qualifications: [
      "Master's or PhD in Computer Science, AI, or related field.",
      "3+ years of experience in AI/ML development.",
      "Strong Python skills and experience with ML frameworks (e.g., TensorFlow, PyTorch).",
      "Experience with LLMs and NLP libraries (e.g., Hugging Face Transformers).",
    ],
    applyLink: "/contact?subject=Application: AI/ML Engineer",
  },
  // Add more job openings here
]

const companyCulture = [
  {
    icon: Brain,
    title: "Innovation-Driven",
    description: "We encourage creative thinking and provide the space to explore new ideas.",
  },
  {
    icon: Users,
    title: "Collaborative Environment",
    description: "Teamwork is key. We foster an open and supportive atmosphere.",
  },
  {
    icon: Sparkles,
    title: "Impactful Work",
    description: "Contribute to a product that empowers users and shapes web intelligence.",
  },
  {
    icon: Briefcase,
    title: "Growth Opportunities",
    description: "We invest in our team's development with learning resources and challenging projects.",
  },
]

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Careers at WScrapierr
          </span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Join our passionate team and help us build the future of web intelligence. We're looking for talented
          individuals who are eager to make an impact.
        </p>
      </header>

      <section className="mb-12 md:mb-16">
        <h2 className="text-3xl font-semibold text-center mb-10">Why Join WScrapierr?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {companyCulture.map((item) => (
            <div key={item.title} className="text-center p-4">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <item.icon className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-center mb-10">Current Openings</h2>
        {jobOpenings.length > 0 ? (
          <div className="space-y-8">
            {jobOpenings.map((job) => (
              <Card key={job.title} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="bg-muted/30">
                  <CardTitle className="text-2xl">{job.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" /> {job.department}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" /> {job.location}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardDescription className="mb-6">{job.description}</CardDescription>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold mb-2">Responsibilities:</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {job.responsibilities.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Qualifications:</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {job.qualifications.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button asChild>
                    <Link href={job.applyLink}>Apply Now</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-lg">
            We don't have any open positions at the moment, but we're always interested in hearing from talented
            individuals. Feel free to{" "}
            <Link href="/contact" className="text-primary hover:underline">
              get in touch
            </Link>
            !
          </p>
        )}
      </section>
    </div>
  )
}
