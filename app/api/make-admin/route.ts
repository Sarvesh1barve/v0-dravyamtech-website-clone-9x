import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// This endpoint allows the first user or specific email to become admin
// In production, you should secure this better or remove after initial setup
export async function POST(request: Request) {
  try {
    const { email, secretKey } = await request.json()
    
    // Validate inputs
    if (!email || !secretKey) {
      return NextResponse.json({ error: "Email and secret key are required" }, { status: 400 })
    }

    // Simple secret key protection - change this in production
    if (secretKey !== "DRAVYAM_ADMIN_SECRET_2024") {
      return NextResponse.json({ 
        error: "Invalid secret key. The secret key is NOT your password. Ask the developer for the correct key." 
      }, { status: 401 })
    }

    const supabase = await createClient()

    // First check if the user exists
    const { data: existingUser, error: checkError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single()

    if (checkError || !existingUser) {
      return NextResponse.json({ 
        error: "No account found with this email. Please sign up first at /login, then try again." 
      }, { status: 404 })
    }

    if (existingUser.is_admin) {
      return NextResponse.json({ 
        success: true, 
        message: "This user is already an admin! Login and go to /admin to access the panel." 
      })
    }

    // Find user by email and make them admin
    const { data, error } = await supabase
      .from("profiles")
      .update({ is_admin: true })
      .eq("email", email)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to update user: " + error.message }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      message: `User ${email} is now an admin`,
      profile: data 
    })
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
