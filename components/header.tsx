"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { Menu, X, User, LogOut, Shield, Home, Info, Package, BookOpen, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  // Fetch admin status from API (more reliable than client-side query)
  const checkAdminStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/check-admin')
      const data = await response.json()
      
      if (data.isLoggedIn) {
        setIsAdmin(data.isAdmin === true)
      } else {
        setIsAdmin(false)
      }
    } catch {
      setIsAdmin(false)
    }
  }, [])

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        if (user) {
          await checkAdminStatus()
        }
      } catch {
        // Silently handle errors
      } finally {
        setIsLoading(false)
      }
    }
    
    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        // Small delay to ensure session is fully established
        setTimeout(() => {
          checkAdminStatus()
        }, 100)
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, checkAdminStatus])

  // Close menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
    setMobileMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about", icon: Info },
    { name: "Products", href: "/products", icon: Package },
    { name: "Resources", href: "/resources", icon: BookOpen },
    { name: "How We Work", href: "/how-we-work", icon: Settings },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false)
    router.push(href)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <Image
              src="/logo.png"
              alt="Dravyam Technology Logo"
              width={44}
              height={44}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full"
              priority
            />
            <span className="text-base sm:text-lg font-semibold text-foreground tracking-tight hidden sm:block">
              Dravyam Technology
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors relative py-1 ${
                  isActive(item.href) 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>
          
          {/* Desktop User Actions */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-3">
            {!isLoading && user ? (
              <>
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="default" size="sm" className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : !isLoading ? (
              <Link href="/login">
                <Button variant="outline" size="sm" className="border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg bg-secondary/50 text-foreground hover:bg-secondary transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[9998] lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-[280px] max-w-[85vw] bg-background z-[9999] lg:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="font-semibold text-foreground">Menu</span>
            <button
              type="button"
              className="p-2 rounded-lg bg-secondary/50 text-foreground hover:bg-secondary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-3">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Mobile User Actions */}
          <div className="p-4 border-t border-border space-y-2">
            {!isLoading && user ? (
              <>
                {isAdmin && (
                  <button
                    onClick={() => handleNavClick('/admin')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-colors"
                  >
                    <Shield className="h-5 w-5 flex-shrink-0" />
                    Admin Panel
                  </button>
                )}
                <button
                  onClick={() => handleNavClick('/dashboard')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground border border-border hover:bg-secondary transition-colors"
                >
                  <User className="h-5 w-5 flex-shrink-0" />
                  Dashboard
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  Logout
                </button>
              </>
            ) : !isLoading ? (
              <button
                onClick={() => handleNavClick('/login')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <User className="h-5 w-5" />
                Login
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}
