// Public read permissions + sample data so the concept looks like a populated site.

const BASE = 'http://localhost:8055'
const TOKEN = 'verbivore-concept-admin-token'
const PUBLIC_POLICY = 'abf8a154-5b1c-4a46-ac9c-7300570f4f17'

async function api(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let json
  try { json = text ? JSON.parse(text) : null } catch { json = text }
  if (!res.ok) {
    console.error(`${method} ${path} -> ${res.status}`)
    console.error(JSON.stringify(json, null, 2))
    throw new Error(`Request failed: ${method} ${path}`)
  }
  return json
}

/* ───────────────────────── Public read permissions ───────────────────────── */

const { data: existingPerms } = await api('GET', `/permissions?filter[policy][_eq]=${PUBLIC_POLICY}&limit=-1`)
const already = new Set(existingPerms.map((p) => `${p.collection}:${p.action}`))

for (const collection of ['gallery', 'news', 'faq', 'directus_files']) {
  if (already.has(`${collection}:read`)) continue
  await api('POST', '/permissions', {
    policy: PUBLIC_POLICY,
    collection,
    action: 'read',
    permissions: {},
    validation: {},
    fields: ['*'],
  })
}
console.log('✓ public read permissions set')

/* ───────────────────────── Import sample images ───────────────────────── */

async function importImage(url, title) {
  const { data } = await api('POST', '/files/import', { url, data: { title } })
  return data.id
}

const [imgExam, imgGrandFinal, imgNational] = await Promise.all([
  importImage('https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=80', 'İmtahan günü'),
  importImage('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80', 'Böyük Final mərasimi'),
  importImage('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=80', 'Milli Finaldan görüntü'),
])
const [imgNews1, imgNews2, imgNews3] = await Promise.all([
  importImage('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80', 'Böyük Final elanı'),
  importImage('https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1200&q=80', 'Milli Final nəticələri'),
  importImage('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80', 'Yeni tərəfdaşlıq'),
])
console.log('✓ sample images imported')

/* ───────────────────────── Gallery items ───────────────────────── */

await api('POST', '/items/gallery', [
  {
    status: 'published',
    sort: 1,
    media_type: 'photo',
    image: imgExam,
    title: 'İmtahan günü',
    subtitle: 'İlkin seçim turunda iştirakçılar test tapşırıqlarını yerinə yetirir.',
    tag: 'Foto',
    stage: 'preliminary',
  },
  {
    status: 'published',
    sort: 2,
    media_type: 'photo',
    image: imgGrandFinal,
    title: 'Böyük Final mərasimi',
    subtitle: 'Qaliblərin mükafatlandırılması mərasimindən görüntü.',
    tag: 'Mərasim',
    stage: 'grand-final',
  },
  {
    status: 'published',
    sort: 3,
    media_type: 'photo',
    image: imgNational,
    title: 'Milli Finaldan görüntü',
    subtitle: 'Milli final mərhələsində komandaların çıxışı.',
    tag: 'Foto',
    stage: 'national-final',
  },
  {
    status: 'published',
    sort: 4,
    media_type: 'video',
    image: imgGrandFinal,
    video_url: 'https://youtu.be/jNQXAC9IVRw',
    title: 'Verbivore — tanıtım videosu',
    subtitle: 'Müsabiqə haqqında qısa tanıtım çarxı (media növü "Video" seçilərkən YouTube linki sahəsi avtomatik görünür).',
    tag: 'Video',
    stage: 'national-final',
  },
])
console.log('✓ gallery items seeded')

/* ───────────────────────── News items ───────────────────────── */

await api('POST', '/items/news', [
  {
    status: 'published',
    sort: 1,
    title: 'Verbivore 2026 Böyük Finalı elan edildi',
    category: 'Announcement',
    date: '2026-05-27',
    image: imgNews1,
    excerpt: 'Bu ilin Böyük Finalı 10 ölkədən gələn komandaları bir araya gətirəcək.',
    content: '<p>Verbivore 2026 Böyük Finalının tarixi və yeri açıqlandı. Tədbir bu il rekord sayda ölkənin nümayəndələrini qəbul edəcək. Ətraflı məlumat tezliklə paylaşılacaq.</p>',
    ticker: 'Verbivore 2026 Böyük Finalı elan edildi',
  },
  {
    status: 'published',
    sort: 2,
    title: 'Milli Final nəticələri açıqlandı',
    category: 'Update',
    date: '2026-04-12',
    image: imgNews2,
    excerpt: 'Milli final turunun nəticələri və Böyük Finala vəsiqə qazanan komandalar müəyyənləşdi.',
    content: '<p>Milli final turu başa çatdı. Qalib komandalar Böyük Finala vəsiqə qazandı. Tam nəticə cədvəli "Nəticələr" bölməsində mövcuddur.</p>',
    ticker: '',
  },
  {
    status: 'published',
    sort: 3,
    title: 'Yeni tərəfdaşlıq elan edildi',
    category: 'Press',
    date: '2026-03-02',
    image: imgNews3,
    excerpt: 'Beynəlxalq təhsil təşkilatı ilə yeni tərəfdaşlıq müqaviləsi imzalandı.',
    content: '<p>Verbivore müsabiqəsi beynəlxalq tərəfdaşlar şəbəkəsini genişləndirməyə davam edir.</p>',
    ticker: '',
  },
])
console.log('✓ news items seeded')

/* ───────────────────────── FAQ items ───────────────────────── */

await api('POST', '/items/faq', [
  {
    status: 'published',
    sort: 1,
    group: 'Students & Parents',
    question: 'Müsabiqədə kim iştirak edə bilər?',
    answer: '<p>Müvafiq yaş kateqoriyalarına uyğun bütün məktəblilər iştirak edə bilər.</p>',
  },
  {
    status: 'published',
    sort: 2,
    group: 'Students & Parents',
    question: 'Qeydiyyat necə həyata keçirilir?',
    answer: '<p>Qeydiyyat onlayn formada, "Qeydiyyat" bölməsindən aparılır.</p>',
  },
  {
    status: 'published',
    sort: 3,
    group: 'Schools & Educators',
    question: 'Məktəblər necə qoşula bilər?',
    answer: '<p>Məktəblər koordinator vasitəsilə komanda kimi qeydiyyatdan keçə bilər.</p>',
  },
  {
    status: 'published',
    sort: 4,
    group: 'Grand Final & Editions',
    question: 'Böyük Final harada keçiriləcək?',
    answer: '<p>Hər ilin Böyük Finalı fərqli ev sahibi ölkədə keçirilir, detallar "Buraxılışlar" bölməsindədir.</p>',
  },
])
console.log('✓ faq items seeded')
