'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Tag, FileText, Clock } from 'lucide-react'
import Link from 'next/link'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  useEffect(() => {
    const search = async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/posts?search=${encodeURIComponent(query)}`)
        const data = await response.json()
        setResults(data.posts || [])
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(search, 300)
    return () => clearTimeout(debounce)
  }, [query])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-background rounded-2xl shadow-2xl overflow-hidden">
          {/* Search Header */}
          <div className="border-b p-6">
            <div className="flex items-center gap-3">
              <Search className="text-muted-foreground" size={20} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts by title or content..."
                className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
                autoComplete="off"
              />
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-accent"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mt-2 text-sm text-muted-foreground flex items-center gap-4">
              <kbd className="px-2 py-1 bg-accent rounded text-xs">Esc</kbd>
              <span>to close</span>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {loading ? (
              <div className="py-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
                <p className="mt-2 text-muted-foreground">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-2">
                {results.map((post) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.slug}`}
                    onClick={onClose}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-pastel-blue/20 group-hover:bg-pastel-blue/30">
                      <FileText size={18} className="text-pastel-blue" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium group-hover:text-pastel-blue transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {post.publishedAt && (
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </span>
                        )}
                        {post.tags?.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Tag size={12} />
                            {post.tags.length} tags
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : query.length >= 2 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No results found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try different keywords
                </p>
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  Type at least 2 characters to search
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-4 text-center text-sm text-muted-foreground">
            <p>Search across all blog posts and tags</p>
          </div>
        </div>
      </div>
    </div>
  )
}