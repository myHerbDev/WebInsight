import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Target, Lightbulb, Handshake, Github, Globe } from "lucide-react"
import Link from "next/link"

const teamMembers = [
  {
    name: "myHerb (DevSphere Project)",
    role: "Founder & Lead Developer",
    avatarUrl: "/placeholder-user.jpg", // Replace with actual image
    bio: "Passionate about web technologies, AI, and building tools that empower users. myHerb leads the vision and development of WScrapierr.",
    social: {
      github: "https://github.com/myHerbDev",
      website: "https://www.myherb.co.il",
    },
  },
  // Add more team members here if applicable
  // { name: "Jane Doe", role: "UX/UI Designer", avatarUrl: "/placeholder-user.jpg", bio: "..." },
  // { name: "John Smith", role: "AI Specialist", avatarUrl: "/placeholder-user.jpg", bio: "..." },
]

const coreValues = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We constantly explore new technologies and approaches to deliver cutting-edge solutions.",
  },
  {
    icon: Users,
    title: "User-Centricity",
    description:
      "Our users are at the heart of everything we do. We strive to create intuitive and valuable experiences.",
  },
  {
    icon: Target,
    title: "Impact",
    description: "We aim to build tools that make a real difference, helping users achieve their goals efficiently.",
  },
  {
    icon: Handshake,
    title: "Transparency",
    description: "We believe in open communication and clear practices in our development and business operations.",
  },
]

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            About WScrapierr
          </span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          WScrapierr is an intelligent web scraping and AI-powered content generation platform, designed to help you
          unlock the vast potential of web data with ease and precision.
        </p>
      </header>

      <section className="mb-12 md:mb-16">
        <h2 className="text-3xl font-semibold text-center mb-8">Our Mission</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center">
          To empower individuals and businesses by providing sophisticated yet accessible tools for web data extraction
          and content creation, fostering innovation and informed decision-making in the digital landscape.
        </p>
      </section>

      <section className="mb-12 md:mb-16">
        <h2 className="text-3xl font-semibold text-center mb-10">Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {coreValues.map((value) => (
            <Card key={value.title} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-3">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-12 md:mb-16">
        <h2 className="text-3xl font-semibold text-center mb-10">Meet the Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {teamMembers.map((member) => (
            <Card key={member.name} className="text-center p-6">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary">
                <AvatarImage src={member.avatarUrl || "/placeholder.svg"} alt={member.name} />
                <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-primary mb-2">{member.role}</p>
              <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
              <div className="flex justify-center space-x-3">
                {member.social?.github && (
                  <Link href={member.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <Github className="h-5 w-5 text-muted-foreground hover:text-primary" />
                  </Link>
                )}
                {member.social?.website && (
                  <Link href={member.social.website} target="_blank" rel="noopener noreferrer" aria-label="Website">
                    <Globe className="h-5 w-5 text-muted-foreground hover:text-primary" />
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-semibold mb-4">Join Our Journey</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          We're passionate about building the future of web intelligence. Follow our progress and become part of the
          WScrapierr community.
        </p>
        {/* <div className="space-x-4">
          <Button asChild variant="outline">
            <Link href="/careers">View Open Positions</Link>
          </Button>
          <Button asChild>
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div> */}
      </section>
    </div>
  )
}
