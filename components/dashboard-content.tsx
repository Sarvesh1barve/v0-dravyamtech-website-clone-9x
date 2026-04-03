"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { 
  User, 
  Crown, 
  Play, 
  CreditCard, 
  Settings,
  Loader2,
  X,
  Check
} from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface Resource {
  id: string
  title: string
  description: string
  video_url: string | null
  thumbnail_url: string | null
}

interface UserResource {
  id: string
  resource_id: string
  purchased_at: string
  resources: Resource
}

interface Payment {
  id: string
  amount: number
  payment_type: string
  transaction_id: string | null
  status: string
  created_at: string
}

interface Profile {
  id: string
  full_name: string | null
  email: string | null
  is_subscribed: boolean
  subscription_expires_at: string | null
}

interface SiteSettings {
  upi_id: string | null
  qr_code_url: string | null
}

interface DashboardContentProps {
  user: SupabaseUser
  profile: Profile | null
  userResources: UserResource[]
  payments: Payment[]
  settings: SiteSettings | null
}

export function DashboardContent({
  user,
  profile,
  userResources,
  payments,
  settings
}: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "resources" | "payments" | "settings">("overview")
  const [showSubscribeModal, setShowSubscribeModal] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const supabase = createClient()

  const isSubscribed = profile?.is_subscribed && 
    (!profile.subscription_expires_at || 
     new Date(profile.subscription_expires_at) > new Date())

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaveMessage("")

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, updated_at: new Date().toISOString() })
      .eq("id", user.id)

    if (error) {
      setSaveMessage("Error updating profile")
    } else {
      setSaveMessage("Profile updated successfully!")
    }
    setSaving(false)
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "resources", label: "My Resources", icon: Play },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* User Info */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Account Information</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-muted-foreground">Email:</span>
                <p className="text-foreground">{user.email}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Name:</span>
                <p className="text-foreground">{profile?.full_name || "Not set"}</p>
              </div>
            </div>
          </div>

          {/* Subscription Status */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Subscription Status</h2>
                <div className="flex items-center gap-2">
                  <Crown className={`w-5 h-5 ${isSubscribed ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`font-medium ${isSubscribed ? "text-primary" : "text-muted-foreground"}`}>
                    {isSubscribed ? "Active Subscription" : "No Active Subscription"}
                  </span>
                </div>
                {isSubscribed && profile?.subscription_expires_at && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Expires: {new Date(profile.subscription_expires_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              {!isSubscribed && (
                <Button 
                  onClick={() => setShowSubscribeModal(true)}
                  className="bg-primary text-primary-foreground"
                >
                  Subscribe Now
                </Button>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-1">{userResources.length}</div>
              <div className="text-sm text-muted-foreground">Resources Owned</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-1">{payments.length}</div>
              <div className="text-sm text-muted-foreground">Total Payments</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {isSubscribed ? "Active" : "Inactive"}
              </div>
              <div className="text-sm text-muted-foreground">Subscription</div>
            </div>
          </div>
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === "resources" && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">My Resources</h2>
          {userResources.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <Play className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">You haven&apos;t purchased any resources yet.</p>
              <Button asChild>
                <a href="/resources">Browse Resources</a>
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userResources.map((ur) => (
                <div key={ur.id} className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="aspect-video bg-secondary flex items-center justify-center">
                    {ur.resources?.thumbnail_url ? (
                      <img 
                        src={ur.resources.thumbnail_url} 
                        alt={ur.resources.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Play className="w-10 h-10 text-muted-foreground" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-1">{ur.resources?.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{ur.resources?.description}</p>
                    <Button className="w-full mt-4" asChild>
                      <a href="/resources">Watch Now</a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === "payments" && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Payment History</h2>
          {payments.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No payment history yet.</p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-secondary">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-t border-border">
                      <td className="p-4 text-sm text-foreground">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm text-foreground capitalize">{payment.payment_type}</td>
                      <td className="p-4 text-sm text-foreground">₹{payment.amount}</td>
                      <td className="p-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          payment.status === "completed" 
                            ? "bg-green-500/20 text-green-500"
                            : payment.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : "bg-red-500/20 text-red-500"
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Account Settings</h2>
          <div className="bg-card border border-border rounded-xl p-6">
            <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="bg-secondary border-border"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>

              {saveMessage && (
                <p className={`text-sm ${saveMessage.includes("Error") ? "text-destructive" : "text-green-500"}`}>
                  {saveMessage}
                </p>
              )}

              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Subscribe Modal */}
      {showSubscribeModal && (
        <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-foreground">Subscribe</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSubscribeModal(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="text-center mb-6">
              <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Premium Subscription</h3>
              <p className="text-muted-foreground text-sm">
                Get unlimited access to all premium resources
              </p>
            </div>

            {settings?.qr_code_url && (
              <div className="mb-6">
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Scan QR code to pay:
                </p>
                <div className="flex justify-center">
                  <img
                    src={settings.qr_code_url}
                    alt="Payment QR Code"
                    className="w-48 h-48 bg-white p-2 rounded-lg"
                  />
                </div>
              </div>
            )}

            {settings?.upi_id && (
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground mb-2">Or pay via UPI:</p>
                <p className="font-mono text-foreground bg-secondary px-4 py-2 rounded-lg">
                  {settings.upi_id}
                </p>
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center mb-4">
              After payment, please contact support with your transaction ID to activate your subscription.
            </p>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowSubscribeModal(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
