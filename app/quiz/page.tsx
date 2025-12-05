'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Terminal, XCircle, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface QuizQuestion {
  id: number
  question_text: string
  options: Array<{ text: string; points: number; feedback: string }>
  correct_answer: number
  points: number
}

interface AnswerRecord {
  id: number
  question_text: string
  selected: number
  correct: number
  isCorrect: boolean
  points: number
}

// Static quiz questions as fallback
const STATIC_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question_text: "Qu'est-ce que NIRD ?",
    options: [
      { text: "Un système d'exploitation propriétaire", points: -5, feedback: "Non, NIRD promeut les solutions libres." },
      { text: "Numérique Inclusif, Responsable et Durable", points: 10, feedback: "Correct ! NIRD signifie Numérique Inclusif, Responsable et Durable." },
      { text: "Un logiciel de gestion scolaire", points: -5, feedback: "Non, NIRD est une démarche plus large." },
      { text: "Une entreprise de Big Tech", points: -5, feedback: "Non, NIRD s'oppose au Big Tech." },
    ],
    correct_answer: 1,
    points: 10,
  },
  {
    id: 2,
    question_text: "Pourquoi reconditionner des PC plutôt que d'acheter du neuf ?",
    options: [
      { text: "C'est moins cher et plus écologique", points: 10, feedback: "Correct ! Le reconditionnement réduit les coûts et l'impact environnemental." },
      { text: "Les PC neufs sont toujours meilleurs", points: -5, feedback: "Non, les PC reconditionnés peuvent être très performants." },
      { text: "C'est plus compliqué à installer", points: -5, feedback: "Non, avec Linux c'est souvent plus simple." },
      { text: "Cela nécessite des licences coûteuses", points: -5, feedback: "Non, Linux est gratuit et libre." },
    ],
    correct_answer: 0,
    points: 10,
  },
  {
    id: 3,
    question_text: "Quelle distribution Linux est recommandée pour les écoles primaires ?",
    options: [
      { text: "PrimTux", points: 10, feedback: "Correct ! PrimTux est spécialement conçue pour le primaire." },
      { text: "Windows 10", points: -5, feedback: "Non, Windows est propriétaire et coûteux." },
      { text: "macOS", points: -5, feedback: "Non, macOS est propriétaire et très coûteux." },
      { text: "Chrome OS", points: -5, feedback: "Non, Chrome OS dépend de Google et du cloud." },
    ],
    correct_answer: 0,
    points: 10,
  },
  {
    id: 4,
    question_text: "Quel est l'avantage principal de LibreOffice par rapport à Microsoft Office ?",
    options: [
      { text: "Il est gratuit et libre", points: 10, feedback: "Correct ! LibreOffice est gratuit, libre et sans licences." },
      { text: "Il nécessite un abonnement mensuel", points: -5, feedback: "Non, LibreOffice est complètement gratuit." },
      { text: "Il stocke les données dans le cloud", points: -5, feedback: "Non, vous gardez le contrôle de vos données." },
      { text: "Il nécessite Windows", points: -5, feedback: "Non, LibreOffice fonctionne sur Linux, Windows et macOS." },
    ],
    correct_answer: 0,
    points: 10,
  },
  {
    id: 5,
    question_text: "Qu'est-ce que l'obsolescence programmée ?",
    options: [
      { text: "Une stratégie pour rendre les produits rapidement obsolètes", points: 10, feedback: "Correct ! C'est une pratique du Big Tech pour forcer les renouvellements." },
      { text: "Un processus naturel d'usure", points: -5, feedback: "Non, c'est une stratégie volontaire." },
      { text: "Une loi européenne", points: -5, feedback: "Non, c'est une pratique commerciale." },
      { text: "Un avantage pour les utilisateurs", points: -5, feedback: "Non, c'est défavorable aux utilisateurs." },
    ],
    correct_answer: 0,
    points: 10,
  },
]

