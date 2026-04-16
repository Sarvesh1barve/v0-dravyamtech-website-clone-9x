import { revalidateTag, revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Verify this is from internal calls only
  const tag = request.nextUrl.searchParams.get("tag")
  const path = request.nextUrl.searchParams.get("path")

  try {
    console.log("[v0] Revalidate request:", { tag, path })

    if (tag) {
      revalidateTag(tag)
      console.log("[v0] Revalidated tag:", tag)
    }

    if (path) {
      revalidatePath(path, "layout")
      console.log("[v0] Revalidated path:", path)
    }

    // Revalidate common pages when settings change
    if (tag === "site-settings") {
      revalidatePath("/", "layout")
      revalidatePath("/about", "layout")
      revalidatePath("/resources", "layout")
      console.log("[v0] Revalidated all site pages")
    }

    return NextResponse.json({ 
      success: true,
      message: `Revalidated tag: ${tag}, path: ${path}` 
    })
  } catch (error) {
    console.error("[v0] Revalidation error:", error)
    return NextResponse.json(
      { error: "Revalidation failed" },
      { status: 500 }
    )
  }
}
