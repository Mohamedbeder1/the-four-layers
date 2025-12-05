'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Lightbulb, RotateCcw } from 'lucide-react'

interface DragItem {
  id: string
  text: string
  category: string
  isCorrect?: boolean
}

interface Question {
  question: string
  options: { text: string; correct: boolean }[]
  hint: string
}

interface DragDropQuestionsProps {
  ageGroup: string
  level: string
  buildingId: string
  onComplete: (points: number) => void
}

export default function DragDropQuestions({ ageGroup, level, buildingId, onComplete }: DragDropQuestionsProps) {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null)
  const [droppedItems, setDroppedItems] = useState<Record<string, DragItem | null>>({})
  const [droppedItemIds, setDroppedItemIds] = useState<Set<string>>(new Set()) // Track all dropped item IDs
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [score, setScore] = useState(0)
  const [phase, setPhase] = useState<'drag' | 'question'>('drag')
  const [completed, setCompleted] = useState(false)
  const [shuffledOptions, setShuffledOptions] = useState<{ text: string; correct: boolean }[][]>([])

  // Shuffle array helper
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const getContent = () => {
    // Mairie : budget, licences, solutions libres
    if (buildingId === 'cityhall') {
      if (ageGroup === 'junior' && level === 'intermediate') {
        return {
          dragItems: [
            { id: '1', text: 'PrimTux', category: 'Gratuit', isCorrect: true },
            { id: '2', text: 'Windows', category: 'Payant', isCorrect: true },
            { id: '3', text: 'LibreOffice', category: 'Gratuit', isCorrect: true },
          ],
          categories: ['Gratuit', 'Payant'],
          questions: [
            {
              question: 'PrimTux est gratuit ?',
              options: [
                { text: 'Oui ✓', correct: true },
                { text: 'Non ✗', correct: false }
              ],
              hint: 'PrimTux est gratuit !'
            }
          ]
        }
      }
      if (ageGroup === 'senior' && level === 'intermediate') {
        return {
          dragItems: [
            { id: '1', text: 'Reconditionner avec Linux', category: 'Durable', isCorrect: true },
            { id: '2', text: 'Acheter du neuf', category: 'Coûteux', isCorrect: true },
            { id: '3', text: 'Former au libre', category: 'Durable', isCorrect: true },
          ],
          categories: ['Durable', 'Coûteux'],
          questions: [
            {
              question: 'Former à Linux, c\'est utile ?',
              options: [
                { text: 'Oui ✓', correct: true },
                { text: 'Non ✗', correct: false }
              ],
              hint: 'Former rend autonome !'
            }
          ]
        }
      }
      if (ageGroup === 'senior' && level === 'advanced') {
        return {
          dragItems: [
            { id: '1', text: 'Migrer vers Linux', category: 'Autonomie', isCorrect: true },
            { id: '2', text: 'Acheter des licences', category: 'Dépendance', isCorrect: true },
            { id: '3', text: 'Utiliser des logiciels libres', category: 'Autonomie', isCorrect: true },
          ],
          categories: ['Autonomie', 'Dépendance'],
          questions: [
            {
              question: 'Linux donne plus d\'autonomie ?',
              options: [
                { text: 'Oui ✓', correct: true },
                { text: 'Non ✗', correct: false }
              ],
              hint: 'Linux rend autonome !'
            }
          ]
        }
      }
    }

    // Coin éco : sobriété numérique (complément de DragDropGame)
    if (buildingId === 'eco') {
      if (ageGroup === 'junior' && level === 'intermediate') {
        return {
          dragItems: [
            { id: '1', text: 'Réutiliser un vieux PC', category: 'Bon geste', isCorrect: true },
            { id: '2', text: 'Laisser le PC allumé toute la nuit', category: 'Mauvais geste', isCorrect: true },
            { id: '3', text: 'Éteindre le PC après usage', category: 'Bon geste', isCorrect: true },
          ],
          categories: ['Bon geste', 'Mauvais geste'],
          questions: [
            {
              question: 'Réutiliser un vieux PC, c\'est bien ?',
              options: [
                { text: 'Oui ✓', correct: true },
                { text: 'Non ✗', correct: false }
              ],
              hint: 'Réutiliser aide la planète !'
            }
          ]
        }
      }
    }

    // Library building content
    if (buildingId === 'library') {
      if (ageGroup === 'junior' && level === 'intermediate') {
        return {
          dragItems: [
            { id: '1', text: 'GCompris', category: 'Gratuit', isCorrect: true },
            { id: '2', text: 'Kiwix', category: 'Gratuit', isCorrect: true },
            { id: '3', text: 'Google Classroom', category: 'Payant', isCorrect: true },
          ],
          categories: ['Gratuit', 'Payant'],
          questions: [
            {
              question: 'Kiwix marche sans internet ?',
              options: [
                { text: 'Oui ✓', correct: true },
                { text: 'Non ✗', correct: false }
              ],
              hint: 'Kiwix marche sans internet !'
            }
          ]
        }
      }
      if (ageGroup === 'junior' && level === 'advanced') {
        return {
          dragItems: [
            { id: '1', text: 'Moodle', category: 'Plateforme libre', isCorrect: true },
            { id: '2', text: 'Kolibri', category: 'Plateforme libre', isCorrect: true },
            { id: '3', text: 'OpenBoard', category: 'Plateforme libre', isCorrect: true },
            { id: '4', text: 'Google Classroom', category: 'Plateforme propriétaire', isCorrect: true },
            { id: '5', text: 'Microsoft Teams', category: 'Plateforme propriétaire', isCorrect: true },
          ],
          categories: ['Plateforme libre', 'Plateforme propriétaire'],
          questions: [
            {
              question: 'Moodle est gratuit ?',
              options: [
                { text: 'Oui ✓', correct: true },
                { text: 'Non ✗', correct: false }
              ],
              hint: 'Moodle est gratuit !'
            }
          ]
        }
      }
    }

    // Lab building content
    if (buildingId === 'lab') {
      if (ageGroup === 'junior' && level === 'intermediate') {
        return {
          dragItems: [
            { id: '1', text: 'PrimTux', category: 'Gratuit', isCorrect: true },
            { id: '2', text: 'Windows', category: 'Payant', isCorrect: true },
            { id: '3', text: 'LibreOffice', category: 'Gratuit', isCorrect: true },
          ],
          categories: ['Gratuit', 'Payant'],
          questions: [
            {
              question: 'PrimTux est pour les enfants ?',
              options: [
                { text: 'Oui ✓', correct: true },
                { text: 'Non ✗', correct: false }
              ],
              hint: 'PrimTux est fait pour les enfants !'
            }
          ]
        }
      }
    }

    // Fallback: generic free-software content
    if (ageGroup === 'junior') {
      return {
        dragItems: [
          { id: '1', text: 'Linux', category: 'Gratuit', isCorrect: true },
          { id: '2', text: 'Windows', category: 'Payant', isCorrect: true },
          { id: '3', text: 'LibreOffice', category: 'Gratuit', isCorrect: true },
        ],
        categories: ['Gratuit', 'Payant'],
        questions: [
          {
            question: 'Linux est gratuit ?',
            options: [
              { text: 'Oui ✓', correct: true },
              { text: 'Non ✗', correct: false }
            ],
            hint: 'Linux est gratuit !'
          },
          {
            question: 'Les logiciels libres sont gratuits ?',
            options: [
              { text: 'Oui ✓', correct: true },
              { text: 'Non ✗', correct: false }
            ],
            hint: 'Les logiciels libres sont gratuits !'
          }
        ]
      }
    } else if (ageGroup === 'senior') {
      return {
        dragItems: [
          { id: '1', text: 'Linux', category: 'Gratuit', isCorrect: true },
          { id: '2', text: 'Windows', category: 'Payant', isCorrect: true },
          { id: '3', text: 'LibreOffice', category: 'Gratuit', isCorrect: true },
        ],
        categories: ['Gratuit', 'Payant'],
        questions: [
          {
            question: 'Linux est gratuit ?',
            options: [
              { text: 'Oui ✓', correct: true },
              { text: 'Non ✗', correct: false }
            ],
            hint: 'Linux est gratuit !'
          }
        ]
      }
    }
    return { dragItems: [], categories: [], questions: [] }
  }

  const content = getContent()
  const availableItems = content.dragItems.filter(item => 
    !droppedItemIds.has(item.id)
  )

  const handleDragStart = (item: DragItem) => {
    setDraggedItem(item)
  }

  const handleDrop = (category: string) => {
    if (!draggedItem) return
    const item = content.dragItems.find(i => i.id === draggedItem.id)
    if (!item) return

    const isCorrect = item.category === category
    
    // Track dropped item ID
    setDroppedItemIds(prev => {
      const updated = new Set(prev)
      updated.add(draggedItem.id)
      
      // Check if all items are placed
      const allPlaced = content.dragItems.every(dragItem => updated.has(dragItem.id))
      
      // Move to question phase when all items are placed
      if (allPlaced && content.questions.length > 0) {
        setTimeout(() => {
          // Shuffle all question options
          const shuffled = content.questions.map(q => shuffleArray(q.options))
          setShuffledOptions(shuffled)
          setPhase('question')
        }, 1000)
      } else if (allPlaced && content.questions.length === 0) {
        // No questions, complete immediately - use functional update to get latest score
        setTimeout(() => {
          setCompleted(true)
          setScore(currentScore => {
            const finalScore = currentScore + (isCorrect ? 10 : -5)
            setTimeout(() => onComplete(finalScore), 1000)
            return finalScore
          })
        }, 1000)
      }
      
      return updated
    })
    
    // Update dropped items for display (can have multiple items per category)
    setDroppedItems(prev => ({ ...prev, [`${category}-${draggedItem.id}`]: draggedItem }))
    
    // Award points immediately when dropped correctly
    if (isCorrect) {
      setScore(prev => prev + 10)
    } else {
      setScore(prev => Math.max(0, prev - 5))
    }

    setDraggedItem(null)
  }

  const handleQuestionAnswer = (optionIndex: number) => {
    if (selectedAnswer !== null) return
    
    // Safety check: ensure we have questions and currentQuestion is valid
    if (!content.questions || content.questions.length === 0 || currentQuestion >= content.questions.length) {
      // No questions or out of bounds, complete immediately
      setCompleted(true)
      setTimeout(() => onComplete(score), 1000)
      return
    }
    
    setSelectedAnswer(optionIndex)
    const question = content.questions[currentQuestion]
    if (!question) {
      // Question doesn't exist, complete immediately
      setCompleted(true)
      setTimeout(() => onComplete(score), 1000)
      return
    }
    
    // Check the shuffled options, not the original
    const displayedOptions = shuffledOptions[currentQuestion] || question.options
    const isCorrect = displayedOptions[optionIndex].correct

    if (isCorrect) {
      const pointsToAdd = 15
      const newScore = score + pointsToAdd
      setScore(newScore)
      
      // Check if this was the last question
      if (currentQuestion >= content.questions.length - 1) {
        // Last question - complete immediately
        setCompleted(true)
        setTimeout(() => {
          onComplete(newScore)
        }, 500)
            } else {
        // More questions - move to next after delay
              setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1)
          setSelectedAnswer(null)
        }, 1000)
      }
    } else {
      setScore(prev => Math.max(0, prev - 5))
    }
  }

  const handleReset = () => {
    setDroppedItems({})
    setDroppedItemIds(new Set())
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setPhase('drag')
    setCompleted(false)
    setShowHint(false)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-4 md:p-6 bg-white rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
            {phase === 'drag' ? 'Organisez les éléments' : 'Répondez aux questions'}
          </h3>
          <p className="text-sm sm:text-base text-gray-600">
            {phase === 'drag' 
              ? 'Glissez les éléments dans les bonnes catégories, puis répondez aux questions'
              : content.questions && content.questions.length > 0
                ? `Question ${Math.min(currentQuestion + 1, content.questions.length)} / ${content.questions.length}`
                : 'Aucune question disponible'
            }
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowHint(!showHint)}
            className="p-2 bg-yellow-100 rounded-lg hover:bg-yellow-200"
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

      {phase === 'drag' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2 sm:space-y-4">
            <h4 className="text-sm sm:text-base font-semibold text-gray-900">Éléments :</h4>
            <div className="min-h-[150px] sm:min-h-[200px] p-3 sm:p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              {availableItems.length === 0 ? (
                <p className="text-center text-gray-400 py-8">Tous placés !</p>
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
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Catégories :</h4>
            {content.categories.map((category) => {
              // Get all items dropped in this category
              const droppedInCategory = Object.entries(droppedItems)
                .filter(([key]) => key.startsWith(`${category}-`))
                .map(([, item]) => item)
                .filter(Boolean) as DragItem[]
              
              const hasItems = droppedInCategory.length > 0
              const allCorrect = droppedInCategory.every(item => {
                const originalItem = content.dragItems.find(i => i.id === item.id)
                return originalItem?.category === category
              })

              return (
                <div
                  key={category}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(category)}
                  className={`min-h-[80px] p-4 rounded-lg border-2 ${
                    hasItems
                      ? allCorrect 
                        ? 'bg-green-100 border-green-500 shadow-lg' 
                        : 'bg-gray-100 border-gray-400'
                      : 'bg-gray-50 border-dashed border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{category}</span>
                    {hasItems && allCorrect && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <span className="text-green-600 font-bold text-xl">✓</span>
                      </div>
                    )}
                  </div>
                  {droppedInCategory.length > 0 && (
                    <div className="space-y-2">
                      {droppedInCategory.map((dropped) => {
                        const item = content.dragItems.find(i => i.id === dropped.id)
                        const isCorrect = item?.category === category
                        return (
                          <div key={dropped.id} className={`px-3 py-2 rounded text-sm font-medium flex items-center justify-between ${
                            isCorrect 
                              ? 'bg-green-200 text-gray-900' 
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            <span>{dropped.text}</span>
                            {isCorrect && <span className="text-green-600 font-bold">✓</span>}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {content.questions && content.questions.length > 0 && currentQuestion < content.questions.length ? (
            <>
              {showHint && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    💡 {content.questions[currentQuestion].hint}
                  </p>
                </div>
              )}
              <p className="text-lg font-semibold text-gray-900 mb-4">
                {content.questions[currentQuestion].question}
              </p>
              <div className="space-y-3">
                {(shuffledOptions[currentQuestion] || content.questions[currentQuestion].options).map((option, idx) => {
              const isSelected = selectedAnswer === idx
              const isCorrect = option.correct
              const showResult = selectedAnswer !== null

              return (
                <button
                  key={idx}
                  onClick={() => handleQuestionAnswer(idx)}
                  disabled={selectedAnswer !== null}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
                    showResult
                      ? isCorrect
                        ? 'bg-green-100 border-green-500 text-gray-900 shadow-lg'
                        : isSelected
                        ? 'bg-gray-100 border-gray-400 text-gray-600'
                        : 'border-gray-300 opacity-50 text-gray-600'
                      : 'border-gray-300 hover:border-blue-500 hover:shadow-md text-gray-900 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-base">{option.text}</span>
                    {showResult && isCorrect && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <span className="text-green-600 font-bold text-lg">✓</span>
                      </div>
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </button>
              )
            })}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Aucune question disponible.</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-lg font-semibold text-gray-900">
            Score : <span className="text-green-600 text-xl">{score}</span> points
          </div>
          {score > 0 && (
            <div className="flex items-center gap-1">
              {[...Array(Math.min(3, Math.floor(score / 10)))].map((_, i) => (
                <span key={i} className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              ))}
            </div>
          )}
        </div>
        {completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-lg"
          >
            <CheckCircle className="w-7 h-7 text-green-600" />
            <span className="text-green-700 font-bold text-lg">Bravo ! ✓</span>
          </motion.div>
        )}
      </div>
    </div>
  )
}

