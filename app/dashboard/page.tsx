import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DashboardContent } from "@/components/dashboard-content"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Dashboard - Dravyam Technology",
  description: "Manage your account, subscriptions, and purchased resources.",
}

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const { data: userResources } = await supabase
    .from("user_resources")
    .select("*, resources(*)")
    .eq("user_id", user.id)

  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .single()

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-16 px-6">
        <DashboardContent 
          user={user}
          profile={profile}
          userResources={userResources || []}
          payments={payments || []}
          settings={settings}
        />
      </section>

      <Footer />
    </main>
  )
}
