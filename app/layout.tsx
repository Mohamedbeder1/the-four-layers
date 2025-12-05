import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import Header from '@/components/Header'
import TerminalNavigator from '@/components/TerminalNavigator'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Village Numérique Résistant - NIRD',
  description: 'Découvrez comment les écoles peuvent résister au Big Tech et adopter des pratiques numériques durables et responsables.',
  keywords: 'NIRD, numérique responsable, Linux, éducation, logiciels libres',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Force light mode immediately - before page renders
              (function() {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
                
                // Override any system preference
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col transition-colors font-sans">
        <ThemeProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <TerminalNavigator />
        </ThemeProvider>
      </body>
    </html>
  )
}

