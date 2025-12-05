'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Terminal, Users, Shield, Leaf, Heart, Zap } from 'lucide-react'
import Link from 'next/link'

const pillars = [
  {
    id: 'inclusion',
    title: 'Inclusion',
    icon: Users,
    gradient: 'from-[#eab308] to-[#f59e0b]',
    description: 'Accès équitable au numérique',
    details: 'Réduction de la fracture numérique, réutilisation des PC, accès équitable pour tous',
    features: ['Réutilisation des PC', 'Accès équitable', 'Réduction de la fracture numérique'],
    color: 'var(--inclusion)',
  },
  {
    id: 'responsabilite',
    title: 'Responsabilité',
    icon: Shield,
    gradient: 'from-[#2563eb] to-[#1d4ed8]',
    description: 'Technologies souveraines',
    details: 'Promotion de Linux, ressources éducatives libres, souveraineté numérique et protection des données',
    features: ['Promotion de Linux', 'Ressources éducatives libres', 'Souveraineté numérique'],
    color: 'var(--info)',
  },
  {
    id: 'durabilite',
    title: 'Durabilité',
    icon: Leaf,
    gradient: 'from-[#16a34a] to-[#15803d]',
    description: 'Lutte contre l\'obsolescence',
    details: 'Sobriété numérique, reconditionnement, maîtrise des coûts, choix de Linux',
    features: ['Sobriété numérique', 'Reconditionnement', 'Maîtrise des coûts'],
    color: 'var(--durable)',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight" style={{ color: 'var(--text-main)' }}>
              Résistez au Big Tech
            </h1>
            <p className="text-xl md:text-2xl mb-8" style={{ color: 'var(--text-subtle)' }}>
              Adoptez des solutions libres, durables et souveraines pour votre établissement scolaire
            </p>
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/village" className="btn-primary inline-flex items-center gap-2">
                  Explorer le Village
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/swipe" className="btn-secondary inline-flex items-center gap-2">
                  Jeu de Décisions
                  <Terminal className="w-5 h-5" />
                </Link>
              </div>
              <Link href="/quiz" className="btn-secondary inline-flex items-center gap-2">
                Testez vos connaissances
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Three Pillars Section - Creative Design */}
      <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: 'var(--inclusion)' }}></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: 'var(--info)' }}></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 rounded-full blur-3xl" style={{ background: 'var(--durable)' }}></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(15, 179, 138, 0.1)' }}>
              <Heart className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--accent-strong)' }}>
                Les Trois Piliers de NIRD
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-main)' }}>
              Une approche complète pour{' '}
              <span className="bg-gradient-to-r from-[#0fb38a] to-[#2563eb] bg-clip-text text-transparent">
                transformer votre école
              </span>
            </h2>
            <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-subtle)' }}>
              Trois valeurs fondamentales qui guident chaque action vers un numérique plus inclusif, responsable et durable
            </p>
          </motion.div>

          {/* Pillars Grid */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon
              return (
                <motion.div
                  key={pillar.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative"
                >
                  {/* Card */}
                  <div
                    className="relative h-full p-8 rounded-2xl transition-all duration-500 cursor-pointer"
                    style={{
                      background: 'var(--card)',
                      border: '1px solid rgba(15, 23, 42, 0.08)',
                      boxShadow: '0 4px 20px rgba(15, 23, 42, 0.06)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)'
                      e.currentTarget.style.boxShadow = '0 20px 60px rgba(15, 23, 42, 0.12)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(15, 23, 42, 0.06)'
                    }}
                  >
                    {/* Gradient overlay on hover */}
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${pillar.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                    ></div>

                    {/* Icon */}
                    <div className="relative mb-6">
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                        style={{
                          background: `linear-gradient(135deg, ${pillar.color}15, ${pillar.color}25)`,
                        }}
                      >
                        <Icon className="w-8 h-8" style={{ color: pillar.color }} />
                      </div>
                      <div className="absolute top-0 left-0 w-16 h-16 rounded-xl opacity-20 blur-xl" style={{ background: pillar.color }}></div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>
                      {pillar.title}
                    </h3>
                    <p className="text-sm font-semibold mb-4" style={{ color: pillar.color }}>
                      {pillar.description}
                    </p>
                    <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-subtle)' }}>
                      {pillar.details}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2">
                      {pillar.features.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 + idx * 0.05 }}
                          className="flex items-center gap-2 text-sm"
                          style={{ color: 'var(--text-subtle)' }}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: pillar.color }}
                          ></div>
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <div className="w-20 h-20 rounded-full blur-2xl" style={{ background: pillar.color }}></div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-16"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full" style={{ background: 'rgba(15, 179, 138, 0.08)' }}>
              <Zap className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>
                Ensemble, construisons un numérique plus responsable
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
