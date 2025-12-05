'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, HardDrive, CheckCircle, Lightbulb, RotateCcw, Terminal } from 'lucide-react'

interface LinuxDistroSetupProps {
  ageGroup: string
  level: string
  buildingId?: string
  onComplete: (points: number) => void
}

export default function LinuxDistroSetup({ ageGroup, level, buildingId, onComplete }: LinuxDistroSetupProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedDistro, setSelectedDistro] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [score, setScore] = useState(0)
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

  const distros = [
    {
      name: 'Linux NIRD',
      description: 'Distribution éducative pour le secondaire',
      link: 'https://nird.forge.apps.education.fr/linux/',
      steps: [
        'Télécharger l\'image ISO depuis le site officiel',
        'Vérifier l\'intégrité avec la clé MD5',
        'Graver l\'image sur une clé USB avec Balena Etcher ou Ventoy',
        'Démarrer l\'ordinateur depuis la clé USB',
        'Suivre l\'assistant d\'installation'
      ]
    },
    {
      name: 'Linux Mint',
      description: 'Distribution conviviale basée sur Ubuntu',
      link: 'https://linuxmint.com/',
      steps: [
        'Télécharger l\'ISO depuis linuxmint.com',
        'Vérifier la somme de contrôle',
        'Créer une clé USB bootable',
        'Configurer le BIOS pour démarrer sur USB',
        'Installer en mode dual-boot ou remplacement'
      ]
    },
    {
      name: 'Ubuntu',
      description: 'Distribution populaire et bien documentée',
      link: 'https://ubuntu.com/',
      steps: [
        'Télécharger Ubuntu Desktop depuis ubuntu.com',
        'Vérifier l\'intégrité du fichier',
        'Utiliser Rufus ou Balena Etcher pour créer la clé USB',
        'Démarrer depuis la clé USB en mode "Try Ubuntu"',
        'Lancer l\'installation complète'
      ]
    }
  ]

  const packageManagerChallenges = [
    {
      question: 'Quelle commande installe un logiciel avec APT ?',
      options: [
        { text: 'apt install nom_du_logiciel', correct: true },
        { text: 'apt get nom_du_logiciel', correct: false },
        { text: 'install nom_du_logiciel', correct: false },
        { text: 'apt download nom_du_logiciel', correct: false }
      ],
      hint: 'APT utilise la commande "install" après "apt"',
      points: 15
    },
    {
      question: 'Comment mettre à jour la liste des paquets disponibles ?',
      options: [
        { text: 'apt update', correct: true },
        { text: 'apt upgrade', correct: false },
        { text: 'apt refresh', correct: false },
        { text: 'apt reload', correct: false }
      ],
      hint: 'Cette commande synchronise la liste des paquets avec les dépôts',
      points: 15
    },
    {
      question: 'Quel gestionnaire graphique permet d\'installer des applications facilement ?',
      options: [
        { text: 'Ubuntu Software / Logiciels', correct: true },
        { text: 'Windows Store', correct: false },
        { text: 'App Store', correct: false },
        { text: 'Play Store', correct: false }
      ],
      hint: 'C\'est l\'équivalent Linux de l\'App Store',
      points: 10
    }
  ]

  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [challengeAnswer, setChallengeAnswer] = useState<number | null>(null)

  const handleDistroSelect = (distroName: string) => {
    setSelectedDistro(distroName)
    setScore(prev => prev + 10)
  }

  const handleStepComplete = () => {
    if (currentStep < (selectedDistro ? distros.find(d => d.name === selectedDistro)!.steps.length - 1 : 0)) {
      setCurrentStep(prev => prev + 1)
      setScore(prev => prev + 5)
    } else {
      // Move to package manager challenges and shuffle options
      const shuffled = packageManagerChallenges.map(c => shuffleArray(c.options))
      setShuffledOptions(shuffled)
      setCurrentStep(-1)
    }
  }

  const handleChallengeAnswer = (optionIndex: number) => {
    setChallengeAnswer(optionIndex)
    const challenge = packageManagerChallenges[currentChallenge]
    // Check the shuffled options, not the original
    const displayedOptions = shuffledOptions[currentChallenge] || challenge.options
    const isCorrect = displayedOptions[optionIndex].correct
    
    if (isCorrect) {
      setScore(prev => prev + challenge.points)
      setTimeout(() => {
        if (currentChallenge < packageManagerChallenges.length - 1) {
          setCurrentChallenge(prev => prev + 1)
          setChallengeAnswer(null)
        } else {
          setCompleted(true)
          setTimeout(() => onComplete(score + challenge.points), 500)
        }
      }, 1500)
    } else {
      setScore(prev => Math.max(0, prev - 5))
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    setSelectedDistro(null)
    setCurrentChallenge(0)
    setChallengeAnswer(null)
    setScore(0)
    setCompleted(false)
    setShowHint(false)
  }

  const selectedDistroData = selectedDistro ? distros.find(d => d.name === selectedDistro) : null

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Installation d'une distribution Linux
          </h3>
          <p className="text-gray-600">
            Apprenez à installer Linux et utiliser les gestionnaires de paquets
          </p>
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

      {!selectedDistro ? (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Choisissez une distribution à installer :
          </h4>
          <div className="grid md:grid-cols-3 gap-4">
            {distros.map((distro) => (
              <motion.button
                key={distro.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDistroSelect(distro.name)}
                className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all text-left"
              >
                <Terminal className="w-8 h-8 text-blue-600 mb-3" />
                <h5 className="font-bold text-lg text-gray-900 mb-2">
                  {distro.name}
                </h5>
                <p className="text-sm text-gray-600">
                  {distro.description}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      ) : currentStep >= 0 ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <HardDrive className="w-6 h-6 text-blue-600" />
            <h4 className="text-xl font-semibold text-gray-900">
              Installation de {selectedDistro}
            </h4>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
            <div className="mb-4">
              <span className="text-sm text-gray-500">
                Étape {currentStep + 1} / {selectedDistroData!.steps.length}
              </span>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / selectedDistroData!.steps.length) * 100}%` }}
                  className="h-full bg-blue-600"
                />
              </div>
            </div>

            <p className="text-lg text-gray-900 mb-4">
              {selectedDistroData!.steps[currentStep]}
            </p>

            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded-lg mb-4"
              >
                <p className="text-sm text-yellow-800">
                  💡 Consultez le site officiel : <a href={selectedDistroData!.link} target="_blank" rel="noopener noreferrer" className="underline">{selectedDistroData!.link}</a>
                </p>
              </motion.div>
            )}

            <button
              onClick={handleStepComplete}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Étape suivante →
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <h4 className="text-xl font-semibold text-gray-900 mb-4">
            Défis : Gestionnaires de paquets
          </h4>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
            <p className="text-lg text-gray-900 mb-4">
              {packageManagerChallenges[currentChallenge].question}
            </p>

            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded-lg mb-4"
              >
                <p className="text-sm text-yellow-800">
                  💡 {packageManagerChallenges[currentChallenge].hint}
                </p>
              </motion.div>
            )}

            <div className="space-y-3">
              {(shuffledOptions[currentChallenge] || packageManagerChallenges[currentChallenge].options).map((option, idx) => {
                const isSelected = challengeAnswer === idx
                const isCorrect = option.correct
                const showResult = challengeAnswer !== null

                return (
                  <button
                    key={idx}
                    onClick={() => handleChallengeAnswer(idx)}
                    disabled={challengeAnswer !== null}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                      showResult
                        ? isCorrect
                          ? 'bg-green-50 border-green-500 text-gray-900'
                          : isSelected
                          ? 'bg-red-50 border-red-500 text-gray-900'
                          : 'border-gray-300 opacity-50 text-gray-600'
                        : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-900 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option.text}</span>
                      {showResult && isCorrect && (
                        <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <div className="text-lg font-semibold text-gray-900">
          Score : <span className="text-blue-600">{score}</span> points
        </div>
        {completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold"
          >
            <CheckCircle className="w-6 h-6" />
            <span>Félicitations ! Vous maîtrisez l'installation Linux !</span>
          </motion.div>
        )}
      </div>
    </div>
  )
}

