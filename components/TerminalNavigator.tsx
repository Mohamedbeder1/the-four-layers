'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal } from 'lucide-react'

const routes = [
  { path: '/', label: 'Accueil', command: 'home' },
  { path: '/about', label: 'À propos', command: 'about' },
  { path: '/village', label: 'Village', command: 'village' },
  { path: '/resources', label: 'Ressources', command: 'resources' },
  { path: '/swipe', label: 'Jeu de Décisions', command: 'swipe' },
  { path: '/community', label: 'Communauté', command: 'community' },
  { path: '/quiz', label: 'Quiz', command: 'quiz' },
]

export default function TerminalNavigator() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl+K or Ctrl+T to open terminal
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 't')) {
        e.preventDefault()
        setIsOpen(true)
      }
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        setInput('')
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isOpen])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (input.trim()) {
      const filtered = routes.filter(route =>
        route.command.toLowerCase().includes(input.toLowerCase()) ||
        route.label.toLowerCase().includes(input.toLowerCase())
      )
      setSuggestions(filtered.map(r => r.command))
    } else {
      setSuggestions([])
    }
  }, [input])

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    
    if (trimmed === 'clear' || trimmed === 'cls') {
      setHistory([])
      setInput('')
      return
    }

    if (trimmed === 'help' || trimmed === '?') {
      setHistory(prev => [...prev, `$ ${cmd}`, 'Commandes disponibles:', '', ...routes.map(r => `  ${r.command.padEnd(12)} - ${r.label}`), '', '  clear        - Effacer le terminal', '  help         - Afficher cette aide', '  exit         - Fermer le terminal'])
      setInput('')
      return
    }

    if (trimmed === 'exit' || trimmed === 'quit') {
      setIsOpen(false)
      setInput('')
      return
    }

    const route = routes.find(r => r.command === trimmed)
    if (route) {
      setHistory(prev => [...prev, `$ ${cmd}`, `Navigating to ${route.label}...`])
      router.push(route.path)
      setTimeout(() => {
        setIsOpen(false)
        setInput('')
        setHistory([])
      }, 400)
    } else {
      setHistory(prev => [...prev, `$ ${cmd}`, `bash: ${trimmed}: command not found`, 'Type "help" for available commands'])
      setInput('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      handleCommand(input)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    inputRef.current?.focus()
  }

  return (
    <>
      {/* Terminal Toggle Button - GNOME style */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-md shadow-lg flex items-center justify-center text-white transition-all"
        style={{ 
          background: '#300A24',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
        title="Terminal (Ctrl+K)"
      >
        <Terminal className="w-5 h-5" />
      </motion.button>

      {/* Terminal Window - GNOME Terminal Style */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 z-50"
            />
            
            {/* Terminal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50 rounded-lg overflow-hidden shadow-2xl"
              style={{ 
                background: '#300A24',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* GNOME-style Header */}
              <div className="px-3 py-2 flex items-center justify-between" style={{ background: '#2C001E' }}>
                <span className="font-mono text-xs text-white/70">
                  nird@ubuntu:~
                </span>
              </div>

              {/* Terminal Body */}
              <div className="p-4 h-96 overflow-y-auto font-mono text-sm">
                {/* Welcome Message - Simple */}
                {history.length === 0 && (
                  <div className="mb-3 text-green-400">
                    <div>Type &quot;help&quot; for available commands</div>
                  </div>
                )}

                {/* History */}
                {history.map((line, index) => (
                  <div key={index} className="mb-1">
                    {line.startsWith('$') ? (
                      <span className="text-green-400">{line}</span>
                    ) : line.startsWith('bash:') ? (
                      <span className="text-red-400">{line}</span>
                    ) : line.startsWith('Navigating') ? (
                      <span className="text-cyan-400">{line}</span>
                    ) : line.startsWith('  ') ? (
                      <span className="text-white/70">{line}</span>
                    ) : (
                      <span className="text-white/90">{line}</span>
                    )}
                  </div>
                ))}

                {/* Input Line */}
                <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2 relative">
                  <span className="text-green-400">$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-white/90"
                    placeholder=""
                    autoComplete="off"
                  />
                  
                  {/* Autocomplete suggestions */}
                  {suggestions.length > 0 && input.length > 0 && (
                    <div className="absolute bottom-full left-0 mb-2 rounded p-2 min-w-[200px]" style={{ background: '#3C0A2E', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-2 py-1 rounded text-sm text-green-400 hover:bg-white/10 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

