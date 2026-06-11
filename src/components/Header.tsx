import Link from 'next/link'
import Image from 'next/image'
import { getSiteSettings } from '@/lib/globals'
import { MobileToggle } from './MobileToggle'

export default async function Header() {
  const ss = await getSiteSettings()
  return (
    <>
      {/* ── Top strip ─────────────────────────────────────── */}
      <div className="top-strip">
        <div className="container">
          <span><b>Verbivore The Contest</b> — Global English Challenge</span>
          <span className="top-strip-sub">Preliminary • National Final • Grand Final</span>
        </div>
      </div>

      {/* ── Desktop header ────────────────────────────────── */}
      <header className="site-header" id="siteHeader">
        <div className="container navbar">
          <Link className="brand" href="/" aria-label="Verbivore Home">
            <Image src="/verbivore-logo.png" alt="Verbivore The Contest Logo" width={218} height={60} priority />
          </Link>
          <nav>
            <ul className="menu">
              <li><Link href="/">Home</Link></li>
              <li>
                <Link className="dropbtn" href="/verbivore">Verbivore ▾</Link>
                <div className="dropdown">
                  <Link href="/verbivore/about">About <span>→</span></Link>
                  <Link href="/verbivore/countries-territories">Countries &amp; Territories <span>→</span></Link>
                  {ss.showScientificCommittee !== false && (
                    <Link href="/verbivore/scientific-committee">Scientific Committee <span>→</span></Link>
                  )}
                  <Link href="/verbivore/regulations">Regulations <span>→</span></Link>
                  <Link href="/verbivore/categories">Categories <span>→</span></Link>
                  <Link href="/verbivore/sample-questions">Sample Questions <span>→</span></Link>
                  <Link href="/verbivore/preliminary-round">Preliminary Round <span>→</span></Link>
                  <Link href="/verbivore/national-final">National Final <span>→</span></Link>
                  <Link href="/verbivore/global-final">Global Final <span>→</span></Link>
                  <Link href="/verbivore/exam-time">Exam Time <span>→</span></Link>
                </div>
              </li>
              <li><Link href="/editions">Editions</Link></li>
              <li><Link href="/news">News</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </nav>
          <div className="header-actions">
            <Link className="btn btn-ghost" href="/verbivore/exam-time">Exam Time</Link>
            <Link className="btn btn-primary" href="/contact">Contact Us</Link>
          </div>

          {/* Hamburger — 3 animated lines */}
          <MobileToggle />
        </div>
      </header>

      {/* ── Mobile menu drawer ────────────────────────────── */}
      <div className="mob-menu" id="mobMenu" aria-hidden="true">
        <div className="mob-menu-inner">

          {/* Header row */}
          <div className="mob-menu-head">
            <Link href="/" className="mob-menu-logo" id="mobMenuLogoLink">
              <Image src="/verbivore-logo.png" alt="Verbivore" width={160} height={44} />
            </Link>
            <button className="mob-close-btn" id="mobCloseBtn" aria-label="Close menu">
              <span></span>
              <span></span>
            </button>
          </div>

          {/* Scrollable nav */}
          <nav className="mob-nav">
            <Link className="mob-nav-link" href="/">
              <span className="mob-nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>
              </span> Home
            </Link>

            <div className="mob-nav-divider">Verbivore</div>
            <Link className="mob-nav-sub" href="/verbivore/about">About</Link>
            <Link className="mob-nav-sub" href="/verbivore/countries-territories">Countries &amp; Territories</Link>
            {ss.showScientificCommittee !== false && (
              <Link className="mob-nav-sub" href="/verbivore/scientific-committee">Scientific Committee</Link>
            )}
            <Link className="mob-nav-sub" href="/verbivore/regulations">Regulations</Link>
            <Link className="mob-nav-sub" href="/verbivore/categories">Categories</Link>
            <Link className="mob-nav-sub" href="/verbivore/sample-questions">Sample Questions</Link>
            <Link className="mob-nav-sub" href="/verbivore/preliminary-round">Preliminary Round</Link>
            <Link className="mob-nav-sub" href="/verbivore/national-final">National Final</Link>
            <Link className="mob-nav-sub" href="/verbivore/global-final">Global Final</Link>
            <Link className="mob-nav-sub highlight" href="/verbivore/exam-time">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginRight:6,marginBottom:1}}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Exam Time
            </Link>

            <div className="mob-nav-divider">Explore</div>
            <Link className="mob-nav-link" href="/editions">
              <span className="mob-nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8m-4-4v4M5 3h14v9a7 7 0 01-14 0V3z"/><path d="M5 6H2a1 1 0 000 2c0 2 1.3 3.7 3 4.5"/><path d="M19 6h3a1 1 0 010 2c0 2-1.3 3.7-3 4.5"/></svg>
              </span> Editions
            </Link>
            <Link className="mob-nav-link" href="/news">
              <span className="mob-nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="7" y1="15" x2="12" y2="15"/><line x1="7" y1="18" x2="10" y2="18"/></svg>
              </span> News
            </Link>
            <Link className="mob-nav-link" href="/faq">
              <span className="mob-nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r=".5" fill="currentColor"/></svg>
              </span> FAQ
            </Link>
            <Link className="mob-nav-link" href="/contact">
              <span className="mob-nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
              </span> Contact
            </Link>
          </nav>

          {/* Footer CTAs */}
          <div className="mob-menu-footer">
            <Link className="btn btn-primary" href="/contact" style={{ width: '100%', justifyContent: 'center' }}>
              Contact Us →
            </Link>
            <Link className="btn btn-ghost" href="/certificate-verify" style={{ width: '100%', justifyContent: 'center' }}>
              Verify Certificate
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
