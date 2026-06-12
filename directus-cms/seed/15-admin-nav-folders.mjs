// Reorganizes the Directus admin content nav into labeled folders so related
// collections ("sample questions, preliminary, national final, etc.") sit
// together and everything can be found at a glance.
// Idempotent: safe to re-run.

import { api, createFolder } from './_lib.mjs'

const FOLDERS = [
  {
    name: 'folder_contest_stages',
    icon: 'emoji_events',
    label: 'Yarış Mərhələləri',
    collections: ['preliminary_page', 'national_final_page', 'sample_questions_page', 'preliminary_resources', 'exam_times', 'regulations', 'categories'],
  },
  {
    name: 'folder_site_pages',
    icon: 'web',
    label: 'Sayt Səhifələri',
    collections: ['home_page', 'about_page', 'contact_page', 'editions_page', 'site_settings'],
  },
  {
    name: 'folder_reference_data',
    icon: 'public',
    label: 'Məlumat Bazaları',
    collections: ['countries', 'committee', 'certificates', 'partners'],
  },
  {
    name: 'folder_media',
    icon: 'photo_library',
    label: 'Media və Bloq',
    collections: ['gallery', 'news', 'faq'],
  },
]

for (const folder of FOLDERS) {
  let exists = true
  try { await api('GET', `/collections/${folder.name}`) } catch { exists = false }

  if (!exists) {
    await createFolder(folder.name, { icon: folder.icon, translations: [{ language: 'az-AZ', translation: folder.label }] })
    console.log(`✓ folder created: ${folder.label}`)
  } else {
    console.log(`· folder already exists: ${folder.label}`)
  }

  for (const collection of folder.collections) {
    await api('PATCH', `/collections/${collection}`, { meta: { group: folder.name } })
  }
  console.log(`  -> grouped: ${folder.collections.join(', ')}`)
}

console.log('Done.')
