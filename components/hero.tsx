import { ArrowRight, TrendingUp, BarChart3, LineChart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Floating elements */}
      <div className="absolute top-1/4 left-10 opacity-20 animate-pulse">
        <TrendingUp className="h-16 w-16 text-primary" />
      </div>
      <div className="absolute top-1/3 right-20 opacity-20 animate-pulse delay-300">
        <BarChart3 className="h-20 w-20 text-primary" />
      </div>
      <div className="absolute bottom-1/4 left-1/4 opacity-15 animate-pulse delay-700">
        <LineChart className="h-24 w-24 text-primary" />
      </div>
      
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center lg:px-8">
        <div className="mb-8 inline-flex items-center rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
          <span className="mr-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
          Research-Driven Trading Systems
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
          Fintech That Thinks
          <span className="block text-primary">Beyond Numbers</span>
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
          Building research-driven trading systems, advanced analytics, and education platforms for disciplined market participation
        </p>
        
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
            Explore Our Work
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary px-8">
            Learn More
          </Button>
        </div>
        
        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {[
            { value: "500+", label: "Strategies Tested" },
            { value: "99.9%", label: "System Uptime" },
            { value: "10+", label: "Years Experience" },
            { value: "24/7", label: "Market Coverage" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
