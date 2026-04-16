"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-16 px-6 min-h-[80vh] flex items-center">
        <div className="max-w-md mx-auto w-full">
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Authentication Error</h1>
            <p className="text-muted-foreground mb-6">
              There was a problem with the authentication link. It may have expired or is invalid.
            </p>
            
            <div className="space-y-3">
              <Link href="/login" className="block">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Try Again
                </Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full">
                  Go Home
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground mt-6">
              Authentication links expire after 24 hours. If you keep having issues, try signing up again.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
