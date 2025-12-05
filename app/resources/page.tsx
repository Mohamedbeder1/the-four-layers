'use client'

import { motion } from 'framer-motion'
import { Download, Book, Video, FileText, Terminal, Code, Cloud, Package, GitBranch, Server, Cpu, HardDrive, Users, MessageCircle, Laptop, Globe, BookOpen, Rocket } from 'lucide-react'

const resources = [
  {
    category: 'Distributions Linux Éducatives',
    icon: Laptop,
    emoji: '🐧',
    description: 'Systèmes d\'exploitation libres adaptés pour l\'éducation',
    items: [
      {
        title: 'PrimTux',
        description: 'Distribution pour le primaire avec interface adaptée et applications éducatives intégrées',
        link: 'https://primtux.fr/',
        type: 'Distro',
        tag: 'Primaire'
      },
      {
        title: 'Debian EDU',
        description: 'Solution complète pour établissements scolaires basée sur Debian',
        link: 'https://www.debian.org/devel/debian-edu/',
        type: 'Distro',
        tag: 'Tous niveaux'
      },
      {
        title: 'Ubuntu',
        description: 'Distribution populaire et stable, idéale pour débuter avec Linux',
        link: 'https://ubuntu.com/',
        type: 'Distro',
        tag: 'Débutant'
      },
      {
        title: 'Linux Mint',
        description: 'Interface familière pour ceux qui viennent de Windows',
        link: 'https://linuxmint.com/',
        type: 'Distro',
        tag: 'Débutant'
      },
      {
        title: 'Fedora',
        description: 'Distribution innovante avec les dernières technologies libres',
        link: 'https://fedoraproject.org/',
        type: 'Distro',
        tag: 'Avancé'
      },
    ],
  },
  {
    category: 'Documentation NIRD Officielle',
    icon: BookOpen,
    emoji: '📚',
    description: 'Guides et ressources du projet NIRD',
    items: [
      {
        title: 'Documentation Forge NIRD',
        description: 'Documentation complète du projet NIRD et guides de migration',
        link: 'https://docs.forge.apps.education.fr/',
        type: 'Docs',
        tag: 'Officiel'
      },
      {
        title: 'Forge des Communs Numériques',
        description: 'Plateforme collaborative pour les ressources éducatives libres',
        link: 'https://forge.apps.education.fr/nird',
        type: 'Plateforme',
        tag: 'Officiel'
      },
      {
        title: 'Apps.education.fr',
        description: 'Services numériques libres pour l\'éducation nationale',
        link: 'https://apps.education.fr/',
        type: 'Portail',
        tag: 'Officiel'
      },
    ],
  },
  {
    category: 'Communautés & Support',
    icon: Users,
    emoji: '💬',
    description: 'Rejoignez les communautés pour échanger et obtenir de l\'aide',
    items: [
      {
        title: 'r/linux - Reddit',
        description: 'Communauté mondiale Linux avec 2M+ membres, discussions et entraide',
        link: 'https://www.reddit.com/r/linux/',
        type: 'Forum',
        tag: 'Communauté'
      },
      {
        title: 'r/linuxquestions',
        description: 'Questions et réponses pour débutants et experts',
        link: 'https://www.reddit.com/r/linuxquestions/',
        type: 'Forum',
        tag: 'Support'
      },
      {
        title: 'Forum Tchap NIRD',
        description: 'Espace d\'échange sécurisé pour la communauté NIRD française',
        link: 'https://edurl.fr/tchap-laforgeedu-nird',
        type: 'Chat',
        tag: 'NIRD'
      },
      {
        title: 'Ask Ubuntu',
        description: 'Questions/réponses communautaires pour Ubuntu',
        link: 'https://askubuntu.com/',
        type: 'Q&A',
        tag: 'Ubuntu'
      },
    ],
  },
  {
    category: 'Projets Open Source Incontournables',
    icon: Rocket,
    emoji: '🚀',
    description: 'Logiciels libres populaires pour remplacer les solutions propriétaires',
    items: [
      {
        title: 'LibreOffice',
        description: 'Suite bureautique complète (traitement de texte, tableur, présentation)',
        link: 'https://www.libreoffice.org/',
        type: 'Application',
        tag: 'Bureautique'
      },
      {
        title: 'GIMP',
        description: 'Éditeur d\'images professionnel, alternative à Photoshop',
        link: 'https://www.gimp.org/',
        type: 'Application',
        tag: 'Graphisme'
      },
      {
        title: 'Firefox',
        description: 'Navigateur web respectueux de la vie privée',
        link: 'https://www.mozilla.org/firefox/',
        type: 'Application',
        tag: 'Navigation'
      },
      {
        title: 'VLC Media Player',
        description: 'Lecteur multimédia universel pour tous formats',
        link: 'https://www.videolan.org/',
        type: 'Application',
        tag: 'Multimédia'
      },
      {
        title: 'Nextcloud',
        description: 'Cloud personnel et souverain pour stocker et partager vos fichiers',
        link: 'https://nextcloud.com/',
        type: 'Plateforme',
        tag: 'Cloud'
      },
      {
        title: 'Moodle',
        description: 'Plateforme d\'apprentissage en ligne utilisée mondialement',
        link: 'https://moodle.org/',
        type: 'Plateforme',
        tag: 'E-learning'
      },
    ],
  },
  {
    category: 'Guides & Tutoriels',
    icon: Book,
    emoji: '📖',
    description: 'Apprenez à installer, configurer et utiliser Linux',
    items: [
      {
        title: 'Guide d\'installation Linux',
        description: 'Tutoriel complet pour installer Linux sur n\'importe quel PC',
        link: 'https://doc.ubuntu-fr.org/tutoriel/obtenir_cd_ubuntu',
        type: 'Guide',
        tag: 'Installation'
      },
      {
        title: 'Commandes Linux essentielles',
        description: 'Les commandes de base du terminal Linux pour débutants',
        link: 'https://doc.ubuntu-fr.org/tutoriel/console_commandes_de_base',
        type: 'Guide',
        tag: 'Terminal'
      },
      {
        title: 'Reconditionnement PC',
        description: 'Donnez une seconde vie à vos anciens ordinateurs avec Linux',
        link: 'https://primtux.fr/telechargement',
        type: 'Guide',
        tag: 'Recyclage'
      },
      {
        title: 'Migration vers le Libre',
        description: 'Checklist et conseils pour migrer un établissement vers Linux',
        link: 'https://docs.forge.apps.education.fr/',
        type: 'PDF',
        tag: 'Migration'
      },
    ],
  },
]

