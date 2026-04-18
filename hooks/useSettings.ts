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
  hero_title: 'Quantitative Research & Trading Systems',
  hero_subtitle: 'Data-Driven Financial Intelligence',
  hero_cta_text: 'Explore Products',
  hero_background_color: '#000000',
  hero_text_color: '#ffffff',
  theme_primary_color: '#3b82f6',
  theme_accent_color: '#10b981',
  updated_at: new Date().toISOString(),
}

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      setIsLoading(true)
      const supabase = createClient()
      
      const { data, error: fetchError } = await supabase
        .from('site_settings')
        .select('*')
        .single()

      if (fetchError) {
        console.error('[v0] Settings fetch error:', fetchError)
        setSettings(DEFAULT_SETTINGS)
        return
      }

      if (data) {
        setSettings(data as SiteSettings)
      } else {
        setSettings(DEFAULT_SETTINGS)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch settings'
      console.error('[v0] Settings error:', message)
      setError(message)
      setSettings(DEFAULT_SETTINGS)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshSettings = async () => {
    await fetchSettings()
  }

  return {
    settings: settings || DEFAULT_SETTINGS,
    isLoading,
    error,
    refreshSettings,
  }
}
