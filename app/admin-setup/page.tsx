"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Shield, CheckCircle, XCircle, Info } from "lucide-react"

export default function AdminSetupPage() {
  const [email, setEmail] = useState("")
  const [secretKey, setSecretKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/make-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, secretKey })
      })

      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, message: data.message || "Successfully made admin! Please logout and login again to see admin panel." })
      } else {
        setResult({ success: false, message: data.error || "Failed to make admin" })
      }
    } catch (error) {
      setResult({ success: false, message: "An error occurred. Please try again." })
    }

    setIsLoading(false)
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-xl mx-auto">
          <Card className="bg-card border-border">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl text-foreground">Admin Setup</CardTitle>
              <CardDescription>
                Make yourself an admin to manage the website
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Instructions */}
              <Alert className="bg-blue-500/10 border-blue-500/30">
                <Info className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-sm text-blue-200">
                  <strong>Before you start:</strong>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>You must have an account (sign up at /login first)</li>
                    <li>Enter the email you signed up with</li>
                    <li>Enter the secret admin key (provided by the developer)</li>
                  </ol>
                </AlertDescription>
              </Alert>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Your Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your-email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-input text-foreground"
                  />
                  <p className="text-xs text-muted-foreground">
                    The email you used to sign up
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secretKey" className="text-foreground">Admin Secret Key</Label>
                  <Input
                    id="secretKey"
                    type="password"
                    placeholder="Enter the secret key"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    required
                    className="bg-input text-foreground"
                  />
                  <p className="text-xs text-muted-foreground">
                    This is NOT your password. Ask the developer for the secret key.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Make Me Admin
                    </>
                  )}
                </Button>
              </form>

              {/* Result Message */}
              {result && (
                <Alert className={result.success ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}>
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <AlertDescription className={result.success ? "text-green-200" : "text-red-200"}>
                    {result.message}
                  </AlertDescription>
                </Alert>
              )}

              {/* Secret Key Hint for Development */}
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  <strong>Development Only:</strong> The default secret key is{" "}
                  <code className="bg-secondary px-2 py-1 rounded text-primary">
                    DRAVYAM_ADMIN_SECRET_2024
                  </code>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-card border-border mt-6">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">After Becoming Admin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>1. <strong>Logout</strong> from your account</p>
              <p>2. <strong>Login again</strong> with the same email</p>
              <p>3. You will see <strong>Admin Panel</strong> button in the header</p>
              <p>4. Access <strong>/admin</strong> to manage the website</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  )
}
