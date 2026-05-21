import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  
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

  // For password reset, Supabase sends tokens in the URL hash fragment
  // The hash is not accessible server-side, so we redirect to a client page
  // that will handle the token exchange
  // The reset-password page will check for a valid session
  return NextResponse.redirect(new URL('/reset-password', request.url))
}
