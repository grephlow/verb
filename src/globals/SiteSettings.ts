import type { GlobalConfig } from 'payload'
import { revalidateSiteSettings } from '../lib/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Sayt Parametrləri',
  hooks: {
    afterChange: [() => revalidateSiteSettings()],
  },
  admin: {
    group: '⚙️ Tənzimləmələr',
    description: 'Saytın bütün səhifələrində istifadə olunan ümumi parametrlər: altbilgi (footer), /contact səhifəsindəki əlaqə məlumatları, ana səhifənin statistika rəqəmləri, geri sayım və hansı səhifələrin görünüb-görünməyəcəyi.',
  },
  fields: [
    { name: 'siteName', type: 'text', label: 'Sayt Adı', defaultValue: 'Verbivore The Contest' },

    { type: 'collapsible', label: 'Altbilgi', admin: { description: 'Saytın hər səhifəsinin ən altındakı altbilgi (footer) bölməsində göstərilir.' }, fields: [
      { name: 'footerDescription', type: 'textarea', label: 'Altbilgi Açıqlaması', defaultValue: 'Verbivore The Contest şagirdlər, valideynlər, məktəblər və ölkə nümayəndələri üçün beynəlxalq İngilis dili müsabiqə platformasıdır.' },
      { name: 'footerCopyright', type: 'text', label: 'Müəllif Hüququ Sətri', defaultValue: 'Verbivore The Contest. Bütün hüquqlar qorunur.', admin: { description: 'Altbilginin ən altında, "© <cari il> ..." şəklində göstərilir. İl avtomatik əlavə edilir.' } },
    ]},

    { type: 'collapsible', label: 'Əlaqə Məlumatları', admin: { description: '/contact səhifəsindəki məlumat panelində və saytın altbilgisində göstərilir.' }, fields: [
      { name: 'contactEmail', type: 'email', label: 'Ümumi Əlaqə E-poçtu', defaultValue: 'info@verbivore.org', admin: { description: '/contact səhifəsində və altbilgidə göstərilir.' } },
      { name: 'representativesEmail', type: 'email', label: 'Nümayəndələr E-poçtu', defaultValue: 'representatives@verbivore.org', admin: { description: '/contact səhifəsində "Ölkə Nümayəndələri" panelində göstərilir.' } },
      { name: 'partnersEmail', type: 'email', label: 'Tərəfdaşlar E-poçtu', defaultValue: 'partners@verbivore.org', admin: { description: '/contact səhifəsində "Tərəfdaşlar" panelində göstərilir.' } },
      { name: 'representativesDescription', type: 'text', label: 'Nümayəndələr Paneli Açıqlaması', defaultValue: 'Ölkə nümayəndəsi sorğuları və akkreditasiya üçün.', admin: { description: '/contact səhifəsində Nümayəndələr e-poçtunun üstündə göstərilir.' } },
      { name: 'partnersDescription', type: 'text', label: 'Tərəfdaşlar Paneli Açıqlaması', defaultValue: 'Sponsorluq, akademik tərəfdaşlıq və media sorğuları üçün.', admin: { description: '/contact səhifəsində Tərəfdaşlar e-poçtunun üstündə göstərilir.' } },
      { name: 'responseTime', type: 'text', label: 'Cavab Müddəti', defaultValue: '2–3 iş günü' },
    ]},

    { type: 'collapsible', label: 'Müsabiqə Statistikası', admin: { description: 'Ana səhifədə iki yerdə göstərilir: yuxarıdakı kiçik statistika kartlarında və aşağıdakı böyük statistika şəbəkəsində.' }, fields: [
      { name: 'statsCountries', type: 'text', label: 'Ölkələr və Ərazilər', defaultValue: '35+' },
      { name: 'statsSchools', type: 'text', label: 'Tərəfdaş Məktəblər', defaultValue: '500+' },
      { name: 'statsStudents', type: 'text', label: 'Gözlənilən Şagirdlər', defaultValue: '10K+' },
      { name: 'statsRounds', type: 'text', label: 'Əsas Turlar', defaultValue: '3' },
    ]},

    { type: 'collapsible', label: 'Böyük Final', fields: [
      { name: 'grandFinalLabel', type: 'text', label: 'Geri Sayım Etiketi', defaultValue: '🏁 Böyük Final geri sayımı — 14 İyul 2026', admin: { description: 'Geri sayım taymerinin üstündə göstərilən mətn.' } },
      { name: 'grandFinalISODate', type: 'text', label: 'Böyük Final ISO Tarixi', defaultValue: '2026-07-14T09:00:00', admin: { description: 'Format: YYYY-MM-DDTHH:mm:ss — əsas səhifədəki canlı geri sayım üçün.' } },
    ]},

    { type: 'collapsible', label: 'Aktiv Müsabiqə Turu', admin: { description: 'Əsas səhifədəki qalereya bu tura uyğun foto göstərir.' }, fields: [
      { name: 'currentContestStage', type: 'select', label: 'Hazırkı Tur', defaultValue: 'preliminary',
        options: [
          { label: '🟠 İlkin Seçim (Preliminary Round)', value: 'preliminary' },
          { label: '🔵 Milli Final (National Final)',     value: 'national-final' },
          { label: '🏆 Böyük Final (Grand Final)',        value: 'grand-final' },
        ],
        admin: { description: 'Bu seçim dəyişdikdə əsas səhifənin qalereyası avtomatik yenilənir.' },
      },
    ]},

    { type: 'collapsible', label: 'Səhifə Görünüşü', admin: { description: 'Müəyyən səhifələri sayt miqyasında aktiv/deaktiv edin.' }, fields: [
      { name: 'showScientificCommittee', type: 'checkbox', label: 'Elmi Komitə səhifəsini göstər', defaultValue: true, admin: { description: 'Söndürülsə, /verbivore/scientific-committee səhifəsi və ona aparan menyu keçidi gizlənir.' } },
    ]},
  ],
}
