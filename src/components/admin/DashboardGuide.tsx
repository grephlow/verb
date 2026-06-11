import React from 'react'

const TASKS: { icon: string; title: string; text: string; href: string }[] = [
  { icon: '📰', title: 'Xəbər əlavə et',            text: 'Əsas səhifədəki xəbər zolağına yeni xəbər yazın.',                    href: '/admin/collections/news' },
  { icon: '🖼️', title: 'Qalereya şəklini dəyiş',     text: 'Əsas səhifənin foto bölməsi üçün şəkil əlavə edin və ya dəyişin.',     href: '/admin/collections/gallery' },
  { icon: '🔄', title: 'Aktiv turu dəyiş',          text: 'Hazırda hansı turun getdiyini seçin — qalereya buna görə avtomatik dəyişir.', href: '/admin/globals/site-settings' },
  { icon: '🏆', title: 'Nəticələri yenilə',         text: 'Buraxılışı açın → "7️⃣ Nəticələr" bölməsində medal cədvəlini doldurun.', href: '/admin/collections/editions' },
  { icon: '📅', title: 'İmtahan tarixini yenilə',   text: 'Ölkələr üzrə imtahan tarixi, yeri və statusunu dəyişin.',              href: '/admin/collections/exam-times' },
  { icon: '🌍', title: 'Ölkə / komitə üzvü əlavə et', text: 'Yeni ölkə nümayəndəliyi və ya elmi komitə üzvü əlavə edin.',          href: '/admin/collections/countries' },
  { icon: '🤝', title: 'Tərəfdaş əlavə et',         text: 'Yeni sponsor və ya tərəfdaş loqosu əlavə edin.',                       href: '/admin/collections/partners' },
  { icon: '📨', title: 'Mesajlara bax',             text: 'Sayt vasitəsilə göndərilən sorğu və müraciətləri oxuyun.',             href: '/admin/collections/inquiries' },
]

const GUIDE_CSS = `
.v-guide {
  margin: 0 0 32px;
  padding: 22px 24px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(255,130,26,.08) 0%, rgba(10,16,52,.05) 100%);
  border: 1px solid rgba(255,130,26,.18);
}
.v-guide-head h2 {
  margin: 0 0 6px;
  font-size: 19px;
  font-weight: 800;
}
.v-guide-head p {
  margin: 0 0 18px;
  opacity: .75;
  font-size: 13px;
  line-height: 1.5;
  max-width: 760px;
}
.v-guide-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}
.v-guide-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px;
  border-radius: 12px;
  background: var(--theme-elevation-0, #fff);
  border: 1px solid rgba(0,0,0,.08);
  text-decoration: none;
  color: inherit;
  transition: transform .15s, box-shadow .15s, border-color .15s;
}
.v-guide-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,.08);
  border-color: rgba(255,130,26,.45);
}
.v-guide-icon {
  font-size: 22px;
  line-height: 1;
}
.v-guide-title {
  font-weight: 700;
  font-size: 14px;
}
.v-guide-text {
  font-size: 12px;
  opacity: .65;
  line-height: 1.4;
}
`

export function DashboardGuide() {
  return (
    <div className="v-guide">
      <style dangerouslySetInnerHTML={{ __html: GUIDE_CSS }} />
      <div className="v-guide-head">
        <h2>👋 Xoş gəlmisiniz!</h2>
        <p>
          Ən çox edilən işlər üçün aşağıdan birbaşa keçid edin. Soldakı menyu kateqoriyalara bölünüb —
          hər kateqoriyanın adı onun saytın hansı hissəsinə aid olduğunu göstərir.
        </p>
      </div>
      <div className="v-guide-grid">
        {TASKS.map((t) => (
          <a key={t.title} className="v-guide-card" href={t.href}>
            <span className="v-guide-icon">{t.icon}</span>
            <span className="v-guide-title">{t.title}</span>
            <span className="v-guide-text">{t.text}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
