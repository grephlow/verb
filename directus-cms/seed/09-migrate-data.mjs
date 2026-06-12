// Migrates real production data from the Payload SQLite DB (verbivore-next/verbivore.db)
// into the Directus schema created by seed scripts 03-08.
// Run order matters: countries -> editions -> (committee/certificates/partners, which
// reference both) -> regulations/exam_times/preliminary_resources -> gallery/news/faq -> singletons.

import Database from 'better-sqlite3'
import { readFileSync } from 'fs'
import { api, BASE, TOKEN } from './_lib.mjs'

const PAYLOAD_DB = '/home/greph/Downloads/verbivore/verbivore-next/verbivore.db'
const UPLOADS_DIR = '/home/greph/Downloads/verbivore/verbivore-next/public/uploads'

const db = new Database(PAYLOAD_DB, { readonly: true })
const all = (table) => db.prepare(`SELECT * FROM ${table}`).all()
const childrenOf = (table, parentId) => db.prepare(`SELECT * FROM ${table} WHERE _parent_id = ? ORDER BY _order`).all(parentId)
const bulkInsert = (collection, items) => api('POST', `/items/${collection}`, items)

/* ── Media upload ───────────────────────────────────────────────── */
async function uploadMedia(filename, mime) {
  const buffer = readFileSync(`${UPLOADS_DIR}/${filename}`)
  const form = new FormData()
  form.append('title', filename)
  form.append('file', new Blob([buffer], { type: mime }), filename)
  const res = await fetch(`${BASE}/files`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}` },
    body: form,
  })
  const json = await res.json()
  if (!res.ok) { console.error(JSON.stringify(json, null, 2)); throw new Error('upload failed: ' + filename) }
  return json.data.id
}

const mediaMap = {}
for (const m of all('media')) {
  mediaMap[m.id] = await uploadMedia(m.filename, m.mime_type)
}
console.log('✓ uploaded media', mediaMap)

/* ── Countries ──────────────────────────────────────────────────── */
const countries = all('countries')
const countryById = new Map(countries.map((c) => [c.id, c]))
const countryRef = (id) => {
  const c = countryById.get(id)
  return { countryName: c?.name ?? '', countryFlag: c?.flag ?? '' }
}

await bulkInsert('countries', countries.map((c) => ({
  id: c.id, name: c.name, flag: c.flag, status: c.status,
  accreditedOrganization: c.accredited_organization, representative: c.representative,
  website: c.website, notes: c.notes, order: c.order,
})))
console.log('✓ countries')

/* ── Categories ─────────────────────────────────────────────────── */
await bulkInsert('categories', all('categories').map((cat) => ({
  id: cat.id, name: cat.name, slug: cat.slug, gradeRange: cat.grade_range, ageRange: cat.age_range,
  color: cat.color, description: cat.description,
  topics: childrenOf('categories_topics', cat.id).map((t) => ({ topic: t.topic })),
  coverImage: cat.cover_image_id ? mediaMap[cat.cover_image_id] : null,
  videoUrl: cat.video_url,
  contentSections: childrenOf('categories_content_sections', cat.id).map((s) => ({ icon: s.icon, title: s.title, content: s.content })),
  order: cat.order,
})))
console.log('✓ categories')

/* ── Editions ───────────────────────────────────────────────────── */
await bulkInsert('editions', all('editions').map((ed) => ({
  id: ed.id, shortTitle: ed.short_title, slug: ed.slug, year: ed.year,
  hostCountry: ed.host_country_id, hostCity: ed.host_city, flag: ed.flag, hostCountryLabel: ed.host_country_label,
  image: ed.image_id ? mediaMap[ed.image_id] : null,
  heroImage: ed.hero_image_id ? mediaMap[ed.hero_image_id] : null,
  status: ed.status, dates: ed.dates, organizer: ed.organizer, description: ed.description, order: ed.order,
  aboutTitle: ed.about_title, aboutText: ed.about_text, participantsCount: ed.participants_count, duration: ed.duration,
  destinationCards: childrenOf('editions_destination_cards', ed.id).map((d) => ({ icon: d.icon, imageUrl: d.image_url, title: d.title, content: d.content })),
  hostInstitutionName: ed.host_institution_name, hostInstitutionWebsite: ed.host_institution_website,
  hostInstitutionDescription: ed.host_institution_description, hostInstitutionDescription2: ed.host_institution_description2,
  hostInstitutionAddress: ed.host_institution_address, hostInstitutionEmail: ed.host_institution_email, hostInstitutionPhone: ed.host_institution_phone,
  academicPartnerName: ed.academic_partner_name, academicPartnerDescription: ed.academic_partner_description,
  venuePartnerName: ed.venue_partner_name, venuePartnerDescription: ed.venue_partner_description,
  organizerResponsibilities: ed.organizer_responsibilities,
  committeeMembers: childrenOf('editions_committee_members', ed.id).map((m) => ({ name: m.name, role: m.role, badge: m.badge })),
  contactBlocks: childrenOf('editions_contact_blocks', ed.id).map((b) => ({ label: b.label, value: b.value })),
  scheduleDays: childrenOf('editions_schedule_days', ed.id).map((day) => ({
    dayLabel: day.day_label, dayTitle: day.day_title, dayNote: day.day_note,
    items: childrenOf('editions_schedule_days_items', day.id).map((it) => ({ time: it.time, activity: it.activity, note: it.note, highlight: !!it.highlight })),
  })),
  scheduleNotes: ed.schedule_notes, schedulePdfUrl: ed.schedule_pdf_url,
  ruleDocuments: childrenOf('editions_rule_documents', ed.id).map((d) => ({ title: d.title, description: d.description, downloadUrl: d.download_url })),
  ruleSections: childrenOf('editions_rule_sections', ed.id).map((s) => ({ icon: s.icon, title: s.title, content: s.content })),
  countryDelegations: childrenOf('editions_country_delegations', ed.id).map((del) => ({
    ...countryRef(del.country_id), teamLeader: del.team_leader, organization: del.organization,
    students: childrenOf('editions_country_delegations_students', del.id).map((s) => ({ name: s.name, class: s.class, category: s.category, score: s.score, medal: s.medal })),
  })),
  participantsNote: ed.participants_note,
  medalTable: childrenOf('editions_medal_table', ed.id).map((mt) => ({
    ...countryRef(mt.country_id), gold: mt.gold, silver: mt.silver, bronze: mt.bronze, honorable: mt.honorable, participation: mt.participation, hasDetails: !!mt.has_details,
  })),
})))
console.log('✓ editions')

/* ── Committee, Certificates, Partners ─────────────────────────────*/
await bulkInsert('committee', all('committee').map((m) => ({
  id: m.id, name: m.name, organization: m.organization, title: m.title, country: m.country_id,
  isChair: !!m.is_chair, bio: m.bio, photo: m.photo_id ? mediaMap[m.photo_id] : null, order: m.order,
})))

await bulkInsert('certificates', all('certificates').map((c) => ({
  id: c.id, code: c.code, nameSurname: c.name_surname, country: c.country_id, edition: c.edition_id,
  grade: c.grade, examDate: c.exam_date, score: c.score, achievement: c.achievement, examType: c.exam_type,
})))

await bulkInsert('partners', all('partners').map((p) => ({
  id: p.id, name: p.name, logo: p.logo_id ? mediaMap[p.logo_id] : null, websiteUrl: p.website_url, tier: p.tier, order: p.order,
})))
console.log('✓ committee, certificates, partners')

/* ── Regulations, Exam Times, Preliminary Resources ────────────────*/
await bulkInsert('regulations', all('regulations').map((r) => ({
  id: r.id, title: r.title, icon: r.icon, content: r.content, order: r.order,
})))

await bulkInsert('exam_times', all('exam_times').map((e) => ({
  id: e.id, country: e.country_id, year: e.year, round: e.round, date: e.date, time: e.time,
  venue: e.venue, participants: e.participants, status: e.status, order: e.order,
})))

await bulkInsert('preliminary_resources', all('preliminary_resources').map((p) => ({
  id: p.id, stage: p.stage, type: p.type, roundLabel: p.round_label, roundIcon: p.round_icon,
  category: p.category, grade: p.grade, title: p.title, country: p.country_id, countryMeta: p.country_meta,
  pdfUrl: p.pdf_url, order: p.order,
})))
console.log('✓ regulations, exam_times, preliminary_resources')

/* ── Gallery / News / FAQ — replace POC placeholder data ───────────*/
const existingGallery = (await api('GET', '/items/gallery?limit=-1&fields=id')).data.map((r) => r.id)
const existingNews = (await api('GET', '/items/news?limit=-1&fields=id')).data.map((r) => r.id)
const existingFaq = (await api('GET', '/items/faq?limit=-1&fields=id')).data.map((r) => r.id)
if (existingGallery.length) await api('DELETE', '/items/gallery', existingGallery)
if (existingNews.length) await api('DELETE', '/items/news', existingNews)
if (existingFaq.length) await api('DELETE', '/items/faq', existingFaq)

await bulkInsert('gallery', all('gallery').map((g) => ({
  id: g.id, status: 'published', sort: g.order, media_type: g.media_type,
  image: g.image_id ? mediaMap[g.image_id] : null,
  video_file: g.video_file_id ? mediaMap[g.video_file_id] : null,
  video_url: g.video_url, title: g.title, subtitle: g.subtitle, tag: g.tag, stage: g.stage,
})))

await bulkInsert('news', all('news').map((n) => ({
  id: n.id, status: n.published ? 'published' : 'draft', sort: n.order,
  title: n.text, category: n.category, date: n.date,
  image: n.image_id ? mediaMap[n.image_id] : null,
  excerpt: n.excerpt, content: n.content, ticker: n.ticker,
})))

await bulkInsert('faq', all('faq').map((f) => ({
  id: f.id, status: 'published', sort: f.order, group: f.group, question: f.question, answer: f.answer,
})))
console.log('✓ gallery, news, faq (replaced POC data)')

/* ── Page singletons ────────────────────────────────────────────── */
const ap = all('about_page')[0]
await api('PATCH', '/items/about_page', {
  heroTitle: ap.hero_title, heroSubtitle: ap.hero_subtitle, whatIsTitle: ap.what_is_title,
  whatIsText1: ap.what_is_text1, whatIsText2: ap.what_is_text2, missionTitle: ap.mission_title,
  missionCards: childrenOf('about_page_mission_cards', ap.id).map((c) => ({ icon: c.icon, title: c.title, text: c.text })),
  timelineItems: childrenOf('about_page_timeline_items', ap.id).map((t) => ({ year: t.year, text: t.text })),
  examTopics: childrenOf('about_page_exam_topics', ap.id).map((t) => ({ label: t.label })),
  participateText: ap.participate_text,
})

const cp = all('contact_page')[0]
await api('PATCH', '/items/contact_page', {
  heroTitle: cp.hero_title, heroSubtitle: cp.hero_subtitle, formTitle: cp.form_title, formSuccessMessage: cp.form_success_message,
})

const ep = all('editions_page')[0]
await api('PATCH', '/items/editions_page', {
  heroImage: ep.hero_image_id ? mediaMap[ep.hero_image_id] : null,
  heroTitle: ep.hero_title, heroSubtitle: ep.hero_subtitle,
  statsEditions: ep.stats_editions, statsCountries: ep.stats_countries, statsAlumni: ep.stats_alumni,
})

const hp = all('home_page')[0]
await api('PATCH', '/items/home_page', {
  heroImage: hp.hero_image_id ? mediaMap[hp.hero_image_id] : null,
  heroEyebrow: hp.hero_eyebrow, heroTitle: hp.hero_title, heroSubtitle: hp.hero_subtitle,
  heroCta1Label: hp.hero_cta1_label, heroCta1Url: hp.hero_cta1_url,
  heroCta2Label: hp.hero_cta2_label, heroCta2Url: hp.hero_cta2_url,
  statsKicker: hp.stats_kicker, statsTitle: hp.stats_title, statsText: hp.stats_text,
  partnersKicker: hp.partners_kicker, partnersTitle: hp.partners_title,
})

const ss = all('site_settings')[0]
await api('PATCH', '/items/site_settings', {
  siteName: ss.site_name, footerDescription: ss.footer_description, footerCopyright: ss.footer_copyright,
  contactEmail: ss.contact_email, representativesEmail: ss.representatives_email, partnersEmail: ss.partners_email,
  representativesDescription: ss.representatives_description, partnersDescription: ss.partners_description,
  responseTime: ss.response_time, statsCountries: ss.stats_countries, statsSchools: ss.stats_schools,
  statsStudents: ss.stats_students, statsRounds: ss.stats_rounds,
  grandFinalLabel: ss.grand_final_label, grandFinalISODate: ss.grand_final_i_s_o_date,
  currentContestStage: ss.current_contest_stage, showScientificCommittee: !!ss.show_scientific_committee,
})
console.log('✓ page singletons')

console.log('✓ data migration complete')
