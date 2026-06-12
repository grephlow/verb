// Three new singleton "page" collections recreating the hardcoded copy of the
// contest-stage pages: /verbivore/sample-questions, /verbivore/preliminary-round,
// /verbivore/national-final. Mirrors the pattern in 08-page-singletons.mjs.
// Idempotent: safe to re-run (createSingleton/addFields are no-ops on existing schema
// only if re-run from scratch — this script is meant to run once per environment).

import {
  api, createSingleton, addFields, setPublicRead,
  strField, textareaField, listField, subField, emojiSubField, tagsField, groupField,
} from './_lib.mjs'

// Assigns a field def to a collapsible group ("group-detail") created via groupField().
const grouped = (fieldDef, group) => ({ ...fieldDef, meta: { ...fieldDef.meta, group } })

/* ── sample_questions_page ─────────────────────────────────────── */
await createSingleton('sample_questions_page', {
  icon: 'quiz',
  note: '/verbivore/sample-questions səhifəsinin məzmununu idarə edir.',
  translations: [{ language: 'az-AZ', translation: 'Nümunə Suallar Səhifəsi' }],
})

await addFields('sample_questions_page', [groupField('group_hero', 'Hero')])
await addFields('sample_questions_page', [
  grouped(strField('heroTitle', 'Hero Başlığı', { defaultValue: 'Nümunə Suallar və Sillabus' }), 'group_hero'),
  grouped(textareaField('heroSubtitle', 'Hero Alt Başlığı', { defaultValue: 'Verbivore müsabiqəsinin mərhələlərinə uyğun nümunə suallar və sillabus sənədlərini buradan yükləyə bilərsiniz. Resurslar mərhələ və kateqoriyalar üzrə strukturlaşdırılmışdır.' }), 'group_hero'),
])

await addFields('sample_questions_page', [groupField('group_samples', 'Nümunə Suallar Bölməsi')])
await addFields('sample_questions_page', [
  grouped(strField('sampleSectionTitle', 'Bölmə Başlığı', { defaultValue: 'Nümunə suallar' }), 'group_samples'),
  grouped(textareaField('sampleSectionText', 'Bölmə Mətni', { defaultValue: 'Aşağıdakı mərhələlərdən birini seçin. Kateqoriyaya daxil olaraq mövcud PDF nümunələrini yükləyə bilərsiniz.' }), 'group_samples'),
  grouped(listField('categoryChips', 'Kateqoriya Çipləri', [
    emojiSubField('icon', 'Emoji'),
    subField('label', 'Etiket', 'string'),
  ], { template: '{{icon}} {{label}}', note: 'Mobil görünüşdə "Nümunə suallar" bölməsinin üstündə kiçik çip kimi göstərilir.' }), 'group_samples'),
  grouped(tagsField('topicTags', 'Mövzu Etiketləri', { note: 'Əhatə olunan mövzular — bölmənin altında və yan paneldə göstərilir.', defaultValue: ['Lüğət', 'Oxu', 'Qrammatika', 'Məntiq', 'İdiomlar', 'Söz əmələ gəlməsi'] }), 'group_samples'),
])

await addFields('sample_questions_page', [groupField('group_syllabus', 'Sillabus Bölməsi')])
await addFields('sample_questions_page', [
  grouped(strField('syllabusSectionTitle', 'Bölmə Başlığı', { defaultValue: 'Sillabus' }), 'group_syllabus'),
  grouped(textareaField('syllabusSectionText', 'Bölmə Mətni', { defaultValue: 'Hər mərhələ üzrə kateqoriyanı seçərək həmin kateqoriyaya aid sillabus PDF sənədini yükləyə bilərsiniz.' }), 'group_syllabus'),
  grouped(strField('syllabusBadge', 'Nişan Mətni', { width: 'half', defaultValue: 'Yüklənə bilən PDF' }), 'group_syllabus'),
  grouped(tagsField('syllabusStructure', 'Sillabus Strukturu', { note: 'Mobil və yan paneldə "Sillabus strukturu" siyahısı.', defaultValue: ['İlkin seçim üçün mövzu bölgüsü', 'Milli final üçün dərinləşdirilmiş istiqamətlər', 'Grand Final üçün genişləndirilmiş proqram'] }), 'group_syllabus'),
  grouped(tagsField('usageSteps', 'İstifadə Qaydası', { note: 'Yan paneldə "İstifadə qaydası" siyahısı.', defaultValue: ['Mərhələ seçilir', 'Kateqoriya açılır', 'Uyğun PDF yüklənir'] }), 'group_syllabus'),
])

