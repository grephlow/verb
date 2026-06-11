import React from 'react'

// Root layout intentionally renders no html/body shell.
// Each route group layout ((frontend) and (payload)) renders its own
// <html><body> so Payload's admin can set up its own providers correctly.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
