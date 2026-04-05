'use client'

import { useSiteSettings } from '@/hooks/useSiteSettings'
import { Loader2 } from 'lucide-react'

export function HowWeWorkSection() {
  const { settings, loading } = useSiteSettings()

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const items = settings?.how_we_work_items || [
    {
      title: 'Research',
      description: 'Deep market analysis and pattern identification'
    },
    {
      title: 'Architecture',
      description: 'System design for optimal execution'
    },
    {
      title: 'Testing',
      description: 'Rigorous backtesting and validation'
    },
    {
      title: 'Deployment',
      description: 'Live trading with continuous monitoring'
    }
  ]

  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: settings?.heading_color }}>
          {settings?.how_we_work_title || 'How We Work'}
        </h2>
        
        <div className="grid md:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mb-4"
                  style={{ backgroundColor: settings?.primary_color }}
                >
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-center mb-2 text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground text-center">{item.description}</p>
              </div>
              {index < items.length - 1 && (
                <div 
                  className="hidden md:block absolute top-6 left-[calc(50%+28px)] w-[calc(100%-56px)] h-0.5 bg-border"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
