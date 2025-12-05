'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, XCircle, TrendingUp, DollarSign, Cloud, Shield, Terminal, Users, Leaf, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-subtle)' }}>
              À propos
            </p>
            <h1 className="text-5xl md:text-7xl font-bold mb-4" style={{ color: 'var(--text-main)' }}>
              Le Défi du Big Tech
            </h1>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--text-subtle)' }}>
              Comprendre le problème et découvrir la solution NIRD
            </p>
          </div>
        </motion.div>

        {/* Problem Overview */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card mb-8"
            style={{ borderColor: 'rgba(245, 106, 63, 0.3)', background: 'rgba(255, 241, 232, 0.5)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245, 106, 63, 0.15)' }}>
                <AlertTriangle className="w-6 h-6" style={{ color: 'var(--warning)' }} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-subtle)' }}>
                  Le Problème
                </p>
                <h2 className="text-3xl font-bold" style={{ color: 'var(--text-main)' }}>Le Problème</h2>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: XCircle,
                  title: 'Obsolescence de Windows 10',
                  description: 'Des millions de PC deviennent obsolètes à cause de la fin du support',
                  color: 'text-red-400',
                  bg: 'bg-red-500/10',
                  border: 'border-red-500/30',
                },
                {
                  icon: DollarSign,
                  title: 'Licences coûteuses',
                  description: 'Les coûts de licences s\'accumulent et pèsent sur les budgets',
                  color: 'text-red-400',
                  bg: 'bg-red-500/10',
                  border: 'border-red-500/30',
                },
                {
                  icon: Cloud,
                  title: 'Écosystèmes fermés',
                  description: 'Dépendance aux services cloud stockés hors de l\'UE',
                  color: 'text-red-400',
                  bg: 'bg-red-500/10',
                  border: 'border-red-500/30',
                },
                {
                  icon: Shield,
                  title: 'Souveraineté numérique',
                  description: 'Perte de contrôle sur les données et les outils',
                  color: 'text-red-400',
                  bg: 'bg-red-500/10',
                  border: 'border-red-500/30',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`${item.bg} ${item.border} border rounded-lg p-4 flex gap-4`}
                >
                  <item.icon className={`w-8 h-8 ${item.color} flex-shrink-0`} />
                  <div>
                    <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-main)' }}>{item.title}</h3>
                    <p className="text-sm" style={{ color: 'var(--text-subtle)' }}>{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Comparison Infographic */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-8"
            style={{ color: 'var(--text-main)' }}
          >
            École Big Tech vs École NIRD
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Big Tech School */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card"
              style={{ borderColor: 'rgba(245, 106, 63, 0.3)', background: 'rgba(255, 241, 232, 0.5)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245, 106, 63, 0.15)' }}>
                  <XCircle className="w-5 h-5" style={{ color: 'var(--warning)' }} />
                </div>
                <h3 className="text-2xl font-bold" style={{ color: 'var(--warning)' }}>École Big Tech</h3>
              </div>
              <div className="text-sm space-y-2">
                {[
                  'Renouvellement forcé du parc tous les 5 ans',
                  'Coûts élevés de licences',
                  'Dépendance aux services cloud',
                  'Données stockées hors UE',
                  'Obsolescence programmée',
                  'Fracture numérique accrue',
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-2" style={{ color: 'var(--text-subtle)' }}>
                    <span style={{ color: 'var(--warning)' }}>-</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* NIRD School */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card"
              style={{ borderColor: 'rgba(15, 179, 138, 0.3)', background: 'rgba(232, 248, 240, 0.5)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(15, 179, 138, 0.18)' }}>
                  <CheckCircle className="w-5 h-5" style={{ color: 'var(--accent-strong)' }} />
                </div>
                <h3 className="text-2xl font-bold" style={{ color: 'var(--accent-strong)' }}>École NIRD</h3>
              </div>
              <div className="text-sm space-y-2">
                {[
                  'Reconditionnement et prolongation de vie',
                  'Logiciels libres et gratuits',
                  'Solutions souveraines et locales',
                  'Données protégées et maîtrisées',
                  'Durabilité et responsabilité',
                  'Inclusion numérique renforcée',
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-2" style={{ color: 'var(--text-subtle)' }}>
                    <span style={{ color: 'var(--accent-strong)' }}>+</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* NIRD Solution - Terminal Style */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-green-500/10 to-cyan-500/10 border-2 border-green-500/30 rounded-xl p-8 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/30">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="font-mono text-sm text-green-400 mb-1">
                  <span className="text-green-500">[SUCCESS]</span> Notre Stratégie Village
                </div>
                <h2 className="text-3xl font-bold text-green-300">Notre Stratégie Village</h2>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  icon: Users,
                  title: 'Inclusion',
                  actions: [
                    'Réutilisation des PC',
                    'Accès équitable',
                    'Réduction de la fracture',
                  ],
                  color: 'from-green-500 to-emerald-500',
                  bg: 'bg-green-500/10',
                  border: 'border-green-500/30',
                },
                {
                  icon: Shield,
                  title: 'Responsabilité',
                  actions: [
                    'Promotion de Linux',
                    'Ressources éducatives libres',
                    'Souveraineté numérique',
                  ],
                  color: 'from-cyan-500 to-blue-500',
                  bg: 'bg-cyan-500/10',
                  border: 'border-cyan-500/30',
                },
                {
                  icon: Leaf,
                  title: 'Durabilité',
                  actions: [
                    'Sobriété numérique',
                    'Reconditionnement',
                    'Maîtrise des coûts',
                  ],
                  color: 'from-blue-500 to-purple-500',
                  bg: 'bg-blue-500/10',
                  border: 'border-blue-500/30',
                },
              ].map((pillar, index) => {
                const Icon = pillar.icon
                return (
                  <motion.div
                    key={pillar.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`${pillar.bg} ${pillar.border} border-2 rounded-xl p-6 text-center`}
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${pillar.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-main)' }}>{pillar.title}</h3>
                    <ul className="space-y-2 text-sm">
                      {pillar.actions.map((action, i) => (
                        <li key={i} className="flex items-center justify-center gap-2" style={{ color: 'var(--text-subtle)' }}>
                          <TrendingUp className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </section>

        {/* Quiz moved to home page - CTA to go there
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card text-center"
            style={{ borderColor: 'rgba(15, 179, 138, 0.3)', background: 'rgba(232, 248, 240, 0.5)' }}
          >
            <div className="inline-block mb-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: 'rgba(15, 179, 138, 0.1)' }}>
                <Terminal className="w-8 h-8" style={{ color: 'var(--accent)' }} />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--text-main)' }}>
              Testez vos connaissances !
            </h2>
            <p className="text-base mb-6 max-w-2xl mx-auto" style={{ color: 'var(--text-subtle)' }}>
              Découvrez notre quiz interactif sur le numérique libre, responsable et durable.
              Mesurez vos connaissances sur NIRD et apprenez-en plus !
            </p>
            <Link href="/" className="btn-primary inline-flex items-center gap-2">
              Accéder au Quiz
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </section> */}

        {/* Command Examples */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-900/50 border border-green-500/30 rounded-xl p-8"
          >
            <div className="font-mono text-green-400 text-sm mb-4">
              <span className="text-green-500">$</span> cat commands.txt
            </div>
            <h2 className="text-2xl font-bold mb-6 text-white font-mono">Commandes NIRD</h2>
            <div className="space-y-4 font-mono text-sm">
              {[
                { cmd: 'sudo apt install freedom', desc: 'Installer la liberté numérique' },
                { cmd: 'echo "libre > propriétaire"', desc: 'Afficher la philosophie NIRD' },
                { cmd: 'git clone https://forge.apps.education.fr/nird', desc: 'Cloner le projet NIRD' },
                { cmd: './reconditionner_pc.sh', desc: 'Script de reconditionnement' },
              ].map((item, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="text-green-400 mb-1">
                    <span className="text-cyan-400">nird@village</span>:<span className="text-blue-400">~</span>$ {item.cmd}
                  </div>
                  <div className="text-gray-400 text-xs ml-4">
                    # {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