export default function ResourcesPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4" style={{ color: 'var(--text-main)' }}>
            📚 Ressources Libres
            </h1>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--text-subtle)' }}>
            Découvrez toutes les ressources dont vous avez besoin pour passer au libre : distributions Linux, 
            logiciels open source, communautés d'entraide et guides pratiques
            </p>
        </motion.div>

        {/* Resources by Category */}
        {resources.map((category, categoryIndex) => {
          const Icon = category.icon
          return (
            <motion.section
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="mb-12 sm:mb-16"
            >
              {/* Category Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl sm:text-4xl">{category.emoji}</span>
                  <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-main)' }}>
                      {category.category}
                  </h2>
                </div>
                <p className="text-base sm:text-lg ml-12 sm:ml-14" style={{ color: 'var(--text-subtle)' }}>
                  {category.description}
                </p>
              </div>

              {/* Resources Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {category.items.map((item, itemIndex) => (
                  <motion.a
                      key={item.title}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: itemIndex * 0.05 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="card group cursor-pointer"
                  >
                    {/* Header with tag */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold mb-1 group-hover:text-blue-600 transition-colors" style={{ color: 'var(--text-main)' }}>
                          {item.title}
                        </h3>
                      </div>
                      <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 whitespace-nowrap">
                        {item.tag}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-subtle)' }}>
                      {item.description}
                    </p>

                    {/* Footer with type */}
                    <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                      <span className="text-xs font-medium" style={{ color: 'var(--text-subtle)' }}>
                        {item.type}
                      </span>
                      <span className="text-blue-600 group-hover:translate-x-1 transition-transform inline-block">
                        →
                      </span>
                        </div>
                  </motion.a>
                ))}
              </div>
            </motion.section>
          )
        })}

        {/* Help Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="card max-w-4xl mx-auto text-center p-6 sm:p-8" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))' }}>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: 'var(--text-main)' }}>
              💡 Besoin d'aide ?
          </h2>
            <p className="text-base sm:text-lg mb-6 leading-relaxed" style={{ color: 'var(--text-subtle)' }}>
              Rejoignez nos communautés d'entraide ! Des milliers de personnes partagent leurs connaissances 
              et répondent à vos questions chaque jour.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://www.reddit.com/r/linux/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-white rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
              >
                r/linux sur Reddit
              </a>
              <a
                href="https://edurl.fr/tchap-laforgeedu-nird"
                  target="_blank"
                  rel="noopener noreferrer"
                className="px-5 py-2.5 bg-blue-600 rounded-lg font-semibold text-white hover:bg-blue-700 transition-colors shadow-lg"
              >
                Forum NIRD
              </a>
                  </div>
          </div>
        </motion.section>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-sm mb-2" style={{ color: 'var(--text-subtle)' }}>
            ✨ Toutes les ressources listées sont 100% libres et open source
          </p>
          <p className="text-sm" style={{ color: 'var(--text-subtle)' }}>
            Contribuez au projet sur{' '}
            <a 
              href="https://forge.apps.education.fr/nird" 
              className="font-semibold hover:underline" 
              style={{ color: 'var(--accent-strong)' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              forge.apps.education.fr/nird
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
