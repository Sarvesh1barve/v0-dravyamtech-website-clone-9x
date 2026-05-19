"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save, Upload, AlertCircle, RotateCcw } from "lucide-react"
import { toast } from "sonner"

interface SiteSettings {
  id: string
  site_name: string
  site_tagline: string
  site_description: string
  logo_url: string | null
  contact_email: string
  contact_phone: string
  contact_address: string
  hero_title: string
  hero_highlight: string
  hero_description: string
  hero_background_color: string
  hero_text_color: string
  hero_cta_text: string
  about_title: string
  about_description: string | null
  what_we_do_title: string
  what_we_do_items: Array<{ title: string; description: string }> | null
  how_we_work_title: string
  how_we_work_items: Array<{ title: string; description: string }> | null
  primary_color: string
  secondary_color: string
  accent_color: string
  theme_primary_color: string
  theme_accent_color: string
  text_color: string
  heading_color: string
  upi_id: string | null
  qr_code_url: string | null
  social_twitter: string | null
  social_linkedin: string | null
  social_youtube: string | null
  updated_at: string
}

export function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [qrFile, setQrFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const router = useRouter()
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null)

  useEffect(() => {
    setSupabase(createClient())
  }, [])

  useEffect(() => {
    if (!supabase) return
    fetchSettings()
  }, [supabase])

  async function handleReset() {
    if (!confirm("Are you sure you want to reset all settings to default values? This cannot be undone.")) {
      return
    }

    setIsResetting(true)
    try {
      const response = await fetch("/api/admin/reset-settings", {
        method: "POST",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to reset settings")
      }

      toast.success("Settings reset to defaults!")
      
      // Refresh to show new defaults
      await fetchSettings()
      router.refresh()
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An error occurred while resetting"
      console.error("[v0] Reset exception:", err)
      toast.error(msg)
    } finally {
      setIsResetting(false)
    }
  }

  async function fetchSettings() {
    if (!supabase) return
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single()

      if (error && error.code !== "PGRST116") {
        console.error("[v0] Error loading settings:", error)
        toast.error("Failed to load settings")
        return
      }

      if (data) {
        setSettings(data)
      } else {
        // Create default settings if none exist
        const defaultSettings: Partial<SiteSettings> = {
          site_name: "Dravyam Technology",
          site_tagline: "Fintech That Thinks Beyond Numbers",
          site_description: "Building research-driven trading systems",
          hero_title: "Welcome",
          hero_highlight: "Dravyam",
          hero_description: "Start trading smart",
          about_title: "About Us",
          about_description: "",
          what_we_do_title: "What We Do",
          what_we_do_items: [],
          how_we_work_title: "How We Work",
          how_we_work_items: [],
          contact_email: "",
          contact_phone: "",
          contact_address: "",
          primary_color: "#1e3a5f",
          secondary_color: "#f59e0b",
          accent_color: "#10b981",
          text_color: "#ffffff",
          heading_color: "#f59e0b",
          upi_id: null,
          qr_code_url: null,
          social_twitter: null,
          social_linkedin: null,
          social_youtube: null,
        }
        setSettings(defaultSettings as SiteSettings)
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSave() {
    if (!settings) return
    setIsSaving(true)
    setUploadError(null)

    try {
      let logoUrl = settings.logo_url
      let qrCodeUrl = settings.qr_code_url

      // Handle logo upload
      if (logoFile) {
        try {
          const fileExt = logoFile.name.split(".").pop()
          const fileName = `logo-${Date.now()}.${fileExt}`
          const { error: uploadError } = await supabase.storage
            .from("public")
            .upload(fileName, logoFile, { upsert: true })

          if (uploadError) {
            throw new Error(`Logo upload failed: ${uploadError.message}`)
          }

          const { data: { publicUrl } } = supabase.storage
            .from("public")
            .getPublicUrl(fileName)
          logoUrl = publicUrl
          console.log("[v0] Logo uploaded:", logoUrl)
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Logo upload failed"
          setUploadError(msg)
          toast.error(msg)
          setIsSaving(false)
          return
        }
      }

      // Handle QR code upload
      if (qrFile) {
        try {
          const fileExt = qrFile.name.split(".").pop()
          const fileName = `qr-code-${Date.now()}.${fileExt}`
          const { error: uploadError } = await supabase.storage
            .from("public")
            .upload(fileName, qrFile, { upsert: true })

          if (uploadError) {
            throw new Error(`QR code upload failed: ${uploadError.message}`)
          }

          const { data: { publicUrl } } = supabase.storage
            .from("public")
            .getPublicUrl(fileName)
          qrCodeUrl = publicUrl
          console.log("[v0] QR code uploaded:", qrCodeUrl)
        } catch (err) {
          const msg = err instanceof Error ? err.message : "QR code upload failed"
          setUploadError(msg)
          toast.error(msg)
          setIsSaving(false)
          return
        }
      }

      // Call API endpoint with service role key
      const settingsPayload = {
        id: settings.id,
        site_name: settings.site_name,
        site_tagline: settings.site_tagline,
        site_description: settings.site_description,
        logo_url: logoUrl,
        contact_email: settings.contact_email,
        contact_phone: settings.contact_phone,
        contact_address: settings.contact_address,
        hero_title: settings.hero_title,
        hero_highlight: settings.hero_highlight,
        hero_description: settings.hero_description,
        about_title: settings.about_title,
        about_description: settings.about_description,
        what_we_do_title: settings.what_we_do_title,
        what_we_do_items: settings.what_we_do_items,
        how_we_work_title: settings.how_we_work_title,
        how_we_work_items: settings.how_we_work_items,
        primary_color: settings.primary_color,
        secondary_color: settings.secondary_color,
        accent_color: settings.accent_color,
        text_color: settings.text_color,
        heading_color: settings.heading_color,
        upi_id: settings.upi_id,
        qr_code_url: qrCodeUrl,
        social_twitter: settings.social_twitter,
        social_linkedin: settings.social_linkedin,
        social_youtube: settings.social_youtube,
        updated_at: new Date().toISOString()
      }

      console.log("[v0] Calling settings API with:", settingsPayload)

      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upsert",
          data: settingsPayload
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save settings")
      }

      const result = await response.json()
      if (result.data) {
        setSettings(result.data)
      }

      setLogoFile(null)
      setQrFile(null)
      
      toast.success("Settings saved successfully!")
      
      // Revalidate all routes that use site settings
      console.log("[v0] Revalidating routes after settings save")
      await Promise.all([
        fetch("/api/revalidate?tag=site-settings"),
        fetch("/api/revalidate?tag=home-page"),
        fetch("/api/revalidate?tag=about-page"),
      ]).catch(err => console.error("[v0] Revalidation error:", err))
      
      // Refresh page to show new settings
      router.refresh()
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An error occurred while saving"
      console.error("[v0] Save exception:", err)
      toast.error(msg)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">Upload Error</p>
            <p className="text-sm text-red-700">{uploadError}</p>
          </div>
        </div>
      )}

      {/* Site Identity */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Site Identity</CardTitle>
          <CardDescription>Manage your site name, logo, and branding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground">Site Name</Label>
              <Input
                value={settings?.site_name || ""}
                onChange={(e) => setSettings(s => s ? { ...s, site_name: e.target.value } : null)}
                className="bg-input text-foreground"
                disabled={isSaving}
              />
            </div>
            <div>
              <Label className="text-foreground">Site Tagline</Label>
              <Input
                value={settings?.site_tagline || ""}
                onChange={(e) => setSettings(s => s ? { ...s, site_tagline: e.target.value } : null)}
                className="bg-input text-foreground"
                disabled={isSaving}
              />
            </div>
          </div>
          <div>
            <Label className="text-foreground">Site Description</Label>
            <Textarea
              value={settings?.site_description || ""}
              onChange={(e) => setSettings(s => s ? { ...s, site_description: e.target.value } : null)}
              className="bg-input text-foreground"
              disabled={isSaving}
            />
          </div>
          <div>
            <Label className="text-foreground">Logo</Label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                className="bg-input text-foreground"
                disabled={isSaving}
              />
              {settings?.logo_url && (
                <img 
                  src={settings.logo_url} 
                  alt="Site Logo" 
                  className="h-16 object-contain border border-border rounded"
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hero Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Hero Section</CardTitle>
          <CardDescription>Customize home page hero content and styling</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground">Hero Title</Label>
              <Input
                value={settings?.hero_title || ""}
                onChange={(e) => setSettings(s => s ? { ...s, hero_title: e.target.value } : null)}
                className="bg-input text-foreground"
                disabled={isSaving}
              />
            </div>
            <div>
              <Label className="text-foreground">Hero CTA Button Text</Label>
              <Input
                value={settings?.hero_cta_text || "Explore Products"}
                onChange={(e) => setSettings(s => s ? { ...s, hero_cta_text: e.target.value } : null)}
                className="bg-input text-foreground"
                disabled={isSaving}
              />
            </div>
          </div>
          <div>
            <Label className="text-foreground">Hero Subtitle</Label>
            <Textarea
              value={settings?.hero_description || ""}
              onChange={(e) => setSettings(s => s ? { ...s, hero_description: e.target.value } : null)}
              className="bg-input text-foreground"
              disabled={isSaving}
            />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label className="text-foreground">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={settings?.hero_background_color || "#000000"}
                  onChange={(e) => setSettings(s => s ? { ...s, hero_background_color: e.target.value } : null)}
                  className="h-10 w-14 bg-input"
                  disabled={isSaving}
                />
                <Input
                  type="text"
                  value={settings?.hero_background_color || "#000000"}
                  onChange={(e) => setSettings(s => s ? { ...s, hero_background_color: e.target.value } : null)}
                  className="bg-input text-foreground flex-1"
                  disabled={isSaving}
                />
              </div>
            </div>
            <div>
              <Label className="text-foreground">Text Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={settings?.hero_text_color || "#ffffff"}
                  onChange={(e) => setSettings(s => s ? { ...s, hero_text_color: e.target.value } : null)}
                  className="h-10 w-14 bg-input"
                  disabled={isSaving}
                />
                <Input
                  type="text"
                  value={settings?.hero_text_color || "#ffffff"}
                  onChange={(e) => setSettings(s => s ? { ...s, hero_text_color: e.target.value } : null)}
                  className="bg-input text-foreground flex-1"
                  disabled={isSaving}
                />
              </div>
            </div>
            <div>
              <Label className="text-foreground">Primary Color (Accent)</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={settings?.theme_primary_color || "#3b82f6"}
                  onChange={(e) => setSettings(s => s ? { ...s, theme_primary_color: e.target.value } : null)}
                  className="h-10 w-14 bg-input"
                  disabled={isSaving}
                />
                <Input
                  type="text"
                  value={settings?.theme_primary_color || "#3b82f6"}
                  onChange={(e) => setSettings(s => s ? { ...s, theme_primary_color: e.target.value } : null)}
                  className="bg-input text-foreground flex-1"
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">About Section</CardTitle>
          <CardDescription>Customize about page content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-foreground">About Title</Label>
            <Input
              value={settings?.about_title || ""}
              onChange={(e) => setSettings(s => s ? { ...s, about_title: e.target.value } : null)}
              className="bg-input text-foreground"
              disabled={isSaving}
            />
          </div>
          <div>
            <Label className="text-foreground">About Description</Label>
            <Textarea
              value={settings?.about_description || ""}
              onChange={(e) => setSettings(s => s ? { ...s, about_description: e.target.value } : null)}
              className="bg-input text-foreground"
              disabled={isSaving}
              rows={5}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Contact Information</CardTitle>
          <CardDescription>Update contact details displayed on site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label className="text-foreground">Email</Label>
              <Input
                type="email"
                value={settings?.contact_email || ""}
                onChange={(e) => setSettings(s => s ? { ...s, contact_email: e.target.value } : null)}
                className="bg-input text-foreground"
                disabled={isSaving}
              />
            </div>
            <div>
              <Label className="text-foreground">Phone</Label>
              <Input
                value={settings?.contact_phone || ""}
                onChange={(e) => setSettings(s => s ? { ...s, contact_phone: e.target.value } : null)}
                className="bg-input text-foreground"
                disabled={isSaving}
              />
            </div>
            <div>
              <Label className="text-foreground">Address</Label>
              <Input
                value={settings?.contact_address || ""}
                onChange={(e) => setSettings(s => s ? { ...s, contact_address: e.target.value } : null)}
                className="bg-input text-foreground"
                disabled={isSaving}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Color Settings</CardTitle>
          <CardDescription>Customize website colors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label className="w-32 text-foreground">Primary</Label>
                <Input
                  type="color"
                  value={settings?.primary_color || "#1e3a5f"}
                  onChange={(e) => setSettings(s => s ? { ...s, primary_color: e.target.value } : null)}
                  className="w-16 h-10 p-1 cursor-pointer"
                  disabled={isSaving}
                />
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-32 text-foreground">Secondary</Label>
                <Input
                  type="color"
                  value={settings?.secondary_color || "#f59e0b"}
                  onChange={(e) => setSettings(s => s ? { ...s, secondary_color: e.target.value } : null)}
                  className="w-16 h-10 p-1 cursor-pointer"
                  disabled={isSaving}
                />
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-32 text-foreground">Accent</Label>
                <Input
                  type="color"
                  value={settings?.accent_color || "#10b981"}
                  onChange={(e) => setSettings(s => s ? { ...s, accent_color: e.target.value } : null)}
                  className="w-16 h-10 p-1 cursor-pointer"
                  disabled={isSaving}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label className="w-32 text-foreground">Text</Label>
                <Input
                  type="color"
                  value={settings?.text_color || "#ffffff"}
                  onChange={(e) => setSettings(s => s ? { ...s, text_color: e.target.value } : null)}
                  className="w-16 h-10 p-1 cursor-pointer"
                  disabled={isSaving}
                />
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-32 text-foreground">Headings</Label>
                <Input
                  type="color"
                  value={settings?.heading_color || "#f59e0b"}
                  onChange={(e) => setSettings(s => s ? { ...s, heading_color: e.target.value } : null)}
                  className="w-16 h-10 p-1 cursor-pointer"
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Payment Settings</CardTitle>
          <CardDescription>Configure UPI payment details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-foreground">UPI ID</Label>
            <Input
              placeholder="yourname@upi"
              value={settings?.upi_id || ""}
              onChange={(e) => setSettings(s => s ? { ...s, upi_id: e.target.value } : null)}
              className="bg-input text-foreground"
              disabled={isSaving}
            />
          </div>
          <div>
            <Label className="text-foreground">QR Code</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setQrFile(e.target.files?.[0] || null)}
              className="bg-input text-foreground"
              disabled={isSaving}
            />
            {settings?.qr_code_url && (
              <div className="mt-4">
                <img 
                  src={settings.qr_code_url} 
                  alt="QR Code" 
                  className="w-32 h-32 object-contain border border-border rounded"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Social Links</CardTitle>
          <CardDescription>Add social media links</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label className="text-foreground">Twitter</Label>
              <Input
                placeholder="https://twitter.com/yourhandle"
                value={settings?.social_twitter || ""}
                onChange={(e) => setSettings(s => s ? { ...s, social_twitter: e.target.value } : null)}
                className="bg-input text-foreground"
                disabled={isSaving}
              />
            </div>
            <div>
              <Label className="text-foreground">LinkedIn</Label>
              <Input
                placeholder="https://linkedin.com/company/yourcompany"
                value={settings?.social_linkedin || ""}
                onChange={(e) => setSettings(s => s ? { ...s, social_linkedin: e.target.value } : null)}
                className="bg-input text-foreground"
                disabled={isSaving}
              />
            </div>
            <div>
              <Label className="text-foreground">YouTube</Label>
              <Input
                placeholder="https://youtube.com/@yourchannel"
                value={settings?.social_youtube || ""}
                onChange={(e) => setSettings(s => s ? { ...s, social_youtube: e.target.value } : null)}
                className="bg-input text-foreground"
                disabled={isSaving}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button 
          onClick={handleSave} 
          disabled={isSaving || isResetting}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          size="lg"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save All Settings
            </>
          )}
        </Button>
        
        <Button 
          onClick={handleReset} 
          disabled={isSaving || isResetting}
          variant="outline"
          className="border-destructive text-destructive hover:bg-destructive/10"
          size="lg"
        >
          {isResetting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Resetting...
            </>
          ) : (
            <>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Default
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
