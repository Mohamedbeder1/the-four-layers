'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Lightbulb, RotateCcw, Sparkles } from 'lucide-react'

interface BubbleItem {
  id: string
  text: string
  category: 'opensource' | 'bigtech'
  description?: string
}

interface BubbleGameProps {
  ageGroup: string
  level: string
  buildingId: string
  onComplete: (points: number) => void
}

export default function BubbleGame({ ageGroup, level, buildingId, onComplete }: BubbleGameProps) {
  const [items, setItems] = useState<BubbleItem[]>([])
  const [opensourceBubble, setOpensourceBubble] = useState<BubbleItem[]>([])
  const [bigtechBubble, setBigtechBubble] = useState<BubbleItem[]>([])
  const [showHint, setShowHint] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [exploded, setExploded] = useState(false)

  const getGameContent = (): { title: string; description: string; items: BubbleItem[]; hint: string } | null => {
    // Different content based on building and age
    if (buildingId === 'lab') {
      if (ageGroup === 'junior') {
        return {
          title: 'Gratuit ou Payant ?',
          description: 'Glisse dans la bonne bulle',
          items: [
            { id: '1', text: 'PrimTux', category: 'opensource', description: 'Gratuit' },
            { id: '2', text: 'LibreOffice', category: 'opensource', description: 'Gratuit' },
            { id: '3', text: 'Windows', category: 'bigtech', description: 'Payant' },
            { id: '4', text: 'Microsoft Office', category: 'bigtech', description: 'Payant' },
          ],
          hint: 'PrimTux et LibreOffice sont gratuits !'
        }
      } else if (ageGroup === 'senior') {
        return {
          title: 'Libre ou Propriétaire ?',
          description: 'Glisse dans la bonne bulle',
          items: [
            { id: '1', text: 'Linux', category: 'opensource', description: 'Libre' },
            { id: '2', text: 'Firefox', category: 'opensource', description: 'Libre' },
            { id: '3', text: 'Chrome', category: 'bigtech', description: 'Propriétaire' },
            { id: '4', text: 'Safari', category: 'bigtech', description: 'Propriétaire' },
          ],
          hint: 'Linux et Firefox sont des logiciels libres !'
        }
      }
    } else if (buildingId === 'library') {
      if (ageGroup === 'junior') {
        return {
          title: 'Gratuit ou Payant ?',
          description: 'Glisse dans la bonne bulle',
          items: [
            { id: '1', text: 'Kiwix', category: 'opensource', description: 'Gratuit' },
            { id: '2', text: 'GCompris', category: 'opensource', description: 'Gratuit' },
            { id: '3', text: 'Google Classroom', category: 'bigtech', description: 'Payant' },
            { id: '4', text: 'Microsoft Teams', category: 'bigtech', description: 'Payant' },
          ],
          hint: 'Kiwix et GCompris sont gratuits !'
        }
      } else if (ageGroup === 'senior') {
        return {
          title: 'Libre ou Propriétaire ?',
          description: 'Glisse dans la bonne bulle',
          items: [
            { id: '1', text: 'Wikipedia', category: 'opensource', description: 'Libre' },
            { id: '2', text: 'Moodle', category: 'opensource', description: 'Libre' },
            { id: '3', text: 'Google Docs', category: 'bigtech', description: 'Propriétaire' },
            { id: '4', text: 'Microsoft 365', category: 'bigtech', description: 'Propriétaire' },
          ],
          hint: 'Wikipedia et Moodle sont des plateformes libres !'
        }
      }
    } else if (buildingId === 'cityhall') {
      if (ageGroup === 'junior') {
        return {
          title: 'Gratuit ou Payant ?',
          description: 'Glisse dans la bonne bulle',
          items: [
            { id: '1', text: 'PrimTux', category: 'opensource', description: 'Gratuit' },
            { id: '2', text: 'LibreOffice', category: 'opensource', description: 'Gratuit' },
            { id: '3', text: 'Windows', category: 'bigtech', description: 'Payant' },
            { id: '4', text: 'Office 365', category: 'bigtech', description: 'Payant' },
          ],
          hint: 'PrimTux et LibreOffice ne coûtent rien !'
        }
      } else if (ageGroup === 'senior') {
        return {
          title: 'Libre ou Propriétaire ?',
          description: 'Glisse dans la bonne bulle',
          items: [
            { id: '1', text: 'Nextcloud', category: 'opensource', description: 'Libre' },
            { id: '2', text: 'Peertube', category: 'opensource', description: 'Libre' },
            { id: '3', text: 'Google Drive', category: 'bigtech', description: 'Propriétaire' },
            { id: '4', text: 'Dropbox', category: 'bigtech', description: 'Propriétaire' },
          ],
          hint: 'Nextcloud et Peertube sont des alternatives libres !'
        }
      }
    } else if (buildingId === 'eco') {
      if (ageGroup === 'junior') {
        return {
          title: 'Bon ou Mauvais geste ?',
          description: 'Glisse dans la bonne bulle',
          items: [
            { id: '1', text: 'Réutiliser un vieux PC', category: 'opensource', description: 'Bon pour la planète' },
            { id: '2', text: 'Éteindre le PC après usage', category: 'opensource', description: 'Économise l\'énergie' },
            { id: '3', text: 'Laisser le PC allumé la nuit', category: 'bigtech', description: 'Gaspille de l\'énergie' },
            { id: '4', text: 'Jeter un PC qui marche', category: 'bigtech', description: 'Mauvais pour la planète' },
          ],
          hint: 'Les solutions libres aident à protéger la planète !'
        }
      } else if (ageGroup === 'senior') {
        return {
          title: 'Écologique ou Pas ?',
          description: 'Glisse dans la bonne bulle',
          items: [
            { id: '1', text: 'Reconditionner du matériel', category: 'opensource', description: 'Écologique' },
            { id: '2', text: 'Utiliser des serveurs locaux', category: 'opensource', description: 'Écologique' },
            { id: '3', text: 'Acheter du neuf systématiquement', category: 'bigtech', description: 'Pas écologique' },
            { id: '4', text: 'Tout stocker dans le cloud', category: 'bigtech', description: 'Pas écologique' },
          ],
          hint: 'Le reconditionnement et les serveurs locaux sont plus écologiques !'
        }
      }
    }
    return null
  }

  const gameContent = getGameContent()
  
  useEffect(() => {
    if (gameContent) {
      setItems([...gameContent.items].sort(() => Math.random() - 0.5))
    }
  }, [buildingId, ageGroup, level])

  const handleDragStart = (e: React.DragEvent, item: BubbleItem) => {
    e.dataTransfer.setData('item', JSON.stringify(item))
  }

  const handleDrop = (e: React.DragEvent, targetBubble: 'opensource' | 'bigtech') => {
    e.preventDefault()
    const itemData = e.dataTransfer.getData('item')
    if (!itemData) return

    const item: BubbleItem = JSON.parse(itemData)
    const isCorrect = item.category === targetBubble

    // Remove from items
    setItems(prev => prev.filter(i => i.id !== item.id))
    
    // Add to correct bubble
    if (targetBubble === 'opensource') {
      setOpensourceBubble(prev => [...prev, item])
    } else {
      setBigtechBubble(prev => [...prev, item])
    }

    if (isCorrect) {
      setScore(prev => prev + 15)
    } else {
      setScore(prev => Math.max(0, prev - 10))
    }

    // Check if all items are placed correctly
    setTimeout(() => {
      const newOpensourceBubble = targetBubble === 'opensource' ? [...opensourceBubble, item] : opensourceBubble
      const newBigtechBubble = targetBubble === 'bigtech' ? [...bigtechBubble, item] : bigtechBubble
      const remainingItems = items.filter(i => i.id !== item.id)
      
      const allOpensourcePlaced = gameContent!.items
        .filter(i => i.category === 'opensource')
        .every(i => newOpensourceBubble.some(b => b.id === i.id))
      
      const allBigtechPlaced = gameContent!.items
        .filter(i => i.category === 'bigtech')
        .every(i => newBigtechBubble.some(b => b.id === i.id))

      const allCorrect = newOpensourceBubble.every(i => i.category === 'opensource') &&
                        newBigtechBubble.every(i => i.category === 'bigtech')

      if (remainingItems.length === 0 && allOpensourcePlaced && allBigtechPlaced && allCorrect) {
        setCompleted(true)
        setExploded(true)
        setTimeout(() => onComplete(score + (isCorrect ? 15 : -10)), 500)
      }
    }, 100)
  }

  const handleReset = () => {
    if (gameContent) {
      setItems([...gameContent.items].sort(() => Math.random() - 0.5))
    }
    setOpensourceBubble([])
    setBigtechBubble([])
    setScore(0)
    setCompleted(false)
    setExploded(false)
    setShowHint(false)
  }

  if (!gameContent) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <p className="text-center text-gray-600">
          Contenu en préparation pour ce bâtiment...
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {gameContent.title}
          </h3>
          <p className="text-gray-600">{gameContent.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="p-2 bg-yellow-100 rounded-lg hover:bg-yellow-200 transition-colors"
            title="Aide"
          >
            <Lightbulb className="w-5 h-5 text-yellow-600" />
          </button>
          <button
            onClick={handleReset}
            className="p-2.5 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all hover:scale-110 active:scale-95 shadow-sm"
            title="Recommencer"
          >
            <RotateCcw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {showHint && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
        >
          <p className="text-sm text-yellow-800">
            💡 {gameContent.hint}
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Available Items */}
        <div className="space-y-2 sm:space-y-4 order-1 md:order-none">
          <h4 className="text-sm sm:text-base font-semibold text-gray-900 text-center">
            Éléments à trier ({items.length})
          </h4>
          <div className="min-h-[200px] sm:min-h-[300px] md:min-h-[400px] p-3 sm:p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            {items.length === 0 ? (
              <p className="text-center text-gray-400 py-8">
                Tous les éléments ont été triés !
              </p>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e as any as React.DragEvent, item)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg cursor-move shadow-md hover:bg-blue-500 transition-colors"
                  >
                    <div className="font-medium">{item.text}</div>
                    {item.description && (
                      <div className="text-xs mt-1 text-blue-50">{item.description}</div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Open Source Bubble */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, 'opensource')}
          className="space-y-2 sm:space-y-4 order-2 md:order-none"
        >
          <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
            <h4 className="text-sm sm:text-base font-semibold text-gray-900 text-center">
              Bulle Libre & Open Source
            </h4>
          </div>
          <motion.div
            className={`min-h-[200px] sm:min-h-[300px] md:min-h-[400px] p-3 sm:p-4 rounded-lg border-2 sm:border-4 transition-all ${
              completed && !exploded
                ? 'bg-green-100 dark:bg-green-900/30 border-green-500 shadow-lg shadow-green-500/50'
                : 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 border-dashed'
            }`}
            animate={completed && !exploded ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {opensourceBubble.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">
                Glissez les solutions libres ici
              </p>
            ) : (
              <div className="space-y-2">
                {opensourceBubble.map((item) => {
                  const isCorrect = item.category === 'opensource'
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        isCorrect
                          ? 'bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100'
                          : 'bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.text}</span>
                        {isCorrect ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* Big Tech Bubble */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, 'bigtech')}
          className="space-y-2 sm:space-y-4 order-3 md:order-none"
        >
          <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
            <h4 className="text-sm sm:text-base font-semibold text-gray-900 text-center">
              Bulle Big Tech
            </h4>
          </div>
          <motion.div
            className={`min-h-[200px] sm:min-h-[300px] md:min-h-[400px] p-3 sm:p-4 rounded-lg border-2 sm:border-4 transition-all ${
              exploded
                ? 'bg-red-200 dark:bg-red-900/50 border-red-500'
                : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 border-dashed'
            }`}
            animate={exploded ? {
              scale: [1, 1.2, 0],
              opacity: [1, 0.8, 0],
              rotate: [0, 10, -10, 0]
            } : {}}
            transition={exploded ? { duration: 1 } : {}}
          >
            {exploded ? (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.5, 1] }}
                  className="text-6xl mb-4"
                >
                  💥
                </motion.div>
                <p className="text-lg font-bold text-red-900 dark:text-red-100">
                  La bulle Big Tech a explosé !
                </p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                  Les solutions libres ont gagné ! 🎉
                </p>
              </div>
            ) : bigtechBubble.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">
                Glissez les solutions Big Tech ici
              </p>
            ) : (
              <div className="space-y-2">
                {bigtechBubble.map((item) => {
                  const isCorrect = item.category === 'bigtech'
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        isCorrect
                          ? 'bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100'
                          : 'bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.text}</span>
                        {isCorrect ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-lg font-semibold text-gray-900">
          Score : <span className="text-blue-600">{score}</span> points
        </div>
        {completed && !exploded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold"
          >
            <CheckCircle className="w-6 h-6" />
            <span>Tous les éléments sont bien placés ! La bulle Big Tech va exploser !</span>
          </motion.div>
        )}
      </div>
    </div>
  )
}

