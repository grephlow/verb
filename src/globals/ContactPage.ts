import type { GlobalConfig } from 'payload'
import { revalidateContactPage } from '../lib/revalidate'

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Əlaqə Səhifəsi',
  hooks: {
    afterChange: [() => revalidateContactPage()],
  },
  admin: {
    group: 'ℹ️ Səhifələr',
    description: '/contact səhifəsinin yuxarı (hero) hissəsini və əlaqə formasının mətnlərini idarə edir. Formada doldurulan əlaqə nüsxəsi sahibinin əlaqə məlumatları (e-poçt, telefon, ünvan) Sayt Parametrləri → "Əlaqə Məlumatları" bölməsindən idarə olunur.',
  },
  fields: [
    { name: 'heroTitle', type: 'text', label: 'Hero Başlığı', defaultValue: 'Bizimlə Əlaqə' },
    { name: 'heroSubtitle', type: 'textarea', label: 'Hero Alt Başlığı', defaultValue: 'İştirak, akkreditasiya və ya tərəfdaşlıq barədə hər hansı sualınız üçün Verbivore koordinasiya qrupuna müraciət edin.' },
    { name: 'formTitle', type: 'text', label: 'Forma Başlığı', defaultValue: 'Mesaj göndər', admin: { description: 'Əlaqə formasının üstündəki başlıq.' } },
    { name: 'formSuccessMessage', type: 'text', label: 'Forma Uğur Mesajı', defaultValue: '2–3 iş günü ərzində cavab veriləcək.', admin: { description: 'İstifadəçi formanı uğurla göndərdikdən sonra göstərilən mesaj.' } },
  ],
}
