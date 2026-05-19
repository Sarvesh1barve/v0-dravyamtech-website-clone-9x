import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Search, 
  Code, 
  TestTube, 
  Rocket,
  ArrowRight,
  CheckCircle,
  Users,
  MessageSquare
} from "lucide-react"

export const metadata = {
  title: "How We Work - Dravyam Technology",
  description: "Learn about our research-driven approach to building trading systems and educational content.",
}

export const revalidate = 60

const process = [
  {
    step: "01",
    icon: Search,
    title: "Research & Analysis",
    description: "We begin with extensive market research, analyzing historical data, identifying patterns, and developing hypotheses about market behavior.",
    details: [
      "Historical data analysis",
      "Statistical pattern identification",
      "Literature review and academic research",
      "Market microstructure study",
    ],
  },
  {
    step: "02",
    icon: Code,
    title: "Strategy Development",
    description: "Based on our research findings, we develop systematic trading strategies with clear rules for entry, exit, and position sizing.",
    details: [
      "Rule-based strategy formulation",
      "Algorithm development",
      "Risk management integration",
      "Parameter optimization",
    ],
  },
  {
    step: "03",
    icon: TestTube,
    title: "Rigorous Testing",
    description: "Every strategy undergoes extensive backtesting, walk-forward analysis, and stress testing before consideration for live trading.",
    details: [
      "Multi-period backtesting",
      "Out-of-sample validation",
      "Monte Carlo simulation",
      "Stress testing scenarios",
    ],
  },
  {
    step: "04",
    icon: Rocket,
    title: "Deployment & Monitoring",
    description: "Validated strategies are carefully deployed with continuous monitoring and regular performance reviews.",
    details: [
      "Gradual capital allocation",
      "Real-time performance tracking",
      "Automated alerts and notifications",
      "Regular strategy review",
    ],
  },
]

const principles = [
  {
    title: "Data-Driven Decisions",
    description: "Every decision is backed by data and statistical analysis, not gut feelings or market speculation.",
  },
  {
    title: "Continuous Learning",
    description: "Markets evolve, and so do we. We constantly update our knowledge and adapt our approaches.",
  },
  {
    title: "Risk First",
    description: "Capital preservation is paramount. We never risk more than we can afford to lose on any single trade.",
  },
  {
    title: "Systematic Approach",
    description: "Emotions are the enemy of good trading. Our systematic approach removes emotional decision-making.",
  },
]

export default function HowWeWorkPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            How We <span className="text-primary">Work</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our systematic, research-driven approach ensures that every strategy and tool 
            we develop is built on a solid foundation of data and rigorous testing.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          {process.map((item, index) => (
            <div 
              key={index}
              className={`flex flex-col md:flex-row gap-8 items-start mb-16 last:mb-0 ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl font-bold text-primary/30">{item.step}</span>
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground mb-6">{item.description}</p>
                <ul className="space-y-2">
                  {item.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex-1 w-full">
                <div className="bg-card border border-border rounded-xl p-8 h-full flex items-center justify-center">
                  <item.icon className="w-24 h-24 text-primary/20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="py-16 px-6 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Our Guiding Principles
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {principles.map((principle, index) => (
              <div key={index} className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">{principle.title}</h3>
                <p className="text-sm text-muted-foreground">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Work With Us
                </h3>
                <p className="text-muted-foreground mb-6">
                  Interested in collaborating or learning more about our methodology? 
                  We welcome discussions with fellow traders, researchers, and institutions.
                </p>
                <Link href="/login">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Get in Touch
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
