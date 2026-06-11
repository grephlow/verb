import type { CollectionConfig } from 'payload'
import { revalidateCommittee } from '../lib/revalidate'

export const Committee: CollectionConfig = {
  access: { read: () => true },
  slug: 'committee',
  hooks: {
    afterChange: [() => revalidateCommittee()],
    afterDelete: [() => revalidateCommittee()],
  },
  labels: { singular: 'Komitə Üzvü', plural: 'Komitə Üzvləri' },
  admin: {
    useAsTitle: 'name',
    group: '🌍 İştirakçılar',
    description: '/verbivore/scientific-committee səhifəsində göstərilir (səhifə Sayt Parametrlərində aktiv edilibsə görünür). "Komitə Sədridir" işarələnən üzvlər səhifənin yuxarısında ayrıca, böyük "Sədr" kartında çıxır, qalanları isə adi kartlarda.',
    defaultColumns: ['name', 'title', 'country', 'isChair', 'order'],
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Ad Soyad' },
    { name: 'organization', type: 'text', label: 'Təmsil Etdiyi Qurum', admin: { placeholder: 'University of Cambridge', description: 'Üzvün təmsil etdiyi universitet, təşkilat və ya qurumun adı.' } },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Elmi Dərəcə / Vəzifə',
      admin: { placeholder: 'Prof. Dr. / PhD ...' },
    },
    {
      name: 'country',
      type: 'relationship',
      relationTo: 'countries',
      required: true,
      label: 'Ölkə',
      admin: { description: 'Üzvün təmsil etdiyi ölkə. Bayraq avtomatik ölkə məlumatından götürülür.' },
    },
    {
      name: 'isChair',
      type: 'checkbox',
      label: 'Komitə Sədridir',
      defaultValue: false,
      admin: { description: 'İşarələnsə, üzv səhifənin yuxarısında ayrıca, böyük "Sədr" kartında göstəriləcək.' },
    },
    { name: 'bio', type: 'textarea', label: 'Bioqrafiya' },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto',
      admin: { description: 'Üzvün portret fotosu (isteğe bağlı).' },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Sıra',
      defaultValue: 0,
      admin: { description: 'Sədrlər əvvəl (məs. 0), sonra üzvlər sıraya görə.' },
    },
  ],
  defaultSort: 'order',
}
