import Link from "next/link"
import Image from "next/image"
import { Linkedin, Twitter, Youtube } from "lucide-react"

const navigation = {
  main: [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Resources", href: "/resources" },
    { name: "How We Work", href: "/how-we-work" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Disclaimer", href: "#" },
  ],
}

const socialLinks = [
  { name: "LinkedIn", href: "#", icon: Linkedin },
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "YouTube", href: "#", icon: Youtube },
]

export function Footer() {
  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col items-center gap-8">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Dravyam Technology Logo"
              width={44}
              height={44}
              className="w-11 h-11 rounded-full"
            />
            <span className="text-lg font-semibold text-foreground">Dravyam Technology</span>
          </Link>
          
          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {navigation.main.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Social links */}
          <div className="flex gap-6">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
          
          {/* Legal links */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {navigation.legal.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Copyright */}
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Dravyam Technology. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
