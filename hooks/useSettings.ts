'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export type SiteSettings = {
  id: string
  hero_title: string
  hero_subtitle: string
  hero_cta_text: string
  hero_background_color: string
  hero_text_color: string
  theme_primary_color: string
  theme_accent_color: string
  updated_at: string
}

const DEFAULT_SETTINGS: SiteSettings = {
  id: 'default',
  hero_title: 'Fintech That Thinks',
  hero_subtitle: 'Building research-driven trading systems, advanced analytics, and education platforms for disciplined market participation',
  hero_cta_text: 'Explore Our Work',
  hero_background_color: '#09090b',
  hero_text_color: '#fafafa',
  theme_primary_color: '#10b981',
  theme_accent_color: '#10b981',
  updated_at: new Date().toISOString(),
}

export function useSettings() {
  // Initialize with defaults immediately for fast initial render
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    
    async function fetchSettings() {
      try {
        const supabase = createClient()
        
        const { data, error: fetchError } = await supabase
          .from('site_settings')
          .select('*')
          .single()

        if (!isMounted) return

        if (fetchError) {
          console.error('[v0] Settings fetch error:', fetchError)
          // Keep using defaults on error
          return
        }

        if (data) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...data,
          } as SiteSettings)
        }
      } catch (err) {
        if (!isMounted) return
        const message = err instanceof Error ? err.message : 'Failed to fetch settings'
        console.error('[v0] Settings error:', message)
        setError(message)
        // Keep using defaults on error
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchSettings()
    
    return () => {
      isMounted = false
    }
  }, [])

  const refreshSettings = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .single()
      
      if (data) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...data,
        } as SiteSettings)
      }
    } catch (err) {
      console.error('[v0] Refresh error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    settings,
    isLoading,
    error,
    refreshSettings,
  }
}
