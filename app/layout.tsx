import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'OwnerIntel',
  description: 'Building-ownership intelligence',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
