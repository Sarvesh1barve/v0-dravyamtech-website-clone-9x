import { BarChart2, LineChart, GraduationCap, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  {
    title: "Quantitative Research & Strategy",
    description: "Data-driven strategy development with rigorous backtesting and statistical validation for robust trading systems.",
    icon: BarChart2,
    features: ["Statistical Analysis", "Backtesting", "Risk Modeling", "Strategy Optimization"],
  },
  {
    title: "Trading Systems & Analytics",
    description: "Professional-grade trading tools with real-time analytics, risk management, and performance tracking capabilities.",
    icon: LineChart,
    features: ["Real-time Data", "Risk Management", "Performance Tracking", "Custom Dashboards"],
  },
  {
    title: "Professional Education",
    description: "Structured learning programs teaching disciplined approaches to markets through systematic frameworks and mentorship.",
    icon: GraduationCap,
    features: ["Mentorship", "Course Material", "Live Sessions", "Community Access"],
  },
]

export function Services() {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
            What We Do
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Comprehensive solutions for modern trading and financial analysis
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-3">
          {services.map((service) => (
            <Card 
              key={service.title} 
              className="group relative bg-card border-border hover:border-primary/50 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardHeader className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <service.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative">
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-muted-foreground">
                      <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button className="mt-6 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  Learn more
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
