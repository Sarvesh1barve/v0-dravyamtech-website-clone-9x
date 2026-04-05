"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Save, Upload } from "lucide-react"
import { toast } from "sonner"

interface SiteSettings {
  id: string
  primary_color: string
  secondary_color: string
  accent_color: string
  text_color: string
  heading_color: string
  upi_id: string | null
  qr_code_url: string | null
}

export function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
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
    } else {
      // Create default settings if none exist
      const { data: newSettings, error: insertError } = await supabase
        .from("site_settings")
        .insert({
          primary_color: "#1e3a5f",
          secondary_color: "#f59e0b",
          accent_color: "#10b981",
          text_color: "#ffffff",
          heading_color: "#f59e0b"
        })
        .select()
        .single()

      if (!insertError && newSettings) {
        setSettings(newSettings)
      }
    }
    setIsLoading(false)
  }

  async function handleSave() {
    if (!settings) return
    setIsSaving(true)

    try {
      // Handle QR code upload if file is selected
      let qrCodeUrl = settings.qr_code_url
      if (qrFile) {
        const fileExt = qrFile.name.split(".").pop()
        const fileName = `qr-code-${Date.now()}.${fileExt}`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("public")
          .upload(fileName, qrFile, { upsert: true })

        if (uploadError) {
          toast.error("Failed to upload QR code")
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from("public")
            .getPublicUrl(fileName)
          qrCodeUrl = publicUrl
        }
      }

      const { error } = await supabase
        .from("site_settings")
        .update({
          primary_color: settings.primary_color,
          secondary_color: settings.secondary_color,
          accent_color: settings.accent_color,
          text_color: settings.text_color,
          heading_color: settings.heading_color,
          upi_id: settings.upi_id,
          qr_code_url: qrCodeUrl,
          updated_at: new Date().toISOString()
        })
        .eq("id", settings.id)

      if (error) {
        toast.error("Failed to save settings")
      } else {
        setSettings({ ...settings, qr_code_url: qrCodeUrl })
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
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Color Settings</CardTitle>
          <CardDescription>Customize your website colors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="primary" className="w-32 text-foreground">Primary</Label>
              <Input
                id="primary"
                type="color"
                value={settings?.primary_color || "#1e3a5f"}
                onChange={(e) => setSettings(s => s ? { ...s, primary_color: e.target.value } : null)}
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={settings?.primary_color || ""}
                onChange={(e) => setSettings(s => s ? { ...s, primary_color: e.target.value } : null)}
                className="flex-1 bg-input text-foreground"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label htmlFor="secondary" className="w-32 text-foreground">Secondary</Label>
              <Input
                id="secondary"
                type="color"
                value={settings?.secondary_color || "#f59e0b"}
                onChange={(e) => setSettings(s => s ? { ...s, secondary_color: e.target.value } : null)}
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={settings?.secondary_color || ""}
                onChange={(e) => setSettings(s => s ? { ...s, secondary_color: e.target.value } : null)}
                className="flex-1 bg-input text-foreground"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label htmlFor="accent" className="w-32 text-foreground">Accent</Label>
              <Input
                id="accent"
                type="color"
                value={settings?.accent_color || "#10b981"}
                onChange={(e) => setSettings(s => s ? { ...s, accent_color: e.target.value } : null)}
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={settings?.accent_color || ""}
                onChange={(e) => setSettings(s => s ? { ...s, accent_color: e.target.value } : null)}
                className="flex-1 bg-input text-foreground"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label htmlFor="text" className="w-32 text-foreground">Text Color</Label>
              <Input
                id="text"
                type="color"
                value={settings?.text_color || "#ffffff"}
                onChange={(e) => setSettings(s => s ? { ...s, text_color: e.target.value } : null)}
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={settings?.text_color || ""}
                onChange={(e) => setSettings(s => s ? { ...s, text_color: e.target.value } : null)}
                className="flex-1 bg-input text-foreground"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label htmlFor="heading" className="w-32 text-foreground">Heading Color</Label>
              <Input
                id="heading"
                type="color"
                value={settings?.heading_color || "#f59e0b"}
                onChange={(e) => setSettings(s => s ? { ...s, heading_color: e.target.value } : null)}
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={settings?.heading_color || ""}
                onChange={(e) => setSettings(s => s ? { ...s, heading_color: e.target.value } : null)}
                className="flex-1 bg-input text-foreground"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Payment Settings</CardTitle>
          <CardDescription>Configure UPI payment details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="upi" className="text-foreground">UPI ID</Label>
            <Input
              id="upi"
              type="text"
              placeholder="yourname@upi"
              value={settings?.upi_id || ""}
              onChange={(e) => setSettings(s => s ? { ...s, upi_id: e.target.value } : null)}
              className="bg-input text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="qr" className="text-foreground">QR Code Image</Label>
            <div className="flex items-center gap-4">
              <Input
                id="qr"
                type="file"
                accept="image/*"
                onChange={(e) => setQrFile(e.target.files?.[0] || null)}
                className="bg-input text-foreground"
              />
            </div>
            {settings?.qr_code_url && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Current QR Code:</p>
                <img 
                  src={settings.qr_code_url} 
                  alt="Payment QR Code" 
                  className="w-32 h-32 object-contain border border-border rounded"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="md:col-span-2">
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
          Save Settings
        </Button>
      </div>
    </div>
  )
}
