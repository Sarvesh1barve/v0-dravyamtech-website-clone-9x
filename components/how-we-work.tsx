import { Search, Code2, TestTube2, Rocket, ArrowRight } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Research & Strategy Development",
    description: "Data-driven research methodologies and quantitative strategy frameworks that form the foundation of our trading systems.",
    icon: Search,
  },
  {
    number: "02",
    title: "System Architecture",
    description: "Building robust, scalable infrastructure designed for high-performance trading with minimal latency and maximum reliability.",
    icon: Code2,
  },
  {
    number: "03",
    title: "Backtesting & Validation",
    description: "Rigorous testing protocols ensure strategies perform across various market conditions before deployment.",
    icon: TestTube2,
  },
  {
    number: "04",
    title: "Deployment & Monitoring",
    description: "Seamless deployment with continuous monitoring, optimization, and real-time performance analytics.",
    icon: Rocket,
  },
]

export function HowWeWork() {
  return (
    <section id="how-we-work" className="py-24 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
            How We Work
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Our systematic approach to building trading excellence
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="relative group">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-border -translate-x-1/2 z-0">
                    <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-border" />
                  </div>
                )}
                
                <div className="relative z-10 flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <step.icon className="h-7 w-7" />
                  </div>
                  
                  <span className="text-xs font-bold text-primary mb-2">{step.number}</span>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <button className="inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors">
              Explore More
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
