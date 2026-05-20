"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { AlertCircle, Clock, Mail, RefreshCw } from "lucide-react"
import { Suspense } from "react"

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const errorCode = searchParams.get("error_code") || searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  // Determine error type and message
  const getErrorDetails = () => {
    if (errorCode === "otp_expired" || errorDescription?.includes("expired")) {
      return {
        icon: Clock,
        title: "Link Expired",
        message: "This password reset or verification link has expired. Links are valid for 24 hours.",
        action: "Request a new link"
      }
    }
    if (errorCode === "access_denied") {
      return {
        icon: AlertCircle,
        title: "Access Denied",
        message: "The authentication link is invalid or has already been used.",
        action: "Try again"
      }
    }
    if (errorCode === "invalid_request" || errorDescription?.includes("invalid")) {
      return {
        icon: AlertCircle,
        title: "Invalid Link",
        message: "This link is invalid. Please request a new password reset or verification email.",
        action: "Request a new link"
      }
    }
    return {
      icon: AlertCircle,
      title: "Authentication Error",
      message: "There was a problem with your authentication request. Please try again.",
      action: "Try again"
    }
  }

  const errorDetails = getErrorDetails()
  const IconComponent = errorDetails.icon

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-16 px-6 min-h-[80vh] flex items-center">
        <div className="max-w-md mx-auto w-full">
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconComponent className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{errorDetails.title}</h1>
            <p className="text-muted-foreground mb-6">
              {errorDetails.message}
            </p>
            
            <div className="space-y-3">
              <Link href="/login?mode=forgot" className="block">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Mail className="w-4 h-4 mr-2" />
                  Request New Reset Link
                </Button>
              </Link>
              <Link href="/login" className="block">
                <Button variant="outline" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="ghost" className="w-full text-muted-foreground">
                  Go Home
                </Button>
              </Link>
            </div>

            {errorDescription && (
              <p className="text-xs text-muted-foreground mt-6 bg-secondary/50 rounded p-2">
                Error details: {decodeURIComponent(errorDescription.replace(/\+/g, ' '))}
              </p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </main>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}
