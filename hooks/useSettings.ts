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

// Map database columns to our SiteSettings type
function mapDatabaseToSettings(data: any): SiteSettings {
  return {
    id: data.id || 'default',
    hero_title: data.hero_title || DEFAULT_SETTINGS.hero_title,
    hero_subtitle: data.hero_description || DEFAULT_SETTINGS.hero_subtitle, // Database has hero_description
    hero_cta_text: data.hero_cta_text || DEFAULT_SETTINGS.hero_cta_text,
    hero_background_color: data.hero_background_color || '#09090b', // Default to dark
    hero_text_color: data.text_color || DEFAULT_SETTINGS.hero_text_color, // Database has text_color
    theme_primary_color: data.primary_color || DEFAULT_SETTINGS.theme_primary_color, // Database has primary_color
    theme_accent_color: data.accent_color || DEFAULT_SETTINGS.theme_accent_color, // Database has accent_color
    updated_at: data.updated_at || new Date().toISOString(),
  }
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
          setSettings(mapDatabaseToSettings(data))
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
        setSettings(mapDatabaseToSettings(data))
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
