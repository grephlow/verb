import type { GlobalConfig } from 'payload'
import { revalidateHomePage } from '../lib/revalidate'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Ana Səhifə',
  hooks: {
    afterChange: [() => revalidateHomePage()],
  },
  admin: {
    group: '🏠 Əsas Səhifə',
    description: 'Ana səhifənin (/) yuxarı hero bölməsini və aşağıdakı bölmələrin üst başlıqlarını idarə edir. Qalereya şəkilləri Qalereya bölməsindən, xəbər lenti Xəbərlər bölməsindən, tərəfdaş loqoları isə Tərəfdaşlar bölməsindən gəlir.',
  },
  fields: [
    /* ── Hero ─────────────────────────────────────────────── */
    { type: 'collapsible', label: 'Hero Bölməsi', admin: { description: 'Ana səhifə açılan kimi görünən ən yuxarı bölmə.' }, fields: [
      { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Hero Arxa Plan Şəkli', admin: { description: 'Hero bölməsi üçün tam enlikli şəkil. Tövsiyə: 1600×900px və ya daha geniş.' } },
      { name: 'heroEyebrow', type: 'text', label: 'Üst Mətn', defaultValue: 'Global English Olympiad Experience', admin: { description: 'Əsas başlığın üstündəki kiçik mətn.' } },
      { name: 'heroTitle', type: 'text', label: 'Hero Başlığı', defaultValue: 'English becomes a colorful challenge.', admin: { description: 'Hero bölməsinin böyük başlığı (H1).' } },
      { name: 'heroSubtitle', type: 'textarea', label: 'Hero Alt Başlığı', defaultValue: 'Verbivore brings students into a friendly international contest environment where vocabulary, reading, logic and communication skills are tested with excitement and confidence.', admin: { description: 'Böyük başlığın altındakı izahat mətni.' } },
      { name: 'heroCta1Label', type: 'text', label: 'Əsas Düymə Mətni', defaultValue: 'Explore Verbivore →', admin: { description: 'Hero bölməsindəki birinci (əsas, narıncı) düymənin yazısı.' } },
      { name: 'heroCta1Url', type: 'text', label: 'Əsas Düymə URL', defaultValue: '/verbivore/about', admin: { description: 'Birinci düyməyə basanda gedəcəyi səhifə.' } },
      { name: 'heroCta2Label', type: 'text', label: 'İkinci Düymə Mətni', defaultValue: 'Check Exam Time', admin: { description: 'Hero bölməsindəki ikinci (mavi) düymənin yazısı.' } },
      { name: 'heroCta2Url', type: 'text', label: 'İkinci Düymə URL', defaultValue: '/verbivore/exam-time', admin: { description: 'İkinci düyməyə basanda gedəcəyi səhifə.' } },
    ]},

    /* ── Bölmə Başlıqları ─────────────────────────────────── */
    { type: 'collapsible', label: 'Bölmə Başlıqları', admin: { description: 'Ana səhifədə hero-dan aşağıdakı bölmələrin (Statistika və Tərəfdaşlar) üst başlıqları.' }, fields: [
      { name: 'statsKicker', type: 'text', label: 'Statistika Alt Başlığı', defaultValue: 'Platform metrics', admin: { description: 'Statistika bölməsinin başlığından əvvəl, kiçik hərflərlə göstərilən etiket.' } },
      { name: 'statsTitle', type: 'text', label: 'Statistika Bölməsi Başlığı', defaultValue: 'Designed for students, parents and schools.', admin: { description: 'Statistika bölməsinin başlığı (H2).' } },
      { name: 'statsText', type: 'textarea', label: 'Statistika Bölməsi Mətni', defaultValue: 'The homepage gives fast access to core numbers, contest structure, announcements and public exam information.', admin: { description: 'Statistika bölməsinin başlığının altındakı izahat mətni.' } },
      { name: 'partnersKicker', type: 'text', label: 'Tərəfdaşlar Alt Başlığı', defaultValue: 'Partners', admin: { description: '"Partners" bölməsinin başlığından əvvəl göstərilən kiçik etiket.' } },
      { name: 'partnersTitle', type: 'text', label: 'Tərəfdaşlar Bölməsi Başlığı', defaultValue: 'Our institutional partners.', admin: { description: '"Partners" bölməsinin başlığı (H2) — loqolar Tərəfdaşlar bölməsindən gəlir.' } },
    ]},
  ],
}
