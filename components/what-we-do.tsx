'use client'

import { useSiteSettings } from '@/hooks/useSiteSettings'
import { Loader2, TrendingUp, BarChart3, GraduationCap } from 'lucide-react'

const defaultItems = [
  {
    icon: TrendingUp,
    title: 'Quantitative Research & Strategy',
    description: 'Data-driven strategy development with rigorous backtesting and statistical validation for robust trading systems.'
  },
  {
    icon: BarChart3,
    title: 'Trading Systems & Analytics',
    description: 'Professional-grade trading tools with real-time analytics, risk management, and performance tracking capabilities.'
  },
  {
    icon: GraduationCap,
    title: 'Professional Education',
    description: 'Structured learning programs teaching disciplined approaches to markets through systematic frameworks and mentorship.'
  }
]

export function WhatWeDo() {
  const { settings, loading } = useSiteSettings()

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {settings?.what_we_do_title || 'What We Do'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive solutions for modern trading and financial analysis
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {defaultItems.map((item, index) => {
            const Icon = item.icon
            return (
              <div 
                key={index} 
                className="p-8 rounded-xl bg-[#1a2d4a] border border-[#2a3f5f] hover:border-primary/50 transition-colors"
              >
                <div className="w-14 h-14 rounded-lg bg-[#0d4f6e] flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
