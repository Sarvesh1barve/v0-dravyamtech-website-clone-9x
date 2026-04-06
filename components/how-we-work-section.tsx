'use client'

import { useState, useEffect } from 'react'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { Loader2, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const carouselItems = [
  {
    title: 'Research & Strategy Development',
    description: 'Data-driven research methodologies and quantitative strategy frameworks that form the foundation of our trading systems.',
    image: '/images/trading-chart-1.jpg',
    link: '/how-we-work'
  },
  {
    title: 'System Architecture & Design',
    description: 'Building robust, scalable trading infrastructure with modular components for seamless integration and performance optimization.',
    image: '/images/trading-chart-2.jpg',
    link: '/how-we-work'
  },
  {
    title: 'Rigorous Backtesting & Validation',
    description: 'Comprehensive testing across multiple market conditions, stress scenarios, and historical periods to ensure strategy reliability.',
    image: '/images/trading-chart-3.jpg',
    link: '/how-we-work'
  },
  {
    title: 'Live Deployment & Monitoring',
    description: 'Real-time system monitoring, performance analytics, and continuous optimization to maintain edge in dynamic markets.',
    image: '/images/trading-chart-4.jpg',
    link: '/how-we-work'
  }
]

export function HowWeWorkSection() {
  const { settings, loading } = useSiteSettings()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % carouselItems.length)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const currentItem = carouselItems[currentIndex]

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {settings?.how_we_work_title || 'How We Work'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our systematic approach to building trading excellence
          </p>
        </div>
        
        {/* Carousel Container */}
        <div className="relative">
          <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden bg-[#1a2d4a] border border-[#2a3f5f]">
            {/* Left side - Chart Image */}
            <div className="relative md:w-1/2 h-64 md:h-[400px] bg-[#0a1628] overflow-hidden">
              {/* Animated Trading Chart SVG */}
              <svg 
                viewBox="0 0 400 300" 
                className="w-full h-full"
                preserveAspectRatio="xMidYMid slice"
              >
                {/* Background Grid */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1a3a2a" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="#0a1a12"/>
                <rect width="100%" height="100%" fill="url(#grid)"/>
                
                {/* Candlestick Pattern */}
                {[20, 50, 80, 110, 140, 170, 200, 230, 260, 290, 320, 350].map((x, i) => {
                  const isGreen = [0, 2, 3, 5, 7, 9, 11].includes(i)
                  const heights = [60, 45, 80, 55, 40, 70, 50, 65, 75, 55, 45, 60]
                  const tops = [120, 140, 100, 130, 150, 110, 140, 115, 95, 125, 145, 120]
                  return (
                    <g key={i}>
                      <line 
                        x1={x} y1={tops[i] - 20} 
                        x2={x} y2={tops[i] + heights[i] + 20} 
                        stroke={isGreen ? "#22c55e" : "#ef4444"} 
                        strokeWidth="1"
                      />
                      <rect 
                        x={x - 8} y={tops[i]} 
                        width="16" height={heights[i]} 
                        fill={isGreen ? "#22c55e" : "#ef4444"}
                      />
                    </g>
                  )
                })}
                
                {/* Moving Average Lines */}
                <path 
                  d="M 20 180 Q 80 160, 140 175 T 260 165 T 380 170" 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="2"
                  opacity="0.8"
                />
                <path 
                  d="M 20 200 Q 80 185, 140 195 T 260 185 T 380 190" 
                  fill="none" 
                  stroke="#eab308" 
                  strokeWidth="2"
                  opacity="0.8"
                />
                
                {/* Volume Bars */}
                {[20, 50, 80, 110, 140, 170, 200, 230, 260, 290, 320, 350].map((x, i) => {
                  const isGreen = [0, 2, 3, 5, 7, 9, 11].includes(i)
                  const heights = [30, 45, 25, 50, 35, 55, 40, 30, 45, 35, 25, 40]
                  return (
                    <rect 
                      key={`vol-${i}`}
                      x={x - 6} y={270 - heights[i]} 
                      width="12" height={heights[i]} 
                      fill={isGreen ? "#22c55e" : "#ef4444"}
                      opacity="0.6"
                    />
                  )
                })}
              </svg>
              
              {/* Left Arrow */}
              <button 
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            </div>
            
            {/* Right side - Content */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative bg-[#1e3654]">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                {currentItem.title}
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {currentItem.description}
              </p>
              <div>
                <Link href={currentItem.link}>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Explore More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              
              {/* Right Arrow */}
              <button 
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
          
          {/* Carousel Indicators */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-8 h-2 bg-primary rounded-full' 
                    : 'w-2 h-2 bg-muted-foreground/50 rounded-full hover:bg-muted-foreground'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
