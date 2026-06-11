import type { CollectionConfig } from 'payload'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  labels: { singular: 'Müraciət', plural: 'Müraciətlər' },
  admin: {
    useAsTitle: 'name',
    group: '📨 Mesajlar',
    description: 'Saytda heç bir səhifədə göstərilmir — bu, yalnız adminkadakı bir gələnqutudur. /contact səhifəsindəki əlaqə formasını dolduran hər kəsin mesajı buraya avtomatik düşür.',
    defaultColumns: ['name', 'email', 'subject', 'status', 'createdAt'],
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Ad Soyad' },
    { name: 'email', type: 'email', required: true, label: 'E-poçt Ünvanı' },
    { name: 'country', type: 'text', label: 'Ölkə' },
    {
      name: 'subject',
      type: 'select',
      label: 'Mövzu',
      options: [
        { label: 'İştirak sorğusu', value: 'Participation inquiry' },
        { label: 'Ölkə nümayəndəsi müraciəti', value: 'Country representative application' },
        { label: 'Tərəfdaşlıq sorğusu', value: 'Partnership inquiry' },
        { label: 'Texniki dəstək', value: 'Technical support' },
        { label: 'Digər', value: 'Other' },
      ],
    },
    { name: 'message', type: 'textarea', required: true, label: 'Mesaj' },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: '🔵 Yeni', value: 'new' },
        { label: '👁 Oxunub', value: 'read' },
        { label: '✅ Cavablandırılıb', value: 'replied' },
      ],
      defaultValue: 'new',
      admin: { description: 'Yalnız sizin işinizi asanlaşdırmaq üçündür — sayt ziyarətçiləri bunu görmür. Mesajı oxuyub cavab verdikcə statusu yeniləyin.' },
    },
  ],
  timestamps: true,
}
