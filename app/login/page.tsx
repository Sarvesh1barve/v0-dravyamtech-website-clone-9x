"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })
        if (error) throw error
        setMessage("Password reset link sent! Check your email.")
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push("/dashboard")
        router.refresh()
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
              `${window.location.origin}/dashboard`,
          },
        })
        if (error) throw error
        setMessage("Check your email to confirm your account!")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-16 px-6 min-h-[80vh] flex items-center">
        <div className="max-w-md mx-auto w-full">
          <div className="bg-card border border-border rounded-xl p-8">
            {/* Tabs */}
            {mode !== "forgot" && (
              <div className="flex mb-8 bg-secondary rounded-lg p-1">
                <button
                  onClick={() => { setMode("login"); setError(""); setMessage(""); }}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                    mode === "login" 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => { setMode("signup"); setError(""); setMessage(""); }}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                    mode === "signup" 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}

            {mode === "forgot" && (
              <button
                onClick={() => { setMode("login"); setError(""); setMessage(""); }}
                className="mb-6 text-sm text-primary hover:underline flex items-center gap-1"
              >
                &larr; Back to Login
              </button>
            )}

            <h1 className="text-2xl font-bold text-foreground mb-2 text-center">
              {mode === "login" ? "Welcome Back" : mode === "signup" ? "Create Account" : "Reset Password"}
            </h1>
            <p className="text-muted-foreground text-center mb-6">
              {mode === "login" 
                ? "Login to access your dashboard" 
                : mode === "signup"
                ? "Sign up to get started"
                : "Enter your email to receive a reset link"}
            </p>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3 mb-6">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-primary/10 border border-primary/20 text-primary text-sm rounded-lg p-3 mb-6">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={mode === "signup"}
                    className="bg-secondary border-border"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-secondary border-border"
                />
              </div>

              {mode !== "forgot" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => { setMode("forgot"); setError(""); setMessage(""); }}
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
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
              )}

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {mode === "login" ? "Logging in..." : mode === "signup" ? "Creating account..." : "Sending..."}
                  </>
                ) : (
                  mode === "login" ? "Login" : mode === "signup" ? "Create Account" : "Send Reset Link"
                )}
              </Button>
            </form>

            {mode !== "forgot" && (
              <div className="mt-6 text-center text-sm text-muted-foreground">
                {mode === "login" ? (
                  <>
                    {"Don't have an account? "}
                    <button
                      onClick={() => { setMode("signup"); setError(""); setMessage(""); }}
                      className="text-primary hover:underline"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => { setMode("login"); setError(""); setMessage(""); }}
                      className="text-primary hover:underline"
                    >
                      Login
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          
          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="#" className="text-primary hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
