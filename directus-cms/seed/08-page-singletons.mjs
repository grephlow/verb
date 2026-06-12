// 5 singleton "page" collections recreating the Payload globals.

import {
  api, createSingleton, addFields, addRelations, setPublicRead,
  strField, textareaField, boolField, selectField, emailField, fileField, relationDef,
  listField, subField, emojiSubField, groupField,
} from './_lib.mjs'

// Assigns a field def to a collapsible group ("group-detail") created via groupField().
const grouped = (fieldDef, group) => ({ ...fieldDef, meta: { ...fieldDef.meta, group } })

/* ── about_page ─────────────────────────────────────────────────── */
await createSingleton('about_page', {
  icon: 'info',
  note: '/verbivore/about səhifəsinin məzmununu idarə edir.',
  translations: [{ language: 'az-AZ', translation: 'Haqqımızda Səhifəsi' }],
})
await addFields('about_page', [
  strField('heroTitle', 'Hero Başlığı', { defaultValue: 'Verbivore Haqqında' }),
  textareaField('heroSubtitle', 'Hero Alt Başlığı', { defaultValue: '35+ ölkədəki məktəblər və milli təhsil qurumları ilə əməkdaşlıqda 9–17 yaşlı məktəblilər üçün hazırlanmış beynəlxalq İngilis dili olimpiadası.' }),
  strField('whatIsTitle', '"Nədir" Başlığı', { defaultValue: 'Verbivore nədir?' }),
  textareaField('whatIsText1', '"Nədir" 1-ci Paraqraf', { defaultValue: 'Verbivore lüğət dərinliyini, oxu anlayışını, məntiqi düşüncəni, kontekstdə qrammatikanı və qısa yazılı kommunikasiyanı yoxlayan strukturlu beynəlxalq İngilis dili müsabiqəsidir.' }),
  textareaField('whatIsText2', '"Nədir" 2-ci Paraqraf', { defaultValue: 'Tərcüməyə əsaslanan olimpiadalardan fərqli olaraq, Verbivore yaş səviyyəsinə uyğun, mədəni cəhətdən neytral kontekstlərdə həqiqi ünsiyyət bacarığını ölçür.' }),
  strField('missionTitle', 'Missiya Bölməsi Başlığı', { defaultValue: 'Missiyamız' }),
  listField('missionCards', 'Missiya Dəyər Kartları', [
    emojiSubField('icon', 'Emoji İkon'),
    subField('title', 'Başlıq', 'string'),
    subField('text', 'Mətn', 'text'),
  ], { template: '{{title}}', note: 'Hər element "Verbivore nədir" bölməsinin altında ayrı kart kimi göstərilir.' }),
  listField('timelineItems', 'Xronologiya Elementləri', [
    subField('year', 'İl', 'string'),
    subField('text', 'Mətn', 'text'),
  ], { template: '{{year}}: {{text}}', note: 'Səhifənin sağındakı "Timeline" panelində yuxarıdan-aşağı düzülən tarixçə nöqtələri.' }),
  listField('examTopics', 'İmtahan Mövzusu Etiketləri', [
    subField('label', 'Etiket', 'string'),
  ], { template: '{{label}}', note: 'Səhifənin sağındakı "Exam Topics" panelində kiçik etiketlər (tag) kimi göstərilir.' }),
  textareaField('participateText', 'İştirak Paneli Mətni', { defaultValue: 'İştirak akkreditə edilmiş milli nümayəndələr vasitəsilə həyata keçirilir. Ölkənizi aşağıda tapın və ya nümayəndəliyə müraciət edin.' }),
])

/* ── contact_page ───────────────────────────────────────────────── */
await createSingleton('contact_page', {
  icon: 'mail',
  note: '/contact səhifəsinin hero hissəsini və əlaqə formasının mətnlərini idarə edir.',
  translations: [{ language: 'az-AZ', translation: 'Əlaqə Səhifəsi' }],
})
await addFields('contact_page', [
  strField('heroTitle', 'Hero Başlığı', { defaultValue: 'Bizimlə Əlaqə' }),
  textareaField('heroSubtitle', 'Hero Alt Başlığı', { defaultValue: 'İştirak, akkreditasiya və ya tərəfdaşlıq barədə hər hansı sualınız üçün Verbivore koordinasiya qrupuna müraciət edin.' }),
  strField('formTitle', 'Forma Başlığı', { defaultValue: 'Mesaj göndər', note: 'Əlaqə formasının üstündəki başlıq.' }),
  strField('formSuccessMessage', 'Forma Uğur Mesajı', { defaultValue: '2–3 iş günü ərzində cavab veriləcək.', note: 'İstifadəçi formanı uğurla göndərdikdən sonra göstərilən mesaj.' }),
])

