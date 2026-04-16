import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  BarChart3, 
  LineChart, 
  BookOpen, 
  Cpu, 
  ArrowRight,
  Check,
  Zap,
  Shield,
  Clock
} from "lucide-react"

export const metadata = {
  title: "Products - Dravyam Technology",
  description: "Explore our suite of trading systems, analytics tools, and educational platforms.",
}

export const revalidate = 60

const products = [
  {
    icon: BarChart3,
    name: "Quantitative Trading Systems",
    description: "Algorithmic trading systems built on rigorous quantitative research and backtested strategies.",
    features: [
      "Systematic entry and exit signals",
      "Multi-timeframe analysis",
      "Risk-adjusted position sizing",
      "Real-time market scanning",
    ],
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: LineChart,
    name: "Advanced Analytics Platform",
    description: "Comprehensive market analysis tools with real-time data visualization and pattern recognition.",
    features: [
      "Technical indicator suite",
      "Statistical analysis tools",
      "Market correlation analysis",
      "Custom dashboard builder",
    ],
    color: "from-emerald-500/20 to-teal-500/20",
  },
  {
    icon: BookOpen,
    name: "Trading Education Hub",
    description: "Structured learning paths from fundamentals to advanced quantitative strategies.",
    features: [
      "Video courses and tutorials",
      "Live trading sessions",
      "Strategy development guides",
      "Community discussions",
    ],
    color: "from-primary/20 to-orange-500/20",
  },
  {
    icon: Cpu,
    name: "Strategy Backtester",
    description: "Professional-grade backtesting engine to validate your trading ideas with historical data.",
    features: [
      "High-fidelity simulation",
      "Transaction cost modeling",
      "Monte Carlo analysis",
      "Performance attribution",
    ],
    color: "from-purple-500/20 to-pink-500/20",
  },
]

const benefits = [
  {
    icon: Zap,
    title: "Speed & Performance",
    description: "Optimized systems designed for real-time market analysis and execution.",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description: "Built-in risk controls and position sizing algorithms to protect your capital.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Dedicated support team to help you get the most out of our products.",
  },
]

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our <span className="text-primary">Products</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Professional-grade trading tools and educational resources designed to give 
            you an edge in the markets.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {products.map((product, index) => (
            <div 
              key={index}
              className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-colors"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-6`}>
                <product.icon className="w-7 h-7 text-primary" />
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3">{product.name}</h3>
              <p className="text-muted-foreground mb-6">{product.description}</p>
              
              <ul className="space-y-3 mb-6">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Link href="/resources">
                <Button variant="outline" className="w-full border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-6 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Why Choose Our Products
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8">
            Explore our resources and start your journey to becoming a more disciplined trader.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/resources">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Browse Resources
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
