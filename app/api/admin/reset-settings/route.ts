import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

async function verifyAdminAuth() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll() {}
        }
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { isAdmin: false, user: null }
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { persistSession: false }
      }
    )

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    return { isAdmin: profile?.is_admin || false, user }
  } catch (error) {
    console.error("[reset-api] Auth error:", error)
    return { isAdmin: false, user: null }
  }
}

const DEFAULT_SETTINGS = {
  hero_title: "Quantitative Research & Trading Systems",
  hero_subtitle: "Data-Driven Financial Intelligence",
  hero_cta_text: "Explore Products",
  hero_background_color: "#000000",
  hero_text_color: "#ffffff",
  theme_primary_color: "#3b82f6",
  theme_accent_color: "#10b981",
}

export async function POST(request: NextRequest) {
  try {
    const { isAdmin, user } = await verifyAdminAuth()
    
    if (!isAdmin || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { persistSession: false }
      }
    )

    console.log("[v0] Reset settings by user:", user.id)

    // Update settings to default values
    const { error } = await supabaseAdmin
      .from("site_settings")
      .update({
        ...DEFAULT_SETTINGS,
        updated_at: new Date().toISOString()
      })
      .eq("id", "default")

    if (error) {
      console.error("[v0] Reset error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Trigger revalidation
    try {
      await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/revalidate?tag=site-settings`, {
        method: 'POST'
      })
    } catch (revalidateError) {
      console.warn("[v0] Revalidation failed but reset succeeded:", revalidateError)
    }

    return NextResponse.json({ success: true, data: DEFAULT_SETTINGS })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("[v0] Reset API exception:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
