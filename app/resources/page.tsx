import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ResourcesList } from "@/components/resources-list"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Resources - Dravyam Technology",
  description: "Access our library of trading education videos, tutorials, and resources.",
}

export const revalidate = 60

export default async function ResourcesPage() {
  const supabase = await createClient()
  
  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .order("created_at", { ascending: false })

  const { data: { user } } = await supabase.auth.getUser()
  
  let userProfile = null
  let userResources: string[] = []
  
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
    
    userProfile = profile
    
    const { data: purchased } = await supabase
      .from("user_resources")
      .select("resource_id")
      .eq("user_id", user.id)
    
    userResources = purchased?.map(p => p.resource_id) || []
  }

  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .single()

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Learning <span className="text-primary">Resources</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Access our comprehensive library of trading education videos, tutorials, 
            and resources to enhance your market knowledge.
          </p>
        </div>
      </section>

      {/* Resources List */}
      <section className="py-8 px-6">
        <ResourcesList 
          resources={resources || []} 
          user={user}
          userProfile={userProfile}
          userResources={userResources}
          settings={settings}
        />
      </section>

      <Footer />
    </main>
  )
}
