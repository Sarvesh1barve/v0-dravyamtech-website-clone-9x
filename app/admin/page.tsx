import dynamic from 'next/dynamic'

// Dynamically import with ssr disabled to prevent server-side rendering at build time
const AdminPageContent = dynamic(() => import('./admin-content'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Loading admin panel...</p>
      </div>
    </div>
  ),
})

export default function AdminPage() {
  return <AdminPageContent />
}
