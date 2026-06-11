import type { GlobalConfig } from 'payload'
import { revalidateAboutPage } from '../lib/revalidate'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  access: { read: () => true },
  label: 'Haqqımızda Səhifəsi',
  admin: {
    group: 'ℹ️ Səhifələr',
    description: '/verbivore/about səhifəsinin məzmununu idarə edir: yuxarıdan-aşağı hero, "Verbivore nədir", missiya kartları, sağ tərəfdəki Timeline / Exam Topics / Participate panelləri.',
  },
  hooks: {
    afterChange: [() => revalidateAboutPage()],
  },
  fields: [
    /* ── Hero ───────────────────────────────────────── */
    { name: 'heroTitle', type: 'text', defaultValue: 'Verbivore Haqqında', label: 'Hero Başlığı' },
    { name: 'heroSubtitle', type: 'textarea', defaultValue: '35+ ölkədəki məktəblər və milli təhsil qurumları ilə əməkdaşlıqda 9–17 yaşlı məktəblilər üçün hazırlanmış beynəlxalq İngilis dili olimpiadası.', label: 'Hero Alt Başlığı' },

    /* ── Verbivore nədir ────────────────────────────── */
    { name: 'whatIsTitle', type: 'text', defaultValue: 'Verbivore nədir?', label: '"Nədir" Başlığı' },
    { name: 'whatIsText1', type: 'textarea', defaultValue: 'Verbivore lüğət dərinliyini, oxu anlayışını, məntiqi düşüncəni, kontekstdə qrammatikanı və qısa yazılı kommunikasiyanı yoxlayan strukturlu beynəlxalq İngilis dili müsabiqəsidir.', label: '"Nədir" 1-ci Paraqraf' },
    { name: 'whatIsText2', type: 'textarea', defaultValue: 'Tərcüməyə əsaslanan olimpiadalardan fərqli olaraq, Verbivore yaş səviyyəsinə uyğun, mədəni cəhətdən neytral kontekstlərdə həqiqi ünsiyyət bacarığını ölçür.', label: '"Nədir" 2-ci Paraqraf' },

    /* ── Missiya kartları ───────────────────────────── */
    { name: 'missionTitle', type: 'text', defaultValue: 'Missiyamız', label: 'Missiya Bölməsi Başlığı' },
    {
      name: 'missionCards', type: 'array', label: 'Missiya Dəyər Kartları',
      admin: { description: 'Hər element "Verbivore nədir" bölməsinin altında ayrı kart kimi göstərilir (emoji + başlıq + mətn).' },
      fields: [
        { name: 'icon',  type: 'text', label: 'Emoji İkon', admin: { placeholder: '🎯' } },
        { name: 'title', type: 'text', required: true, label: 'Başlıq' },
        { name: 'text',  type: 'textarea', required: true, label: 'Mətn' },
      ],
    },

    /* ── Xronologiya ────────────────────────────────── */
    {
      name: 'timelineItems', type: 'array', label: 'Xronologiya Elementləri',
      admin: { description: 'Səhifənin sağındakı "Timeline" panelində yuxarıdan-aşağı düzülən tarixçə nöqtələri.' },
      fields: [
        { name: 'year', type: 'text', required: true, label: 'İl', admin: { placeholder: '2023' } },
        { name: 'text', type: 'textarea', required: true, label: 'Mətn' },
      ],
    },

    /* ── İmtahan mövzuları ──────────────────────────── */
    {
      name: 'examTopics', type: 'array', label: 'İmtahan Mövzusu Etiketləri',
      admin: { description: 'Səhifənin sağındakı "Exam Topics" panelində kiçik etiketlər (tag) kimi göstərilir.' },
      fields: [
        { name: 'label', type: 'text', required: true, label: 'Etiket', admin: { placeholder: 'Lüğət' } },
      ],
    },

    /* ── İştirak paneli ─────────────────────────────── */
    { name: 'participateText', type: 'textarea', defaultValue: 'İştirak akkreditə edilmiş milli nümayəndələr vasitəsilə həyata keçirilir. Ölkənizi aşağıda tapın və ya nümayəndəliyə müraciət edin.', label: 'İştirak Paneli Mətni', admin: { description: 'Səhifənin sağındakı "Participate" panelində, "Ölkələrə bax" və "Bizimlə əlaqə" düymələrinin üstündə göstərilir.' } },
  ],
}