// Static human quiz questions from API seed data
const STATIC_HUMAN_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 101,
    question_text: 'Combien de PC deviennent obsolètes à cause de la fin du support de Windows 10 ?',
    options: [
      { text: '100 millions', points: 5, feedback: "Pas tout à fait, c'est plus que ça." },
      { text: '400 millions', points: 10, feedback: 'Correct ! Plus de 400 millions d\'ordinateurs dans le monde.' },
      { text: '1 milliard', points: 5, feedback: "C'est beaucoup, mais pas encore 1 milliard." },
    ],
    correct_answer: 1,
    points: 10,
  },
  {
    id: 102,
    question_text: 'Quels sont les trois piliers de la démarche NIRD ?',
    options: [
      { text: 'Inclusion, Responsabilité, Durabilité', points: 10, feedback: 'Parfait ! Ce sont bien les trois piliers de NIRD.' },
      { text: 'Économie, Écologie, Éducation', points: 5, feedback: 'Pas exactement, mais proche des valeurs.' },
      { text: 'Linux, Libre, Libre', points: 3, feedback: "Linux est un outil, pas un pilier." },
    ],
    correct_answer: 0,
    points: 10,
  },
  {
    id: 103,
    question_text: "Quel pourcentage de l'empreinte environnementale du numérique provient de la fabrication des équipements ?",
    options: [
      { text: '50%', points: 5, feedback: "C'est plus que ça." },
      { text: '75%', points: 10, feedback: "Exactement ! 75% de l'impact vient de la fabrication." },
      { text: '90%', points: 5, feedback: "C'est beaucoup, mais pas 90%." },
    ],
    correct_answer: 1,
    points: 10,
  },
]

