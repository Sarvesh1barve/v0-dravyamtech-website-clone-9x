import dynamic from 'next/dynamic'

// Loading component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Loading admin panel...</p>
      </div>
    </div>
  )
}

// Dynamically import with ssr disabled to prevent server-side rendering at build time
const AdminPageContent = dynamic(() => import('./admin-content'), {
  ssr: false,
  loading: LoadingFallback,
})

export default function AdminPage() {
  return <AdminPageContent />
}
