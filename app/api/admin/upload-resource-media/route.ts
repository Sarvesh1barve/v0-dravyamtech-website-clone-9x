import { NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { createClient } from "@/lib/supabase/server"

async function verifyAdminAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { isAdmin: false, user: null }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  return { isAdmin: profile?.is_admin || false, user }
}

export async function POST(request: NextRequest) {
  try {
    const { isAdmin } = await verifyAdminAuth()
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized - admin access required" },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string // "video" or "thumbnail"

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file type
    const isVideo = type === "video"
    const isThumbnail = type === "thumbnail"

    if (isVideo) {
      const validVideoTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"]
      if (!validVideoTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid video format. Accepted: MP4, WebM, OGG, MOV" },
          { status: 400 }
        )
      }
      
      if (file.size > 500 * 1024 * 1024) { // 500MB limit for videos
        return NextResponse.json(
          { error: "Video file too large (max 500MB)" },
          { status: 400 }
        )
      }
    } else if (isThumbnail) {
      const validImageTypes = ["image/jpeg", "image/png", "image/webp"]
      if (!validImageTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid image format. Accepted: JPEG, PNG, WebP" },
          { status: 400 }
        )
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit for images
        return NextResponse.json(
          { error: "Image file too large (max 10MB)" },
          { status: 400 }
        )
      }
    } else {
      return NextResponse.json(
        { error: "Invalid file type (must be 'video' or 'thumbnail')" },
        { status: 400 }
      )
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const filename = `resources/${type}/${timestamp}-${file.name}`

    console.log(`[v0] Uploading ${type} file: ${filename}`)

    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
    })

    console.log(`[v0] Upload successful: ${blob.url}`)

    return NextResponse.json({
      url: blob.url,
      filename: blob.filename,
      contentType: blob.contentType,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed"
    console.error(`[v0] Upload error: ${message}`, error)
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
