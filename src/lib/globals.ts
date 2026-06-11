import { getPayload } from "payload"
import configPromise from "@payload-config"

async function fetchGlobal(slug: string) {
  const payload = await getPayload({ config: configPromise })
  return payload.findGlobal({ slug, depth: 2 }) as Promise<any>
}

async function fetchCollection(collection: string, opts: { sort?: string; limit?: number; depth?: number; where?: any } = {}) {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({ collection, ...opts } as any)
  return docs
}

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

/* ── Globals ─────────────────────────────────────────────────── */

export async function getSiteSettings() {
  try { return { ...SITE_DEFAULTS, ...await fetchGlobal("site-settings") } } catch { return SITE_DEFAULTS }
}

export async function getHomePage() {
  try { return { ...HOME_DEFAULTS, ...await fetchGlobal("home-page") } } catch { return HOME_DEFAULTS }
}

export async function getContactPage() {
  try { return { ...CONTACT_DEFAULTS, ...await fetchGlobal("contact-page") } } catch { return CONTACT_DEFAULTS }
}

export async function getAboutPage() {
  try { return { ...ABOUT_DEFAULTS, ...await fetchGlobal("about-page") } } catch { return ABOUT_DEFAULTS }
}

export async function getEditionsPage() {
  try { return { ...EDITIONS_PAGE_DEFAULTS, ...await fetchGlobal("editions-page") } } catch { return EDITIONS_PAGE_DEFAULTS }
}

/* ── Collections ─────────────────────────────────────────────── */

export async function getNewsItems() {
  try { return await fetchCollection('news', { sort: '-createdAt', limit: 100, depth: 1 }) } catch { return [] }
}

export async function getPartners() {
  try { return await fetchCollection('partners', { sort: 'order', limit: 10, depth: 2 }) } catch { return [] }
}

export async function getGallery() {
  try { return await fetchCollection('gallery', { sort: 'order', limit: 20, depth: 2 }) } catch { return [] }
}

export async function getFaqItems() {
  try { return await fetchCollection('faq', { sort: 'order', limit: 100 }) } catch { return [] }
}

export async function getRegulations() {
  try { return await fetchCollection('regulations', { sort: 'order', limit: 50 }) } catch { return [] }
}

export async function getCountries() {
  try { return await fetchCollection('countries', { sort: 'order', limit: 50 }) } catch { return [] }
}

export async function getCommittee() {
  try { return await fetchCollection('committee', { sort: 'order', limit: 50, depth: 2 }) } catch { return [] }
}

export async function getExamTimes() {
  try { return await fetchCollection('exam-times', { sort: 'order', limit: 50, depth: 1 }) } catch { return [] }
}

export async function getEditions() {
  try { return await fetchCollection('editions', { sort: 'order', limit: 50, depth: 2 }) } catch { return [] }
}

export async function getPreliminaryResources() {
  try { return await fetchCollection('preliminary-resources', { sort: 'order', limit: 500, depth: 1, where: { stage: { equals: 'preliminary' } } }) } catch { return [] }
}

export async function getNationalFinalResources() {
  try { return await fetchCollection('preliminary-resources', { sort: 'order', limit: 500, depth: 1, where: { stage: { equals: 'national-final' } } }) } catch { return [] }
}

export async function getAllSampleResources() {
  try { return await fetchCollection('preliminary-resources', { sort: 'order', limit: 1000, depth: 1 }) } catch { return [] }
}

export async function getEditionBySlug(slug: string): Promise<any | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({ collection: 'editions', where: { slug: { equals: slug } }, limit: 1, depth: 2 })
    return docs[0] ?? null
  } catch { return null }
}

export async function getCategories() {
  try { return await fetchCollection('categories', { sort: 'order', limit: 50, depth: 1 }) } catch { return [] }
}

export async function getCategoryBySlug(slug: string): Promise<any | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
    return docs[0] ?? null
  } catch { return null }
}

/* ── Helpers ─────────────────────────────────────────────────── */

export function editionHost(ed: any): { name: string; flag: string } {
  if (ed?.hostCountry && typeof ed.hostCountry === 'object') {
    return { name: ed.hostCountry.name, flag: ed.hostCountry.flag }
  }
  return { name: ed?.hostCountryLabel || '', flag: ed?.flag || '' }
}