await addFields('sample_questions_page', [groupField('group_sidebar', 'Yan Panel')])
await addFields('sample_questions_page', [
  grouped(tagsField('stagesList', 'Mərhələlər Siyahısı', { note: 'Yan paneldə "Mərhələlər" siyahısı.', defaultValue: ['İlkin seçim mərhələsi', 'Milli final mərhələsi', 'Grand Final mərhələsi'] }), 'group_sidebar'),
  grouped(tagsField('categoriesList', 'Kateqoriyalar Siyahısı', { note: 'Yan paneldə "Kateqoriyalar" siyahısı.', defaultValue: ['Kiçik A — 3–4-cü sinif', 'Kiçik B — 5–6-cı sinif', 'Orta səviyyə — 7–8-ci sinif', 'Böyük — 9–11-ci sinif'] }), 'group_sidebar'),
])

await api('PATCH', '/items/sample_questions_page', {
  heroTitle: 'Nümunə Suallar və Sillabus',
  heroSubtitle: 'Verbivore müsabiqəsinin mərhələlərinə uyğun nümunə suallar və sillabus sənədlərini buradan yükləyə bilərsiniz. Resurslar mərhələ və kateqoriyalar üzrə strukturlaşdırılmışdır.',
  sampleSectionTitle: 'Nümunə suallar',
  sampleSectionText: 'Aşağıdakı mərhələlərdən birini seçin. Kateqoriyaya daxil olaraq mövcud PDF nümunələrini yükləyə bilərsiniz.',
  categoryChips: [
    { icon: '📂', label: 'Kiçik A' },
    { icon: '📂', label: 'Kiçik B' },
    { icon: '📂', label: 'Orta' },
    { icon: '📂', label: 'Böyük' },
  ],
  topicTags: ['Lüğət', 'Oxu', 'Qrammatika', 'Məntiq', 'İdiomlar', 'Söz əmələ gəlməsi'],
  syllabusSectionTitle: 'Sillabus',
  syllabusSectionText: 'Hər mərhələ üzrə kateqoriyanı seçərək həmin kateqoriyaya aid sillabus PDF sənədini yükləyə bilərsiniz.',
  syllabusBadge: 'Yüklənə bilən PDF',
  syllabusStructure: ['İlkin seçim üçün mövzu bölgüsü', 'Milli final üçün dərinləşdirilmiş istiqamətlər', 'Grand Final üçün genişləndirilmiş proqram'],
  usageSteps: ['Mərhələ seçilir', 'Kateqoriya açılır', 'Uyğun PDF yüklənir'],
  stagesList: ['İlkin seçim mərhələsi', 'Milli final mərhələsi', 'Grand Final mərhələsi'],
  categoriesList: ['Kiçik A — 3–4-cü sinif', 'Kiçik B — 5–6-cı sinif', 'Orta səviyyə — 7–8-ci sinif', 'Böyük — 9–11-ci sinif'],
})

/* ── preliminary_page ───────────────────────────────────────────── */
await createSingleton('preliminary_page', {
  icon: 'looks_one',
  note: '/verbivore/preliminary-round səhifəsinin məzmununu idarə edir.',
  translations: [{ language: 'az-AZ', translation: 'Preliminary Round Səhifəsi' }],
})

