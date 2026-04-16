import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { persistSession: false }
      }
    )

    const body = await request.json()
    const { action, paymentId, status, userId } = body

    console.log("[v0] Payments API:", action, paymentId)

    if (action === "update_status") {
      // Update payment status
      const { error: paymentError } = await supabaseAdmin
        .from("payments")
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq("id", paymentId)

      if (paymentError) {
        console.error("[v0] Payment update error:", paymentError)
        return NextResponse.json({ error: paymentError.message }, { status: 400 })
      }

      // If approved, update user subscription
      if (status === "approved") {
        const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        const { error: subError } = await supabaseAdmin
          .from("profiles")
          .update({
            is_subscribed: true,
            subscription_expires_at: expiryDate,
            updated_at: new Date().toISOString()
          })
          .eq("id", userId)

        if (subError) {
          console.error("[v0] Subscription update error:", subError)
          return NextResponse.json(
            { error: `Payment approved but subscription update failed: ${subError.message}` },
            { status: 400 }
          )
        }
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("[v0] Payments API exception:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
