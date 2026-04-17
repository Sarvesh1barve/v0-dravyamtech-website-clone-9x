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

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error("[settings-api] Admin check error:", profileError)
      return { isAdmin: false, user }
    }

    return { isAdmin: profile?.is_admin || false, user }
  } catch (error) {
    console.error("[settings-api] Auth verification exception:", error)
    return { isAdmin: false, user: null }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const { isAdmin, user } = await verifyAdminAuth()
    
    if (!isAdmin || !user) {
      console.warn("[settings-api] Unauthorized attempt")
      return NextResponse.json(
        { error: "Unauthorized - admin access required" },
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

    const body = await request.json()
    const { action, data } = body

    console.log("[v0] Settings API:", action, "by user:", user.id)

    if (action === "upsert") {
      const { error, data: result } = await supabaseAdmin
        .from("site_settings")
        .upsert(data)
        .select()
        .single()

      if (error) {
        console.error("[v0] Upsert error:", error)
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }

      return NextResponse.json({ success: true, data: result })
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("[v0] Settings API exception:", message)
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
