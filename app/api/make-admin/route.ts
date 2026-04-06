import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// This endpoint allows the first user or specific email to become admin
// In production, you should secure this better or remove after initial setup
export async function POST(request: Request) {
  try {
    const { email, secretKey } = await request.json()
    
    // Simple secret key protection - change this in production
    if (secretKey !== "DRAVYAM_ADMIN_SECRET_2024") {
      return NextResponse.json({ error: "Invalid secret key" }, { status: 401 })
    }

    const supabase = await createClient()

    // Find user by email and make them admin
    const { data, error } = await supabase
      .from("profiles")
      .update({ is_admin: true })
      .eq("email", email)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
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
