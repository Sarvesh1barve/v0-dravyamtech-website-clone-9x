import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Use service role key to bypass RLS policies
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { persistSession: false }
      }
    )

    // First get the user from the regular client (using cookies)
    const { createServerClient } = await import('@supabase/ssr')
    const { cookies } = await import('next/headers')
    
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
      return NextResponse.json({ 
        isAdmin: false, 
        isLoggedIn: false
      })
    }

    // Use admin client to bypass RLS and fetch profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error("[check-admin] Admin client error:", profileError)
      return NextResponse.json({ 
        isAdmin: false, 
        isLoggedIn: true
      })
    }

    return NextResponse.json({ 
      isAdmin: profile?.is_admin || false,
      isLoggedIn: true
    })
  } catch (error) {
    console.error("[check-admin] Error:", error)
    return NextResponse.json({ 
      isAdmin: false, 
      isLoggedIn: false
    }, { status: 500 })
  }
}
