import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { WhatWeDo } from "@/components/what-we-do"
import { HowWeWorkSection } from "@/components/how-we-work-section"
import { Footer } from "@/components/footer"

export const revalidate = 60

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <WhatWeDo />
      <HowWeWorkSection />
      <Footer />
    </main>
  )
}
