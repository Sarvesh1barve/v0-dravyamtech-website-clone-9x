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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Plus, Pencil, Trash2, Video, Lock, Unlock } from "lucide-react"
import { toast } from "sonner"

interface Resource {
  id: string
  title: string
  description: string | null
  video_url: string | null
  thumbnail_url: string | null
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
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video_url: "",
    thumbnail_url: "",
    category: "general",
    is_locked: false
  })

  const supabase = createClient()

  useEffect(() => {
    fetchResources()
  }, [])

  async function fetchResources() {
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
      thumbnail_url: "",
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
      thumbnail_url: resource.thumbnail_url || "",
      category: resource.category,
      is_locked: resource.is_locked
    })
    setIsDialogOpen(true)
  }

  async function handleSave() {
    if (!formData.title.trim()) {
      toast.error("Title is required")
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
              thumbnail_url: formData.thumbnail_url || null,
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
        
        // Revalidate resources pages
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
              thumbnail_url: formData.thumbnail_url || null,
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
        
        // Revalidate resources pages
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
    } else {
      toast.success("Resource deleted successfully!")
      fetchResources()
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

              <div className="space-y-2">
                <Label htmlFor="video_url" className="text-foreground">Video URL</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  className="bg-input text-foreground"
                  placeholder="https://youtube.com/watch?v=..."
                />
                <p className="text-xs text-muted-foreground">YouTube, Vimeo, or direct video URL</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail_url" className="text-foreground">Thumbnail URL</Label>
                <Input
                  id="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  className="bg-input text-foreground"
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>

              <div className="space-y-2">
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

              <div className="flex items-center justify-between">
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
                  disabled={isSaving}
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
                  <TableHead className="text-muted-foreground">Price</TableHead>
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
                    <TableCell className="text-muted-foreground">
                      {resource.is_locked ? "Locked" : "Free"}
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