await addFields('preliminary_page', [groupField('group_hero', 'Hero')])
await addFields('preliminary_page', [
  grouped(strField('heroTitle', 'Hero Başlığı', { defaultValue: 'Preliminary Round' }), 'group_hero'),
  grouped(textareaField('heroSubtitle', 'Hero Alt Başlığı', { defaultValue: 'The first stage of Verbivore. Held in schools across all participating countries, the Preliminary Round is open to all registered students.' }), 'group_hero'),
])

await addFields('preliminary_page', [groupField('group_how', 'Necə işləyir')])
await addFields('preliminary_page', [
  grouped(strField('howItWorksTitle', 'Bölmə Başlığı', { defaultValue: 'How it works' }), 'group_how'),
  grouped(textareaField('howItWorksSubtitle', 'Bölmə Mətni', { defaultValue: 'Preliminary Round mərhələsinin əsas proses xəritəsi.' }), 'group_how'),
  grouped(listField('steps', 'Addımlar', [
    subField('number', 'Nömrə', 'string', { width: 'half' }),
    subField('title', 'Başlıq', 'string', { width: 'half' }),
    subField('text', 'Mətn', 'text'),
  ], { template: '{{number}} — {{title}}', note: '"How it works" bölməsindəki addım kartları.' }), 'group_how'),
])

await addFields('preliminary_page', [groupField('group_info', 'Açar Məlumat')])
await addFields('preliminary_page', [
  grouped(strField('keyInfoTitle', 'Açar Məlumat Başlığı', { width: 'half', defaultValue: '📋 Key Info' }), 'group_info'),
  grouped(listField('keyInfo', 'Açar Məlumat Sətirləri', [
    emojiSubField('icon', 'Emoji'),
    subField('label', 'Etiket', 'string'),
    subField('value', 'Dəyər', 'string'),
  ], { template: '{{icon}} {{label}}: {{value}}' }), 'group_info'),
  grouped(strField('topicsTitle', 'Mövzular Başlığı', { width: 'half', defaultValue: '🎯 Topics tested' }), 'group_info'),
  grouped(tagsField('topicTags', 'Mövzu Etiketləri', { defaultValue: ['Vocabulary', 'Reading', 'Grammar', 'Logic', 'Word Formation'] }), 'group_info'),
])

await addFields('preliminary_page', [groupField('group_sections', 'Resurs Bölmələri')])
await addFields('preliminary_page', [
  grouped(strField('sampleQuestionsTitle', 'Başlıq', { width: 'half', defaultValue: 'Nümunə suallar' }), 'group_sections'),
  grouped(textareaField('sampleQuestionsText', 'Mətn', { defaultValue: 'Valideyn və şagird müvafiq mərhələni, sonra kateqoriyanı seçərək PDF nümunələrini açıb yükləyə bilər.' }), 'group_sections'),
  grouped(strField('syllabusTitle', 'Başlıq', { width: 'half', defaultValue: 'Sillabus' }), 'group_sections'),
  grouped(textareaField('syllabusText', 'Mətn', { defaultValue: 'Hər mərhələ üzrə kateqoriya açılır və uyğun sillabus PDF-i yüklənir.' }), 'group_sections'),
  grouped(strField('resultsTitle', 'Başlıq', { width: 'half', defaultValue: 'Nəticələr' }), 'group_sections'),
  grouped(textareaField('resultsText', 'Mətn', { defaultValue: 'Bu bölmə yalnız Preliminary Round nəticələri üçündür. İstifadəçi ölkə adına klikləyərək həmin ölkəyə aid PDF nəticəni yükləyə bilər.' }), 'group_sections'),
])

