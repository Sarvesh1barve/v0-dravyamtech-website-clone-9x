import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ 
        isAdmin: false, 
        isLoggedIn: false,
        error: "Not authenticated" 
      })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin, email')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error("[check-admin] Profile error:", profileError)
      return NextResponse.json({ 
        isAdmin: false, 
        isLoggedIn: true,
        userId: user.id,
        email: user.email,
        error: profileError.message 
      })
    }

    return NextResponse.json({ 
      isAdmin: profile?.is_admin || false,
      isLoggedIn: true,
      userId: user.id,
      email: profile?.email || user.email
    })
  } catch (error) {
    console.error("[check-admin] Error:", error)
    return NextResponse.json({ 
      isAdmin: false, 
      isLoggedIn: false,
      error: "Server error" 
    }, { status: 500 })
  }
}