export default function QuizPage() {
  const [allQuizQuestions, setAllQuizQuestions] = useState<QuizQuestion[]>([])
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [loading, setLoading] = useState(false)
  const [questionCount, setQuestionCount] = useState<number | null>(5)
  const [quizFinished, setQuizFinished] = useState(false)
  const [answerHistory, setAnswerHistory] = useState<AnswerRecord[]>([])
  const [showHistoryDetails, setShowHistoryDetails] = useState(false)

  // Initial load: fetch ALL quiz questions once from the backend
  useEffect(() => {
    fetchAllQuizQuestions()
  }, [])

  // When the desired count changes, start a new session from the already-fetched pool
  useEffect(() => {
    if (questionCount !== null && questionCount > 0 && allQuizQuestions.length > 0) {
      startNewSession(questionCount, allQuizQuestions)
    }
  }, [questionCount, allQuizQuestions])

  const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  const fetchAllQuizQuestions = async () => {
    setLoading(true)
    try {
      // Use static data instead of API call
      const questions = STATIC_HUMAN_QUIZ_QUESTIONS
      if (questions && questions.length > 0) {
        const allQuestions = [...questions, ...STATIC_QUIZ_QUESTIONS]
        const uniqueQuestions = allQuestions.filter((q, index, self) => 
          index === self.findIndex((t) => t.question_text === q.question_text)
        )
        setAllQuizQuestions(uniqueQuestions)
        if (questionCount !== null && questionCount > 0) {
          startNewSession(questionCount, uniqueQuestions)
        }
      } else {
        setAllQuizQuestions(STATIC_QUIZ_QUESTIONS)
        if (questionCount !== null && questionCount > 0) {
          startNewSession(questionCount, STATIC_QUIZ_QUESTIONS)
        }
      }
    } catch (error) {
      console.error('Error loading quiz questions, using static questions:', error)
      setAllQuizQuestions(STATIC_QUIZ_QUESTIONS)
      if (questionCount !== null && questionCount > 0) {
        startNewSession(questionCount, STATIC_QUIZ_QUESTIONS)
      }
    }
    setLoading(false)
  }

  const startNewSession = (count: number, sourceQuestions?: QuizQuestion[]) => {
    if (count <= 0) {
      setQuizQuestions([])
      setCurrentQuizIndex(0)
      setSelectedAnswer(null)
      setShowFeedback(false)
      setQuizFinished(false)
      setAnswerHistory([])
      setShowHistoryDetails(false)
      return
    }

    const base = sourceQuestions ?? allQuizQuestions
    if (!base || base.length === 0) {
      const staticBase = STATIC_QUIZ_QUESTIONS
      const shuffled = shuffleArray(staticBase)
      const limited = shuffled.slice(0, Math.min(count, shuffled.length))
      setQuizQuestions(limited)
      setCurrentQuizIndex(0)
      setSelectedAnswer(null)
      setShowFeedback(false)
      setQuizFinished(false)
      setAnswerHistory([])
      setShowHistoryDetails(false)
      return
    }
    
    const shuffled = shuffleArray([...base])
    const limited = shuffled.slice(0, Math.min(count, shuffled.length))
    setQuizQuestions(limited)
    setCurrentQuizIndex(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setQuizFinished(false)
    setAnswerHistory([])
    setShowHistoryDetails(false)
  }

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return
    
    setSelectedAnswer(index)
    setShowFeedback(true)

    const currentQuestion = quizQuestions[currentQuizIndex]
    if (!currentQuestion) return

    setAnswerHistory(prev => {
      if (prev.some(r => r.id === currentQuestion.id)) return prev
      const isCorrect = index === currentQuestion.correct_answer
      return [
        ...prev,
        {
          id: currentQuestion.id,
          question_text: currentQuestion.question_text,
          selected: index,
          correct: currentQuestion.correct_answer,
          isCorrect,
          points: isCorrect ? currentQuestion.points : 0,
        },
      ]
    })
  }

  const handleNextQuiz = async () => {
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } else {
      setQuizFinished(true)
    }
  }

  const handleGenerateNewQuestion = async () => {
    if (questionCount === null) return
    setLoading(true)
    setSelectedAnswer(null)
    setShowFeedback(false)
    try {
      startNewSession(questionCount)
    } catch (error) {
      console.error('Error loading new quiz questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRestartQuiz = () => {
    if (questionCount === null) return
    const base = allQuizQuestions.length > 0 ? allQuizQuestions : STATIC_QUIZ_QUESTIONS
    if (base.length === 0) return
    startNewSession(questionCount, base)
  }

  const currentQuestion = quizQuestions[currentQuizIndex]

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-main)' }}>
            Quiz NIRD
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-subtle)' }}>
            Testez vos connaissances sur le numérique libre, responsable et durable
          </p>
        </motion.div>

        {/* Quiz Section */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                <span className="font-semibold" style={{ color: 'var(--text-main)' }}>Configuration</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm" style={{ color: 'var(--text-subtle)' }}>Nombre de questions :</label>
                <select
                  value={questionCount ?? ''}
                  onChange={e => {
                    const value = e.target.value
                    if (value === '') {
                      setQuestionCount(null)
                    } else {
                      setQuestionCount(Number(value))
                    }
                  }}
                  className="border rounded-lg px-3 py-2 text-sm"
                  style={{ background: 'var(--card)', borderColor: 'rgba(15, 23, 42, 0.12)', color: 'var(--text-main)' }}
                >
                  {[3, 5, 8].map(count => (
                    <option key={count} value={count}>
                      {count} questions
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: 'var(--accent)' }}></div>
                <p className="mt-4" style={{ color: 'var(--text-subtle)' }}>Chargement des questions...</p>
              </div>
            ) : quizFinished ? (
              <div className="py-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ background: 'rgba(15, 179, 138, 0.1)' }}>
                    <CheckCircle className="w-10 h-10" style={{ color: 'var(--accent)' }} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--text-main)' }}>
                    Quiz terminé ! Félicitations 🎉
                  </h2>
                  <p className="text-lg mb-2" style={{ color: 'var(--text-subtle)' }}>
                    Votre score :
                  </p>
                  <p className="text-5xl font-bold mb-6" style={{ color: 'var(--accent)' }}>
                    {answerHistory.filter(r => r.isCorrect).length}/{answerHistory.length}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-subtle)' }}>
                    {((answerHistory.filter(r => r.isCorrect).length / answerHistory.length) * 100).toFixed(0)}% de bonnes réponses
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <button
                    onClick={handleRestartQuiz}
                    className="btn-primary px-6 py-3 inline-flex items-center gap-2"
                  >
                    <ArrowRight className="w-5 h-5" />
                    Recommencer
                  </button>
                  <button
                    onClick={() => setShowHistoryDetails(prev => !prev)}
                    className="btn-secondary px-6 py-3"
                  >
                    {showHistoryDetails ? 'Masquer' : 'Voir'} les détails
                  </button>
                  <Link href="/" className="btn-secondary px-6 py-3">
                    Retour à l&apos;accueil
                  </Link>
                </div>

                {showHistoryDetails && (
                  <div className="pt-6 border-t" style={{ borderColor: 'rgba(15, 23, 42, 0.08)' }}>
                    <h3 className="font-semibold mb-4" style={{ color: 'var(--text-main)' }}>Détails de vos réponses</h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {answerHistory.map((record, idx) => {
                        const question = quizQuestions.find(q => q.id === record.id)
                        return (
                          <div key={record.id} className="p-4 rounded-lg" style={{ background: 'rgba(15, 23, 42, 0.02)', border: '1px solid rgba(15, 23, 42, 0.08)' }}>
                            <div className="flex items-start gap-3 mb-2">
                              {record.isCorrect ? (
                                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                              ) : (
                                <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} />
                              )}
                              <div className="flex-1">
                                <p className="font-semibold mb-2" style={{ color: 'var(--text-main)' }}>
                                  {idx + 1}. {record.question_text}
                                </p>
                                {question && (
                                  <>
                                    <p className="text-sm mb-1" style={{ color: record.isCorrect ? 'var(--accent)' : 'var(--warning)' }}>
                                      Votre réponse : {question.options[record.selected]?.text}
                                    </p>
                                    {!record.isCorrect && (
                                      <p className="text-sm" style={{ color: 'var(--accent)' }}>
                                        Bonne réponse : {question.options[record.correct]?.text}
                                      </p>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : currentQuestion ? (
              <div className="py-6">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold px-4 py-2 rounded-full" style={{ background: 'rgba(15, 179, 138, 0.1)', color: 'var(--accent)' }}>
                      Question {currentQuizIndex + 1} / {quizQuestions.length}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--text-main)' }}>
                    {currentQuestion.question_text}
                  </h2>
                </div>

                <div className="space-y-3 mb-8">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === index
                    const isCorrect = index === currentQuestion.correct_answer
                    const showResult = showFeedback && isSelected
                    
                    return (
                      <button
                        key={index}
                        disabled={selectedAnswer !== null}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${
                          showResult
                            ? isCorrect
                              ? 'border-[#0fb38a]'
                              : 'border-[#f56a3f]'
                            : selectedAnswer !== null
                            ? 'opacity-50'
                            : 'hover:border-[#0fb38a]/50'
                        }`}
                        style={{
                          background: showResult
                            ? isCorrect
                              ? 'rgba(15, 179, 138, 0.1)'
                              : 'rgba(245, 106, 63, 0.1)'
                            : 'var(--card)',
                          borderColor: showResult
                            ? isCorrect
                              ? 'rgba(15, 179, 138, 0.3)'
                              : 'rgba(245, 106, 63, 0.3)'
                            : 'rgba(15, 23, 42, 0.12)',
                          color: 'var(--text-main)',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-semibold" style={{ color: 'var(--accent)' }}>{String.fromCharCode(65 + index)}.</span>
                          <span>{option.text}</span>
                          {showResult && (
                            <span className="ml-auto text-lg">
                              {isCorrect ? '✓' : '✗'}
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
                
                {showFeedback && selectedAnswer !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-6 rounded-lg"
                    style={{ background: 'rgba(15, 179, 138, 0.1)', border: '1px solid rgba(15, 179, 138, 0.3)' }}
                  >
                    <p className="font-semibold" style={{ color: 'var(--accent)' }}>
                      {currentQuestion.options[selectedAnswer].feedback}
                    </p>
                  </motion.div>
                )}

                {showFeedback && (
                  <div className="flex flex-wrap justify-between gap-4">
                    <button
                      onClick={handleGenerateNewQuestion}
                      disabled={loading}
                      className="btn-secondary px-6 py-3"
                    >
                      Nouveau quiz
                    </button>
                    {quizQuestions.length > 1 && (
                      <button
                        onClick={handleNextQuiz}
                        disabled={loading}
                        className="btn-primary px-8 py-3 inline-flex items-center gap-2"
                      >
                        Question suivante
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12" style={{ color: 'var(--text-subtle)' }}>
                Sélectionnez le nombre de questions pour commencer
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

