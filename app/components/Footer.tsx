import Link from 'next/link'
import { Github, Twitter, Rss } from 'lucide-react'

const currentYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="mt-auto border-t py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand & Copyright */}
          <div className="text-center md:text-left">
            <Link href="/" className="inline-flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-pastel-green to-pastel-blue" />
              <span className="text-lg font-bold font-rounded">Plato's Lair</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              © {currentYear} A thinking space. All thoughts preserved.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Built with shadows, whispers, and Next.js
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            <div>
              <h3 className="font-semibold mb-3">The Lair</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/archive" className="text-muted-foreground hover:text-foreground transition-colors">
                    Echoes (Archive)
                  </Link>
                </li>
                <li>
                  <Link href="/tags" className="text-muted-foreground hover:text-foreground transition-colors">
                    Ideologies (Tags)
                  </Link>
                </li>
                <li>
                  <Link href="/stats" className="text-muted-foreground hover:text-foreground transition-colors">
                    Scrolls (Stats)
                  </Link>
                </li>
                <li>
                  <Link href="/feed.xml" className="text-muted-foreground hover:text-foreground transition-colors">
                    Epistles (RSS)
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">The Agora</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    Enter the Cave
                  </Link>
                </li>
                <li>
                  <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    Chisel Code
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    Whisper on Twitter
                  </a>
                </li>
                <li>
                  <a href="mailto:philosopher@platoslair.com" className="text-muted-foreground hover:text-foreground transition-colors">
                    Send Owl
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="/feed.xml"
              aria-label="RSS Feed"
              className="p-2 rounded-full hover:bg-accent transition-colors"
            >
              <Rss size={18} className="text-muted-foreground" />
            </a>
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="p-2 rounded-full hover:bg-accent transition-colors"
            >
              <Github size={18} className="text-muted-foreground" />
            </a>
            <a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="p-2 rounded-full hover:bg-accent transition-colors"
            >
              <Twitter size={18} className="text-muted-foreground" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>
            This cave is open to wanderers.{' '}
            <a
              href="https://github.com/yourusername/blog-platform"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              Study the shadows on GitHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}