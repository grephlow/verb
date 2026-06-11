import type { CollectionConfig } from 'payload'
import { COUNTRY_FLAGS } from '../lib/countryFlags'
import { revalidateCountries } from '../lib/revalidate'

export const Countries: CollectionConfig = {
  access: { read: () => true },
  slug: 'countries',
  hooks: {
    afterChange: [() => revalidateCountries()],
    afterDelete: [() => revalidateCountries()],
  },
  labels: { singular: 'Ölkə', plural: 'Ölkələr' },
  admin: {
    useAsTitle: 'name',
    group: '🌍 İştirakçılar',
    description: '/verbivore/countries-territories səhifəsində cədvəl şəklində göstərilir. Hər sətirdə bayraq, ölkə adı, status (rəngli etiket) və nümayəndə görünür.',
    defaultColumns: ['name', 'flag', 'status', 'representative', 'order'],
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Ölkə Adı' },
    {
      name: 'flag',
      type: 'select',
      label: 'Bayraq',
      options: COUNTRY_FLAGS,
      admin: { isClearable: true, description: 'Ölkə adını axtarmaq üçün yazın.' },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Aktiv', value: 'Active' },
        { label: 'Müşahidəçi', value: 'Observer' },
        { label: 'Gözləmədə', value: 'Pending' },
      ],
      defaultValue: 'Active',
      admin: { description: 'Cədvəldə ölkə adının yanında rəngli nöqtə/etiket kimi göstərilir (Aktiv = yaşıl, Müşahidəçi = mavi, Gözləmədə = narıncı).' },
    },
    { name: 'accreditedOrganization', type: 'text', label: 'Akkreditə Olunmuş Təşkilat', admin: { description: 'Bu ölkəni rəsmi olaraq təmsil edən akkreditə olunmuş təşkilatın adı. /verbivore/countries-territories səhifəsindəki ölkə kartında bayraq və ölkə adı ilə yanaşı göstərilir.' } },
    { name: 'representative', type: 'text', label: 'Nümayəndə (şəxs)', admin: { description: 'Əlaqə üçün məsul şəxsin adı (istəyə bağlı). Doldurularsa, ölkə kartında akkreditə olunmuş təşkilatın altında göstərilir.' } },
    { name: 'website', type: 'text', label: 'Vebsayt URL', admin: { placeholder: 'https://example.org' } },
    { name: 'notes', type: 'textarea', label: 'Qeydlər' },
    { name: 'order', type: 'number', label: 'Sıra', defaultValue: 0 },
  ],
  defaultSort: 'order',
}