/* ── editions_page ──────────────────────────────────────────────── */
await createSingleton('editions_page', {
  icon: 'emoji_events',
  note: '/editions səhifəsinin hero hissəsini idarə edir.',
  translations: [{ language: 'az-AZ', translation: 'Buraxılışlar Səhifəsi' }],
})
await addFields('editions_page', [
  fileField('heroImage', 'Hero Arxa Plan Şəkli', { note: 'Hero bölməsi üçün tam enlikli şəkil.' }),
  strField('heroTitle', 'Hero Başlığı', { defaultValue: 'Verbivore Buraxılışları' }),
  textareaField('heroSubtitle', 'Hero Alt Başlığı', { defaultValue: 'Hər il yeni ev sahibi ölkə. Hər Böyük Final beynəlxalq İngilis dili mükəmməlliyinin yeni fəslidir.' }),
  strField('statsEditions', 'Statistika: Buraxılış sayı', { width: 'half', defaultValue: '3', note: '/editions səhifəsində "Editions hosted" rəqəmi.' }),
  strField('statsCountries', 'Statistika: Ölkə sayı', { width: 'half', defaultValue: '35+', note: '/editions səhifəsində "Countries" rəqəmi.' }),
  strField('statsAlumni', 'Statistika: Mezun sayı', { width: 'half', defaultValue: '500+', note: '/editions səhifəsində "Grand Final alumni" rəqəmi.' }),
])
await addRelations([relationDef('editions_page', 'heroImage', 'directus_files')])

/* ── home_page ──────────────────────────────────────────────────── */
await createSingleton('home_page', {
  icon: 'home',
  note: 'Ana səhifənin (/) hero bölməsini və aşağıdakı bölmələrin üst başlıqlarını idarə edir.',
  translations: [{ language: 'az-AZ', translation: 'Ana Səhifə' }],
})
await addFields('home_page', [groupField('group_hero', 'Hero Bölməsi')])
await addFields('home_page', [
  grouped(fileField('heroImage', 'Hero Arxa Plan Şəkli', { note: 'Tövsiyə: 1600×900px və ya daha geniş.' }), 'group_hero'),
  grouped(strField('heroEyebrow', 'Üst Mətn', { defaultValue: 'Global English Olympiad Experience' }), 'group_hero'),
  grouped(strField('heroTitle', 'Hero Başlığı', { defaultValue: 'English becomes a colorful challenge.' }), 'group_hero'),
  grouped(textareaField('heroSubtitle', 'Hero Alt Başlığı', { defaultValue: 'Verbivore brings students into a friendly international contest environment where vocabulary, reading, logic and communication skills are tested with excitement and confidence.' }), 'group_hero'),
  grouped(strField('heroCta1Label', 'Əsas Düymə Mətni', { width: 'half', defaultValue: 'Explore Verbivore →' }), 'group_hero'),
  grouped(strField('heroCta1Url', 'Əsas Düymə URL', { width: 'half', defaultValue: '/verbivore/about' }), 'group_hero'),
  grouped(strField('heroCta2Label', 'İkinci Düymə Mətni', { width: 'half', defaultValue: 'Check Exam Time' }), 'group_hero'),
  grouped(strField('heroCta2Url', 'İkinci Düymə URL', { width: 'half', defaultValue: '/verbivore/exam-time' }), 'group_hero'),
])
await addRelations([relationDef('home_page', 'heroImage', 'directus_files')])

await addFields('home_page', [groupField('group_sections', 'Bölmə Başlıqları')])
await addFields('home_page', [
  grouped(strField('statsKicker', 'Statistika Alt Başlığı', { defaultValue: 'Platform metrics' }), 'group_sections'),
  grouped(strField('statsTitle', 'Statistika Bölməsi Başlığı', { defaultValue: 'Designed for students, parents and schools.' }), 'group_sections'),
  grouped(textareaField('statsText', 'Statistika Bölməsi Mətni', { defaultValue: 'The homepage gives fast access to core numbers, contest structure, announcements and public exam information.' }), 'group_sections'),
  grouped(strField('partnersKicker', 'Tərəfdaşlar Alt Başlığı', { defaultValue: 'Partners' }), 'group_sections'),
  grouped(strField('partnersTitle', 'Tərəfdaşlar Bölməsi Başlığı', { defaultValue: 'Our institutional partners.' }), 'group_sections'),
])

/* ── site_settings ──────────────────────────────────────────────── */
await createSingleton('site_settings', {
  icon: 'settings',
  note: 'Saytın bütün səhifələrində istifadə olunan ümumi parametrlər.',
  translations: [{ language: 'az-AZ', translation: 'Sayt Parametrləri' }],
})
await addFields('site_settings', [
  strField('siteName', 'Sayt Adı', { defaultValue: 'Verbivore The Contest' }),
])

