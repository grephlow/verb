import React from 'react'

// Root layout intentionally renders no html/body shell — the (frontend)
// route group layout renders its own <html><body>.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
