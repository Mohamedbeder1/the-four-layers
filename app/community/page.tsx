'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle, Github, Mail, MessageCircle, Plus, FileQuestion } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CommunityPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    idea: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [questionForm, setQuestionForm] = useState({
    question_text: '',
    question_type: 'village',
    level: 'beginner',
    age_group: '18+',
    building_id: '',
    options: [{ text: '', points: 10, feedback: '' }],
    correct_answer: 0,
    points: 10,
  })


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const submissions = JSON.parse(localStorage.getItem('communityIdeas') || '[]')
    submissions.push({
      ...formData,
      date: new Date().toISOString(),
    })
    localStorage.setItem('communityIdeas', JSON.stringify(submissions))
    
    setSubmitted(true)
    setFormData({ name: '', role: '', idea: '' })
    
    setTimeout(() => setSubmitted(false), 5000)
  }

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Save question locally instead of sending to API
    const questions = JSON.parse(localStorage.getItem('userQuestions') || '[]')
    questions.push({
      ...questionForm,
      date: new Date().toISOString(),
    })
    localStorage.setItem('userQuestions', JSON.stringify(questions))
    
    setShowQuestionForm(false)
    setQuestionForm({
      question_text: '',
      question_type: 'village',
      level: 'beginner',
      age_group: '18+',
      building_id: '',
      options: [{ text: '', points: 10, feedback: '' }],
      correct_answer: 0,
      points: 10,
    })
    alert('Question enregistrée localement ! Merci pour votre contribution.')
  }

  const addOption = () => {
    setQuestionForm({
      ...questionForm,
      options: [...questionForm.options, { text: '', points: 10, feedback: '' }],
    })
  }

  const downloadCSV = () => {
    const submissions = JSON.parse(localStorage.getItem('communityIdeas') || '[]')
    if (submissions.length === 0) {
      alert('Aucune soumission à télécharger')
      return
    }

    const headers = ['Nom', 'Rôle', 'Idée', 'Date']
    const rows = submissions.map((sub: any) => [
      sub.name,
      sub.role,
      sub.idea,
      new Date(sub.date).toLocaleDateString('fr-FR'),
    ])

    const csv = [
      headers.join(','),
      ...rows.map((row: string[]) => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `nird-community-ideas-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <div className="min-h-screen py-12" style={{ background: 'var(--bg)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-main)' }}>
            Communauté et Contribution
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--text-subtle)' }}>
            Partagez vos idées et participez à la construction du Village Numérique Résistant
          </p>
        </motion.div>

        {/* Submit Question Button */}
        <div className="mb-8 text-center">
          <button
            onClick={() => setShowQuestionForm(!showQuestionForm)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <FileQuestion className="w-5 h-5" />
            {showQuestionForm ? 'Masquer le formulaire' : 'Soumettre une question'}
          </button>
        </div>

        {/* Question Form */}
        {showQuestionForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-8"
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-main)' }}>Soumettre une Question</h2>
            <form onSubmit={handleQuestionSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-main)' }}>
                  Type de question
                </label>
                <select
                  value={questionForm.question_type}
                  onChange={(e) => setQuestionForm({ ...questionForm, question_type: e.target.value })}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                  style={{ 
                    background: 'var(--card)', 
                    borderColor: 'rgba(15, 23, 42, 0.12)', 
                    color: 'var(--text-main)',
                  }}
                >
                  <option value="village">Village Scenario</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-main)' }}>
                  Question
                </label>
                <textarea
                  required
                  rows={3}
                  value={questionForm.question_text}
                  onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                  style={{ 
                    background: 'var(--card)', 
                    borderColor: 'rgba(15, 23, 42, 0.12)', 
                    color: 'var(--text-main)',
                  }}
                  placeholder="Votre question..."
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-main)' }}>Niveau</label>
                  <select
                    value={questionForm.level}
                    onChange={(e) => setQuestionForm({ ...questionForm, level: e.target.value })}
                    className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                    style={{ 
                      background: 'var(--card)', 
                      borderColor: 'rgba(15, 23, 42, 0.12)', 
                      color: 'var(--text-main)',
                    }}
                  >
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="advanced">Avancé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-main)' }}>Groupe d'âge</label>
                  <select
                    value={questionForm.age_group}
                    onChange={(e) => setQuestionForm({ ...questionForm, age_group: e.target.value })}
                    className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                    style={{ 
                      background: 'var(--card)', 
                      borderColor: 'rgba(15, 23, 42, 0.12)', 
                      color: 'var(--text-main)',
                    }}
                  >
                    <option value="14-">14 ou moins</option>
                    <option value="15-17">15 à 17</option>
                    <option value="18+">18 et plus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-main)' }}>Bâtiment (si village)</label>
                  <input
                    type="text"
                    value={questionForm.building_id}
                    onChange={(e) => setQuestionForm({ ...questionForm, building_id: e.target.value })}
                    className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                    style={{ 
                      background: 'var(--card)', 
                      borderColor: 'rgba(15, 23, 42, 0.12)', 
                      color: 'var(--text-main)',
                    }}
                    placeholder="lab, library, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-main)' }}>Options</label>
                {questionForm.options.map((option, index) => (
                  <div key={index} className="card mb-4 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="radio"
                        name="correct_answer"
                        checked={questionForm.correct_answer === index}
                        onChange={() => setQuestionForm({ ...questionForm, correct_answer: index })}
                        className="w-4 h-4"
                        style={{ accentColor: 'var(--accent)' }}
                      />
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>Réponse correcte</span>
                    </div>
                    <input
                      type="text"
                      required
                      value={option.text}
                      onChange={(e) => {
                        const newOptions = [...questionForm.options]
                        newOptions[index].text = e.target.value
                        setQuestionForm({ ...questionForm, options: newOptions })
                      }}
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none mb-2"
                      style={{ 
                        background: 'var(--card)', 
                        borderColor: 'rgba(15, 23, 42, 0.12)', 
                        color: 'var(--text-main)',
                      }}
                      placeholder="Texte de l'option"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={option.points}
                        onChange={(e) => {
                          const newOptions = [...questionForm.options]
                          newOptions[index].points = parseInt(e.target.value) || 0
                          setQuestionForm({ ...questionForm, options: newOptions })
                        }}
                        className="px-4 py-2 border-2 rounded-lg focus:outline-none"
                        style={{ 
                          background: 'var(--card)', 
                          borderColor: 'rgba(15, 23, 42, 0.12)', 
                          color: 'var(--text-main)',
                        }}
                        placeholder="Points"
                      />
                      <input
                        type="text"
                        value={option.feedback}
                        onChange={(e) => {
                          const newOptions = [...questionForm.options]
                          newOptions[index].feedback = e.target.value
                          setQuestionForm({ ...questionForm, options: newOptions })
                        }}
                        className="px-4 py-2 border-2 rounded-lg focus:outline-none"
                        style={{ 
                          background: 'var(--card)', 
                          borderColor: 'rgba(15, 23, 42, 0.12)', 
                          color: 'var(--text-main)',
                        }}
                        placeholder="Feedback"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOption}
                  className="btn-outline text-sm"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Ajouter une option
                </button>
              </div>

              <button type="submit" className="btn-primary w-full">
                Soumettre (enregistré localement)
              </button>
            </form>
          </motion.div>
        )}

        {/* Submit Idea Form */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-main)' }}>Soumettre une Idée</h2>
            
            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 rounded-lg flex items-center gap-3"
                style={{ background: 'rgba(15, 179, 138, 0.1)', border: '1px solid rgba(15, 179, 138, 0.3)' }}
              >
                <CheckCircle className="w-6 h-6" style={{ color: 'var(--accent-strong)' }} />
                <p className="font-semibold" style={{ color: 'var(--accent-strong)' }}>
                  Merci ! Votre idée a été enregistrée localement.
                </p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-main)' }}>
                Nom
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors"
                style={{ 
                  background: 'var(--card)', 
                  borderColor: 'rgba(15, 23, 42, 0.12)', 
                  color: 'var(--text-main)',
                }}
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-main)' }}>
                Rôle
              </label>
              <select
                id="role"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors"
                style={{ 
                  background: 'var(--card)', 
                  borderColor: 'rgba(15, 23, 42, 0.12)', 
                  color: 'var(--text-main)',
                }}
              >
                <option value="">Sélectionnez votre rôle</option>
                <option value="student">Étudiant</option>
                <option value="teacher">Enseignant</option>
                <option value="admin">Administrateur</option>
                <option value="parent">Parent</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label htmlFor="idea" className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-main)' }}>
                Description de l&apos;idée
              </label>
              <textarea
                id="idea"
                required
                value={formData.idea}
                onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors resize-none"
                style={{ 
                  background: 'var(--card)', 
                  borderColor: 'rgba(15, 23, 42, 0.12)', 
                  color: 'var(--text-main)',
                }}
                placeholder="Décrivez votre idée pour améliorer le Village NIRD..."
              />
            </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Soumettre
                </button>
                <button
                  type="button"
                  onClick={downloadCSV}
                  className="btn-outline"
                >
                  Télécharger CSV
                </button>
              </div>
            </form>
          </motion.div>
        </section>

        {/* Links Section */}
        <section>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-8"
            style={{ color: 'var(--text-main)' }}
          >
            Rejoignez la Communauté
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: 'Forum Tchap',
                description: 'Échangez avec la communauté NIRD',
                link: 'https://edurl.fr/tchap-laforgeedu-nird',
                icon: MessageCircle,
                color: 'var(--info)',
              },
              {
                title: 'GitLab',
                description: 'Contribuez au code et aux ressources',
                link: 'https://forge.apps.education.fr/nird',
                icon: Github,
                color: 'var(--accent)',
              },
              {
                title: 'Contact',
                description: 'Envoyez-nous un message',
                link: 'mailto:contact@nird.fr',
                icon: Mail,
                color: 'var(--durable)',
              },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <motion.a
                  key={item.title}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card hover:scale-105 text-white"
                  style={{ background: item.color }}
                >
                  <Icon className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-white/90">{item.description}</p>
                </motion.a>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
