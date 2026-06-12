import { directusFetch, fileUrl } from './directus'

/* ── Defaults ────────────────────────────────────────────────── */

export const SITE_DEFAULTS = {
  siteName: "Verbivore The Contest",
  footerDescription: "Verbivore The Contest is an international English challenge platform for students, parents, schools and country representatives.",
  footerCopyright: "Verbivore The Contest. All rights reserved.",
  contactEmail: "info@verbivore.org",
  representativesEmail: "representatives@verbivore.org",
  partnersEmail: "partners@verbivore.org",
  representativesDescription: "For country representative inquiries and accreditation applications.",
  partnersDescription: "For sponsorship, academic partnership and media inquiries.",
  responseTime: "2-3 business days",
  statsCountries: "35+", statsSchools: "500+", statsStudents: "10K+", statsRounds: "3",
  grandFinalLabel: "Grand Final countdown - July 14, 2026",
  grandFinalISODate: "2026-07-14T09:00:00",
  showScientificCommittee: true,
}

export const HOME_DEFAULTS = {
  heroImage: null as null | { url?: string },
  heroEyebrow: "Global English Olympiad Experience",
  heroTitle: "English becomes a colorful challenge.",
  heroSubtitle: "Verbivore brings students into a friendly international contest environment where vocabulary, reading, logic and communication skills are tested with excitement and confidence.",
  heroCta1Label: "Explore Verbivore", heroCta1Url: "/verbivore/about",
  heroCta2Label: "Check Exam Time", heroCta2Url: "/verbivore/exam-time",
  statsKicker: "Platform metrics", statsTitle: "Designed for students, parents and schools.",
  statsText: "The homepage gives fast access to core numbers, contest structure, announcements and public exam information.",
  partnersKicker: "Partners", partnersTitle: "Our institutional partners.",
}

export const CONTACT_DEFAULTS = {
  heroTitle: "Contact Us",
  heroSubtitle: "Reach the Verbivore coordination team for any questions about participation, accreditation or partnerships.",
  formTitle: "Send a message",
  formSuccessMessage: "We will get back to you within 2-3 business days.",
}

export const ABOUT_DEFAULTS = {
  heroTitle: 'About Verbivore',
  heroSubtitle: 'The international English olympiad designed for school students aged 9–17, in partnership with schools and national educational bodies across 35+ countries.',
  whatIsTitle: 'What is Verbivore?',
  whatIsText1: 'Verbivore is a structured international English competition that tests vocabulary depth, reading comprehension, logical reasoning, grammar in context and short written communication.',
  whatIsText2: 'Unlike translation-focused olympiads, Verbivore measures genuine communicative competence in age-appropriate, culturally neutral contexts.',
  missionTitle: 'Our Mission',
  missionCards: [] as any[],
  timelineItems: [] as any[],
  examTopics: [] as any[],
  participateText: 'Participation is through accredited national representatives. Find your country below or apply to represent yours.',
}

export const EDITIONS_PAGE_DEFAULTS = {
  heroImage: null as null | { url?: string },
  heroTitle: 'Verbivore Editions',
  heroSubtitle: 'Every year, a new host country. Every Grand Final, a new chapter in international English excellence.',
  statsEditions: '3',
  statsCountries: '35+',
  statsAlumni: '500+',
}

export const SAMPLE_QUESTIONS_PAGE_DEFAULTS = {
  heroTitle: 'Nümunə Suallar və Sillabus',
  heroSubtitle: 'Verbivore müsabiqəsinin mərhələlərinə uyğun nümunə suallar və sillabus sənədlərini buradan yükləyə bilərsiniz. Resurslar mərhələ və kateqoriyalar üzrə strukturlaşdırılmışdır.',
  sampleSectionTitle: 'Nümunə suallar',
  sampleSectionText: 'Aşağıdakı mərhələlərdən birini seçin. Kateqoriyaya daxil olaraq mövcud PDF nümunələrini yükləyə bilərsiniz.',
  categoryChips: [] as any[],
  topicTags: [] as string[],
  syllabusSectionTitle: 'Sillabus',
  syllabusSectionText: 'Hər mərhələ üzrə kateqoriyanı seçərək həmin kateqoriyaya aid sillabus PDF sənədini yükləyə bilərsiniz.',
  syllabusBadge: 'Yüklənə bilən PDF',
  syllabusStructure: [] as string[],
  usageSteps: [] as string[],
  stagesList: [] as string[],
  categoriesList: [] as string[],
}

