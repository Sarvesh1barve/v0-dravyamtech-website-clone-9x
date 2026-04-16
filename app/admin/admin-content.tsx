"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminSettings } from "@/components/admin/admin-settings"
import { AdminResources } from "@/components/admin/admin-resources"
import { AdminUsers } from "@/components/admin/admin-users"
import { AdminPayments } from "@/components/admin/admin-payments"
import { Settings, Video, Users, CreditCard, Loader2, HelpCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminContent() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkAdmin() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/login")
        return
      }

      try {
        // Call the API which uses service role to bypass RLS
        const response = await fetch('/api/check-admin')
        const data = await response.json()
        
        if (!data.isAdmin) {
          router.push("/dashboard")
          return
        }

        setIsAdmin(true)
        setIsLoading(false)
      } catch (error) {
        console.error("Error checking admin status:", error)
        router.push("/dashboard")
      }
    }

    checkAdmin()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-8 pt-24">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-muted-foreground mt-2">
                Manage your website settings, resources, users, and payments
              </p>
            </div>
            <Link href="/admin/guide">
              <Button variant="outline" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                View Guide
              </Button>
            </Link>
          </div>

          <Tabs defaultValue="settings" className="space-y-6">
            <TabsList className="flex flex-wrap gap-2 h-auto p-2 bg-secondary/50 rounded-lg w-full max-w-4xl">
              <TabsTrigger value="settings" className="flex items-center gap-2 flex-1 min-w-[80px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-2 flex-1 min-w-[80px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Video className="h-4 w-4" />
                <span className="hidden sm:inline">Resources</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2 flex-1 min-w-[80px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-2 flex-1 min-w-[80px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Payments</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="settings">
              <AdminSettings />
            </TabsContent>

            <TabsContent value="resources">
              <AdminResources />
            </TabsContent>

            <TabsContent value="users">
              <AdminUsers />
            </TabsContent>

            <TabsContent value="payments">
              <AdminPayments />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
