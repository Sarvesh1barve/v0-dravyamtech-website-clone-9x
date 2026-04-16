import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Settings, Video, Users, CreditCard, Palette, Globe, Phone, 
  Image, Link2, Shield, Lock, Crown, CheckCircle, AlertCircle,
  ArrowRight, Key
} from "lucide-react"

export const metadata = {
  title: "Admin Guide - Dravyam Technology",
  description: "Step-by-step guide to using the admin panel",
}

export default function AdminGuidePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Admin Panel Guide
            </h1>
            <p className="text-muted-foreground text-lg">
              Complete guide to managing your Dravyam Technology website
            </p>
          </div>

          {/* Step 1: Becoming an Admin */}
          <Card className="bg-card border-border mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  1
                </div>
                <div>
                  <CardTitle className="text-foreground">Becoming an Admin</CardTitle>
                  <CardDescription>First-time setup to get admin access</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <Key className="h-4 w-4 text-primary" />
                  Method 1: API Call (First Admin)
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Open browser console (F12) and run:
                </p>
                <pre className="bg-background p-3 rounded text-xs overflow-x-auto text-foreground">
{`fetch('/api/make-admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'your-email@example.com',
    secretKey: 'DRAVYAM_ADMIN_SECRET_2024'
  })
}).then(r => r.json()).then(console.log)`}
                </pre>
              </div>
              
              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Method 2: Existing Admin Promotes You
                </h4>
                <p className="text-sm text-muted-foreground">
                  An existing admin can go to Admin Panel &rarr; Users tab &rarr; Click the shield icon next to your name.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Accessing Admin Panel */}
          <Card className="bg-card border-border mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  2
                </div>
                <div>
                  <CardTitle className="text-foreground">Accessing the Admin Panel</CardTitle>
                  <CardDescription>Navigate to your control center</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Desktop:</strong> Click &quot;Admin&quot; in the top navigation bar
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Mobile:</strong> Tap the menu icon &rarr; &quot;Admin Panel&quot; button
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Direct URL:</strong> Go to <code className="bg-secondary px-2 py-0.5 rounded text-xs">/admin</code>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Admin Tabs */}
          <h2 className="text-2xl font-bold text-foreground mb-6">Admin Panel Tabs</h2>

          {/* Settings Tab */}
          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Settings className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Settings Tab</CardTitle>
                  <CardDescription>Manage site identity, colors, and content</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    Site Identity
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>- Site Name</li>
                    <li>- Tagline</li>
                    <li>- Description</li>
                    <li>- Logo Upload</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground flex items-center gap-2">
                    <Palette className="h-4 w-4 text-primary" />
                    Colors
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>- Primary Color</li>
                    <li>- Secondary Color</li>
                    <li>- Accent Color</li>
                    <li>- Text & Heading Colors</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Contact Info
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>- Email Address</li>
                    <li>- Phone Number</li>
                    <li>- Address</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    Payment Settings
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>- UPI ID</li>
                    <li>- QR Code Image Upload</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-primary" />
                    Social Links
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>- Twitter</li>
                    <li>- LinkedIn</li>
                    <li>- YouTube</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground flex items-center gap-2">
                    <Image className="h-4 w-4 text-primary" />
                    Hero Section
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>- Hero Title</li>
                    <li>- Highlighted Text</li>
                    <li>- Description</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resources Tab */}
          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Video className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Resources Tab</CardTitle>
                  <CardDescription>Manage videos and learning content</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Upload and manage educational videos, courses, and learning materials.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-secondary/30 rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-2">Add New Resource</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>- Title & Description</li>
                    <li>- Video URL (YouTube, Vimeo, etc.)</li>
                    <li>- Thumbnail Image</li>
                    <li>- Category Selection</li>
                    <li>- Duration</li>
                    <li>- Price (if premium)</li>
                  </ul>
                </div>
                <div className="bg-secondary/30 rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-2">Access Control</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Lock className="h-4 w-4 text-red-500" />
                      <span className="text-muted-foreground">Locked = Premium content</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-muted-foreground">Unlocked = Free for all</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Tab */}
          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Users Tab</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-secondary/30 rounded-lg p-4 text-center">
                  <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-medium text-foreground text-sm">Toggle Admin</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Grant or revoke admin access
                  </p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-4 text-center">
                  <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <h4 className="font-medium text-foreground text-sm">Toggle Subscription</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Activate or deactivate premium access
                  </p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-4 text-center">
                  <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-medium text-foreground text-sm">View All Users</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    See registered users and their status
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payments Tab */}
          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Payments Tab</CardTitle>
                  <CardDescription>Track and approve payment requests</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                When users make payments via UPI, they submit a payment request with their transaction ID. You can:
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-green-500/10 text-green-500 px-3 py-2 rounded-lg text-sm">
                  <CheckCircle className="h-4 w-4" />
                  Approve Payment
                </div>
                <div className="flex items-center gap-2 bg-red-500/10 text-red-500 px-3 py-2 rounded-lg text-sm">
                  <AlertCircle className="h-4 w-4" />
                  Reject Payment
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Approving a payment automatically activates the user&apos;s subscription or grants access to the purchased resource.
              </p>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Always save your changes after editing settings - look for the Save button at the bottom of each section.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Use high-quality images for thumbnails (recommended: 16:9 aspect ratio, at least 1280x720px).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Test color changes carefully - some combinations may affect text readability.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Keep at least one admin account to prevent lockout.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

        </div>
      </div>
      
      <Footer />
    </main>
  )
}
