'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, CheckCircle, XCircle, Lightbulb, RotateCcw, Minimize2, Maximize2, X } from 'lucide-react'

interface LinuxCommandsGameProps {
  ageGroup: string
  level: string
  buildingId?: string
  onComplete: (points: number) => void
}

// Available commands for auto-completion
const availableCommands = [
  'ls', 'ls -l', 'ls -a', 'ls -la',
  'mkdir', 'mkdir -p',
  'cd', 'cd ..', 'cd ~',
  'pwd',
  'touch',
  'cat',
  'echo',
  'rm', 'rm -r', 'rm -rf',
  'cp', 'cp -r',
  'mv',
  'grep',
  'find',
  'chmod',
  'chown',
  'sudo',
  'apt', 'apt update', 'apt install', 'apt upgrade',
  'clear',
  'history',
  'man',
  'help',
  'whoami',
  'date',
  'cal',
]

export default function LinuxCommandsGame({ ageGroup, level, buildingId, onComplete }: LinuxCommandsGameProps) {
  const [currentCommand, setCurrentCommand] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [currentTask, setCurrentTask] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState(0)
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const tasks = [
    {
      description: 'Affichez le contenu du répertoire actuel',
      command: 'ls',
      hint: 'Utilisez la commande qui liste les fichiers et dossiers',
      points: 10
    },
    {
      description: 'Créez un nouveau dossier appelé "mon_projet"',
      command: 'mkdir mon_projet',
      hint: 'La commande mkdir permet de créer un dossier',
      points: 15
    },
    {
      description: 'Entrez dans le dossier "mon_projet"',
      command: 'cd mon_projet',
      hint: 'La commande cd permet de changer de répertoire',
      points: 15
    },
    {
      description: 'Affichez votre position actuelle dans le système',
      command: 'pwd',
      hint: 'Cette commande affiche le chemin complet du répertoire actuel',
      points: 10
    },
    {
      description: 'Créez un fichier texte nommé "readme.txt"',
      command: 'touch readme.txt',
      hint: 'La commande touch crée un nouveau fichier vide',
      points: 15
    },
  ]

  // Auto-completion logic
  useEffect(() => {
    if (currentCommand.trim()) {
      const input = currentCommand.trim().toLowerCase()
      const matches = availableCommands.filter(cmd => 
        cmd.toLowerCase().startsWith(input) && cmd.toLowerCase() !== input
      ).slice(0, 5)
      setAutocompleteSuggestions(matches)
      setShowAutocomplete(matches.length > 0)
      setSelectedSuggestion(0)
    } else {
      setAutocompleteSuggestions([])
      setShowAutocomplete(false)
    }
  }, [currentCommand])

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentCommand.trim()) return

    const task = tasks[currentTask]
    const isCorrect = currentCommand.trim().toLowerCase() === task.command.toLowerCase()

    setCommandHistory(prev => [...prev, currentCommand])
    setShowAutocomplete(false)
    
    if (isCorrect) {
      setScore(prev => prev + task.points)
      if (currentTask < tasks.length - 1) {
        setTimeout(() => {
          setCurrentTask(prev => prev + 1)
          setCurrentCommand('')
        }, 1000)
      } else {
        setCompleted(true)
        setTimeout(() => onComplete(score + task.points), 500)
      }
    } else {
      setScore(prev => Math.max(0, prev - 5))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showAutocomplete && autocompleteSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedSuggestion(prev => (prev + 1) % autocompleteSuggestions.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedSuggestion(prev => (prev - 1 + autocompleteSuggestions.length) % autocompleteSuggestions.length)
      } else if (e.key === 'Tab') {
        e.preventDefault()
        if (autocompleteSuggestions[selectedSuggestion]) {
          setCurrentCommand(autocompleteSuggestions[selectedSuggestion])
          setShowAutocomplete(false)
        }
      } else if (e.key === 'Escape') {
        setShowAutocomplete(false)
      }
    }
  }

  const handleReset = () => {
    setCurrentCommand('')
    setCommandHistory([])
    setScore(0)
    setCurrentTask(0)
    setCompleted(false)
    setShowHint(false)
    setIsMinimized(false)
    setIsMaximized(false)
  }

  const currentTaskData = tasks[currentTask]

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-3 md:p-6 bg-transparent font-mono">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 md:mb-6 gap-2 sm:gap-0">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <Terminal className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-green-400 flex-shrink-0" />
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg md:text-2xl font-bold text-white mb-0.5 sm:mb-1 truncate">
              Apprendre les commandes Linux
            </h3>
            <p className="text-xs sm:text-sm text-gray-400">
              Tâche {currentTask + 1} / {tasks.length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button
            onClick={() => setShowHint(!showHint)}
            className="p-1.5 sm:p-2 bg-yellow-900/30 rounded-lg hover:bg-yellow-900/50 transition-colors"
            title="Aide"
          >
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 sm:p-2.5 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all hover:scale-110 active:scale-95 shadow-sm"
            title="Recommencer"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
          </button>
        </div>
      </div>

      {showHint && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 sm:mb-4 p-3 sm:p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg"
        >
          <p className="text-xs sm:text-sm text-yellow-300">
            💡 {currentTaskData.hint}
          </p>
        </motion.div>
      )}

      {/* Ubuntu Terminal Window */}
      <div 
        ref={terminalRef}
        className={`bg-[#300a24] rounded-lg overflow-hidden shadow-2xl border border-gray-700 transition-all duration-300 ${
          isMaximized ? 'fixed inset-4 z-50' : ''
        } ${isMinimized ? 'h-12' : ''}`}
      >
        {/* Ubuntu Terminal Title Bar */}
        <div className="bg-[#2d1b1e] px-3 sm:px-4 py-2 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            {/* Window Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#ff5f56] hover:bg-[#ff3b30] transition-colors flex items-center justify-center group"
                title="Minimiser"
              >
                <Minimize2 className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-transparent group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#ffbd2e] hover:bg-[#ff9500] transition-colors flex items-center justify-center group"
                title="Maximiser"
              >
                <Maximize2 className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-transparent group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button
                onClick={handleReset}
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#27c93f] hover:bg-[#ff3b30] transition-colors flex items-center justify-center group"
                title="Fermer"
              >
                <X className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-transparent group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
            {/* Terminal Title */}
            <div className="flex items-center gap-2 ml-2 sm:ml-3 min-w-0">
              <Terminal className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-gray-300 truncate">nird@village: ~</span>
            </div>
          </div>
        </div>

        {/* Terminal Content */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-black p-3 sm:p-4 md:p-6 overflow-hidden"
            >
              {/* Terminal Prompt */}
              <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4 text-xs sm:text-sm">
                <span className="text-[#00ff00] font-semibold">nird@village</span>
                <span className="text-gray-500">:</span>
                <span className="text-[#00d9ff]">~</span>
                <span className="text-gray-500">$</span>
              </div>
              
              {/* Task Description */}
              <div className="mb-3 sm:mb-4">
                <p className="text-white text-xs sm:text-sm md:text-base mb-1 sm:mb-2">
                  <span className="text-[#00d9ff]">[TÂCHE]</span> {currentTaskData.description}
                </p>
              </div>

              {/* Command Input with Auto-completion */}
              <div className="relative">
                <form onSubmit={handleCommandSubmit} className="flex items-center gap-1 sm:gap-2">
                  <span className="text-[#00ff00] text-xs sm:text-sm md:text-base">$</span>
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={currentCommand}
                      onChange={(e) => setCurrentCommand(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full bg-transparent text-white border-none outline-none focus:ring-0 text-xs sm:text-sm md:text-base placeholder-gray-600"
                      placeholder="Tapez votre commande..."
                      autoFocus
                    />
                    {/* Auto-completion suggestions */}
                    <AnimatePresence>
                      {showAutocomplete && autocompleteSuggestions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-[#1e1e1e] border border-gray-700 rounded-lg shadow-xl z-10 max-h-40 overflow-y-auto"
                        >
                          {autocompleteSuggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setCurrentCommand(suggestion)
                                setShowAutocomplete(false)
                                inputRef.current?.focus()
                              }}
                              className={`w-full text-left px-3 py-2 text-xs sm:text-sm text-gray-300 hover:bg-[#2d2d2d] transition-colors ${
                                idx === selectedSuggestion ? 'bg-[#2d2d2d]' : ''
                              }`}
                            >
                              <span className="text-[#00ff00]">$</span> {suggestion}
                            </button>
                          ))}
                          <div className="px-3 py-1.5 text-xs text-gray-500 border-t border-gray-700">
                            <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">Tab</kbd> pour compléter • <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">↑↓</kbd> pour naviguer • <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">Esc</kbd> pour fermer
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <button
                    type="submit"
                    className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 bg-gradient-to-r from-[#00ff00] to-[#00cc00] hover:from-[#00cc00] hover:to-[#009900] text-black rounded-lg sm:rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg text-xs sm:text-sm whitespace-nowrap"
                  >
                    Exécuter ⚡
                  </button>
                </form>
              </div>

              {/* Command History */}
              {commandHistory.length > 0 && (
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-800">
                  <p className="text-gray-500 text-xs sm:text-sm mb-2">Historique :</p>
                  <div className="space-y-1 max-h-32 sm:max-h-40 overflow-y-auto">
                    {commandHistory.slice(-5).map((cmd, idx) => {
                      // Check if command matches current task command
                      const isCorrect = cmd.trim().toLowerCase() === currentTaskData.command.toLowerCase()
                      // Also check if it matches any previous task command
                      const matchesAnyTask = tasks.some(task => cmd.trim().toLowerCase() === task.command.toLowerCase())
                      const isValid = isCorrect || matchesAnyTask
                      
                      return (
                        <div key={idx} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                          <span className="text-gray-500">$</span>
                          <span className={isValid ? 'text-[#00ff00]' : 'text-[#ff3b30]'}>
                            {cmd}
                          </span>
                          {isValid ? (
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#00ff00] flex-shrink-0" />
                          ) : (
                            <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#ff3b30] flex-shrink-0" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Score and Completion */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mt-3 sm:mt-4 md:mt-6">
        <div className="text-sm sm:text-base md:text-lg font-semibold text-white">
          Score : <span className="text-[#00ff00]">{score}</span> points
        </div>
        {completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-[#00ff00] font-semibold text-sm sm:text-base"
          >
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
            <span className="text-xs sm:text-sm md:text-base">Excellent ! Vous maîtrisez les bases de Linux !</span>
          </motion.div>
        )}
      </div>
    </div>
  )
}
