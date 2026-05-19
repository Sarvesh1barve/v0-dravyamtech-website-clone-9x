"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Plus, Pencil, Trash2, Video, Lock, Unlock, Upload, Link as LinkIcon, Image as ImageIcon, Play } from "lucide-react"
import { toast } from "sonner"

interface Resource {
  id: string
  title: string
  description: string | null
  video_url: string | null
  video_file_url: string | null
  video_drive_link: string | null
  thumbnail_url: string | null
  thumbnail_file_url: string | null
  thumbnail_drive_link: string | null
  category: string
  is_locked: boolean
  price: number
  created_at: string
}

export function AdminResources() {
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video_url: "",
    video_file_url: "",
    video_drive_link: "",
    thumbnail_url: "",
    thumbnail_file_url: "",
    thumbnail_drive_link: "",
    category: "general",
    is_locked: false
  })

  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null)

  useEffect(() => {
    setSupabase(createClient())
  }, [])

  useEffect(() => {
    if (!supabase) return
    fetchResources()
  }, [supabase])

  async function fetchResources() {
    if (!supabase) return
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      toast.error("Failed to load resources")
    } else {
      setResources(data || [])
    }
    setIsLoading(false)
  }

  function openAddDialog() {
    setEditingResource(null)
    setFormData({
      title: "",
      description: "",
      video_url: "",
      video_file_url: "",
      video_drive_link: "",
      thumbnail_url: "",
      thumbnail_file_url: "",
      thumbnail_drive_link: "",
      category: "general",
      is_locked: false
    })
    setIsDialogOpen(true)
  }

  function openEditDialog(resource: Resource) {
    setEditingResource(resource)
    setFormData({
      title: resource.title,
      description: resource.description || "",
      video_url: resource.video_url || "",
      video_file_url: resource.video_file_url || "",
      video_drive_link: resource.video_drive_link || "",
      thumbnail_url: resource.thumbnail_url || "",
      thumbnail_file_url: resource.thumbnail_file_url || "",
      thumbnail_drive_link: resource.thumbnail_drive_link || "",
      category: resource.category,
      is_locked: resource.is_locked
    })
    setIsDialogOpen(true)
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>, type: "video" | "thumbnail") {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size upfront
    const maxSize = type === "video" ? 500 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error(type === "video" ? "Video too large (max 500MB)" : "Image too large (max 10MB)")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)
      uploadFormData.append("type", type)

      // Use fetch instead of XHR for simpler error handling
      const response = await fetch("/api/admin/upload-resource-media", {
        method: "POST",
        body: uploadFormData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Upload failed")
      }

      if (type === "video") {
        setFormData(prev => ({ ...prev, video_file_url: result.url }))
        toast.success("Video uploaded successfully!")
      } else {
        setFormData(prev => ({ ...prev, thumbnail_file_url: result.url }))
        toast.success("Thumbnail uploaded successfully!")
      }
    } catch (error) {
      console.error("[v0] Upload error:", error)
      const msg = error instanceof Error ? error.message : "Failed to upload file"
      toast.error(msg)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  async function handleSave() {
    if (!formData.title.trim()) {
      toast.error("Title is required")
      return
    }

    // Check that at least one video source is provided
    if (!formData.video_url && !formData.video_file_url && !formData.video_drive_link) {
      toast.error("Please provide a video URL, file, or Google Drive link")
      return
    }

    // Check that at least one thumbnail source is provided
    if (!formData.thumbnail_url && !formData.thumbnail_file_url && !formData.thumbnail_drive_link) {
      toast.error("Please provide a thumbnail URL, file, or Google Drive link")
      return
    }

    setIsSaving(true)

    try {
      if (editingResource) {
        console.log("[v0] Updating resource:", editingResource.id, formData)
        const response = await fetch("/api/admin/resources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update",
            id: editingResource.id,
            data: {
              title: formData.title,
              description: formData.description || null,
              video_url: formData.video_url || null,
              video_file_url: formData.video_file_url || null,
              video_drive_link: formData.video_drive_link || null,
              thumbnail_url: formData.thumbnail_url || null,
              thumbnail_file_url: formData.thumbnail_file_url || null,
              thumbnail_drive_link: formData.thumbnail_drive_link || null,
              category: formData.category,
              is_locked: formData.is_locked,
              updated_at: new Date().toISOString()
            }
          })
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to update resource")
        }

        console.log("[v0] Resource updated successfully")
        toast.success("Resource updated successfully!")
        fetchResources()
        setIsDialogOpen(false)
        
        await fetch("/api/revalidate?tag=resources-list").catch(err => 
          console.error("[v0] Revalidation error:", err)
        )
      } else {
        console.log("[v0] Creating new resource:", formData)
        const response = await fetch("/api/admin/resources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "create",
            data: {
              title: formData.title,
              description: formData.description || null,
              video_url: formData.video_url || null,
              video_file_url: formData.video_file_url || null,
              video_drive_link: formData.video_drive_link || null,
              thumbnail_url: formData.thumbnail_url || null,
              thumbnail_file_url: formData.thumbnail_file_url || null,
              thumbnail_drive_link: formData.thumbnail_drive_link || null,
              category: formData.category,
              is_locked: formData.is_locked
            }
          })
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to create resource")
        }

        console.log("[v0] Resource created successfully")
        toast.success("Resource created successfully!")
        fetchResources()
        setIsDialogOpen(false)
        
        await fetch("/api/revalidate?tag=resources-list").catch(err => 
          console.error("[v0] Revalidation error:", err)
        )
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An error occurred"
      console.error("[v0] Save exception:", err)
      toast.error(msg)
    }

    setIsSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this resource?")) return

    try {
      const response = await fetch("/api/admin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          id
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete resource")
      }

      toast.success("Resource deleted successfully!")
      fetchResources()
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete resource"
      console.error("[v0] Delete error:", err)
      toast.error(msg)
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
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-foreground">Resources Management</CardTitle>
          <CardDescription>Add, edit, or remove video resources</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {editingResource ? "Edit Resource" : "Add New Resource"}
              </DialogTitle>
              <DialogDescription>
                {editingResource ? "Update the resource details below" : "Fill in the details for the new resource"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-input text-foreground"
                  placeholder="Resource title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-input text-foreground min-h-24"
                  placeholder="Resource description"
                />
              </div>

              {/* Video Section */}
              <div className="space-y-3 border-t border-border pt-4">
                <Label className="text-foreground font-semibold flex items-center gap-2">
                  <Play className="h-4 w-4" /> Video *
                </Label>
                <Tabs defaultValue="url" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-secondary">
                    <TabsTrigger value="url">Direct URL</TabsTrigger>
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                    <TabsTrigger value="drive">Google Drive</TabsTrigger>
                  </TabsList>

                  <TabsContent value="url" className="space-y-2">
                    <Input
                      value={formData.video_url}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      className="bg-input text-foreground"
                      placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                    />
                    <p className="text-xs text-muted-foreground">YouTube, Vimeo, or direct video URL</p>
                    {formData.video_url && <p className="text-xs text-green-500">✓ URL set</p>}
                  </TabsContent>

                  <TabsContent value="upload" className="space-y-2">
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/ogg,video/quicktime"
                        onChange={(e) => handleFileUpload(e, "video")}
                        disabled={isUploading}
                        className="hidden"
                        id="video-upload"
                      />
                      <label htmlFor="video-upload" className={`cursor-pointer flex flex-col items-center ${isUploading ? 'opacity-50' : ''}`}>
                        {isUploading ? (
                          <Loader2 className="h-6 w-6 text-primary animate-spin mb-2" />
                        ) : (
                          <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                        )}
                        <span className="text-sm text-muted-foreground">
                          {isUploading ? "Uploading video... please wait" : "Click to upload video (MP4, WebM, OGG, MOV)"}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">Max 500MB</span>
                      </label>
                    </div>
                    {formData.video_file_url && (
                      <div className="text-xs text-green-500 flex items-center gap-1">
                        ✓ File uploaded: {formData.video_file_url.split('/').pop()?.slice(0, 20)}...
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="drive" className="space-y-2">
                    <Input
                      value={formData.video_drive_link}
                      onChange={(e) => setFormData({ ...formData, video_drive_link: e.target.value })}
                      className="bg-input text-foreground"
                      placeholder="https://drive.google.com/file/d/FILE_ID/view"
                    />
                    <p className="text-xs text-muted-foreground">Share the Google Drive link (make it publicly accessible)</p>
                    {formData.video_drive_link && <p className="text-xs text-green-500">✓ Drive link set</p>}
                  </TabsContent>
                </Tabs>
              </div>

              {/* Thumbnail Section */}
              <div className="space-y-3 border-t border-border pt-4">
                <Label className="text-foreground font-semibold flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" /> Thumbnail *
                </Label>
                <Tabs defaultValue="url" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-secondary">
                    <TabsTrigger value="url">Direct URL</TabsTrigger>
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                    <TabsTrigger value="drive">Google Drive</TabsTrigger>
                  </TabsList>

                  <TabsContent value="url" className="space-y-2">
                    <Input
                      value={formData.thumbnail_url}
                      onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                      className="bg-input text-foreground"
                      placeholder="https://example.com/thumbnail.jpg"
                    />
                    <p className="text-xs text-muted-foreground">JPEG, PNG, or WebP image</p>
                    {formData.thumbnail_url && <p className="text-xs text-green-500">✓ URL set</p>}
                  </TabsContent>

                  <TabsContent value="upload" className="space-y-2">
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => handleFileUpload(e, "thumbnail")}
                        disabled={isUploading}
                        className="hidden"
                        id="thumbnail-upload"
                      />
                      <label htmlFor="thumbnail-upload" className={`cursor-pointer flex flex-col items-center ${isUploading ? 'opacity-50' : ''}`}>
                        {isUploading ? (
                          <Loader2 className="h-6 w-6 text-primary animate-spin mb-2" />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-muted-foreground mb-2" />
                        )}
                        <span className="text-sm text-muted-foreground">
                          {isUploading ? "Uploading image... please wait" : "Click to upload thumbnail (JPEG, PNG, WebP)"}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">Max 10MB</span>
                      </label>
                    </div>
                    {formData.thumbnail_file_url && (
                      <div className="flex items-center gap-2 mt-2">
                        <img src={formData.thumbnail_file_url} alt="Thumbnail preview" className="h-12 w-12 object-cover rounded" />
                        <span className="text-xs text-green-500">✓ Thumbnail uploaded</span>
                      </div>
                    )}
                  </TabsContent>
                    {formData.thumbnail_file_url && (
                      <div className="text-xs text-green-500 flex items-center gap-1">
                        ✓ File uploaded: {formData.thumbnail_file_url.split('/').pop()?.slice(0, 20)}...
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="drive" className="space-y-2">
                    <Input
                      value={formData.thumbnail_drive_link}
                      onChange={(e) => setFormData({ ...formData, thumbnail_drive_link: e.target.value })}
                      className="bg-input text-foreground"
                      placeholder="https://drive.google.com/file/d/FILE_ID/view"
                    />
                    <p className="text-xs text-muted-foreground">Share the Google Drive link (make it publicly accessible)</p>
                    {formData.thumbnail_drive_link && <p className="text-xs text-green-500">✓ Drive link set</p>}
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-2 border-t border-border pt-4">
                <Label htmlFor="category" className="text-foreground">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="bg-input text-foreground">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="trading">Trading</SelectItem>
                    <SelectItem value="analysis">Analysis</SelectItem>
                    <SelectItem value="tutorial">Tutorial</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="space-y-0.5">
                  <Label htmlFor="is_locked" className="text-foreground">Lock Resource</Label>
                  <p className="text-xs text-muted-foreground">Only subscribers can view locked content</p>
                </div>
                <Switch
                  id="is_locked"
                  checked={formData.is_locked}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_locked: checked })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving || isUploading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingResource ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {resources.length === 0 ? (
          <div className="text-center py-12">
            <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No resources yet. Add your first resource!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">Title</TableHead>
                  <TableHead className="text-muted-foreground">Category</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.map((resource) => (
                  <TableRow key={resource.id} className="border-border">
                    <TableCell className="text-foreground font-medium">
                      {resource.title}
                    </TableCell>
                    <TableCell className="text-muted-foreground capitalize">
                      {resource.category}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {resource.is_locked ? (
                        <span className="inline-flex items-center gap-1 text-yellow-500">
                          <Lock className="h-3 w-3" /> Locked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-green-500">
                          <Unlock className="h-3 w-3" /> Free
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(resource)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(resource.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