await addFields('site_settings', [groupField('group_footer', 'Altbilgi')])
await addFields('site_settings', [
  grouped(textareaField('footerDescription', 'Altbilgi Açıqlaması', { defaultValue: 'Verbivore The Contest şagirdlər, valideynlər, məktəblər və ölkə nümayəndələri üçün beynəlxalq İngilis dili müsabiqə platformasıdır.' }), 'group_footer'),
  grouped(strField('footerCopyright', 'Müəllif Hüququ Sətri', { defaultValue: 'Verbivore The Contest. Bütün hüquqlar qorunur.', note: 'Altbilginin ən altında, "© <cari il> ..." şəklində göstərilir.' }), 'group_footer'),
])

await addFields('site_settings', [groupField('group_contact', 'Əlaqə Məlumatları')])
await addFields('site_settings', [
  grouped(emailField('contactEmail', 'Ümumi Əlaqə E-poçtu', { defaultValue: 'info@verbivore.org' }), 'group_contact'),
  grouped(emailField('representativesEmail', 'Nümayəndələr E-poçtu', { defaultValue: 'representatives@verbivore.org' }), 'group_contact'),
  grouped(emailField('partnersEmail', 'Tərəfdaşlar E-poçtu', { defaultValue: 'partners@verbivore.org' }), 'group_contact'),
  grouped(strField('representativesDescription', 'Nümayəndələr Paneli Açıqlaması', { defaultValue: 'Ölkə nümayəndəsi sorğuları və akkreditasiya üçün.' }), 'group_contact'),
  grouped(strField('partnersDescription', 'Tərəfdaşlar Paneli Açıqlaması', { defaultValue: 'Sponsorluq, akademik tərəfdaşlıq və media sorğuları üçün.' }), 'group_contact'),
  grouped(strField('responseTime', 'Cavab Müddəti', { defaultValue: '2–3 iş günü' }), 'group_contact'),
])

await addFields('site_settings', [groupField('group_stats', 'Müsabiqə Statistikası')])
await addFields('site_settings', [
  grouped(strField('statsCountries', 'Ölkələr və Ərazilər', { width: 'half', defaultValue: '35+' }), 'group_stats'),
  grouped(strField('statsSchools', 'Tərəfdaş Məktəblər', { width: 'half', defaultValue: '500+' }), 'group_stats'),
  grouped(strField('statsStudents', 'Gözlənilən Şagirdlər', { width: 'half', defaultValue: '10K+' }), 'group_stats'),
  grouped(strField('statsRounds', 'Əsas Turlar', { width: 'half', defaultValue: '3' }), 'group_stats'),
])

await addFields('site_settings', [groupField('group_grandfinal', 'Böyük Final')])
await addFields('site_settings', [
  grouped(strField('grandFinalLabel', 'Geri Sayım Etiketi', { defaultValue: '🏁 Böyük Final geri sayımı — 14 İyul 2026', note: 'Geri sayım taymerinin üstündə göstərilən mətn.' }), 'group_grandfinal'),
  grouped(strField('grandFinalISODate', 'Böyük Final ISO Tarixi', { defaultValue: '2026-07-14T09:00:00', note: 'Format: YYYY-MM-DDTHH:mm:ss — əsas səhifədəki canlı geri sayım üçün.' }), 'group_grandfinal'),
])

await addFields('site_settings', [groupField('group_stage', 'Aktiv Müsabiqə Turu')])
await addFields('site_settings', [
  grouped(selectField('currentContestStage', 'Hazırkı Tur', [
    { text: '🟠 İlkin Seçim (Preliminary Round)', value: 'preliminary' },
    { text: '🔵 Milli Final (National Final)', value: 'national-final' },
    { text: '🏆 Böyük Final (Grand Final)', value: 'grand-final' },
  ], { width: 'full', defaultValue: 'preliminary', note: 'Bu seçim dəyişdikdə əsas səhifənin qalereyası avtomatik yenilənir.' }), 'group_stage'),
])

await addFields('site_settings', [groupField('group_visibility', 'Səhifə Görünüşü')])
await addFields('site_settings', [
  grouped(boolField('showScientificCommittee', 'Elmi Komitə səhifəsini göstər', { defaultValue: true, note: 'Söndürülsə, /verbivore/scientific-committee səhifəsi və ona aparan menyu keçidi gizlənir.' }), 'group_visibility'),
])

await setPublicRead(['about_page', 'contact_page', 'editions_page', 'home_page', 'site_settings'])
console.log('✓ page singleton collections ready')
