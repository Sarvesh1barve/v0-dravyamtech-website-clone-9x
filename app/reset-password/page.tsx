"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [hasSession, setHasSession] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Handle the password reset token from URL hash
  useEffect(() => {
    const handlePasswordReset = async () => {
      // Check if there's a hash in the URL (Supabase sends tokens in hash)
      const hash = window.location.hash
      
      if (hash && hash.includes('access_token')) {
        // Parse the hash to get the tokens
        const params = new URLSearchParams(hash.substring(1))
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')
        const type = params.get('type')
        
        if (accessToken && refreshToken && type === 'recovery') {
          // Set the session with the tokens from the URL
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          
          if (error) {
            setError("Invalid or expired reset link. Please request a new one.")
            setInitialLoading(false)
            return
          }
          
          // Clear the hash from URL for security
          window.history.replaceState(null, '', window.location.pathname)
          setHasSession(true)
          setInitialLoading(false)
          return
        }
      }
      
      // No hash tokens, check for existing session
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setHasSession(true)
      } else {
        setError("No valid reset session found. Please request a new password reset link.")
      }
      setInitialLoading(false)
    }
    
    handlePasswordReset()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      setSuccess(true)
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <section className="pt-32 pb-16 px-6 min-h-[80vh] flex items-center">
          <div className="max-w-md mx-auto w-full">
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Password Updated!</h1>
              <p className="text-muted-foreground mb-4">
                Your password has been successfully reset. Redirecting to login...
              </p>
              <Button onClick={() => router.push("/login")} className="bg-primary text-primary-foreground">
                Go to Login
              </Button>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  if (initialLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <section className="pt-32 pb-16 px-6 min-h-[80vh] flex items-center">
          <div className="max-w-md mx-auto w-full">
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Verifying reset link...</p>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  if (!hasSession && error) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <section className="pt-32 pb-16 px-6 min-h-[80vh] flex items-center">
          <div className="max-w-md mx-auto w-full">
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Reset Link Invalid</h1>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => router.push("/login?mode=forgot")} className="bg-primary text-primary-foreground">
                Request New Link
              </Button>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-16 px-6 min-h-[80vh] flex items-center">
        <div className="max-w-md mx-auto w-full">
          <div className="bg-card border border-border rounded-xl p-8">
            <h1 className="text-2xl font-bold text-foreground mb-2 text-center">
              Set New Password
            </h1>
            <p className="text-muted-foreground text-center mb-6">
              Enter your new password below
            </p>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3 mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-secondary border-border pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-secondary border-border"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