export const PRELIMINARY_PAGE_DEFAULTS = {
  heroTitle: 'Preliminary Round',
  heroSubtitle: 'The first stage of Verbivore. Held in schools across all participating countries, the Preliminary Round is open to all registered students.',
  howItWorksTitle: 'How it works',
  howItWorksSubtitle: 'Preliminary Round mərhələsinin əsas proses xəritəsi.',
  steps: [] as any[],
  keyInfoTitle: '📋 Key Info',
  keyInfo: [] as any[],
  topicsTitle: '🎯 Topics tested',
  topicTags: [] as string[],
  sampleQuestionsTitle: 'Nümunə suallar',
  sampleQuestionsText: 'Valideyn və şagird müvafiq mərhələni, sonra kateqoriyanı seçərək PDF nümunələrini açıb yükləyə bilər.',
  syllabusTitle: 'Sillabus',
  syllabusText: 'Hər mərhələ üzrə kateqoriya açılır və uyğun sillabus PDF-i yüklənir.',
  resultsTitle: 'Nəticələr',
  resultsText: 'Bu bölmə yalnız Preliminary Round nəticələri üçündür. İstifadəçi ölkə adına klikləyərək həmin ölkəyə aid PDF nəticəni yükləyə bilər.',
}

export const NATIONAL_FINAL_PAGE_DEFAULTS = {
  heroTitle: 'National Final',
  heroSubtitle: 'The second stage of Verbivore. Top scorers from the Preliminary Round compete in a country-level final, qualifying the best for the Grand Final.',
  howItWorksTitle: 'How it works',
  howItWorksSubtitle: 'National Final mərhələsinin əsas proses xəritəsi.',
  steps: [] as any[],
  keyInfoTitle: '📋 Key Info',
  keyInfo: [] as any[],
  awardsTitle: '🏅 Awards',
  awardTags: [] as string[],
  sampleQuestionsTitle: 'Nümunə suallar',
  sampleQuestionsText: 'National Final üçün hazırlıq nümunə sualları. Kateqoriyanı seçib müvafiq PDF-i açın.',
  syllabusTitle: 'Sillabus',
  syllabusText: 'National Final üçün kateqoriya sillabusları. Hər kateqoriya üçün PDF-i yükləyə bilərsiniz.',
  resultsTitle: 'Nəticələr',
  resultsText: 'Bu bölmə yalnız National Final nəticələri üçündür. Ölkə adına klikləyərək PDF nəticəni yükləyə bilərsiniz.',
}

/* ── Globals ─────────────────────────────────────────────────── */

export async function getSiteSettings() {
  try {
    const data = await directusFetch('/items/site_settings')
    return { ...SITE_DEFAULTS, ...data, showScientificCommittee: !!data.showScientificCommittee }
  } catch { return SITE_DEFAULTS }
}

export async function getHomePage() {
  try {
    const data = await directusFetch('/items/home_page')
    return { ...HOME_DEFAULTS, ...data, heroImage: fileUrl(data.heroImage) }
  } catch { return HOME_DEFAULTS }
}

export async function getContactPage() {
  try { return { ...CONTACT_DEFAULTS, ...await directusFetch('/items/contact_page') } } catch { return CONTACT_DEFAULTS }
}

export async function getAboutPage() {
  try { return { ...ABOUT_DEFAULTS, ...await directusFetch('/items/about_page') } } catch { return ABOUT_DEFAULTS }
}

export async function getEditionsPage() {
  try {
    const data = await directusFetch('/items/editions_page')
    return { ...EDITIONS_PAGE_DEFAULTS, ...data, heroImage: fileUrl(data.heroImage) }
  } catch { return EDITIONS_PAGE_DEFAULTS }
}

export async function getSampleQuestionsPage() {
  try { return { ...SAMPLE_QUESTIONS_PAGE_DEFAULTS, ...await directusFetch('/items/sample_questions_page') } } catch { return SAMPLE_QUESTIONS_PAGE_DEFAULTS }
}

export async function getPreliminaryPage() {
  try { return { ...PRELIMINARY_PAGE_DEFAULTS, ...await directusFetch('/items/preliminary_page') } } catch { return PRELIMINARY_PAGE_DEFAULTS }
}

export async function getNationalFinalPage() {
  try { return { ...NATIONAL_FINAL_PAGE_DEFAULTS, ...await directusFetch('/items/national_final_page') } } catch { return NATIONAL_FINAL_PAGE_DEFAULTS }
}

/* ── Collections ─────────────────────────────────────────────── */

export async function getNewsItems() {
  try {
    const data = await directusFetch('/items/news?fields=*&sort=-id&limit=100')
    return data.map((n: any) => ({
      ...n,
      text: n.title,
      published: n.status === 'published',
      image: fileUrl(n.image),
    }))
  } catch { return [] }
}

