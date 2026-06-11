'use client'
import { useState } from 'react'

interface Props {
  formTitle: string
  formSuccessMessage: string
}

export default function ContactForm({ formTitle, formSuccessMessage }: Props) {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name    = (fd.get('name') as string).trim()
    const email   = (fd.get('email') as string).trim()
    const subject = fd.get('subject') as string
    const message = (fd.get('message') as string).trim()
    const country = (fd.get('country') as string).trim()

    const errs: Record<string, string> = {}
    if (!name) errs.name = 'Name is required'
    if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) errs.email = 'Valid email required'
    if (!message || message.length < 20) errs.message = 'Message must be at least 20 characters'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setErrors({})
    setServerError('')
    setLoading(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, country }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setServerError(data.error || 'Something went wrong. Please try again.')
      } else {
        setSent(true)
      }
    } catch {
      setServerError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h2 style={{ color: 'var(--navy-2)', marginBottom: 10 }}>Message sent!</h2>
        <p style={{ color: 'var(--muted)' }}>{formSuccessMessage}</p>
        <button className="btn btn-ghost" style={{ marginTop: 20 }} onClick={() => setSent(false)}>
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 style={{ marginBottom: 20, color: 'var(--navy-2)' }}>{formTitle}</h2>
      <div className="form-grid">
        <div className="field">
          <label>Full Name *</label>
          <input name="name" type="text" placeholder="Your name" style={errors.name ? { borderColor: 'red' } : {}} />
          {errors.name && <small style={{ color: 'red' }}>{errors.name}</small>}
        </div>
        <div className="field">
          <label>Email Address *</label>
          <input name="email" type="email" placeholder="you@example.com" style={errors.email ? { borderColor: 'red' } : {}} />
          {errors.email && <small style={{ color: 'red' }}>{errors.email}</small>}
        </div>
        <div className="field">
          <label>Country</label>
          <input name="country" type="text" placeholder="Your country" />
        </div>
        <div className="field">
          <label>Subject</label>
          <select name="subject">
            <option>Participation inquiry</option>
            <option>Country representative application</option>
            <option>Partnership inquiry</option>
            <option>Technical support</option>
            <option>Other</option>
          </select>
        </div>
        <div className="field full">
          <label>Message *</label>
          <textarea name="message" rows={6} placeholder="Your message..." style={errors.message ? { borderColor: 'red' } : {}} />
          {errors.message && <small style={{ color: 'red' }}>{errors.message}</small>}
        </div>
      </div>
      {serverError && (
        <p style={{ color: 'red', fontSize: 14, marginBottom: 8, fontWeight: 700 }}>{serverError}</p>
      )}
      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
        {loading ? 'Sending…' : 'Send Message →'}
      </button>
    </form>
  )
}
