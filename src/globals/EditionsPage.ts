import type { GlobalConfig } from 'payload'
import { revalidateEditionsPage } from '../lib/revalidate'

export const EditionsPageGlobal: GlobalConfig = {
  slug: 'editions-page',
  label: 'Buraxılışlar Səhifəsi',
  access: { read: () => true },
  admin: {
    group: '🏆 Müsabiqə',
    description: '/editions səhifəsinin yuxarı (hero) hissəsini idarə edir: arxa plan şəkli, başlıq, alt başlıq və hero altındakı 3 statistika rəqəmi.',
  },
  hooks: {
    afterChange: [() => revalidateEditionsPage()],
  },
  fields: [
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Hero Arxa Plan Şəkli',
      admin: { description: 'Hero bölməsi üçün tam enlikli şəkil.' },
    },
    {
      name: 'heroTitle',
      type: 'text',
      defaultValue: 'Verbivore Buraxılışları',
      label: 'Hero Başlığı',
    },
    {
      name: 'heroSubtitle',
      type: 'textarea',
      defaultValue: 'Hər il yeni ev sahibi ölkə. Hər Böyük Final beynəlxalq İngilis dili mükəmməlliyinin yeni fəslidir.',
      label: 'Hero Alt Başlığı',
    },
    {
      name: 'statsEditions',
      type: 'text',
      defaultValue: '3',
      label: 'Statistika: Buraxılış sayı',
      admin: { description: '/editions səhifəsində hero bölməsinin altında "Editions hosted" rəqəmi kimi göstərilir.' },
    },
    {
      name: 'statsCountries',
      type: 'text',
      defaultValue: '35+',
      label: 'Statistika: Ölkə sayı',
      admin: { description: '/editions səhifəsində hero bölməsinin altında "Countries" rəqəmi kimi göstərilir.' },
    },
    {
      name: 'statsAlumni',
      type: 'text',
      defaultValue: '500+',
      label: 'Statistika: Mezun sayı',
      admin: { description: '/editions səhifəsində hero bölməsinin altında "Grand Final alumni" rəqəmi kimi göstərilir.' },
    },
  ],
}
