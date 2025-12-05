'use client'

import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Building2, BookOpen, Landmark, Zap, 
  X, Trophy, TrendingUp, CheckCircle, Sparkles,
  Castle, School, Factory, TreePine, RotateCcw, Settings
} from 'lucide-react'

// Lazy load activity components for better performance
const DragDropGame = lazy(() => import('@/components/village/DragDropGame'))
const DragDropQuestions = lazy(() => import('@/components/village/DragDropQuestions'))
const LinuxCommandsGame = lazy(() => import('@/components/village/LinuxCommandsGame'))
const LinuxDistroSetup = lazy(() => import('@/components/village/LinuxDistroSetup'))
const BubbleGame = lazy(() => import('@/components/village/BubbleGame'))

interface Question {
  id: number
  question_text: string
  options: { text: string; points: number; feedback: string }[]
  correct_answer: number
  points: number
  level: string
}

interface Building {
  id: string
  name: string
  icon: typeof Building2
  position: { x: number; y: number }
  description: string
  color: string
  adultOnly?: boolean
}

const buildingTemplates: Building[] = [
  {
    id: 'lab',
    name: 'Salle Info Linux',
    icon: Building2,
    position: { x: 15, y: 25 },
    description: 'Installez Linux NIRD, découvrez les distributions et réutilisez les PC',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'library',
    name: 'Bibliothèque Libre',
    icon: BookOpen,
    position: { x: 50, y: 20 },
    description: 'Explorez les ressources éducatives libres et la doc Linux',
    color: 'from-indigo-500 to-sky-500',
  },
  {
    id: 'cityhall',
    name: 'Mairie Numérique',
    icon: Landmark,
    position: { x: 30, y: 60 },
    description: 'Gérez les services publics, les budgets et les choix logiciels',
    color: 'from-slate-700 to-emerald-500',
  },
  {
    id: 'eco',
    name: 'Coin Éco (Green IT)',
    icon: TreePine,
    position: { x: 75, y: 50 },
    description: 'Conseils pour la sobriété numérique',
    color: 'from-lime-500 to-emerald-500',
  },
]

// Adult building positions - staggered layout: a c f / b d
const getAdultBuildingPositions = () => {
  return {
    lab: { x: 15, y: 25 },      // a - top left
    cityhall: { x: 35, y: 50 }, // b - middle left
    library: { x: 55, y: 20 },  // c - top middle
    eco: { x: 75, y: 45 },      // d - middle right
    workshop: { x: 90, y: 25 }, // f - top right
  }
}

const getBackgroundClasses = (age: string | null, level: string) => {
  if (!age) {
    return 'bg-gradient-to-br from-green-50 via-blue-50 to-purple-50'
  }

  if (age === '14-') {
    if (level === 'beginner') {
      return 'bg-gradient-to-br from-sky-50 via-emerald-50 to-indigo-50'
    }
    if (level === 'intermediate') {
      return 'bg-gradient-to-br from-emerald-50 via-sky-50 to-lime-50'
    }
    // advanced
    return 'bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50'
  }

  if (age === '15-17') {
    if (level === 'beginner') {
      return 'bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50'
    }
    if (level === 'intermediate') {
      return 'bg-gradient-to-br from-slate-50 via-indigo-50 to-emerald-50'
    }
    // advanced
    return 'bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50'
  }

  // 18+
  if (level === 'beginner') {
    return 'bg-gradient-to-br from-emerald-50 via-slate-50 to-blue-50'
  }
  if (level === 'intermediate') {
    return 'bg-gradient-to-br from-slate-50 via-emerald-50 to-amber-50'
  }
  // advanced
  return 'bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50'
}

const getMapBackgroundClasses = (age: string | null, level: string) => {
  // Stronger Linux / terminal flavor inside the map, per age & level
  if (!age) {
    return 'from-slate-900 via-slate-950 to-slate-900'
  }

  if (age === '14-') {
    if (level === 'beginner') return 'from-slate-900 via-emerald-900 to-sky-900'
    if (level === 'intermediate') return 'from-slate-900 via-sky-900 to-lime-900'
    return 'from-slate-900 via-indigo-900 to-emerald-900'
  }

  if (age === '15-17') {
    if (level === 'beginner') return 'from-slate-900 via-cyan-900 to-slate-900'
    if (level === 'intermediate') return 'from-slate-900 via-indigo-900 to-emerald-900'
    return 'from-slate-950 via-slate-900 to-emerald-900'
  }

  // 18+
  if (level === 'beginner') return 'from-slate-900 via-emerald-900 to-slate-900'
  if (level === 'intermediate') return 'from-black via-slate-900 to-emerald-900'
  return 'from-black via-slate-950 to-emerald-950'
}

