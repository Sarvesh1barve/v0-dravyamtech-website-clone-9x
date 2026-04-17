import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { amount, transaction_id, payment_method = "upi" } = body

    if (!amount || !transaction_id) {
      return NextResponse.json(
        { error: "Missing required fields: amount, transaction_id" },
        { status: 400 }
      )
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { persistSession: false }
      }
    )

    // Create payment record in pending status
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from("payments")
      .insert({
        user_id: user.id,
        amount,
        transaction_id,
        payment_method,
        status: "pending"
      })
      .select()
      .single()

    if (paymentError) {
      console.error("[v0] Payment creation error:", paymentError)
      return NextResponse.json(
        { error: paymentError.message },
        { status: 400 }
      )
    }

    console.log("[v0] Payment created:", payment.id)
    return NextResponse.json({ success: true, payment })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("[v0] Payment creation exception:", message)
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
