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
    const { action, data, id } = body

    console.log("[v0] Resources API:", action, id)

    if (action === "create") {
      const { error, data: result } = await supabaseAdmin
        .from("resources")
        .insert(data)
        .select()
        .single()

      if (error) {
        console.error("[v0] Create error:", error)
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({ success: true, data: result })
    }

    if (action === "update") {
      const { error, data: result } = await supabaseAdmin
        .from("resources")
        .update(data)
        .eq("id", id)
        .select()
        .single()

      if (error) {
        console.error("[v0] Update error:", error)
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({ success: true, data: result })
    }

    if (action === "delete") {
      const { error } = await supabaseAdmin
        .from("resources")
        .delete()
        .eq("id", id)

      if (error) {
        console.error("[v0] Delete error:", error)
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("[v0] Resources API exception:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