const ageGroups = [
  { 
    value: 'junior', 
    label: 'Moins de 15 ans', 
    emoji: '🌟',
    color: 'from-blue-400 to-cyan-500',
    hoverColor: 'hover:from-blue-500 hover:to-cyan-600',
    borderColor: 'border-blue-300 hover:border-blue-500'
  },
  { 
    value: 'senior', 
    label: '15 ans et plus', 
    emoji: '🚀',
    color: 'from-purple-400 to-indigo-500',
    hoverColor: 'hover:from-purple-500 hover:to-indigo-600',
    borderColor: 'border-purple-300 hover:border-purple-500'
  }
]

export default function VillagePage() {
  const [ageSelected, setAgeSelected] = useState<string | null>(null)
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [points, setPoints] = useState(0)
  const [badges, setBadges] = useState<string[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [buildings, setBuildings] = useState<Building[]>([])
  const [loading, setLoading] = useState(false)
  const [difficulty, setDifficulty] = useState<string>('beginner')
  const [villageDescription, setVillageDescription] = useState<string>('')
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [isChangingLevel, setIsChangingLevel] = useState(false)
  const [completedLevels, setCompletedLevels] = useState<Record<string, boolean>>({})
  const [levelResults, setLevelResults] = useState<Record<string, number>>({})

  useEffect(() => {
    const savedPoints = localStorage.getItem('villagePoints')
    const savedBadges = localStorage.getItem('villageBadges')
    const savedAge = localStorage.getItem('villageAge')
    const savedCompletedLevels = localStorage.getItem('villageCompletedLevels')
    const savedLevelResults = localStorage.getItem('villageLevelResults')
    if (savedPoints) setPoints(parseInt(savedPoints))
    if (savedBadges) setBadges(JSON.parse(savedBadges))
    if (savedAge) setAgeSelected(savedAge)
    else setAgeSelected('junior') // Auto-select default age
    if (savedCompletedLevels) setCompletedLevels(JSON.parse(savedCompletedLevels))
    if (savedLevelResults) setLevelResults(JSON.parse(savedLevelResults))
  }, [])

  // Set village description based on age and difficulty
  const loadVillageDescription = useCallback(() => {
    if (!ageSelected) return
    
    const descriptions = {
      junior: {
        beginner: 'Bienvenue dans le village NIRD ! Explore chaque bâtiment pour apprendre les bases du numérique libre et responsable.',
        intermediate: 'Découvre comment les logiciels libres peuvent aider ton école à être plus écologique et indépendante.',
        advanced: 'Deviens un expert du numérique durable en relevant tous les défis du village !'
      },
      senior: {
        beginner: 'Explorez le village numérique résistant et découvrez les alternatives libres aux solutions propriétaires.',
        intermediate: 'Approfondissez vos connaissances sur Linux, l\'open source et la souveraineté numérique.',
        advanced: 'Maîtrisez les concepts avancés de migration vers le libre et de reconditionnement informatique.'
      }
    }
    
    const ageDesc = descriptions[ageSelected as 'junior' | 'senior']
    const diffDesc = ageDesc?.[difficulty as 'beginner' | 'intermediate' | 'advanced']
    setVillageDescription(diffDesc || 'Un village numérique résistant où chaque bâtiment représente un défi pour construire un avenir numérique durable et responsable.')
  }, [ageSelected, difficulty])

  useEffect(() => {
    if (ageSelected) {
      localStorage.setItem('villageAge', ageSelected)
      loadQuestions()
      // Debounce API call to reduce requests
      const timeoutId = setTimeout(() => {
        loadVillageDescription()
      }, 300)
      return () => clearTimeout(timeoutId)
    }
  }, [ageSelected, difficulty, loadVillageDescription])

  const loadQuestions = async () => {
    // Questions will be loaded when building is clicked
  }

  const handleReset = () => {
    setShowResetConfirm(true)
  }

  const confirmReset = () => {
      setPoints(0)
      setBadges([])
      setAgeSelected(null)
      setSelectedBuilding(null)
      setCurrentQuestion(null)
      setShowFeedback(false)
    setShowResetConfirm(false)
    setCompletedLevels({})
    setLevelResults({})
      localStorage.removeItem('villagePoints')
      localStorage.removeItem('villageBadges')
      localStorage.removeItem('villageAge')
    localStorage.removeItem('villageCompletedLevels')
    localStorage.removeItem('villageLevelResults')
  }

  const handleDifficultyChange = (newDifficulty: string) => {
    if (newDifficulty === difficulty) return
    
    setIsChangingLevel(true)
    // Close any open modals immediately for seamless transition
    setSelectedBuilding(null)
    setCurrentQuestion(null)
    setShowFeedback(false)
    
    // Update difficulty with smooth transition (minimal delay for perceived smoothness)
    requestAnimationFrame(() => {
      setDifficulty(newDifficulty)
      setTimeout(() => {
        setIsChangingLevel(false)
      }, 100)
    })
  }

  const handleBuildingClick = useCallback(async (building: Building) => {
    // Safety: Atelier NIRD is adults only
    if (building.adultOnly && ageSelected !== '18+') {
      setFeedback("L'atelier NIRD est réservé aux adultes. Continue d'explorer les autres bâtiments libres du village !")
      setShowFeedback(true)
      return
    }

    setSelectedBuilding(building)
    // Activities are now shown directly, no need to load questions
    setCurrentQuestion({ id: 0, question_text: '', options: [], correct_answer: 0, points: 0, level: difficulty })
  }, [ageSelected, difficulty])

  const handleActivityComplete = useCallback((activityPoints: number) => {
    if (!ageSelected || !difficulty || !selectedBuilding) return

    setPoints(prevPoints => {
      const newPoints = prevPoints + activityPoints
      localStorage.setItem('villagePoints', newPoints.toString())
      
      // Track level completion
      const levelKey = `${ageSelected}-${difficulty}-${selectedBuilding.id}`
      setCompletedLevels(prev => {
        const updated = { ...prev, [levelKey]: true }
        localStorage.setItem('villageCompletedLevels', JSON.stringify(updated))
        return updated
      })
      
      // Track level results
      setLevelResults(prev => {
        const updated = { ...prev, [levelKey]: activityPoints }
        localStorage.setItem('villageLevelResults', JSON.stringify(updated))
        return updated
      })

      const feedbackMessages = [
        `Excellent travail ! Vous avez gagné ${activityPoints} points.`,
        `Bravo ! ${activityPoints} points ajoutés à votre score.`,
        `Superbe ! Vous progressez bien (+${activityPoints} points).`,
      ]
      setFeedback(feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)])
      setShowFeedback(true)

      setBadges(prevBadges => {
        const newBadges: string[] = [...prevBadges]
        if (newPoints >= 20 && !newBadges.includes('starter')) {
          newBadges.push('starter')
        }
        if (newPoints >= 50 && !newBadges.includes('hero')) {
          newBadges.push('hero')
        }
        if (newPoints >= 100 && !newBadges.includes('champion')) {
          newBadges.push('champion')
        }
        localStorage.setItem('villageBadges', JSON.stringify(newBadges))
        return newBadges
      })

      // Check if all levels completed for this building
      const allLevels = ['beginner', 'intermediate', 'advanced']
      const allCompleted = allLevels.every(level => {
        const key = `${ageSelected}-${level}-${selectedBuilding.id}`
        return completedLevels[key] || levelKey === key
      })

      if (allCompleted) {
        setTimeout(() => {
          const bonusPoints = 50
          const totalWithBonus = newPoints + bonusPoints
          setPoints(totalWithBonus)
          localStorage.setItem('villagePoints', totalWithBonus.toString())
          setFeedback(`🎉 Félicitations ! Vous avez complété tous les niveaux de ${selectedBuilding.name} ! Bonus de ${bonusPoints} points !`)
          setShowFeedback(true)
        }, 3500)
      }
      
      // Check if all buildings and levels are completed
      const allBuildings = buildingTemplates.filter(b => !b.adultOnly)
      const allBuildingsCompleted = allBuildings.every(building => {
        return allLevels.every(level => {
          const key = `${ageSelected}-${level}-${building.id}`
          return completedLevels[key] || (building.id === selectedBuilding.id && level === difficulty)
        })
      })

      if (allBuildingsCompleted) {
        setTimeout(() => {
          const finalBonus = 100
          const finalPoints = newPoints + finalBonus
          setPoints(finalPoints)
          localStorage.setItem('villagePoints', finalPoints.toString())
          setFeedback(`🏆 INCROYABLE ! Vous avez complété TOUS les défis du village ! Vous êtes un véritable champion NIRD ! Bonus final de ${finalBonus} points !`)
          setShowFeedback(true)
        }, 7000)
      }

      setTimeout(() => {
        setSelectedBuilding(null)
        setCurrentQuestion(null)
        setShowFeedback(false)
      }, 3000)
      
      return newPoints
    })
  }, [ageSelected, difficulty, selectedBuilding, completedLevels])

  // Memoized activity component loader with Suspense
  const ActivityWrapper = useCallback(({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={
      <div className="card text-center">
        <div className="animate-pulse">
          <div className="h-4 rounded w-3/4 mx-auto mb-4" style={{ background: 'rgba(15, 23, 42, 0.06)' }}></div>
          <div className="h-4 rounded w-1/2 mx-auto" style={{ background: 'rgba(15, 23, 42, 0.06)' }}></div>
        </div>
      </div>
    }>
      {children}
    </Suspense>
  ), [])

  const getActivityComponent = useMemo(() => {
    if (!ageSelected || !difficulty || !selectedBuilding) return null

    const buildingId = selectedBuilding.id

    // ========== SALLE INFO (lab) - Linux & PC reconditionnement ==========
    if (buildingId === 'lab') {
      if (ageSelected === 'junior') {
        if (difficulty === 'beginner') {
          return <ActivityWrapper><BubbleGame ageGroup={ageSelected} level={difficulty} buildingId={buildingId} onComplete={handleActivityComplete} /></ActivityWrapper>
        } else if (difficulty === 'intermediate') {
          return <ActivityWrapper><DragDropQuestions ageGroup={ageSelected} level={difficulty} buildingId={buildingId} onComplete={handleActivityComplete} /></ActivityWrapper>
        } else if (difficulty === 'advanced') {
          return <ActivityWrapper><LinuxCommandsGame ageGroup={ageSelected} level={difficulty} buildingId={buildingId} onComplete={handleActivityComplete} /></ActivityWrapper>
        }
      } else if (ageSelected === 'senior') {
        if (difficulty === 'beginner') {
          return <ActivityWrapper><DragDropGame ageGroup={ageSelected} level={difficulty} buildingId={buildingId} onComplete={handleActivityComplete} /></ActivityWrapper>
        } else if (difficulty === 'intermediate') {
          return <ActivityWrapper><DragDropQuestions ageGroup={ageSelected} level={difficulty} buildingId={buildingId} onComplete={handleActivityComplete} /></ActivityWrapper>
        } else if (difficulty === 'advanced') {
          return <ActivityWrapper><LinuxDistroSetup ageGroup={ageSelected} level={difficulty} buildingId={buildingId} onComplete={handleActivityComplete} /></ActivityWrapper>
        }
      }
    }
    // ========== BIBLIOTHÈQUE (library) - Ressources éducatives libres ==========
    else if (buildingId === 'library') {
      if (ageSelected === 'junior') {
        if (difficulty === 'beginner') {
          return <ActivityWrapper><BubbleGame ageGroup={ageSelected} level={difficulty} buildingId={buildingId} onComplete={handleActivityComplete} /></ActivityWrapper>
        } else if (difficulty === 'intermediate') {
          return <ActivityWrapper><DragDropQuestions ageGroup={ageSelected} level={difficulty} buildingId={buildingId} onComplete={handleActivityComplete} /></ActivityWrapper>
        } else if (difficulty === 'advanced') {
          return <ActivityWrapper><DragDropGame ageGroup={ageSelected} level={difficulty} buildingId={buildingId} onComplete={handleActivityComplete} /></ActivityWrapper>
        }
      } else if (ageSelected === 'senior') {
        if (difficulty === 'beginner') {
          return <ActivityWrapper><DragDropGame ageGroup={ageSelected} level={difficulty} buildingId={buildingId} onComplete={handleActivityComplete} /></ActivityWrapper>
        } else if (difficulty === 'intermediate') {
          return <ActivityWrapper><DragDropQuestions ageGroup={ageSelected} level={difficulty} buildingId={buildingId} onComplete={handleActivityComplete} /></ActivityWrapper>
        } else if (difficulty === 'advanced') {
          return <ActivityWrapper><DragDropGame ageGroup={ageSelected} level={difficulty} buildingId={buildingId} onComplete={handleActivityComplete} /></ActivityWrapper>
        }
      }
    }
    // ========== MAIRIE (cityhall) - Budget & décisions ==========
    else if (buildingId === 'cityhall') {
      if (ageSelected === 'junior') {
        if (difficulty === 'beginner') {
          return <ActivityWrapper><BubbleGame ageGroup={ageSelected} level={difficulty} buildingId={buildingId} onComplete={handleActivityComplete} /></ActivityWrapper>
        } else if (difficulty === 'intermediate') {
          return <ActivityWrapper><DragDropQuestions ageGroup={ageSelected} level={difficulty} buildingId={buildingId} onComplete={handleActivityComplete} /></ActivityWrapper>
        } else if (difficulty === 'advanced') {
          return <ActivityWrapper><DragDropGame ageGroup={ageSelected} level={difficulty} buildingId={buildingId} onComplete={handleActivityComplete} /></ActivityWrapper>
        }
      } else if (ageSelected === 'senior') {
        if (difficulty === 'beginner') {
          return <ActivityWrapper><DragDropGame ageGroup={ageSelected} level={difficulty} buildingId={buildingId} onComplete={handleActivityComplete} /></ActivityWrapper>
        } else if (difficulty === 'intermediate') {
          return <ActivityWrapper><DragDropQuestions ageGroup={ageSelected} level={difficulty} buildingId={buildingId} onComplete={handleActivityComplete} /></ActivityWrapper>
        } else if (difficulty === 'advanced') {
          return <ActivityWrapper><DragDropQuestions ageGroup={ageSelected} level={difficulty} buildingId={buildingId} onComplete={handleActivityComplete} /></ActivityWrapper>
        }
      }
    }
    // ========== COIN ÉCO (eco) - Sobriété numérique ==========
    else if (buildingId === 'eco') {
      if (ageSelected === 'junior') {
        if (difficulty === 'beginner') {
          return <ActivityWrapper><BubbleGame ageGroup={ageSelected} level={difficulty} buildingId={buildingId} onComplete={handleActivityComplete} /></ActivityWrapper>
        } else if (difficulty === 'intermediate') {
          return <ActivityWrapper><DragDropQuestions ageGroup={ageSelected} level={difficulty} buildingId={buildingId} onComplete={handleActivityComplete} /></ActivityWrapper>
        } else if (difficulty === 'advanced') {
          return <ActivityWrapper><DragDropGame ageGroup={ageSelected} level={difficulty} buildingId={buildingId} onComplete={handleActivityComplete} /></ActivityWrapper>
        }
      } else if (ageSelected === 'senior') {
        if (difficulty === 'beginner') {
          return <ActivityWrapper><DragDropGame ageGroup={ageSelected} level={difficulty} buildingId={buildingId} onComplete={handleActivityComplete} /></ActivityWrapper>
        } else if (difficulty === 'intermediate') {
          return <ActivityWrapper><DragDropQuestions ageGroup={ageSelected} level={difficulty} buildingId={buildingId} onComplete={handleActivityComplete} /></ActivityWrapper>
        } else if (difficulty === 'advanced') {
          return <ActivityWrapper><DragDropGame ageGroup={ageSelected} level={difficulty} buildingId={buildingId} onComplete={handleActivityComplete} /></ActivityWrapper>
        }
      }
    }

    // Default fallback
    return (
      <div className="text-center py-8" style={{ color: 'var(--text-subtle)' }}>
        Activité en préparation pour ce bâtiment et ce niveau.
      </div>
    )
  }, [ageSelected, difficulty, selectedBuilding, handleActivityComplete, ActivityWrapper])

  const createFallbackQuestion = (building: Building) => {
    return {
      id: 0,
      question_text: `${building.description}. Que choisissez-vous ?`,
      options: [
        { text: 'Option durable', points: 10, feedback: 'Excellent choix !' },
        { text: 'Option classique', points: -5, feedback: 'Pas optimal.' },
      ],
      correct_answer: 0,
      points: 10,
      level: difficulty,
    }
  }


  // Calculate resistance level based on completed levels
  const resistanceLevel = useMemo(() => {
    if (!ageSelected) return 0
    
    // Count completed levels for current age group
    const allLevels = ['beginner', 'intermediate', 'advanced']
    const allBuildings = buildingTemplates.filter(b => !b.adultOnly)
    
    let totalLevels = 0
    let completedCount = 0
    
    allBuildings.forEach(building => {
      allLevels.forEach(level => {
        totalLevels++
        const key = `${ageSelected}-${level}-${building.id}`
        if (completedLevels[key]) {
          completedCount++
        }
      })
    })
    
    if (totalLevels === 0) return 0
    return Math.min(100, Math.round((completedCount / totalLevels) * 100))
  }, [points, ageSelected, completedLevels])

  // All buildings visible for all age groups
  const visibleBuildings = useMemo(() => 
    buildingTemplates.filter((building) => !building.adultOnly),
    []
  )

  // Age Selection Screen
  if (!ageSelected) {
    return (
      <div className="min-h-screen py-12 bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-500 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card max-w-2xl w-full mx-4"
        >
          <div className="text-center mb-8">
            <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4" style={{ color: 'var(--accent)' }} />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2" style={{ color: 'var(--text-main)' }}>
              Bienvenue au Village !
            </h1>
            <p className="text-base sm:text-lg md:text-xl px-2" style={{ color: 'var(--text-subtle)' }}>
              Pour commencer votre aventure, choisissez votre groupe d'âge
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {ageGroups.map((age) => (
              <motion.button
                key={age.value}
                whileHover={{ scale: 1.08, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAgeSelected(age.value)}
                className={`p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 sm:border-4 ${age.borderColor} bg-gradient-to-br ${age.color} ${age.hoverColor} transition-all text-center shadow-xl hover:shadow-2xl`}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4"
                >
                  {age.emoji}
                </motion.div>
                <div className="font-bold text-base sm:text-lg drop-shadow-md" style={{ color: 'var(--text-main)' }}>{age.label}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen py-12 ${getBackgroundClasses(ageSelected, difficulty)}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 px-2" style={{ color: 'var(--text-main)' }}>
            Carte Interactive du Village
          </h1>
          {villageDescription ? (
            <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-2" style={{ color: 'var(--text-subtle)' }}>
              {villageDescription}
            </p>
          ) : (
            <p className="text-base sm:text-lg md:text-xl px-2" style={{ color: 'var(--text-subtle)' }}>
              Explorez les bâtiments et relevez les défis pour construire un village résistant !
            </p>
          )}
        </motion.div>

        {/* Difficulty and Reset Controls - Improved Design */}
        {ageSelected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-gradient-to-r from-primary-50 via-secondary-50 to-accent-50 rounded-2xl p-4 sm:p-6 shadow-lg border border-primary-200"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center sm:justify-start w-full sm:w-auto">
                <div className="card px-2 sm:px-4 py-1.5 sm:py-2 inline-flex items-center gap-1 sm:gap-2">
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: 'var(--accent)' }} />
                  <label className="font-semibold text-xs sm:text-sm" style={{ color: 'var(--text-main)' }}>Difficulté :</label>
                  <select
                    value={difficulty}
                    onChange={(e) => handleDifficultyChange(e.target.value)}
                    disabled={isChangingLevel}
                    className="ml-1 sm:ml-2 px-2 sm:px-3 py-1 sm:py-1.5 border-2 rounded-lg focus:outline-none font-medium text-xs sm:text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      background: 'var(--card)', 
                      borderColor: 'rgba(15, 23, 42, 0.12)', 
                      color: 'var(--text-main)',
                    }}
                  >
                    <option value="beginner">🟢 Débutant</option>
                    <option value="intermediate">🟡 Intermédiaire</option>
                    <option value="advanced">🔴 Avancé</option>
                  </select>
                  {isChangingLevel && (
                    <span className="text-xs ml-2 animate-pulse" style={{ color: 'var(--text-subtle)' }}>
                      Chargement...
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm" style={{ color: 'var(--text-subtle)' }}>
                  <span className="font-medium">Groupe d'âge :</span>
                  <span className="px-2 sm:px-3 py-1 rounded-lg font-semibold border text-xs sm:text-sm card">
                    {ageGroups.find(a => a.value === ageSelected)?.label || ageSelected}
                  </span>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="btn-secondary group relative w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
                style={{ borderColor: 'var(--warning)', color: 'var(--warning)' }}
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-500" />
                <span>Recommencer</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Progress Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6 sm:mb-8 p-4 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 sm:gap-0">
            <div className="w-full sm:w-auto">
              <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-main)' }}>Niveau de Résistance du Village</h2>
              <p className="text-sm sm:text-base" style={{ color: 'var(--text-subtle)' }}>Points: <span className="font-bold" style={{ color: 'var(--accent-strong)' }}>{points}</span></p>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: 'var(--inclusion)' }} />
              <span className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-main)' }}>{Math.round(resistanceLevel)}%</span>
            </div>
          </div>
          <div className="w-full rounded-full h-6 overflow-hidden shadow-inner" style={{ background: 'rgba(15, 23, 42, 0.06)' }}>
            <motion.div
              initial={false}
              animate={{ width: `${resistanceLevel}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500"
            />
          </div>
          {ageSelected && (
            <div className="mt-4 space-y-2">
              <p className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-subtle)' }}>
                Niveaux complétés : {Object.keys(completedLevels).filter(key => key.startsWith(ageSelected)).length} / {
                  buildingTemplates.filter(b => !b.adultOnly || ageSelected === '18+').length * 3
                }
              </p>
              {resistanceLevel === 100 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 sm:p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-white text-center"
                >
                  <p className="text-sm sm:text-base font-bold">🏆 Félicitations ! Vous avez complété tous les niveaux !</p>
                </motion.div>
              )}
            </div>
          )}
          {badges.length > 0 && (
            <div className="mt-4 flex gap-2 flex-wrap">
              {badges.map((badge) => (
                <span key={badge} className="badge">
                  {badge === 'starter' ? '🌟 Débutant' : badge === 'hero' ? '🏆 Héros' : '👑 Champion'}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Village Map - Improved Design */}
          <div className={`relative bg-gradient-to-br ${getMapBackgroundClasses(ageSelected, difficulty)} rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 min-h-[400px] sm:min-h-[500px] md:min-h-[600px] overflow-hidden border-2 sm:border-4 border-emerald-400/60`}>
          {/* Animated Background - Optimized with CSS animations */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div
              className="absolute top-10 left-10 w-64 h-64 bg-primary-300 rounded-full blur-2xl will-change-transform"
              style={{
                animation: 'village-float-1 20s ease-in-out infinite',
              }}
            />
            <div
              className="absolute bottom-10 right-10 w-80 h-80 bg-secondary-300 rounded-full blur-2xl will-change-transform"
              style={{
                animation: 'village-float-2 25s ease-in-out infinite',
              }}
            />
          </div>

          {/* Decorative Elements */}
          <Castle className="absolute top-2 left-2 sm:top-5 sm:left-5 w-8 h-8 sm:w-12 sm:h-12 text-emerald-500/30 opacity-50" />
          <School className="absolute top-2 right-2 sm:top-5 sm:right-5 w-8 h-8 sm:w-12 sm:h-12 text-cyan-400/30 opacity-50" />
          <Factory className="absolute bottom-2 left-2 sm:bottom-5 sm:left-5 w-8 h-8 sm:w-12 sm:h-12 text-amber-400/30 opacity-40" />

          {visibleBuildings.map((building, index) => {
            const Icon = building.icon
            // Use adult positions if user is adult - staggered layout: a c f / b d
            const adultPositions = getAdultBuildingPositions()
            const position = ageSelected === '18+' && adultPositions[building.id as keyof typeof adultPositions]
              ? adultPositions[building.id as keyof typeof adultPositions]
              : building.position
            
            // Check if building is completed (all 3 levels completed)
            const isBuildingCompleted = ageSelected ? (() => {
              const allLevels = ['beginner', 'intermediate', 'advanced']
              return allLevels.every(level => {
                const key = `${ageSelected}-${level}-${building.id}`
                return completedLevels[key] === true
              })
            })() : false
            
            return (
              <motion.button
                key={building.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3, ease: "easeOut" }}
                onClick={() => handleBuildingClick(building)}
                className="absolute village-building z-10"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`bg-gradient-to-br ${building.color} rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-xl sm:shadow-2xl border-2 sm:border-4 border-white hover:border-yellow-300 transition-all`}
                >
                  <Icon className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white mb-1 sm:mb-2 md:mb-3 drop-shadow-lg" />
                  <p className="text-xs sm:text-sm font-bold text-white drop-shadow-md whitespace-nowrap text-center">
                    {building.name}
                  </p>
                  {/* Completion status indicator */}
                  {isBuildingCompleted ? (
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-yellow-400 rounded-full animate-pulse shadow-lg"></div>
                  ) : (
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-red-500 rounded-full shadow-lg"></div>
                  )}
                </motion.div>
              </motion.button>
            )
          })}
        </div>

        {/* Building Activity Modal */}
        <AnimatePresence mode="wait">
          {selectedBuilding && !showFeedback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
              onClick={() => {
                setSelectedBuilding(null)
                setCurrentQuestion(null)
              }}
            >
              <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="card max-w-5xl w-full my-8 rounded-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between mb-6 pb-4 border-b px-6 pt-6" style={{ borderColor: 'rgba(15, 23, 42, 0.08)' }}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(15, 179, 138, 0.1)' }}>
                      <selectedBuilding.icon className="w-7 h-7" style={{ color: 'var(--accent)' }} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-main)' }}>{selectedBuilding.name}</h2>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-subtle)' }}>{selectedBuilding.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedBuilding(null)
                      setCurrentQuestion(null)
                    }}
                    className="p-2.5 hover:bg-gray-100 rounded-xl transition-all hover:scale-110 active:scale-95"
                    aria-label="Fermer"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
                <div className="max-h-[80vh] overflow-y-auto px-6 pb-6">
                  {getActivityComponent || (
                    <div className="text-center py-12">
                      <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                        <Sparkles className="w-8 h-8 text-gray-400" />
                  </div>
                      <p className="text-gray-600 text-lg">
                        Activité en préparation...
                      </p>
                  </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback Modal - More Human Friendly */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowFeedback(false)}
            >
              <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="card max-w-md w-full bg-white dark:bg-gray-800 shadow-2xl rounded-xl sm:rounded-2xl overflow-hidden mx-2"
              >
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 sm:p-6 text-white">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="p-1.5 sm:p-2 bg-white/20 rounded-full">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold">Bravo ! 🎉</h3>
                  </div>
                  <p className="text-green-50 text-xs sm:text-sm font-medium">Vous avez terminé l'activité avec succès !</p>
                </div>
                <div className="p-4 sm:p-6">
                  <p className="text-gray-700 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">{feedback}</p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 gap-2 sm:gap-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      <div>
                        <p className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-subtle)' }}>Votre score total</p>
                        <p className="text-xl sm:text-2xl font-bold text-blue-600">{points} points</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowFeedback(false)}
                    className="mt-4 sm:mt-6 w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg text-sm sm:text-base"
                  >
                    Continuer l'aventure
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reset Confirmation Modal */}
        <AnimatePresence>
          {showResetConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowResetConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white shadow-2xl rounded-2xl overflow-hidden max-w-sm w-full"
              >
                <div className="p-6">
                  <div className="text-center mb-4">
                    <div className="inline-flex p-3 bg-blue-100 rounded-full mb-3">
                      <RotateCcw className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Recommencer ?</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Vous perdrez votre progression
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full">
                      <span className="text-lg font-bold text-yellow-700">{points} points</span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={confirmReset}
                      className="flex-1 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg"
                    >
                      Recommencer
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
