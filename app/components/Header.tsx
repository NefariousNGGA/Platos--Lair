'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Menu, X } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import SearchModal from './SearchModal'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'The Lair', href: '/' },
  { name: 'The Cave', href: '/about' },
  { name: 'Echoes', href: '/archive' },
  { name: 'Scrolls', href: '/stats' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
      }
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <header className={cn(
        "sticky top-0 z-40 w-full border-b transition-all duration-200",
        scrolled 
          ? "bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60" 
          : "bg-background"
      )}>
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-accent"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pastel-pink to-pastel-purple group-hover:scale-105 transition-transform" />
              <span className="text-xl font-bold font-rounded tracking-tight">
                Plato<span className="text-pastel-blue">'s</span> Lair
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pastel-blue group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-full border hover:bg-accent transition-colors group"
              aria-label="Search (Ctrl+K)"
            >
              <Search size={16} className="opacity-60 group-hover:opacity-100" />
              <span className="hidden sm:inline text-muted-foreground">Seek wisdom...</span>
              <kbd className="hidden md:inline-flex items-center gap-1 text-xs border rounded px-1.5 py-0.5 opacity-60">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="py-2 text-lg font-medium hover:text-pastel-blue transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}