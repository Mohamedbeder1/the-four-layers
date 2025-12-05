'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, RotateCcw, Lightbulb } from 'lucide-react'

interface DragItem {
  id: string
  text: string
  category: string
  isCorrect?: boolean
}

interface DragDropGameProps {
  ageGroup: string
  level: string
  buildingId: string
  onComplete: (points: number) => void
}

export default function DragDropGame({ ageGroup, level, buildingId, onComplete }: DragDropGameProps) {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null)
  const [droppedItems, setDroppedItems] = useState<Record<string, DragItem[]>>({})
  const [showHint, setShowHint] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [score, setScore] = useState(0)

  // Different content based on age group, level, and building
  const getGameContent = () => {
    // Salle info (lab): focus on Linux, NIRD Linux, PrimTux and educational software
    if (buildingId === 'lab') {
      if (ageGroup === 'junior' && level === 'beginner') {
        return {
          title: 'Salle info : PC scolaire libre',
          description: 'Glisse les bons éléments pour construire un PC scolaire NIRD Linux / PrimTux',
          items: [
            { id: '1', text: 'PrimTux', category: 'Distribution pour l’école primaire', isCorrect: true },
            { id: '2', text: 'Linux NIRD', category: 'Distribution pour le secondaire', isCorrect: true },
            { id: '3', text: 'Windows 11 Éducation', category: 'Distribution pour le secondaire', isCorrect: false },
            { id: '4', text: 'GCompris', category: 'Logiciels éducatifs libres', isCorrect: true },
            { id: '5', text: 'Childsplay', category: 'Logiciels éducatifs libres', isCorrect: true },
            { id: '6', text: 'LibreOffice', category: 'Logiciels éducatifs libres', isCorrect: true },
            { id: '7', text: 'Suite propriétaire payante', category: 'Logiciels éducatifs libres', isCorrect: false },
          ],
          categories: [
            'Distribution pour l’école primaire',
            'Distribution pour le secondaire',
            'Logiciels éducatifs libres',
          ],
          hint: 'PrimTux et Linux NIRD sont des distributions éducatives libres, avec GCompris, LibreOffice et d’autres outils déjà installés.'
        }
      }
      if (ageGroup === 'senior' && level === 'beginner') {
        return {
          title: 'Salle info',
          description: 'Classe les logiciels',
          items: [
            { id: '1', text: 'Linux NIRD', category: 'Gratuit', isCorrect: true },
            { id: '2', text: 'LibreOffice', category: 'Gratuit', isCorrect: true },
            { id: '3', text: 'Windows', category: 'Payant', isCorrect: true },
            { id: '4', text: 'Microsoft Office', category: 'Payant', isCorrect: true },
          ],
          categories: ['Gratuit', 'Payant'],
          hint: 'Linux NIRD et LibreOffice sont gratuits !'
        }
      }
    }

    // Mairie : budget, licences, solutions libres
    if (buildingId === 'cityhall') {
      if (ageGroup === 'senior' && level === 'beginner') {
        return {
          title: 'Mairie : Budget',
          description: 'Classe selon le coût',
          items: [
            { id: '1', text: 'PrimTux', category: 'Gratuit', isCorrect: true },
            { id: '2', text: 'Linux NIRD', category: 'Gratuit', isCorrect: true },
            { id: '3', text: 'Windows', category: 'Payant', isCorrect: true },
            { id: '4', text: 'Microsoft Office', category: 'Payant', isCorrect: true },
          ],
          categories: ['Gratuit', 'Payant'],
          hint: 'Linux et PrimTux sont gratuits !'
        }
      }
      if (ageGroup === 'junior' && level === 'advanced') {
        return {
          title: 'Mairie : stratégie numérique durable',
          description: 'Classe les décisions selon leur impact sur la souveraineté numérique',
          items: [
            { id: '1', text: 'Migrer vers Linux NIRD pour toute la mairie', category: 'Souveraineté numérique', isCorrect: true },
            { id: '2', text: 'Former les agents aux logiciels libres', category: 'Souveraineté numérique', isCorrect: true },
            { id: '3', text: 'Utiliser des serveurs locaux plutôt que le cloud', category: 'Souveraineté numérique', isCorrect: true },
            { id: '4', text: 'Renouveler les licences propriétaires chaque année', category: 'Dépendance technologique', isCorrect: true },
            { id: '5', text: 'Stocker toutes les données sur des serveurs étrangers', category: 'Dépendance technologique', isCorrect: true },
            { id: '6', text: 'Adopter des formats ouverts (ODF, PDF)', category: 'Souveraineté numérique', isCorrect: true },
          ],
          categories: ['Souveraineté numérique', 'Dépendance technologique'],
          hint: 'La souveraineté numérique passe par l\'autonomie et le contrôle de ses données et outils.'
        }
      }
      if (ageGroup === 'senior' && level === 'advanced') {
        return {
          title: 'Mairie : Stratégie',
          description: 'Classe selon le coût',
          items: [
            { id: '1', text: 'Migrer vers Linux', category: 'Investissement durable', isCorrect: true },
            { id: '2', text: 'Former aux logiciels libres', category: 'Investissement durable', isCorrect: true },
            { id: '3', text: 'Acheter des licences', category: 'Coût élevé', isCorrect: true },
            { id: '4', text: 'Payer des abonnements', category: 'Coût élevé', isCorrect: true },
          ],
          categories: ['Investissement durable', 'Coût élevé'],
          hint: 'Linux et les logiciels libres sont durables !'
        }
      }
    }

    // Bibliothèque : ressources éducatives libres, OER, wikis hors-ligne (inspiré de Labdoo, GCompris, Kiwix, etc. [Labdoo educational software](https://platform.labdoo.org/content/educational-software))
    if (buildingId === 'library') {
      if (ageGroup === 'junior' && level === 'beginner') {
        return {
          title: 'Bibliothèque : ressources libres',
          description: 'Classe les ressources entre libres et propriétaires',
          items: [
            { id: '1', text: 'GCompris', category: 'Ressources libres', isCorrect: true },
            { id: '2', text: 'Childsplay', category: 'Ressources libres', isCorrect: true },
            { id: '3', text: 'Kolibri', category: 'Ressources libres', isCorrect: true },
            { id: '4', text: 'Kiwix (Wikipedia hors-ligne)', category: 'Ressources libres', isCorrect: true },
            { id: '5', text: 'Plateforme éducative propriétaire', category: 'Ressources propriétaires', isCorrect: true },
            { id: '6', text: 'Abonnement payant à un service en ligne', category: 'Ressources propriétaires', isCorrect: true },
          ],
          categories: ['Ressources libres', 'Ressources propriétaires'],
          hint: 'Les ressources libres (GCompris, Kiwix, Kolibri) peuvent être utilisées sans abonnement et même hors-ligne.'
        }
      }
      if (ageGroup === 'senior' && level === 'beginner') {
        return {
          title: 'Bibliothèque',
          description: 'Classe les ressources',
          items: [
            { id: '1', text: 'Kiwix', category: 'Gratuit', isCorrect: true },
            { id: '2', text: 'GCompris', category: 'Gratuit', isCorrect: true },
            { id: '3', text: 'Google Classroom', category: 'Payant', isCorrect: true },
            { id: '4', text: 'Microsoft Teams', category: 'Payant', isCorrect: true },
          ],
          categories: ['Gratuit', 'Payant'],
          hint: 'Kiwix et GCompris sont gratuits !'
        }
      }
      if (ageGroup === 'junior' && level === 'advanced') {
        return {
          title: 'Bibliothèque : plateformes d\'apprentissage',
          description: 'Classe les plateformes selon leur modèle (libre ou propriétaire)',
          items: [
            { id: '1', text: 'Moodle', category: 'Plateforme libre', isCorrect: true },
            { id: '2', text: 'Kolibri', category: 'Plateforme libre', isCorrect: true },
            { id: '3', text: 'OpenBoard', category: 'Plateforme libre', isCorrect: true },
            { id: '4', text: 'Google Classroom', category: 'Plateforme propriétaire', isCorrect: true },
            { id: '5', text: 'Microsoft Teams Éducation', category: 'Plateforme propriétaire', isCorrect: true },
            { id: '6', text: 'Canvas LMS', category: 'Plateforme propriétaire', isCorrect: true },
          ],
          categories: ['Plateforme libre', 'Plateforme propriétaire'],
          hint: 'Les plateformes libres comme Moodle et Kolibri vous donnent le contrôle de vos données et ne nécessitent pas d\'abonnement.'
        }
      }
      if (ageGroup === 'senior' && level === 'advanced') {
        return {
          title: 'Bibliothèque',
          description: 'Classe les ressources',
          items: [
            { id: '1', text: 'Kiwix', category: 'Libre', isCorrect: true },
            { id: '2', text: 'Moodle', category: 'Libre', isCorrect: true },
            { id: '3', text: 'Google Classroom', category: 'Propriétaire', isCorrect: true },
            { id: '4', text: 'Microsoft Teams', category: 'Propriétaire', isCorrect: true },
          ],
          categories: ['Libre', 'Propriétaire'],
          hint: 'Kiwix et Moodle sont libres !'
        }
      }
    }

    // Coin éco : sobriété numérique, matériel reconditionné
    if (buildingId === 'eco') {
      if (ageGroup === 'junior' && level === 'beginner') {
        return {
          title: 'Coin Éco : gestes numériques responsables',
          description: 'Associe les bonnes pratiques à la bonne catégorie',
          items: [
            { id: '1', text: 'Réutiliser un vieux PC avec Linux NIRD', category: 'Bon geste NIRD', isCorrect: true },
            { id: '2', text: 'Installer PrimTux sur des PC reconditionnés', category: 'Bon geste NIRD', isCorrect: true },
            { id: '3', text: 'Allumer tous les écrans pour décorer la classe', category: 'Mauvaise pratique', isCorrect: true },
            { id: '4', text: 'Acheter des PC neufs tous les 3 ans', category: 'Mauvaise pratique', isCorrect: true },
            { id: '5', text: 'Éteindre les PC après usage', category: 'Bon geste NIRD', isCorrect: true },
          ],
          categories: ['Bon geste NIRD', 'Mauvaise pratique'],
          hint: 'La démarche NIRD privilégie le reconditionnement, l\'extinction des machines inutilisées et les distributions libres adaptées.'
        }
      }
      if (ageGroup === 'senior' && level === 'beginner') {
        return {
          title: 'Coin Éco',
          description: 'Classe les actions',
          items: [
            { id: '1', text: 'Réutiliser un vieux PC', category: 'Bon geste', isCorrect: true },
            { id: '2', text: 'Éteindre le PC', category: 'Bon geste', isCorrect: true },
            { id: '3', text: 'Laisser le PC allumé', category: 'Mauvais geste', isCorrect: true },
            { id: '4', text: 'Jeter un PC qui marche', category: 'Mauvais geste', isCorrect: true },
          ],
          categories: ['Bon geste', 'Mauvais geste'],
          hint: 'Réutiliser et éteindre, c\'est bien !'
        }
      }
      if (ageGroup === 'junior' && level === 'advanced') {
        return {
          title: 'Coin Éco : cycle de vie du matériel',
          description: 'Classe les actions selon leur impact sur le cycle de vie des équipements',
          items: [
            { id: '1', text: 'Reconditionner des PC avec Linux NIRD', category: 'Prolongation de vie', isCorrect: true },
            { id: '2', text: 'Réparer plutôt que remplacer', category: 'Prolongation de vie', isCorrect: true },
            { id: '3', text: 'Jeter un PC fonctionnel pour un modèle plus récent', category: 'Obsolescence programmée', isCorrect: true },
            { id: '4', text: 'Changer d\'ordinateur tous les 2 ans', category: 'Obsolescence programmée', isCorrect: true },
            { id: '5', text: 'Utiliser PrimTux sur du matériel ancien', category: 'Prolongation de vie', isCorrect: true },
            { id: '6', text: 'Acheter du matériel neuf sans vérifier la réparation', category: 'Obsolescence programmée', isCorrect: true },
          ],
          categories: ['Prolongation de vie', 'Obsolescence programmée'],
          hint: 'La démarche NIRD encourage la réparation et le reconditionnement pour réduire les déchets électroniques.'
        }
      }
      if (ageGroup === 'senior' && level === 'advanced') {
        return {
          title: 'Coin Éco',
          description: 'Classe les actions',
          items: [
            { id: '1', text: 'Installer Linux sur vieux PC', category: 'Écologique', isCorrect: true },
            { id: '2', text: 'Utiliser Kiwix hors-ligne', category: 'Écologique', isCorrect: true },
            { id: '3', text: 'Tout stocker sur le cloud', category: 'Polluant', isCorrect: true },
            { id: '4', text: 'Changer de PC souvent', category: 'Polluant', isCorrect: true },
          ],
          categories: ['Écologique', 'Polluant'],
          hint: 'Linux et Kiwix sont écologiques !'
        }
      }
    }

    // Default content if nothing matches
    // Default fallback
    return {
      title: 'Jeu de glisser-déposer',
      description: 'Organisez les éléments',
      items: [],
      categories: [],
      hint: 'Glissez les éléments dans les bonnes catégories'
    }
  }

  const gameContent = getGameContent()
  const availableItems = gameContent.items.filter(item => 
    !Object.values(droppedItems).flat().some(dropped => dropped?.id === item.id)
  )

  const handleDragStart = (item: DragItem) => {
    setDraggedItem(item)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (category: string) => {
    if (!draggedItem) return

    const item = gameContent.items.find(i => i.id === draggedItem.id)
    if (!item) return

    const isCorrect = item.category === category
    
    setDroppedItems(prev => {
      const categoryItems = prev[category] || []
      const updated = { ...prev, [category]: [...categoryItems, draggedItem] }
      
      // Check if all items are placed (after state update)
      const allPlaced = gameContent.items.every(gameItem => 
        Object.values(updated).flat().some(dropped => dropped?.id === gameItem.id)
      )
      
      // Complete when all items are placed
      if (allPlaced) {
        setCompleted(true)
        const finalScore = score + (isCorrect ? 10 : -5)
        setTimeout(() => onComplete(finalScore), 500)
      }
      
      return updated
    })
    
    if (isCorrect) {
      setScore(prev => prev + 10)
    } else {
      setScore(prev => Math.max(0, prev - 5))
    }

    setDraggedItem(null)
  }

  const handleReset = () => {
    setDroppedItems({})
    setScore(0)
    setCompleted(false)
    setShowHint(false)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-4 md:p-6 bg-white rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
            {gameContent.title}
          </h3>
          <p className="text-sm sm:text-base text-gray-600">{gameContent.description}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
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
          className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
        >
          <p className="text-sm text-yellow-800">
            💡 {gameContent.hint}
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Available Items */}
        <div className="space-y-2 sm:space-y-4">
          <h4 className="text-sm sm:text-base font-semibold text-gray-900">Éléments à placer :</h4>
          <div className="min-h-[150px] sm:min-h-[200px] p-3 sm:p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            {availableItems.length === 0 ? (
              <p className="text-center text-gray-400 py-8">
                Tous les éléments ont été placés !
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableItems.map((item) => (
                  <motion.div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(item)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-move shadow-md hover:bg-blue-500 transition-colors"
                  >
                    <span className="font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Drop Zones */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Catégories :</h4>
          {gameContent.categories.map((category) => {
            const droppedInCategory = droppedItems[category] || []
            const hasItems = droppedInCategory.length > 0
            const allCorrect = hasItems && droppedInCategory.every(dropped => {
              const item = gameContent.items.find(i => i.id === dropped.id)
              return item?.category === category
            })

            return (
              <div
                key={category}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(category)}
                className={`min-h-[80px] p-4 rounded-lg border-2 transition-all ${
                  hasItems
                    ? allCorrect
                      ? 'bg-green-50 border-green-500'
                      : 'bg-red-50 border-red-500'
                    : 'bg-gray-50 border-dashed border-gray-300 hover:border-blue-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{category}</span>
                  {hasItems && (
                    allCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )
                  )}
                </div>
                {hasItems ? (
                  <div className="flex flex-wrap gap-2">
                    {droppedInCategory.map((dropped) => {
                      const item = gameContent.items.find(i => i.id === dropped.id)
                      const isCorrect = item?.category === category
                      return (
                        <motion.div
                          key={dropped.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            isCorrect 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {dropped.text}
                        </motion.div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 mt-2">
                    Glissez un élément ici
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-lg font-semibold text-gray-900">
          Score : <span className="text-blue-600">{score}</span> points
        </div>
        {completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-green-600 font-semibold"
          >
            <CheckCircle className="w-6 h-6" />
            <span>Bravo ! Activité terminée !</span>
          </motion.div>
        )}
      </div>
    </div>
  )
}

