import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Index Livingmall Saraburi - Air Quality Dashboard',
  description: 'Powered by Coral Life',
  generator: 'Coral Life',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
 
      <body>{children}</body>
    </html>
  )
}
