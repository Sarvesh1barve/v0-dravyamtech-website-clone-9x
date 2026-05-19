"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/hooks/useSettings"

export function Hero() {
  const { settings } = useSettings()

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-500"
      style={{
        backgroundColor: settings.hero_background_color,
      }}
    >
      {/* Background with candlestick chart pattern */}
      <div className="absolute inset-0">
        {/* Animated candlestick chart SVG */}
        <svg 
          className="absolute inset-0 w-full h-full opacity-30"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Candlestick wicks */}
          <g stroke="currentColor" strokeWidth="2" opacity="0.4">
            <line x1="100" y1="300" x2="100" y2="550" />
            <line x1="180" y1="280" x2="180" y2="500" />
            <line x1="260" y1="320" x2="260" y2="530" />
            <line x1="340" y1="250" x2="340" y2="480" />
            <line x1="420" y1="280" x2="420" y2="470" />
            <line x1="500" y1="220" x2="500" y2="430" />
            <line x1="580" y1="200" x2="580" y2="400" />
            <line x1="660" y1="250" x2="660" y2="420" />
            <line x1="740" y1="230" x2="740" y2="380" />
            <line x1="820" y1="200" x2="820" y2="350" />
            <line x1="900" y1="180" x2="900" y2="320" />
            <line x1="980" y1="160" x2="980" y2="300" />
            <line x1="1060" y1="150" x2="1060" y2="280" />
            <line x1="1140" y1="140" x2="1140" y2="260" />
          </g>
          
          {/* Candlestick bodies - mix of green and red */}
          <g>
            <rect x="88" y="380" width="24" height="80" fill="rgb(239, 68, 68)" opacity="0.5" rx="2" />
            <rect x="168" y="350" width="24" height="70" fill="rgb(16, 185, 129)" opacity="0.5" rx="2" />
            <rect x="248" y="400" width="24" height="60" fill="rgb(239, 68, 68)" opacity="0.5" rx="2" />
            <rect x="328" y="320" width="24" height="80" fill="rgb(16, 185, 129)" opacity="0.5" rx="2" />
            <rect x="408" y="340" width="24" height="60" fill="rgb(16, 185, 129)" opacity="0.5" rx="2" />
            <rect x="488" y="300" width="24" height="60" fill="rgb(16, 185, 129)" opacity="0.5" rx="2" />
            <rect x="568" y="280" width="24" height="50" fill="rgb(239, 68, 68)" opacity="0.5" rx="2" />
            <rect x="648" y="300" width="24" height="60" fill="rgb(16, 185, 129)" opacity="0.5" rx="2" />
            <rect x="728" y="280" width="24" height="50" fill="rgb(16, 185, 129)" opacity="0.5" rx="2" />
            <rect x="808" y="250" width="24" height="50" fill="rgb(16, 185, 129)" opacity="0.5" rx="2" />
            <rect x="888" y="230" width="24" height="40" fill="rgb(16, 185, 129)" opacity="0.5" rx="2" />
            <rect x="968" y="210" width="24" height="40" fill="rgb(16, 185, 129)" opacity="0.5" rx="2" />
            <rect x="1048" y="190" width="24" height="40" fill="rgb(16, 185, 129)" opacity="0.5" rx="2" />
            <rect x="1128" y="180" width="24" height="35" fill="rgb(16, 185, 129)" opacity="0.5" rx="2" />
          </g>
          
          {/* Upward trend line */}
          <path 
            d="M 50 600 Q 200 530, 350 470 T 650 350 T 950 230 T 1150 150" 
            fill="none" 
            stroke="rgb(16, 185, 129)" 
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
        
        {/* Radial gradient overlay for depth */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-opacity-100 transition-all duration-500"
          style={{
            background: `radial-gradient(ellipse at center, transparent 0%, ${settings.hero_background_color}80 70%)`
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-32 text-center lg:py-40">
        <h1 
          className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-balance transition-colors duration-500"
          style={{ color: settings.hero_text_color }}
        >
          {settings.hero_title}{" "}
          <span style={{ color: settings.theme_primary_color }}>Beyond Numbers</span>
        </h1>
        
        <p 
          className="mt-6 text-lg leading-relaxed max-w-2xl mx-auto text-balance transition-colors duration-500"
          style={{ color: `${settings.hero_text_color}cc` }}
        >
          {settings.hero_subtitle}
        </p>
        
        <div className="mt-10 flex items-center justify-center gap-x-4">
          <Link href="/products">
            <Button 
              size="lg" 
              className="gap-2 transition-colors duration-500"
              style={{
                backgroundColor: settings.theme_primary_color,
                color: 'white'
              }}
            >
              {settings.hero_cta_text}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 transition-all duration-500"
        style={{
          background: `linear-gradient(to top, ${settings.hero_background_color}, transparent)`
        }}
      />
    </section>
  )
}
