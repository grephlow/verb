import Link from 'next/link'
import { getNationalFinalResources } from '@/lib/globals'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'National Final | Verbivore The Contest' }

type CatGroup    = { category: string; grade: string; files: { title: string; pdfUrl: string }[] }
type RoundGroup  = { roundLabel: string; roundIcon: string; categories: CatGroup[] }
type ResultRound = { roundLabel: string; roundIcon: string; countries: { country: string; meta: string; pdfUrl: string }[] }

function groupByRound(items: any[]): RoundGroup[] {
  const map: Record<string, RoundGroup> = {}
  for (const item of items) {
    if (!map[item.roundLabel]) map[item.roundLabel] = { roundLabel: item.roundLabel, roundIcon: item.roundIcon || '📋', categories: [] }
    const r = map[item.roundLabel]
    let cat = r.categories.find(c => c.category === item.category)
    if (!cat) { cat = { category: item.category || '', grade: item.grade || '', files: [] }; r.categories.push(cat) }
    cat.files.push({ title: item.title || '', pdfUrl: item.pdfUrl || '#' })
  }
  return Object.values(map)
}

function groupResults(items: any[]): ResultRound[] {
  const map: Record<string, ResultRound> = {}
  for (const item of items) {
    if (!map[item.roundLabel]) map[item.roundLabel] = { roundLabel: item.roundLabel, roundIcon: item.roundIcon || '🏅', countries: [] }
    map[item.roundLabel].countries.push({ country: item.country?.name || '', meta: item.countryMeta || 'PDF', pdfUrl: item.pdfUrl || '#' })
  }
  return Object.values(map)
}

const STEPS = [
  { n: '01', title: 'Qualification',  text: 'Top scorers from the Preliminary Round receive an invitation from their national representative.' },
  { n: '02', title: 'Exam Day',        text: 'A harder paper completed at the national representative venue. Duration: 90–120 minutes.' },
  { n: '03', title: 'Grand Final',     text: 'National medal winners and Grand Final invitees are announced within 4 weeks of the exam.' },
]
const KEY_INFO: [string, string, string][] = [
  ['⏱️', 'Duration',     '90–120 minutes'],
  ['📋', 'Format',       'Paper-based + optional oral'],
  ['🎯', 'Eligibility',  'Top % from Preliminary Round'],
  ['🏆', 'Advancement',  'Grand Final invitation'],
]
const AWARD_TAGS = ['🥇 Gold Medal','🥈 Silver Medal','🥉 Bronze Medal','📜 Certificate','🏆 Grand Final Invite']

