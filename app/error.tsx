'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
      <div className="text-center px-4 max-w-md">
        <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Une erreur s&apos;est produite
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message || 'Une erreur inattendue s&apos;est produite. Veuillez réessayer.'}
        </p>
        <button
          onClick={reset}
          className="btn-primary"
        >
          Réessayer
        </button>
      </div>
    </div>
  )
}