await api('PATCH', '/items/preliminary_page', {
  heroTitle: 'Preliminary Round',
  heroSubtitle: 'The first stage of Verbivore. Held in schools across all participating countries, the Preliminary Round is open to all registered students.',
  howItWorksTitle: 'How it works',
  howItWorksSubtitle: 'Preliminary Round mərhələsinin əsas proses xəritəsi.',
  steps: [
    { number: '01', title: 'Registration', text: 'Schools register students through the accredited national representative before the deadline.' },
    { number: '02', title: 'Exam Day', text: 'Students sit the paper in their own school, supervised by a teacher. Duration: 90 minutes.' },
    { number: '03', title: 'Results', text: 'Results are published within 4 weeks. Top scorers advance to the National Final.' },
  ],
  keyInfoTitle: '📋 Key Info',
  keyInfo: [
    { icon: '⏱️', label: 'Duration', value: '90 minutes' },
    { icon: '📋', label: 'Format', value: 'Paper-based / Online' },
    { icon: '🌍', label: 'Open to', value: 'All registered students' },
    { icon: '🏆', label: 'Advancement', value: 'Top scorers by category' },
  ],
  topicsTitle: '🎯 Topics tested',
  topicTags: ['Vocabulary', 'Reading', 'Grammar', 'Logic', 'Word Formation'],
  sampleQuestionsTitle: 'Nümunə suallar',
  sampleQuestionsText: 'Valideyn və şagird müvafiq mərhələni, sonra kateqoriyanı seçərək PDF nümunələrini açıb yükləyə bilər.',
  syllabusTitle: 'Sillabus',
  syllabusText: 'Hər mərhələ üzrə kateqoriya açılır və uyğun sillabus PDF-i yüklənir.',
  resultsTitle: 'Nəticələr',
  resultsText: 'Bu bölmə yalnız Preliminary Round nəticələri üçündür. İstifadəçi ölkə adına klikləyərək həmin ölkəyə aid PDF nəticəni yükləyə bilər.',
})

/* ── national_final_page ───────────────────────────────────────── */
await createSingleton('national_final_page', {
  icon: 'looks_two',
  note: '/verbivore/national-final səhifəsinin məzmununu idarə edir.',
  translations: [{ language: 'az-AZ', translation: 'National Final Səhifəsi' }],
})

await addFields('national_final_page', [groupField('group_hero', 'Hero')])
await addFields('national_final_page', [
  grouped(strField('heroTitle', 'Hero Başlığı', { defaultValue: 'National Final' }), 'group_hero'),
  grouped(textareaField('heroSubtitle', 'Hero Alt Başlığı', { defaultValue: 'The second stage of Verbivore. Top scorers from the Preliminary Round compete in a country-level final, qualifying the best for the Grand Final.' }), 'group_hero'),
])

await addFields('national_final_page', [groupField('group_how', 'Necə işləyir')])
await addFields('national_final_page', [
  grouped(strField('howItWorksTitle', 'Bölmə Başlığı', { defaultValue: 'How it works' }), 'group_how'),
  grouped(textareaField('howItWorksSubtitle', 'Bölmə Mətni', { defaultValue: 'National Final mərhələsinin əsas proses xəritəsi.' }), 'group_how'),
  grouped(listField('steps', 'Addımlar', [
    subField('number', 'Nömrə', 'string', { width: 'half' }),
    subField('title', 'Başlıq', 'string', { width: 'half' }),
    subField('text', 'Mətn', 'text'),
  ], { template: '{{number}} — {{title}}', note: '"How it works" bölməsindəki addım kartları.' }), 'group_how'),
])

await addFields('national_final_page', [groupField('group_info', 'Açar Məlumat')])
await addFields('national_final_page', [
  grouped(strField('keyInfoTitle', 'Açar Məlumat Başlığı', { width: 'half', defaultValue: '📋 Key Info' }), 'group_info'),
  grouped(listField('keyInfo', 'Açar Məlumat Sətirləri', [
    emojiSubField('icon', 'Emoji'),
    subField('label', 'Etiket', 'string'),
    subField('value', 'Dəyər', 'string'),
  ], { template: '{{icon}} {{label}}: {{value}}' }), 'group_info'),
  grouped(strField('awardsTitle', 'Mükafatlar Başlığı', { width: 'half', defaultValue: '🏅 Awards' }), 'group_info'),
  grouped(tagsField('awardTags', 'Mükafat Etiketləri', { defaultValue: ['🥇 Gold Medal', '🥈 Silver Medal', '🥉 Bronze Medal', '📜 Certificate', '🏆 Grand Final Invite'] }), 'group_info'),
])

