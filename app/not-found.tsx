import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Page non trouvée</h2>
        <p className="text-xl text-gray-600 mb-8">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="btn-primary inline-flex items-center gap-2"
        >
          <Home className="w-5 h-5" />
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  )
}

