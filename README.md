# WSfynder - Intelligent Website Analysis & Content Platform

WSfynder is a comprehensive website analysis and content generation platform that helps you discover, analyze, and understand websites with AI-powered insights.

## 🚀 Features

- **Intelligent Website Analysis**: Comprehensive analysis of performance, SEO, security, and accessibility
- **AI Content Generation**: Transform analysis data into professional reports, blog posts, and marketing content
- **Technology Detection**: Identify frameworks, CMS platforms, and third-party integrations
- **Performance Insights**: Deep dive into loading speeds, optimization scores, and technical metrics
- **Security Assessment**: Detailed security analysis and vulnerability scanning
- **Mobile Optimization**: Comprehensive mobile-friendliness evaluation

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Vercel Postgres / Neon
- **AI**: Groq AI for content generation
- **Deployment**: Vercel

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Vercel account for deployment

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/your-username/wsfynder.git
cd wsfynder
\`\`\`

2. Install dependencies:
\`\`\`bash
pnpm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Fill in your environment variables:
\`\`\`env
# Database
DATABASE_URL="your-postgres-connection-string"

# AI Content Generation
GROQ_API_KEY="your-groq-api-key"

# Optional: Additional integrations
MONGODB_URI="your-mongodb-connection-string"
\`\`\`

4. Run the development server:
\`\`\`bash
pnpm dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Setup

WSfynder uses PostgreSQL for data storage. Run the included SQL scripts to set up your database:

\`\`\`sql
-- Run these scripts in order:
scripts/populate-hosting-providers.sql
scripts/001-create-hosting-feedback.sql
\`\`\`

## 🎨 Features Overview

### Website Analysis
- Performance metrics and optimization scores
- SEO analysis and recommendations
- Security assessment and vulnerability scanning
- Technology stack detection
- Mobile optimization evaluation
- Accessibility compliance checking

### AI Content Studio
- Research reports (2000+ words)
- Blog posts (1500+ words)
- Case studies (1800+ words)
- White papers (2500+ words)
- Social media content
- Email newsletters
- Technical documentation

### Content Customization
- Multiple tone options (Professional, Casual, Academic, Creative, Technical, Persuasive)
- Various intentions (Inform, Persuade, Entertain, Analyze, Promote, Instruct)
- Category-based content types
- Export functionality

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/wsfynder)

### Environment Variables for Production

\`\`\`env
DATABASE_URL="your-production-postgres-url"
GROQ_API_KEY="your-groq-api-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="https://your-domain.com"
\`\`\`

## 📝 API Documentation

### Website Analysis API

\`\`\`typescript
POST /api/analyze
{
  "url": "https://example.com"
}
\`\`\`

Returns comprehensive website analysis including:
- Performance metrics
- SEO factors
- Security assessment
- Technology detection
- Content analysis

### Content Generation API

\`\`\`typescript
POST /api/generate-content
{
  "analysisId": "123",
  "contentType": "research_report",
  "tone": "professional",
  "intention": "inform"
}
\`\`\`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Vercel](https://vercel.com/) for hosting and deployment
- [Groq](https://groq.com/) for AI content generation
- [Lucide](https://lucide.dev/) for the icon library

## 📞 Support

- 📧 Email: support@wsfynder.com
- 💬 Discord: [Join our community](https://discord.gg/wsfynder)
- 📖 Documentation: [docs.wsfynder.com](https://docs.wsfynder.com)

---

Built with ❤️ by the WSfynder team
\`\`\`

**6. Fix Package.json**
