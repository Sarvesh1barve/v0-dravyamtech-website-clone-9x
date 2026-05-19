import { NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      )
    }

    console.log("[v0] Uploading proof image:", file.name)

    // Upload to Vercel Blob
    const buffer = await file.arrayBuffer()
    const timestamp = Date.now()
    const fileName = `payment-proofs/${timestamp}-${file.name}`

    const blob = await put(fileName, buffer, {
      access: "private",
      contentType: file.type,
    })

    console.log("[v0] Proof uploaded to Blob:", blob.url)

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: blob.filename,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed"
    console.error("[v0] Upload exception:", message)
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
