const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055'

export async function directusFetch(path: string) {
  const res = await fetch(`${DIRECTUS_URL}${path}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Directus fetch failed: ${path} (${res.status})`)
  const json = await res.json()
  return json.data
}

export function fileUrl(id: string | null | undefined): { url: string } | null {
  if (!id) return null
  return { url: `/cms-assets/${id}` }
}