await addFields('national_final_page', [groupField('group_sections', 'Resurs Bölmələri')])
await addFields('national_final_page', [
  grouped(strField('sampleQuestionsTitle', 'Başlıq', { width: 'half', defaultValue: 'Nümunə suallar' }), 'group_sections'),
  grouped(textareaField('sampleQuestionsText', 'Mətn', { defaultValue: 'National Final üçün hazırlıq nümunə sualları. Kateqoriyanı seçib müvafiq PDF-i açın.' }), 'group_sections'),
  grouped(strField('syllabusTitle', 'Başlıq', { width: 'half', defaultValue: 'Sillabus' }), 'group_sections'),
  grouped(textareaField('syllabusText', 'Mətn', { defaultValue: 'National Final üçün kateqoriya sillabusları. Hər kateqoriya üçün PDF-i yükləyə bilərsiniz.' }), 'group_sections'),
  grouped(strField('resultsTitle', 'Başlıq', { width: 'half', defaultValue: 'Nəticələr' }), 'group_sections'),
  grouped(textareaField('resultsText', 'Mətn', { defaultValue: 'Bu bölmə yalnız National Final nəticələri üçündür. Ölkə adına klikləyərək PDF nəticəni yükləyə bilərsiniz.' }), 'group_sections'),
])

await api('PATCH', '/items/national_final_page', {
  heroTitle: 'National Final',
  heroSubtitle: 'The second stage of Verbivore. Top scorers from the Preliminary Round compete in a country-level final, qualifying the best for the Grand Final.',
  howItWorksTitle: 'How it works',
  howItWorksSubtitle: 'National Final mərhələsinin əsas proses xəritəsi.',
  steps: [
    { number: '01', title: 'Qualification', text: 'Top scorers from the Preliminary Round receive an invitation from their national representative.' },
    { number: '02', title: 'Exam Day', text: 'A harder paper completed at the national representative venue. Duration: 90–120 minutes.' },
    { number: '03', title: 'Grand Final', text: 'National medal winners and Grand Final invitees are announced within 4 weeks of the exam.' },
  ],
  keyInfoTitle: '📋 Key Info',
  keyInfo: [
    { icon: '⏱️', label: 'Duration', value: '90–120 minutes' },
    { icon: '📋', label: 'Format', value: 'Paper-based + optional oral' },
    { icon: '🎯', label: 'Eligibility', value: 'Top % from Preliminary Round' },
    { icon: '🏆', label: 'Advancement', value: 'Grand Final invitation' },
  ],
  awardsTitle: '🏅 Awards',
  awardTags: ['🥇 Gold Medal', '🥈 Silver Medal', '🥉 Bronze Medal', '📜 Certificate', '🏆 Grand Final Invite'],
  sampleQuestionsTitle: 'Nümunə suallar',
  sampleQuestionsText: 'National Final üçün hazırlıq nümunə sualları. Kateqoriyanı seçib müvafiq PDF-i açın.',
  syllabusTitle: 'Sillabus',
  syllabusText: 'National Final üçün kateqoriya sillabusları. Hər kateqoriya üçün PDF-i yükləyə bilərsiniz.',
  resultsTitle: 'Nəticələr',
  resultsText: 'Bu bölmə yalnız National Final nəticələri üçündür. Ölkə adına klikləyərək PDF nəticəni yükləyə bilərsiniz.',
})

await setPublicRead(['sample_questions_page', 'preliminary_page', 'national_final_page'])
console.log('✓ sample_questions_page, preliminary_page, national_final_page ready')
