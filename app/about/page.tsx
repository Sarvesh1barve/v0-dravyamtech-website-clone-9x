import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Target, Eye, Users, Award, TrendingUp, Shield } from "lucide-react"

export const metadata = {
  title: "About - Dravyam Technology",
  description: "Learn about Dravyam Technology - our mission, vision, and the team behind research-driven fintech solutions.",
}

export const revalidate = 60 // Revalidate every 60 seconds instead of static

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About <span className="text-primary">Dravyam Technology</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We are a fintech company dedicated to building research-driven trading systems, 
            advanced analytics tools, and comprehensive education platforms for disciplined 
            market participation.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              To democratize access to sophisticated trading tools and financial education, 
              empowering traders and investors with the same caliber of research and technology 
              used by institutional players.
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-6">
              <Eye className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
            <p className="text-muted-foreground leading-relaxed">
              To become the leading platform for quantitative trading education and tools, 
              fostering a community of disciplined, data-driven traders who approach the 
              markets with confidence and clarity.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-6 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Core Values</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Research-Driven",
                description: "Every strategy and tool we develop is backed by rigorous research, backtesting, and statistical validation."
              },
              {
                icon: Users,
                title: "Community Focus",
                description: "We believe in building a supportive community where traders can learn, share, and grow together."
              },
              {
                icon: Shield,
                title: "Risk Awareness",
                description: "We emphasize disciplined risk management as the foundation of sustainable trading success."
              },
              {
                icon: Award,
                title: "Excellence",
                description: "We strive for excellence in everything we do, from code quality to educational content."
              },
              {
                icon: Eye,
                title: "Transparency",
                description: "We maintain full transparency about our methodologies, performance metrics, and limitations."
              },
              {
                icon: Target,
                title: "Innovation",
                description: "We continuously innovate and adapt to evolving market conditions and technological advances."
              }
            ].map((value, index) => (
              <div key={index} className="bg-card border border-border rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <value.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">Our Story</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-6">
              Dravyam Technology was founded with a simple yet powerful idea: to bridge the gap 
              between institutional-grade trading technology and retail traders. Our founders, 
              with backgrounds in quantitative finance and software engineering, recognized that 
              many retail traders lacked access to the sophisticated tools and education that 
              could help them succeed.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              The name &ldquo;Dravyam&rdquo; comes from Sanskrit, meaning &ldquo;wealth&rdquo; or &ldquo;substance.&rdquo; It reflects 
              our commitment to helping traders build substantial, sustainable wealth through 
              disciplined, research-driven approaches rather than speculation or gambling.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, we continue to develop cutting-edge trading systems, educational resources, 
              and analytical tools that empower traders to make informed decisions. Our growing 
              community of traders shares our commitment to continuous learning and disciplined 
              market participation.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
