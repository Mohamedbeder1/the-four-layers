'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo and Title */}
            <Link href="/" className="flex items-center gap-3 sm:gap-4 group">
              {/* Penguin SVG Logo */}
              <div className="w-10 h-10 flex items-center justify-center">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                  <ellipse cx="32" cy="40" rx="16" ry="20" fill="#fff" stroke="#222" strokeWidth="2" />
                  <ellipse cx="32" cy="24" rx="12" ry="14" fill="#222" />
                  <ellipse cx="26" cy="24" rx="2" ry="3" fill="#fff" />
                  <ellipse cx="38" cy="24" rx="2" ry="3" fill="#fff" />
                  <ellipse cx="32" cy="34" rx="4" ry="6" fill="#fff" />
                  <path d="M32 40 Q30 44 32 48 Q34 44 32 40" stroke="#f9c74f" strokeWidth="2" fill="#f9c74f" />
                  <ellipse cx="24" cy="52" rx="3" ry="2" fill="#f9c74f" />
                  <ellipse cx="40" cy="52" rx="3" ry="2" fill="#f9c74f" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
                  The Four Layers of NIRD
                </h1>
              </div>
            </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/about"
              className={`px-3 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                pathname === '/about'
                  ? 'bg-[rgba(15,179,138,0.12)] text-[#0a8a6c]'
                  : 'text-[#4b5563] hover:bg-[rgba(15,23,42,0.04)] hover:text-[#0f172a]'
              }`}
            >
              About
            </Link>
            <Link
              href="/resources"
              className={`px-3 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                pathname === '/resources'
                  ? 'bg-[rgba(15,179,138,0.12)] text-[#0a8a6c]'
                  : 'text-[#4b5563] hover:bg-[rgba(15,23,42,0.04)] hover:text-[#0f172a]'
              }`}
            >
              Resources
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

