// Switch the entire admin app (login screen + every account) to Azerbaijani.
import { api } from './_lib.mjs'

await api('PATCH', '/settings', { default_language: 'az-AZ' })

const { data: users } = await api('GET', '/users?fields=id,language&limit=-1')
for (const user of users) {
  if (user.language !== 'az-AZ') {
    await api('PATCH', `/users/${user.id}`, { language: 'az-AZ' })
  }
}

console.log('✓ admin app language set to az-AZ (project default + all users)')
