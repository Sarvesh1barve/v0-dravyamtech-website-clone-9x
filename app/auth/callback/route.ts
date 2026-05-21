import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const type = searchParams.get('type') // 'recovery' for password reset, 'signup' for email verification

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          },
        },
      },
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.session) {
      // Check if this is a password recovery flow
      // The session user will have aal1 for recovery
      const isRecovery = type === 'recovery' || data.session.user?.aud === 'authenticated'
      
      // For password reset, always redirect to reset-password page
      if (type === 'recovery') {
        return NextResponse.redirect(new URL('/reset-password', request.url))
      }
      
      // Successfully exchanged code for session
      return NextResponse.redirect(new URL(next, request.url))
    }
    
    // If exchange failed, redirect to error
    const errorUrl = new URL('/auth/error', request.url)
    errorUrl.searchParams.set('error', 'exchange_failed')
    if (error?.message) {
      errorUrl.searchParams.set('error_description', error.message)
    }
    return NextResponse.redirect(errorUrl)
  }

  // No code - redirect to error page
  const errorUrl = new URL('/auth/error', request.url)
  errorUrl.searchParams.set('error', 'missing_code')
  errorUrl.searchParams.set('error_description', 'No authentication code provided')
  return NextResponse.redirect(errorUrl)
}
