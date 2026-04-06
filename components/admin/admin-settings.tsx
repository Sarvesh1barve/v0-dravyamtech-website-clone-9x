"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save, Upload } from "lucide-react"
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
  about_title: string
  about_description: string | null
  what_we_do_title: string
  what_we_do_items: Array<{ title: string; description: string }> | null
  how_we_work_title: string
  how_we_work_items: Array<{ title: string; description: string }> | null
  primary_color: string
  secondary_color: string
  accent_color: string
  text_color: string
  heading_color: string
  upi_id: string | null
  qr_code_url: string | null
  social_twitter: string | null
  social_linkedin: string | null
  social_youtube: string | null
}

export function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [qrFile, setQrFile] = useState<File | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .single()

    if (error && error.code !== "PGRST116") {
      toast.error("Failed to load settings")
      return
    }

    if (data) {
      setSettings(data)
    }
    setIsLoading(false)
  }

  async function handleSave() {
    if (!settings) return
    setIsSaving(true)

    try {
      let logoUrl = settings.logo_url
      let qrCodeUrl = settings.qr_code_url

      // Handle logo upload
      if (logoFile) {
        const fileExt = logoFile.name.split(".").pop()
        const fileName = `logo-${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from("public")
          .upload(fileName, logoFile, { upsert: true })

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from("public")
            .getPublicUrl(fileName)
          logoUrl = publicUrl
        }
      }

      // Handle QR code upload
      if (qrFile) {
        const fileExt = qrFile.name.split(".").pop()
        const fileName = `qr-code-${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from("public")
          .upload(fileName, qrFile, { upsert: true })

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from("public")
            .getPublicUrl(fileName)
          qrCodeUrl = publicUrl
        }
      }

      const { error } = await supabase
        .from("site_settings")
        .update({
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
        })
        .eq("id", settings.id)

      if (error) {
        toast.error("Failed to save settings")
      } else {
        setSettings({ ...settings, logo_url: logoUrl, qr_code_url: qrCodeUrl })
        setLogoFile(null)
        setQrFile(null)
        toast.success("Settings saved successfully!")
      }
    } catch (err) {
      toast.error("An error occurred while saving")
    }

    setIsSaving(false)
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
              />
            </div>
            <div>
              <Label className="text-foreground">Site Tagline</Label>
              <Input
                value={settings?.site_tagline || ""}
                onChange={(e) => setSettings(s => s ? { ...s, site_tagline: e.target.value } : null)}
                className="bg-input text-foreground"
              />
            </div>
          </div>
          <div>
            <Label className="text-foreground">Site Description</Label>
            <Textarea
              value={settings?.site_description || ""}
              onChange={(e) => setSettings(s => s ? { ...s, site_description: e.target.value } : null)}
              className="bg-input text-foreground"
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
          <CardDescription>Customize home page hero content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground">Hero Title</Label>
              <Input
                value={settings?.hero_title || ""}
                onChange={(e) => setSettings(s => s ? { ...s, hero_title: e.target.value } : null)}
                className="bg-input text-foreground"
              />
            </div>
            <div>
              <Label className="text-foreground">Hero Highlight (colored part)</Label>
              <Input
                value={settings?.hero_highlight || ""}
                onChange={(e) => setSettings(s => s ? { ...s, hero_highlight: e.target.value } : null)}
                className="bg-input text-foreground"
              />
            </div>
          </div>
          <div>
            <Label className="text-foreground">Hero Description</Label>
            <Textarea
              value={settings?.hero_description || ""}
              onChange={(e) => setSettings(s => s ? { ...s, hero_description: e.target.value } : null)}
              className="bg-input text-foreground"
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
              />
            </div>
            <div>
              <Label className="text-foreground">Phone</Label>
              <Input
                value={settings?.contact_phone || ""}
                onChange={(e) => setSettings(s => s ? { ...s, contact_phone: e.target.value } : null)}
                className="bg-input text-foreground"
              />
            </div>
            <div>
              <Label className="text-foreground">Address</Label>
              <Input
                value={settings?.contact_address || ""}
                onChange={(e) => setSettings(s => s ? { ...s, contact_address: e.target.value } : null)}
                className="bg-input text-foreground"
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
                />
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-32 text-foreground">Secondary</Label>
                <Input
                  type="color"
                  value={settings?.secondary_color || "#f59e0b"}
                  onChange={(e) => setSettings(s => s ? { ...s, secondary_color: e.target.value } : null)}
                  className="w-16 h-10 p-1 cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-32 text-foreground">Accent</Label>
                <Input
                  type="color"
                  value={settings?.accent_color || "#10b981"}
                  onChange={(e) => setSettings(s => s ? { ...s, accent_color: e.target.value } : null)}
                  className="w-16 h-10 p-1 cursor-pointer"
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
                />
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-32 text-foreground">Headings</Label>
                <Input
                  type="color"
                  value={settings?.heading_color || "#f59e0b"}
                  onChange={(e) => setSettings(s => s ? { ...s, heading_color: e.target.value } : null)}
                  className="w-16 h-10 p-1 cursor-pointer"
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
            />
          </div>
          <div>
            <Label className="text-foreground">QR Code</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setQrFile(e.target.files?.[0] || null)}
              className="bg-input text-foreground"
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
              />
            </div>
            <div>
              <Label className="text-foreground">LinkedIn</Label>
              <Input
                placeholder="https://linkedin.com/company/yourcompany"
                value={settings?.social_linkedin || ""}
                onChange={(e) => setSettings(s => s ? { ...s, social_linkedin: e.target.value } : null)}
                className="bg-input text-foreground"
              />
            </div>
            <div>
              <Label className="text-foreground">YouTube</Label>
              <Input
                placeholder="https://youtube.com/@yourchannel"
                value={settings?.social_youtube || ""}
                onChange={(e) => setSettings(s => s ? { ...s, social_youtube: e.target.value } : null)}
                className="bg-input text-foreground"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={handleSave} 
        disabled={isSaving}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Save className="h-4 w-4 mr-2" />
        )}
        Save All Settings
      </Button>
    </div>
  )
}
