import { revalidatePath } from 'next/cache'

function safe(fn: () => void) {
  try { fn() } catch { /* silently skip when called outside a request context (e.g. seeding) */ }
}

export function revalidateNews()         { safe(() => { revalidatePath('/', 'page'); revalidatePath('/news', 'page') }) }
export function revalidatePartners()     { safe(() => { revalidatePath('/', 'page') }) }
export function revalidateGallery()      { safe(() => { revalidatePath('/', 'page') }) }
export function revalidateFaq()          { safe(() => { revalidatePath('/faq', 'page') }) }
export function revalidateRegulations()  { safe(() => { revalidatePath('/verbivore/regulations', 'page') }) }
export function revalidateCommittee()    { safe(() => { revalidatePath('/verbivore/scientific-committee', 'page') }) }
export function revalidateExamTimes()    { safe(() => { revalidatePath('/verbivore/exam-time', 'page'); revalidatePath('/', 'page') }) }
export function revalidateCountries()    { safe(() => { revalidatePath('/verbivore/countries-territories', 'page') }) }
export function revalidateSiteSettings() { safe(() => { revalidatePath('/', 'page'); revalidatePath('/contact', 'page') }) }
export function revalidateHomePage()     { safe(() => { revalidatePath('/', 'page') }) }
export function revalidateContactPage()  { safe(() => { revalidatePath('/contact', 'page') }) }
export function revalidateEditions()     { safe(() => { revalidatePath('/editions', 'page'); revalidatePath('/editions/[slug]', 'page') }) }
export function revalidateEditionsPage() { safe(() => { revalidatePath('/editions', 'page') }) }
export function revalidateMedia()        { safe(() => { revalidatePath('/', 'page') }) }
export function revalidateAboutPage()    { safe(() => { revalidatePath('/verbivore/about', 'page') }) }
export function revalidateCategories()   { safe(() => { revalidatePath('/verbivore/categories', 'page'); revalidatePath('/verbivore/categories/[slug]', 'page') }) }