export async function getPartners() {
  try {
    const data = await directusFetch('/items/partners?fields=*&sort=order&limit=10')
    return data.map((p: any) => ({ ...p, logo: fileUrl(p.logo) }))
  } catch { return [] }
}

export async function getGallery() {
  try {
    const data = await directusFetch('/items/gallery?fields=*&sort=sort&limit=20')
    return data.map((g: any) => ({
      ...g,
      image: fileUrl(g.image),
      videoFile: fileUrl(g.video_file),
      videoUrl: g.video_url,
      mediaType: g.media_type,
    }))
  } catch { return [] }
}

export async function getFaqItems() {
  try { return await directusFetch('/items/faq?fields=*&sort=sort&limit=100') } catch { return [] }
}

export async function getRegulations() {
  try { return await directusFetch('/items/regulations?fields=*&sort=order&limit=50') } catch { return [] }
}

export async function getCountries() {
  try { return await directusFetch('/items/countries?fields=*&sort=order&limit=50') } catch { return [] }
}

export async function getCommittee() {
  try {
    const data = await directusFetch('/items/committee?fields=*,country.*&sort=order&limit=50')
    return data.map((m: any) => ({ ...m, photo: fileUrl(m.photo) }))
  } catch { return [] }
}

export async function getExamTimes() {
  try { return await directusFetch('/items/exam_times?fields=*,country.*&sort=order&limit=50') } catch { return [] }
}

export async function getEditions() {
  try {
    const data = await directusFetch('/items/editions?fields=*,hostCountry.*&sort=order&limit=50')
    return data.map(reshapeEdition)
  } catch { return [] }
}

async function fetchPreliminaryResources(stage?: string) {
  const filter = stage ? `&filter[stage][_eq]=${stage}` : ''
  return directusFetch(`/items/preliminary_resources?fields=*,country.*&sort=order&limit=1000${filter}`)
}

export async function getPreliminaryResources() {
  try { return await fetchPreliminaryResources('preliminary') } catch { return [] }
}

export async function getNationalFinalResources() {
  try { return await fetchPreliminaryResources('national-final') } catch { return [] }
}

export async function getAllSampleResources() {
  try { return await fetchPreliminaryResources() } catch { return [] }
}

export async function getEditionBySlug(slug: string): Promise<any | null> {
  try {
    const data = await directusFetch(`/items/editions?filter[slug][_eq]=${encodeURIComponent(slug)}&fields=*,hostCountry.*&limit=1`)
    return data[0] ? reshapeEdition(data[0]) : null
  } catch { return null }
}

export async function getCategories() {
  try {
    const data = await directusFetch('/items/categories?fields=*&sort=order&limit=50')
    return data.map((c: any) => ({ ...c, coverImage: fileUrl(c.coverImage) }))
  } catch { return [] }
}

export async function getCategoryBySlug(slug: string): Promise<any | null> {
  try {
    const data = await directusFetch(`/items/categories?filter[slug][_eq]=${encodeURIComponent(slug)}&fields=*&limit=1`)
    const c = data[0]
    return c ? { ...c, coverImage: fileUrl(c.coverImage) } : null
  } catch { return null }
}

/* ── Helpers ─────────────────────────────────────────────────── */

function reshapeEdition(ed: any) {
  return {
    ...ed,
    image: fileUrl(ed.image),
    heroImage: fileUrl(ed.heroImage),
    hostInstitution: {
      name: ed.hostInstitutionName, website: ed.hostInstitutionWebsite,
      description: ed.hostInstitutionDescription, description2: ed.hostInstitutionDescription2,
      address: ed.hostInstitutionAddress, email: ed.hostInstitutionEmail, phone: ed.hostInstitutionPhone,
    },
    academicPartner: { name: ed.academicPartnerName, description: ed.academicPartnerDescription },
    venuePartner: { name: ed.venuePartnerName, description: ed.venuePartnerDescription },
    countryDelegations: (ed.countryDelegations || []).map((d: any) => ({
      ...d,
      country: { id: d.countryName, name: d.countryName, flag: d.countryFlag },
    })),
    medalTable: (ed.medalTable || []).map((m: any) => ({
      ...m,
      country: { id: m.countryName, name: m.countryName, flag: m.countryFlag },
    })),
  }
}

export function editionHost(ed: any): { name: string; flag: string } {
  if (ed?.hostCountry && typeof ed.hostCountry === 'object') {
    return { name: ed.hostCountry.name, flag: ed.hostCountry.flag }
  }
  return { name: ed?.hostCountryLabel || '', flag: ed?.flag || '' }
}
