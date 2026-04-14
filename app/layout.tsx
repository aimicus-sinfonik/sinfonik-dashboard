import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sinfonik Impact Dashboard',
  description: 'Regional economic impact model for the Sinfonik music ecosystem — starting with New York City.',
  openGraph: {
    title: 'Sinfonik Impact Dashboard',
    description: 'See how Sinfonik transforms songwriter income, local music economies, and regional growth.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
