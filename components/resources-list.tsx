"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Lock, Play, Crown, X } from "lucide-react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"

interface Resource {
  id: string
  title: string
  description: string
  video_url: string | null
  thumbnail_url: string | null
  category: string
  is_locked: boolean
  price: number
  created_at: string
}

interface UserProfile {
  id: string
  is_subscribed: boolean
  subscription_expires_at: string | null
}

interface SiteSettings {
  upi_id: string | null
  qr_code_url: string | null
}

interface ResourcesListProps {
  resources: Resource[]
  user: User | null
  userProfile: UserProfile | null
  userResources: string[]
  settings: SiteSettings | null
}

export function ResourcesList({ 
  resources, 
  user, 
  userProfile, 
  userResources,
  settings 
}: ResourcesListProps) {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentResource, setPaymentResource] = useState<Resource | null>(null)

  const isSubscribed = userProfile?.is_subscribed && 
    (!userProfile.subscription_expires_at || 
     new Date(userProfile.subscription_expires_at) > new Date())

  const canAccess = (resource: Resource) => {
    if (!resource.is_locked) return true
    if (!user) return false
    if (isSubscribed) return true
    return userResources.includes(resource.id)
  }

  const handleResourceClick = (resource: Resource) => {
    if (canAccess(resource)) {
      setSelectedResource(resource)
    } else if (!user) {
      window.location.href = '/login'
    } else {
      setPaymentResource(resource)
      setShowPaymentModal(true)
    }
  }

  const categories = [...new Set(resources.map(r => r.category))]

  return (
    <div className="max-w-6xl mx-auto">
      {resources.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No resources available yet. Check back soon!</p>
        </div>
      ) : (
        <>
          {/* Category tabs */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          )}

          {/* Resources grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors cursor-pointer group"
                onClick={() => handleResourceClick(resource)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-secondary">
                  {resource.thumbnail_url ? (
                    <img
                      src={resource.thumbnail_url}
                      alt={resource.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-12 h-12 text-muted-foreground/50" />
                    </div>
                  )}
                  
                  {/* Overlay for locked content */}
                  {resource.is_locked && !canAccess(resource) && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
                      <Lock className="w-8 h-8 text-primary mb-2" />
                      <span className="text-sm font-medium text-foreground">
                        {resource.price > 0 ? `₹${resource.price}` : 'Subscription Required'}
                      </span>
                    </div>
                  )}
                  
                  {/* Play button overlay */}
                  {canAccess(resource) && (
                    <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                        <Play className="w-6 h-6 text-primary-foreground ml-1" />
                      </div>
                    </div>
                  )}
                  
                  {/* Premium badge */}
                  {resource.is_locked && (
                    <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      Premium
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {resource.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground capitalize">
                      {resource.category}
                    </span>
                    {resource.is_locked && !canAccess(resource) && (
                      <span className="text-xs font-medium text-primary">
                        {resource.price > 0 ? `₹${resource.price}` : 'Subscribe'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Video Modal */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-foreground">{selectedResource.title}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedResource(null)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="aspect-video bg-black rounded-xl overflow-hidden">
              {selectedResource.video_url ? (
                <iframe
                  src={selectedResource.video_url}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Video not available
                </div>
              )}
            </div>
            
            <p className="mt-4 text-muted-foreground">{selectedResource.description}</p>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && paymentResource && (
        <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-foreground">Unlock Resource</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowPaymentModal(false)
                  setPaymentResource(null)
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="text-center mb-6">
              <h3 className="font-semibold text-foreground mb-2">{paymentResource.title}</h3>
              <p className="text-2xl font-bold text-primary">
                ₹{paymentResource.price || 'Subscription Required'}
              </p>
            </div>
            
            {settings?.qr_code_url && (
              <div className="mb-6">
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Scan QR code to pay:
                </p>
                <div className="flex justify-center">
                  <img
                    src={settings.qr_code_url}
                    alt="Payment QR Code"
                    className="w-48 h-48 bg-white p-2 rounded-lg"
                  />
                </div>
              </div>
            )}
            
            {settings?.upi_id && (
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground mb-2">Or pay via UPI:</p>
                <p className="font-mono text-foreground bg-secondary px-4 py-2 rounded-lg">
                  {settings.upi_id}
                </p>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground text-center">
              After payment, please contact support with your transaction ID to unlock this resource.
            </p>
            
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowPaymentModal(false)
                  setPaymentResource(null)
                }}
              >
                Cancel
              </Button>
              <Link href="/dashboard" className="flex-1">
                <Button className="w-full bg-primary text-primary-foreground">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Subscribe CTA for non-subscribers */}
      {user && !isSubscribed && (
        <div className="mt-12 bg-card border border-border rounded-xl p-8 text-center">
          <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">
            Unlock All Premium Content
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Subscribe to get unlimited access to all premium resources and future content.
          </p>
          <Link href="/dashboard">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Subscribe Now
            </Button>
          </Link>
        </div>
      )}

      {/* Login CTA for non-logged in users */}
      {!user && (
        <div className="mt-12 bg-card border border-border rounded-xl p-8 text-center">
          <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">
            Login to Access Premium Content
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create an account or login to unlock premium resources.
          </p>
          <Link href="/login">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Login / Sign Up
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
