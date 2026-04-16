import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

// This endpoint allows making a user admin using a secret key
export async function POST(request: Request) {
  try {
    const { email, secretKey } = await request.json()
    
    // Validate inputs
    if (!email || !secretKey) {
      return NextResponse.json({ 
        error: "Email and secret key are required" 
      }, { status: 400 })
    }

    // Simple secret key protection
    if (secretKey !== "DRAVYAM_ADMIN_SECRET_2024") {
      return NextResponse.json({ 
        error: "Invalid secret key. The secret key is NOT your password. Use: DRAVYAM_ADMIN_SECRET_2024" 
      }, { status: 401 })
    }

    // Use admin client to bypass RLS
    let supabase
    try {
      supabase = createAdminClient()
    } catch (e) {
      // If service role key is not available, fall back to looking up by email directly
      return NextResponse.json({ 
        error: "Server configuration error. Service role key not available." 
      }, { status: 500 })
    }

    // First, find the user in auth.users by email
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      return NextResponse.json({ 
        error: "Failed to access user database: " + authError.message 
      }, { status: 500 })
    }

    const authUser = authUsers.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
    
    if (!authUser) {
      return NextResponse.json({ 
        error: "No account found with this email. Please sign up first at /login, then try again." 
      }, { status: 404 })
    }

    // Check if profile exists
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single()

    if (profileCheckError && profileCheckError.code !== 'PGRST116') {
      // Profile doesn't exist, create it
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: authUser.id,
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || null,
          is_admin: true,
          is_subscribed: false
        })

      if (insertError) {
        return NextResponse.json({ 
          error: "Failed to create profile: " + insertError.message 
        }, { status: 500 })
      }

      // Update user metadata with is_admin flag for JWT
      await supabase.auth.admin.updateUserById(authUser.id, {
        user_metadata: {
          ...authUser.user_metadata,
          is_admin: true
        }
      })

      return NextResponse.json({ 
        success: true, 
        message: `Created profile and made ${email} an admin! Please logout and login again.`
      })
    }

    if (existingProfile?.is_admin) {
      return NextResponse.json({ 
        success: true, 
        message: "This user is already an admin! Logout and login again, then go to /admin" 
      })
    }

    // Update the profile to make admin
    const { data, error: updateError } = await supabase
      .from("profiles")
      .update({ is_admin: true })
      .eq("id", authUser.id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ 
        error: "Failed to update profile: " + updateError.message 
      }, { status: 500 })
    }

    // Also update user metadata with is_admin flag for JWT
    await supabase.auth.admin.updateUserById(authUser.id, {
      user_metadata: {
        ...authUser.user_metadata,
        is_admin: true
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: `Success! ${email} is now an admin. Please logout and login again to see the Admin button.`,
      profile: data 
    })

  } catch (err) {
    console.error("Make admin error:", err)
    return NextResponse.json({ 
      error: "Invalid request: " + (err instanceof Error ? err.message : "Unknown error")
    }, { status: 400 })
  }
}
