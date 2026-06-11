'use client'

import { Fragment, useState } from 'react'
import Link from 'next/link'

const MEDAL_COLOR: Record<string, string> = {
  Gold:   '#ffb800',
  Silver: '#aab4c0',
  Bronze: '#c47a3a',
}

function medalClass(medal: string | undefined): string {
  if (!medal) return ''
  if (medal === 'Gold')               return 'medal-gold'
  if (medal === 'Silver')             return 'medal-silver'
  if (medal === 'Bronze')             return 'medal-bronze'
  if (medal === 'Honorable Mention')  return 'medal-hm'
  return ''
}

function medalLabel(medal: string | undefined): string {
  if (!medal) return '—'
  if (medal === 'Honorable Mention') return 'H.M.'
  return medal
}

export function ResultsList({ editions }: { editions: any[] }) {
  const editionKeys = editions.map((ed) => String(ed.year ?? ed.shortTitle))
  const years = Array.from(new Set(editionKeys))
  const [filter, setFilter] = useState('all')
  const [openRow, setOpenRow] = useState<string | null>(null)

  const visible = editions.filter((_, i) => filter === 'all' || editionKeys[i] === filter)

  return (
    <>
      {years.length > 1 && (
        <div className="field" style={{ maxWidth: 240, marginBottom: 28 }}>
          <label>Filter by edition</label>
          <select value={filter} onChange={(e) => { setFilter(e.target.value); setOpenRow(null) }}>
            <option value="all">All editions</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      )}

      {visible.map((ed) => (
        <div key={ed.id} style={{ marginBottom: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
            {ed.flag && <span style={{ fontSize: 28 }}>{ed.flag}</span>}
            <div>
              <div className="kicker" style={{ marginBottom: 4 }}>Grand Final</div>
              <h2 style={{ fontSize: 26, fontWeight: 900, color: 'var(--navy-2)' }}>
                Medal Table — {ed.shortTitle}
              </h2>
            </div>
          </div>

          <div className="panel desk-only" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-scroll"><table className="result-table">
              <thead>
                <tr>
                  <th>Country</th>
                  <th style={{ color: MEDAL_COLOR.Gold }}>🥇 Gold</th>
                  <th style={{ color: MEDAL_COLOR.Silver }}>🥈 Silver</th>
                  <th style={{ color: MEDAL_COLOR.Bronze }}>🥉 Bronze</th>
                  <th>H.M.</th>
                  <th>Part.</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {ed.medalTable.map((row: any, i: number) => {
                  const rowKey = `${ed.id}-${i}`
                  const del = (ed.countryDelegations || []).find((d: any) => d.country?.id === row.country?.id)
                  const students = del?.students || []
                  const isOpen = openRow === rowKey
                  return (
                    <Fragment key={rowKey}>
                      <tr>
                        <td style={{ fontWeight: 900 }}>
                          {row.country?.flag && <span style={{ marginRight: 8 }}>{row.country.flag}</span>}
                          {row.country?.name}
                        </td>
                        <td style={{ fontWeight: 900, color: MEDAL_COLOR.Gold }}>{row.gold || 0}</td>
                        <td style={{ fontWeight: 900, color: MEDAL_COLOR.Silver }}>{row.silver || 0}</td>
                        <td style={{ fontWeight: 900, color: MEDAL_COLOR.Bronze }}>{row.bronze || 0}</td>
                        <td style={{ color: 'var(--purple)', fontWeight: 700 }}>{row.honorable || 0}</td>
                        <td style={{ color: 'var(--muted)', fontWeight: 700 }}>{row.participation || 0}</td>
                        <td>
                          {row.hasDetails && students.length > 0 ? (
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm"
                              style={{ fontSize: 12, padding: '6px 14px' }}
                              onClick={() => setOpenRow(isOpen ? null : rowKey)}
                            >
                              {isOpen ? 'Gizlət ←' : 'Bax →'}
                            </button>
                          ) : (
                            <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>—</span>
                          )}
                        </td>
                      </tr>
                      {isOpen && students.length > 0 && (
                        <tr>
                          <td colSpan={7} style={{ background: '#f9faff', padding: '16px 20px' }}>
                            <table className="student-table" style={{ minWidth: 400 }}>
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Name</th>
                                  <th>Class</th>
                                  <th>Score</th>
                                  <th>Medal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {students.map((s: any, si: number) => (
                                  <tr key={si}>
                                    <td>{si + 1}</td>
                                    <td>{s.name}</td>
                                    <td>{s.class}</td>
                                    <td>{s.score}</td>
                                    <td className={medalClass(s.medal)}>{medalLabel(s.medal)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table></div>
          </div>

          <div className="mob-only">
            {ed.medalTable.map((row: any, i: number) => {
              const rowKey = `${ed.id}-${i}`
              const del = (ed.countryDelegations || []).find((d: any) => d.country?.id === row.country?.id)
              const students = del?.students || []
              const isOpen = openRow === rowKey
              return (
                <div key={rowKey} className="mob-result-card">
                  <div className="mob-result-head">
                    <div className="mob-result-country">
                      {row.country?.flag && <span className="mob-result-flag">{row.country.flag}</span>}
                      {row.country?.name}
                    </div>
                    {row.hasDetails && students.length > 0 && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{ fontSize: 12, padding: '6px 14px' }}
                        onClick={() => setOpenRow(isOpen ? null : rowKey)}
                      >
                        {isOpen ? 'Gizlət ←' : 'Bax →'}
                      </button>
                    )}
                  </div>
                  <div className="mob-result-medals">
                    <span className="mob-result-medal gold">🥇 {row.gold || 0}</span>
                    <span className="mob-result-medal silver">🥈 {row.silver || 0}</span>
                    <span className="mob-result-medal bronze">🥉 {row.bronze || 0}</span>
                    <span className="mob-result-medal hm">H.M. {row.honorable || 0}</span>
                    <span className="mob-result-part">Part. {row.participation || 0}</span>
                  </div>
                  {isOpen && students.length > 0 && (
                    <div className="mob-student-list">
                      {students.map((s: any, si: number) => (
                        <div key={si} className="mob-student-row">
                          <div className="mob-student-name">{si + 1}. {s.name}</div>
                          <div className="mob-student-meta">
                            <span className="mob-student-class">{s.class}</span>
                            <span className="mob-student-score-medal">
                              <span className="mob-student-score">{s.score} pts</span>
                              {s.medal && <span className={`mob-medal-pill ${medalClass(s.medal)}`}>{medalLabel(s.medal)}</span>}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
            {ed.slug && (
              <Link className="btn btn-ghost btn-sm" href={`/editions/${ed.slug}/participants`}>
                Full participant list →
              </Link>
            )}
            {ed.slug && (
              <Link className="btn btn-ghost btn-sm" href={`/editions/${ed.slug}`}>
                Open {ed.shortTitle} Edition →
              </Link>
            )}
          </div>
        </div>
      ))}
    </>
  )
}
