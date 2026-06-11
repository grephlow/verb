import Link from 'next/link'
import { getAllSampleResources } from '@/lib/globals'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Nümunə Suallar və Sillabus | Verbivore The Contest' }

type CatGroup   = { category: string; grade: string; files: { title: string; pdfUrl: string }[] }
type RoundGroup = { roundLabel: string; roundIcon: string; categories: CatGroup[] }

const STAGE_ORDER = ['preliminary', 'national-final', 'grand-final']

function groupByRound(items: any[]): RoundGroup[] {
  const map: Record<string, RoundGroup & { _stageKey: string }> = {}
  for (const item of items) {
    if (!map[item.roundLabel]) {
      map[item.roundLabel] = { roundLabel: item.roundLabel, roundIcon: item.roundIcon || '📋', categories: [], _stageKey: item.stage || 'preliminary' }
    }
    const r = map[item.roundLabel]
    let cat = r.categories.find(c => c.category === item.category)
    if (!cat) { cat = { category: item.category || '', grade: item.grade || '', files: [] }; r.categories.push(cat) }
    cat.files.push({ title: item.title || '', pdfUrl: item.pdfUrl || '#' })
  }
  return Object.values(map).sort((a, b) => STAGE_ORDER.indexOf(a._stageKey) - STAGE_ORDER.indexOf(b._stageKey))
}

export default async function SampleQuestionsPage() {
  const docs = await getAllSampleResources()

  const sampleGroups   = groupByRound(docs.filter((d: any) => d.type === 'sample-question'))
  const syllabusGroups = groupByRound(docs.filter((d: any) => d.type === 'syllabus'))

  return (
    <>
      {/* HERO */}
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link> <span>›</span>
            <Link href="/verbivore">Verbivore</Link> <span>›</span>
            <span>Nümunə Suallar</span>
          </div>
          <h1>Nümunə Suallar və Sillabus</h1>
          <p>Verbivore müsabiqəsinin mərhələlərinə uyğun nümunə suallar və sillabus sənədlərini buradan yükləyə bilərsiniz. Resurslar mərhələ və kateqoriyalar üzrə strukturlaşdırılmışdır.</p>
        </div>
      </section>

      {/* MAIN */}
      <section>
        <div className="container">

          {/* Tabs */}
          <div className="res-tabs" role="tablist">
            <button className="res-tab active" data-res-tab="res-samples" type="button">📄 Nümunə suallar</button>
            <button className="res-tab" data-res-tab="res-syllabus" type="button">📚 Sillabus</button>
          </div>

          {/* Tab: Sample Questions */}
          <div id="res-samples" className="res-panel active">
            {/* Mobile: quick-reference chips above the accordion */}
            <div className="mob-only" style={{ marginBottom: 16 }}>
              <div className="mob-res-chips">
                <span className="mob-res-chip">📂 Kiçik A</span>
                <span className="mob-res-chip">📂 Kiçik B</span>
                <span className="mob-res-chip">📂 Orta</span>
                <span className="mob-res-chip">📂 Böyük</span>
              </div>
              <div className="prelim-topic-tags">
                {['Lüğət','Oxu','Qrammatika','Məntiq','İdiomlar','Söz əmələ gəlməsi'].map(t => (
                  <span key={t} className="prelim-topic-tag">{t}</span>
                ))}
              </div>
            </div>
            <div className="res-grid">
              {/* Accordion */}
              <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '22px 26px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 950, color: 'var(--navy-2)', letterSpacing: '-.3px' }}>Nümunə suallar</h2>
                    <p style={{ margin: '8px 0 0', color: 'var(--muted)', fontSize: 14, lineHeight: 1.55 }}>Aşağıdakı mərhələlərdən birini seçin. Kateqoriyaya daxil olaraq mövcud PDF nümunələrini yükləyə bilərsiniz.</p>
                  </div>
                  <span className="res-badge">{sampleGroups.length} mərhələ</span>
                </div>
                <div style={{ padding: 16 }}>
                  <ResourceAccordion groups={sampleGroups} />
                </div>
              </div>

              {/* Sidebar */}
              <div className="desk-only">
                <aside className="res-side">
                  <div className="panel">
                    <h3>📌 Mərhələlər</h3>
                    <ul className="res-side-list">
                      <li>İlkin seçim mərhələsi</li>
                      <li>Milli final mərhələsi</li>
                      <li>Grand Final mərhələsi</li>
                    </ul>
                  </div>
                  <div className="panel">
                    <h3>📂 Kateqoriyalar</h3>
                    <ul className="res-side-list">
                      <li>Kiçik A — 3–4-cü sinif</li>
                      <li>Kiçik B — 5–6-cı sinif</li>
                      <li>Orta səviyyə — 7–8-ci sinif</li>
                      <li>Böyük — 9–11-ci sinif</li>
                    </ul>
                  </div>
                  <div className="panel">
                    <h3>🎯 Əhatə olunan istiqamətlər</h3>
                    <div className="prelim-topic-tags" style={{ marginTop: 4 }}>
                      {['Lüğət','Oxu','Qrammatika','Məntiq','İdiomlar','Söz əmələ gəlməsi'].map(t => (
                        <span key={t} className="prelim-topic-tag">{t}</span>
                      ))}
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>

          {/* Tab: Syllabus */}
          <div id="res-syllabus" className="res-panel">
            {/* Mobile: condensed syllabus structure above the accordion */}
            <div className="mob-only panel mob-info-panel" style={{ marginBottom: 16 }}>
              <h3>✅ Sillabus strukturu</h3>
              <ul className="res-side-list">
                <li>İlkin seçim üçün mövzu bölgüsü</li>
                <li>Milli final üçün dərinləşdirilmiş istiqamətlər</li>
                <li>Grand Final üçün genişləndirilmiş proqram</li>
              </ul>
            </div>
            <div className="res-grid">
              {/* Accordion */}
              <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '22px 26px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 950, color: 'var(--navy-2)', letterSpacing: '-.3px' }}>Sillabus</h2>
                    <p style={{ margin: '8px 0 0', color: 'var(--muted)', fontSize: 14, lineHeight: 1.55 }}>Hər mərhələ üzrə kateqoriyanı seçərək həmin kateqoriyaya aid sillabus PDF sənədini yükləyə bilərsiniz.</p>
                  </div>
                  <span className="res-badge">Yüklənə bilən PDF</span>
                </div>
                <div style={{ padding: 16 }}>
                  <ResourceAccordion groups={syllabusGroups} />
                </div>
              </div>

              {/* Sidebar */}
              <div className="desk-only">
                <aside className="res-side">
                  <div className="panel">
                    <h3>✅ Sillabus strukturu</h3>
                    <ul className="res-side-list">
                      <li>İlkin seçim üçün mövzu bölgüsü</li>
                      <li>Milli final üçün dərinləşdirilmiş istiqamətlər</li>
                      <li>Grand Final üçün genişləndirilmiş proqram</li>
                    </ul>
                  </div>
                  <div className="panel">
                    <h3>ℹ️ İstifadə qaydası</h3>
                    <ul className="res-side-list">
                      <li>Mərhələ seçilir</li>
                      <li>Kateqoriya açılır</li>
                      <li>Uyğun PDF yüklənir</li>
                    </ul>
                  </div>
                </aside>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}

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
