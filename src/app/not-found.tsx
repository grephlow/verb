import Link from 'next/link'
import './(frontend)/globals.css'

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
          <h1 style={{ fontSize: 72, color: 'var(--navy)' }}>404</h1>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>This page could not be found.</p>
          <Link href="/" className="btn btn-primary">Go home</Link>
        </div>
      </body>
    </html>
  )
}
