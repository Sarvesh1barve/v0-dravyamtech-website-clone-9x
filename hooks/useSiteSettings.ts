'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface SiteSettings {
  id: string
  site_name: string
  site_tagline: string
  site_description: string
  logo_url: string | null
  contact_email: string
  contact_phone: string
  contact_address: string
  hero_title: string
  hero_highlight: string
  hero_description: string
  primary_color: string
  secondary_color: string
  accent_color: string
  text_color: string
  heading_color: string
  upi_id: string | null
  qr_code_url: string | null
  what_we_do_title: string
  what_we_do_items: Array<{ title: string; description: string }> | null
  how_we_work_title: string
  how_we_work_items: Array<{ title: string; description: string }> | null
  social_twitter: string | null
  social_linkedin: string | null
  social_youtube: string | null
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .single()

        if (error) throw error
        setSettings(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch settings')
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return { settings, loading, error }
}
