'use client'

import { useSiteSettings } from '@/hooks/useSiteSettings'
import { Loader2 } from 'lucide-react'

export function WhatWeDo() {
  const { settings, loading } = useSiteSettings()

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const items = settings?.what_we_do_items || [
    {
      title: 'Quantitative Research',
      description: 'Data-driven market analysis and statistical modeling'
    },
    {
      title: 'Trading Systems',
      description: 'Algorithmic strategies built on rigorous backtesting'
    },
    {
      title: 'Professional Education',
      description: 'Structured learning for disciplined market participation'
    }
  ]

  return (
    <section className="py-16 bg-card">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: settings?.heading_color }}>
          {settings?.what_we_do_title || 'What We Do'}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div key={index} className="p-6 rounded-lg bg-secondary/50 border border-border">
              <h3 className="text-xl font-semibold mb-3 text-foreground">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
