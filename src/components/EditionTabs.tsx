import Link from 'next/link'

const TABS = [
  { key: 'about',        label: 'About' },
  { key: 'organizer',    label: 'Organizer' },
  { key: 'schedule',     label: 'Schedule' },
  { key: 'rules',        label: 'Rules' },
  { key: 'participants', label: 'Participants' },
  { key: 'results',      label: 'Results' },
]

const ACTIVE_STYLE  = { background: 'var(--orange)', color: '#fff', borderColor: 'var(--orange)' }
const INACTIVE_STYLE = { color: 'rgba(255,255,255,.8)', background: 'rgba(255,255,255,.09)', borderColor: 'rgba(255,255,255,.18)' }

export function EditionTabs({ slug, active }: { slug: string; active: string }) {
  return (
    <div className="tabs-list" style={{ marginTop: 28, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,.15)' }}>
      {TABS.map(tab => {
        const href = tab.key === 'about'   ? `/editions/${slug}`
                   : tab.key === 'results' ? '/editions/results'
                   : `/editions/${slug}/${tab.key}`
        return (
          <Link key={tab.key} href={href} style={active === tab.key ? ACTIVE_STYLE : INACTIVE_STYLE}>
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