export default async function NationalFinalPage() {
  const docs = await getNationalFinalResources()

  const sampleGroups   = groupByRound(docs.filter((d: any) => d.type === 'sample-question'))
  const syllabusGroups = groupByRound(docs.filter((d: any) => d.type === 'syllabus'))
  const resultGroups   = groupResults(docs.filter((d: any) => d.type === 'result'))

  return (
    <>
      {/* ── HERO ── */}
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link> <span>›</span>
            <Link href="/verbivore">Verbivore</Link> <span>›</span>
            <span>National Final</span>
          </div>
          <h1>National Final</h1>
          <p>The second stage of Verbivore. Top scorers from the Preliminary Round compete in a country-level final, qualifying the best for the Grand Final.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 24 }}>
            <a className="btn btn-primary" href="#sample-questions">Nümunə suallar</a>
            <a className="btn btn-blue"    href="#syllabus">Sillabus</a>
            <a className="btn btn-outline" href="#results">Nəticələr</a>
          </div>
        </div>
      </section>

      {/* ── INFO GRID ── */}
      <section className="desk-only">
        <div className="container">
          <div className="prelim-info-grid">

            {/* How it works */}
            <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '22px 26px', borderBottom: '1px solid var(--line)' }}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 950, color: 'var(--navy-2)', letterSpacing: '-.3px' }}>How it works</h2>
                <p style={{ margin: '8px 0 0', color: 'var(--muted)', fontSize: 14, lineHeight: 1.55 }}>National Final mərhələsinin əsas proses xəritəsi.</p>
              </div>
              <div className="prelim-step-list">
                {STEPS.map(({ n, title, text }) => (
                  <div key={n} className="prelim-step">
                    <span className="prelim-step-no">{n}</span>
                    <div>
                      <strong style={{ display: 'block', color: 'var(--navy-2)', fontWeight: 950, marginBottom: 5, fontSize: 15 }}>{title}</strong>
                      <p style={{ margin: 0, color: 'var(--muted)', fontSize: 14, lineHeight: 1.55, fontWeight: 600 }}>{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Side cards */}
            <div style={{ display: 'grid', gap: 16 }}>
              <div className="panel">
                <h3 style={{ margin: '0 0 14px', fontSize: 17, fontWeight: 950, color: 'var(--navy-2)' }}>📋 Key Info</h3>
                <div className="prelim-key-table">
                  {KEY_INFO.map(([, k, v]) => (
                    <div key={k} className="prelim-key-row">
                      <span style={{ color: 'var(--muted)' }}>{k}</span>
                      <span>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="panel">
                <h3 style={{ margin: '0 0 14px', fontSize: 17, fontWeight: 950, color: 'var(--navy-2)' }}>🏅 Awards</h3>
                <div className="prelim-topic-tags">
                  {AWARD_TAGS.map(t => (
                    <span key={t} className="prelim-topic-tag">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MOBILE: Key info strip + How-it-works stepper + Awards ── */}
      <section className="mob-only" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="mob-stat-strip" style={{ marginBottom: 18 }}>
            {KEY_INFO.map(([icon, k, v]) => (
              <div key={k} className="mob-stat-pill wide">
                <div className="mob-stat-pill-icon">{icon}</div>
                <b>{v}</b>
                <span>{k}</span>
              </div>
            ))}
          </div>
          <div className="panel mob-info-panel">
            <h3>🗺️ How it works</h3>
            <div className="mob-stepper">
              {STEPS.map(({ n, title, text }) => (
                <div key={n} className="mob-stepper-item">
                  <div className="mob-stepper-node">{Number(n)}</div>
                  <div className="mob-stepper-body">
                    <strong>{title}</strong>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel mob-info-panel">
            <h3>🏅 Awards</h3>
            <div className="prelim-topic-tags">
              {AWARD_TAGS.map(t => (
                <span key={t} className="prelim-topic-tag">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SAMPLE QUESTIONS ── */}
      <section id="sample-questions" className="prelim-resource-section section-soft">
        <div className="container">
          <div className="prelim-section-head">
            <h2>Nümunə suallar</h2>
            <p>National Final üçün hazırlıq nümunə sualları. Kateqoriyanı seçib müvafiq PDF-i açın.</p>
          </div>
          <div className="panel" style={{ padding: 16 }}>
            <ResourceAccordion groups={sampleGroups} />
          </div>
        </div>
      </section>

      {/* ── SYLLABUS ── */}
      <section id="syllabus" className="prelim-resource-section">
        <div className="container">
          <div className="prelim-section-head">
            <h2>Sillabus</h2>
            <p>National Final üçün kateqoriya sillabusları. Hər kateqoriya üçün PDF-i yükləyə bilərsiniz.</p>
          </div>
          <div className="panel" style={{ padding: 16 }}>
            <ResourceAccordion groups={syllabusGroups} />
          </div>
        </div>
      </section>

      {/* ── RESULTS ── */}
      <section id="results" className="prelim-resource-section section-soft">
        <div className="container">
          <div className="prelim-section-head">
            <h2>Nəticələr</h2>
            <p>Bu bölmə yalnız National Final nəticələri üçündür. Ölkə adına klikləyərək PDF nəticəni yükləyə bilərsiniz.</p>
          </div>
          <div className="panel" style={{ padding: 16 }}>
            <ResultAccordion groups={resultGroups} />
          </div>
        </div>
      </section>
    </>
  )
}

/* ── Accordion sub-components ─────────────────────────── */

function ResourceAccordion({ groups }: { groups: RoundGroup[] }) {
  if (!groups.length) return (
    <p style={{ color: 'var(--muted)', padding: '16px 4px', textAlign: 'center', fontSize: 14 }}>Hələ heç bir məlumat əlavə edilməyib.</p>
  )
  return (
    <>
      <div className="desk-only">
        {groups.map((round, ri) => (
          <div key={round.roundLabel} className={`prelim-round${ri === 0 ? ' open' : ''}`}>
            <button className="prelim-round-btn" type="button">
              <span className="prelim-round-title">
                <span className="prelim-round-icon">{round.roundIcon}</span>
                {round.roundLabel}
              </span>
              <span className="prelim-chevron">⌄</span>
            </button>
            <div className="prelim-round-body">
              {round.categories.map((cat, ci) => (
                <div key={cat.category} className={`prelim-category${ci === 0 ? ' open' : ''}`}>
                  <button className="prelim-cat-btn" type="button">
                    <span className="prelim-cat-title">
                      <strong>{cat.category}</strong>
                      <span>{cat.grade}</span>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className="prelim-pdf-count">{cat.files.length} PDF</span>
                      <span className="prelim-chevron">⌄</span>
                    </span>
                  </button>
                  <div className="prelim-cat-body">
                    {cat.files.length === 0
                      ? <p style={{ color: 'var(--muted)', fontSize: 13, margin: '8px 0' }}>Bu kateqoriya üçün PDF hələ əlavə edilməyib.</p>
                      : (
                        <div className="prelim-pdf-list">
                          {cat.files.map((f, fi) => (
                            <a key={fi} className="prelim-pdf-item" href={f.pdfUrl} target="_blank" rel="noopener noreferrer">
                              <span className="prelim-pdf-icon">PDF</span>
                              <span className="prelim-pdf-info">
                                <strong>{f.title}</strong>
                                <span>Yüklə</span>
                              </span>
                            </a>
                          ))}
                        </div>
                      )
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── MOBILE: round switcher (flattened to round → category) ── */}
      <div className="mob-only" data-round-switch>
        {groups.length > 1 && (
          <div className="mob-round-tabs">
            {groups.map((round, ri) => (
              <button key={round.roundLabel} type="button" className={`mob-round-tab${ri === 0 ? ' active' : ''}`} data-round-tab={ri}>
                <span>{round.roundIcon}</span>{round.roundLabel}
              </button>
            ))}
          </div>
        )}
        {groups.map((round, ri) => (
          <div key={round.roundLabel} className={`mob-round-panel${ri === 0 ? ' active' : ''}`} data-round-panel={ri}>
            {round.categories.map((cat, ci) => (
              <div key={cat.category} className={`prelim-category${ci === 0 ? ' open' : ''}`}>
                <button className="prelim-cat-btn" type="button">
                  <span className="prelim-cat-title">
                    <strong>{cat.category}</strong>
                    <span>{cat.grade}</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="prelim-pdf-count">{cat.files.length} PDF</span>
                    <span className="prelim-chevron">⌄</span>
                  </span>
                </button>
                <div className="prelim-cat-body">
                  {cat.files.length === 0
                    ? <p style={{ color: 'var(--muted)', fontSize: 13, margin: '8px 0' }}>Bu kateqoriya üçün PDF hələ əlavə edilməyib.</p>
                    : (
                      <div className="prelim-pdf-list">
                        {cat.files.map((f, fi) => (
                          <a key={fi} className="prelim-pdf-item" href={f.pdfUrl} target="_blank" rel="noopener noreferrer">
                            <span className="prelim-pdf-icon">PDF</span>
                            <span className="prelim-pdf-info">
                              <strong>{f.title}</strong>
                              <span>Yüklə</span>
                            </span>
                          </a>
                        ))}
                      </div>
                    )
                  }
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

function ResultAccordion({ groups }: { groups: ResultRound[] }) {
  if (!groups.length) return (
    <p style={{ color: 'var(--muted)', padding: '16px 4px', textAlign: 'center', fontSize: 14 }}>Hələ heç bir nəticə əlavə edilməyib.</p>
  )
  return (
    <>
      <div className="desk-only">
        {groups.map((round, ri) => (
          <div key={round.roundLabel} className={`prelim-round${ri === 0 ? ' open' : ''}`}>
            <button className="prelim-round-btn" type="button">
              <span className="prelim-round-title">
                <span className="prelim-round-icon">{round.roundIcon}</span>
                {round.roundLabel}
              </span>
              <span className="prelim-chevron">⌄</span>
            </button>
            <div className="prelim-round-body" style={{ paddingTop: 0 }}>
              <div className="prelim-country-grid">
                {round.countries.map(c => (
                  <a key={c.country} className="prelim-pdf-item" href={c.pdfUrl} target="_blank" rel="noopener noreferrer" download>
                    <span className="prelim-pdf-icon">PDF</span>
                    <span className="prelim-pdf-info">
                      <strong>{c.country}</strong>
                      <span>{c.meta}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── MOBILE: round switcher ── */}
      <div className="mob-only" data-round-switch>
        {groups.length > 1 && (
          <div className="mob-round-tabs">
            {groups.map((round, ri) => (
              <button key={round.roundLabel} type="button" className={`mob-round-tab${ri === 0 ? ' active' : ''}`} data-round-tab={ri}>
                <span>{round.roundIcon}</span>{round.roundLabel}
              </button>
            ))}
          </div>
        )}
        {groups.map((round, ri) => (
          <div key={round.roundLabel} className={`mob-round-panel${ri === 0 ? ' active' : ''}`} data-round-panel={ri}>
            <div className="prelim-country-grid">
              {round.countries.map(c => (
                <a key={c.country} className="prelim-pdf-item" href={c.pdfUrl} target="_blank" rel="noopener noreferrer" download>
                  <span className="prelim-pdf-icon">PDF</span>
                  <span className="prelim-pdf-info">
                    <strong>{c.country}</strong>
                    <span>{c.meta}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
