import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, hash } = request.nextUrl
  
  // Check for error params (Supabase sends these when link is invalid/expired)
  const error = searchParams.get('error')
  const errorCode = searchParams.get('error_code')
  const errorDescription = searchParams.get('error_description')
  
  if (error || errorCode) {
    // Redirect to error page with params
    const errorUrl = new URL('/auth/error', request.url)
    if (error) errorUrl.searchParams.set('error', error)
    if (errorCode) errorUrl.searchParams.set('error_code', errorCode)
    if (errorDescription) errorUrl.searchParams.set('error_description', errorDescription)
    return NextResponse.redirect(errorUrl)
  }

  // Get the code from params
  const code = searchParams.get('code')
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

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      // Exchange failed - redirect to error
      const errorUrl = new URL('/auth/error', request.url)
      errorUrl.searchParams.set('error', 'exchange_failed')
      errorUrl.searchParams.set('error_description', error.message)
      return NextResponse.redirect(errorUrl)
    }
    
    // Success - redirect to reset password form
    return NextResponse.redirect(new URL('/reset-password', request.url))
  }

  // No code provided - redirect to error
  const errorUrl = new URL('/auth/error', request.url)
  errorUrl.searchParams.set('error', 'missing_code')
  errorUrl.searchParams.set('error_description', 'No authentication code provided')
  return NextResponse.redirect(errorUrl)
}
