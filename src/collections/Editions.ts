import type { CollectionConfig } from 'payload'
import { revalidateEditions } from '../lib/revalidate'

export const Editions: CollectionConfig = {
  slug: 'editions',
  access: { read: () => true },
  labels: { singular: 'Buraxılış', plural: 'Buraxılışlar' },
  admin: {
    useAsTitle: 'shortTitle',
    group: '🏆 Müsabiqə',
    description: 'Hər buraxılış /editions səhifəsində kart kimi görünür və "Slug" sahəsi vasitəsilə öz /editions/[slug] səhifəsinə (Haqqında, Təşkilatçı, Cədvəl, Qaydalar, İştirakçılar, Nəticələr alt-səhifələri) malikdir. Açın və yuxarıdakı bölmələr (tab) arasında keçərək doldurun.',
    defaultColumns: ['shortTitle', 'hostCountry', 'year', 'status', 'slug', 'order'],
  },
  hooks: {
    afterChange: [() => revalidateEditions()],
    afterDelete: [() => revalidateEditions()],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        /* ── 1. Əsas Məlumat ──────────────────────────────── */
        {
          label: '1️⃣ Əsas Məlumat',
          admin: { description: 'Kartda görünən ad, ölkə, tarix, status və şəkillər.' },
          fields: [
            { name: 'shortTitle', type: 'text', required: true, label: 'Kart Başlığı', admin: { placeholder: '2026 UK' } },
            { name: 'slug', type: 'text', label: 'URL Slug', admin: { placeholder: '2026-uk', description: 'Detal səhifəsi üçün MƏCBURİDİR. URL-də istifadə olunur: /editions/{slug}. Kiçik hərf, yalnız defis. Nümunə: 2026-uk' } },
            {
              type: 'row',
              fields: [
                { name: 'year', type: 'number', label: 'İl', admin: { placeholder: '2026', width: '25%' } },
                {
                  name: 'hostCountry',
                  type: 'relationship',
                  relationTo: 'countries',
                  label: 'Ev Sahibi Ölkə',
                  admin: { width: '25%', description: 'Faktiki ev sahibi ölkə. "TBA" və ya "Arxiv" kimi xüsusi buraxılışlar üçün boş saxlanıla bilər.' },
                },
                { name: 'hostCity', type: 'text', label: 'Ev Sahibi Şəhər', admin: { placeholder: 'London', width: '25%' } },
                { name: 'flag', type: 'text', label: 'Bayraq Emoji (ehtiyat)', admin: { placeholder: '🇬🇧', width: '25%', description: 'Yalnız "Ev Sahibi Ölkə" boş olduqda istifadə olunur (TBA/Arxiv).' } },
              ],
            },
            {
              name: 'hostCountryLabel', type: 'text', label: 'Ev Sahibi Etiketi (TBA/Arxiv üçün)',
              admin: {
                placeholder: 'TBA',
                description: '"Ev Sahibi Ölkə" boş olduqda kart və başlıqlarda göstərilən mətn (məs. "TBA", "Arxiv").',
                condition: (_, siblingData) => !siblingData?.hostCountry,
              },
            },
            {
              type: 'row',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', label: 'Kart Şəkli', admin: { width: '50%' } },
                { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Hero Arxa Plan Şəkli', admin: { width: '50%' } },
              ],
            },
            { name: 'status', type: 'select', label: 'Status', options: [
              { label: '🟢 Cari / Aktiv', value: 'current' },
              { label: '🔵 Gələcək',      value: 'upcoming' },
              { label: '📁 Keçmiş / Arxiv', value: 'past' },
            ], defaultValue: 'upcoming' },
            { name: 'dates',     type: 'text', label: 'Tədbir Tarixləri', admin: { placeholder: '14–18 İyul 2026' } },
            { name: 'organizer', type: 'text', label: 'Təşkilatçı',       admin: { placeholder: 'SchoolConnect UK' } },
            { name: 'description', type: 'textarea', label: 'Kart Açıqlaması' },
            { name: 'order', type: 'number', label: 'Sıra', defaultValue: 0, admin: { description: 'Az = əvvəldə.' } },
          ],
        },

        /* ── 2. Haqqında ──────────────────────────────────── */
        {
          label: '2️⃣ Haqqında',
          admin: { description: '"Haqqında" səhifəsində göstərilən xoş gəlmisiniz mətni və məkan kartları.' },
          fields: [
            { name: 'aboutTitle',   type: 'text',     label: 'Xoş Gəlmisiniz Başlığı', admin: { placeholder: 'Birləşmiş Krallığa xoş gəlmisiniz' } },
            { name: 'aboutText',    type: 'textarea', label: 'Xoş Gəlmisiniz Mətni' },
            {
              type: 'row',
              fields: [
                { name: 'participantsCount', type: 'text', label: 'İştirakçı Sayı', defaultValue: '35+', admin: { width: '50%' } },
                { name: 'duration',          type: 'text', label: 'Müddət',         defaultValue: '5 gün', admin: { width: '50%' } },
              ],
            },
            {
              name: 'destinationCards', type: 'array', label: 'Məkan Bələdçisi Kartları',
              admin: { description: 'Yerləşmə, Yemək, Necə Getmək və s. — hər biri ayrı kart.' },
              fields: [
                { name: 'icon',     type: 'text', label: 'Emoji İkon',    admin: { placeholder: '🏨' } },
                { name: 'imageUrl', type: 'text', label: 'Şəkil URL-i',   admin: { placeholder: 'https://images.unsplash.com/...' } },
                { name: 'title',    type: 'text', required: true, label: 'Başlıq' },
                { name: 'content',  type: 'textarea', required: true, label: 'Məzmun' },
              ],
            },
          ],
        },

        /* ── 3. Təşkilatçı ────────────────────────────────── */
        {
          label: '3️⃣ Təşkilatçı',
          admin: { description: 'Ev sahibi qurum, akademik tərəfdaş, məkan tərəfdaşı və yerli komitə.' },
          fields: [
            {
              name: 'hostInstitution', type: 'group', label: 'Ev Sahibi Qurum',
              fields: [
                { name: 'name',         type: 'text',     label: 'Ad' },
                { name: 'description',  type: 'textarea', label: 'Açıqlama (1-ci paraqraf)' },
                { name: 'description2', type: 'textarea', label: 'Açıqlama (2-ci paraqraf)' },
                { name: 'address',      type: 'text',     label: 'Ünvan' },
                { name: 'website',      type: 'text',     label: 'Vebsayt URL' },
                { name: 'email',        type: 'text',     label: 'E-poçt' },
                { name: 'phone',        type: 'text',     label: 'Telefon' },
              ],
            },
            {
              name: 'academicPartner', type: 'group', label: 'Akademik Tərəfdaş',
              fields: [
                { name: 'name',        type: 'text',     label: 'Ad' },
                { name: 'description', type: 'textarea', label: 'Açıqlama' },
              ],
            },
            {
              name: 'venuePartner', type: 'group', label: 'Məkan Tərəfdaşı',
              fields: [
                { name: 'name',        type: 'text',     label: 'Ad' },
                { name: 'description', type: 'textarea', label: 'Açıqlama' },
              ],
            },
            {
              name: 'organizerResponsibilities', type: 'textarea', label: 'Məsuliyyətlər',
              admin: { description: 'Hər sətir nöqtəli siyahıya çevrilir.' },
            },
            {
              name: 'committeeMembers', type: 'array', label: 'Yerli Komitə Üzvləri',
              fields: [
                { name: 'name',  type: 'text', required: true, label: 'Ad Soyad' },
                { name: 'role',  type: 'text', label: 'Vəzifə / Şöbə' },
                { name: 'badge', type: 'text', label: 'Status Nişanı', admin: { placeholder: 'Ev Sahibi Nümayəndəsi' } },
              ],
            },
            {
              name: 'contactBlocks', type: 'array', label: 'Əlaqə Məlumatları',
              fields: [
                { name: 'label', type: 'text', required: true, label: 'Etiket', admin: { placeholder: 'Ümumi sorğular' } },
                { name: 'value', type: 'text', required: true, label: 'Dəyər',  admin: { placeholder: 'email@example.com' } },
              ],
            },
          ],
        },

        /* ── 4. Cədvəl ────────────────────────────────────── */
        {
          label: '4️⃣ Cədvəl',
          admin: { description: 'Tədbirin gün-gün vaxt cədvəli.' },
          fields: [
            {
              name: 'scheduleDays', type: 'array', label: 'Günlər',
              admin: { description: 'Hər gün üçün bir qeyd əlavə edin. Hər günün etiketi və vaxt cədvəli var.' },
              fields: [
                { name: 'dayLabel', type: 'text', required: true, label: 'Gün Etiketi', admin: { placeholder: 'Gün 1 — 15 İyul' } },
                { name: 'dayTitle', type: 'text', label: 'Gün Başlığı', admin: { placeholder: 'Əsas Gəliş & Açılış Mərasimi' } },
                { name: 'dayNote',  type: 'text', label: 'Gün Qeydi',  admin: { placeholder: 'Gün başlığının altında göstərilən qeyd' } },
                {
                  name: 'items', type: 'array', label: 'Cədvəl Elementləri',
                  fields: [
                    { name: 'time',      type: 'text', label: 'Vaxt',    admin: { placeholder: '09:00–09:30' } },
                    { name: 'activity',  type: 'text', required: true, label: 'Fəaliyyət' },
                    { name: 'note',      type: 'text', label: 'Qeyd',    admin: { placeholder: 'Yer və ya əlavə məlumat' } },
                    { name: 'highlight', type: 'checkbox', defaultValue: false, label: 'Sətri vurgula (imtahan/mərasim)' },
                  ],
                },
              ],
            },
            {
              name: 'scheduleNotes', type: 'textarea', label: 'Mühüm Qeydlər',
              admin: { description: 'Cədvəl səhifəsinin altındakı qeydlər panelində göstərilir.' },
            },
            { name: 'schedulePdfUrl', type: 'text', label: 'PDF Yükləmə URL', admin: { placeholder: '/uploads/programme.pdf' } },
          ],
        },

        /* ── 5. Qaydalar ──────────────────────────────────── */
        {
          label: '5️⃣ Qaydalar',
          admin: { description: 'Rəsmi sənədlər və qaydalar bölmələri.' },
          fields: [
            {
              name: 'ruleDocuments', type: 'array', label: 'Rəsmi Sənədlər',
              fields: [
                { name: 'title',       type: 'text',     required: true, label: 'Başlıq' },
                { name: 'description', type: 'textarea', label: 'Açıqlama' },
                { name: 'downloadUrl', type: 'text',     label: 'Yükləmə URL' },
              ],
            },
            {
              name: 'ruleSections', type: 'array', label: 'Akkordeon Bölmələri',
              fields: [
                { name: 'icon',    type: 'text',     label: 'Emoji İkon', admin: { placeholder: '👤' } },
                { name: 'title',   type: 'text',     required: true, label: 'Başlıq' },
                { name: 'content', type: 'textarea', required: true, label: 'Məzmun', admin: { description: 'Sətir sonları dəstəklənir. • ilə başlayan hər sətir nöqtəyə çevrilir.' } },
              ],
            },
          ],
        },

        /* ── 6. İştirakçılar ──────────────────────────────── */
        {
          label: '6️⃣ İştirakçılar',
          admin: { description: 'Ölkə nümayəndə heyətləri və şagirdlər.' },
          fields: [
            {
              name: 'countryDelegations', type: 'array', label: 'Ölkə Nümayəndə Heyətləri',
              fields: [
                {
                  name: 'country',
                  type: 'relationship',
                  relationTo: 'countries',
                  required: true,
                  label: 'Ölkə',
                  admin: { description: 'Bayraq avtomatik ölkə məlumatından götürülür.' },
                },
                { name: 'teamLeader',   type: 'text', label: 'Komanda Rəhbəri', admin: { placeholder: 'Dr. Nigar Əliyeva' } },
                { name: 'organization', type: 'text', label: 'Təşkilat', admin: { placeholder: 'Global Olimpiad Mərkəzi' } },
                {
                  name: 'students', type: 'array', label: 'Şagirdlər',
                  fields: [
                    { name: 'name',     type: 'text', required: true, label: 'Ad Soyad' },
                    { name: 'class',    type: 'text', label: 'Sinif', admin: { placeholder: '7B' } },
                    { name: 'category', type: 'select', label: 'Kateqoriya', options: ['Junior A', 'Junior B', 'Intermediate', 'Senior'] },
                    { name: 'score',    type: 'text', label: 'Bal', admin: { placeholder: '94/100' } },
                    { name: 'medal',    type: 'select', label: 'Medal',      options: ['Gold', 'Silver', 'Bronze', 'Honorable Mention', 'Participation'] },
                  ],
                },
              ],
            },
            { name: 'participantsNote', type: 'text', label: 'Alt Qeyd', admin: { placeholder: 'Tam siyahı qeydiyyat bağlandıqdan sonra dərc ediləcək.' } },
          ],
        },

        /* ── 7. Nəticələr ─────────────────────────────────── */
        {
          label: '7️⃣ Nəticələr',
          admin: { description: 'Medal cədvəli — nəticələr açıqlananda doldurun.' },
          fields: [
            {
              name: 'medalTable', type: 'array', label: 'Medal Cədvəli',
              fields: [
                {
                  name: 'country',
                  type: 'relationship',
                  relationTo: 'countries',
                  required: true,
                  label: 'Ölkə',
                  admin: { description: 'Bayraq avtomatik ölkə məlumatından götürülür.' },
                },
                { name: 'gold',          type: 'number', label: 'Qızıl',   defaultValue: 0 },
                { name: 'silver',        type: 'number', label: 'Gümüş',   defaultValue: 0 },
                { name: 'bronze',        type: 'number', label: 'Bürünc',  defaultValue: 0 },
                { name: 'honorable',     type: 'number', label: 'Fəxri Qeyd', defaultValue: 0 },
                { name: 'participation', type: 'number', label: 'İştirak', defaultValue: 0 },
                { name: 'hasDetails',    type: 'checkbox', defaultValue: false, label: '"Bax →" düyməsini göstər (iştirakçılara keçid)' },
              ],
            },
          ],
        },
      ],
    },
  ],
  defaultSort: 'order',
}
