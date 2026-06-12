// Shared helpers for the schema-creation seed scripts.

export const BASE = 'http://localhost:8055'
export const TOKEN = 'verbivore-concept-admin-token'
export const PUBLIC_POLICY = 'abf8a154-5b1c-4a46-ac9c-7300570f4f17'

export async function api(method, path, body) {
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

export const az = (translation, extra = {}) => ({ language: 'az-AZ', translation, ...extra })

export const idField = () => ({
  field: 'id',
  type: 'integer',
  meta: { hidden: true, interface: 'input', readonly: true },
  schema: { is_primary_key: true, has_auto_increment: true },
})

export function strField(name, label, opts = {}) {
  const { placeholder, required, width = 'full', note, defaultValue } = opts
  return {
    field: name,
    type: 'string',
    meta: {
      interface: 'input',
      width,
      required: required || undefined,
      options: placeholder ? { placeholder } : undefined,
      note,
      translations: [az(label)],
    },
    schema: { is_nullable: !required, ...(defaultValue !== undefined ? { default_value: defaultValue } : {}) },
  }
}

// Emoji field — string field using the custom "Emoji Picker" interface (extensions/emoji-picker).
export function emojiField(name, label, opts = {}) {
  const field = strField(name, label, opts)
  field.meta.interface = 'emoji-picker'
  field.meta.options = null
  return field
}

export function textareaField(name, label, opts = {}) {
  const { placeholder, required, note, defaultValue } = opts
  return {
    field: name,
    type: 'text',
    meta: {
      interface: 'textarea',
      width: 'full',
      required: required || undefined,
      options: placeholder ? { placeholder } : undefined,
      note,
      translations: [az(label)],
    },
    schema: { is_nullable: !required, ...(defaultValue !== undefined ? { default_value: defaultValue } : {}) },
  }
}

export function richTextField(name, label, opts = {}) {
  const { required, note } = opts
  return {
    field: name,
    type: 'text',
    meta: {
      interface: 'input-rich-text-html',
      width: 'full',
      required: required || undefined,
      note,
      translations: [az(label)],
    },
    schema: { is_nullable: !required },
  }
}

export function intField(name, label, opts = {}) {
  const { width = 'half', note, defaultValue = 0, required } = opts
  return {
    field: name,
    type: 'integer',
    meta: {
      interface: 'input',
      width,
      note,
      required: required || undefined,
      translations: [az(label)],
    },
    schema: { default_value: defaultValue, is_nullable: !required },
  }
}

export function boolField(name, label, opts = {}) {
  const { note, defaultValue = false } = opts
  return {
    field: name,
    type: 'boolean',
    meta: {
      interface: 'boolean',
      width: 'half',
      note,
      translations: [az(label)],
    },
    schema: { default_value: defaultValue, is_nullable: false },
  }
}

export function selectField(name, label, choices, opts = {}) {
  const { width = 'half', note, defaultValue, required } = opts
  return {
    field: name,
    type: 'string',
    meta: {
      interface: 'select-dropdown',
      width,
      options: { choices },
      note,
      required: required || undefined,
      translations: [az(label)],
    },
    schema: { default_value: defaultValue, is_nullable: !required },
  }
}

export function emailField(name, label, opts = {}) {
  const { defaultValue, note } = opts
  return {
    field: name,
    type: 'string',
    meta: {
      interface: 'input',
      width: 'full',
      iconLeft: 'email',
      note,
      translations: [az(label)],
    },
    schema: { default_value: defaultValue, is_nullable: true },
  }
}

// M2O relation field — call together with relationField() to register /relations
export function m2oField(name, label, opts = {}) {
  const { width = 'full', note, template = '{{flag}} {{name}}', required } = opts
  return {
    field: name,
    type: 'integer',
    meta: {
      interface: 'select-dropdown-m2o',
      special: null,
      options: { template },
      display: 'related-values',
      display_options: { template },
      width,
      note,
      required: required || undefined,
      translations: [az(label)],
    },
    schema: { is_nullable: !required },
  }
}

export function relationDef(collection, field, related_collection) {
  return { collection, field, related_collection }
}

// File (upload) field — call together with relationDef(collection, name, 'directus_files')
export function fileField(name, label, opts = {}) {
  const { image = true, note, width = 'full' } = opts
  return {
    field: name,
    type: 'uuid',
    meta: {
      interface: image ? 'file-image' : 'file',
      special: ['file'],
      width,
      note,
      translations: [az(label)],
    },
  }
}

// JSON repeater field ("list" interface). subFields: array of subField() defs.
export function listField(name, label, subFields, opts = {}) {
  const { note, template } = opts
  return {
    field: name,
    type: 'json',
    meta: {
      interface: 'list',
      special: ['cast-json'],
      width: 'full',
      note,
      options: { template, fields: subFields, addLabel: 'Əlavə et' },
      translations: [az(label)],
    },
    schema: { is_nullable: true },
  }
}

// Sub-field descriptor for use inside listField()'s subFields array.
export function subField(field, name, type = 'string', metaExtra = {}) {
  const interfaceMap = { string: 'input', text: 'textarea', integer: 'input', boolean: 'boolean', json: 'list' }
  return {
    field,
    name,
    type,
    meta: { interface: interfaceMap[type] || 'input', width: 'full', ...metaExtra },
  }
}

// Emoji sub-field — like subField(), but uses the custom "Emoji Picker" interface.
export function emojiSubField(field, name, metaExtra = {}) {
  return subField(field, name, 'string', { interface: 'emoji-picker', options: null, ...metaExtra })
}

// Icon field — string field using the custom "Icon Picker" interface (extensions/icon-picker).
export function iconField(name, label, opts = {}) {
  const field = strField(name, label, opts)
  field.meta.interface = 'icon-picker'
  field.meta.options = null
  return field
}

// Icon sub-field — like subField(), but uses the custom "Icon Picker" interface.
export function iconSubField(field, name, metaExtra = {}) {
  return subField(field, name, 'string', { interface: 'icon-picker', options: null, ...metaExtra })
}

// Color sub-field — like subField(), but uses Directus's built-in color-swatch picker.
export function colorSubField(field, name, metaExtra = {}) {
  return subField(field, name, 'string', { interface: 'select-color', options: {}, ...metaExtra })
}

// Tags field — a flat array of strings edited with Directus's built-in "tags" interface.
// Lighter-weight than listField() for simple bullet/tag lists (no per-item sub-fields).
export function tagsField(name, label, opts = {}) {
  const { note, defaultValue = [] } = opts
  return {
    field: name,
    type: 'json',
    meta: {
      interface: 'tags',
      special: ['cast-json'],
      width: 'full',
      note,
      translations: [az(label)],
    },
    schema: { default_value: JSON.stringify(defaultValue), is_nullable: true },
  }
}

// Folder collection — no underlying DB table, used purely to group other collections
// under a labeled section in the admin content nav (via meta.group on those collections).
export async function createFolder(name, meta) {
  await api('POST', '/collections', {
    collection: name,
    meta: { hidden: false, icon: 'folder', ...meta },
    schema: null,
  })
}

// Collapsible field group ("group-detail"). Child fields need meta.group = name.
export function groupField(name, title) {
  return {
    field: name,
    type: 'alias',
    meta: {
      special: ['alias', 'no-data', 'group'],
      interface: 'group-detail',
      options: { title, headerIcon: 'list_alt' },
      width: 'full',
    },
    schema: null,
  }
}

export async function createCollection(collection, meta) {
  await api('POST', '/collections', {
    collection,
    meta: { sort_field: 'order', ...meta },
    schema: {},
    fields: [idField()],
  })
}

export async function createSingleton(collection, meta) {
  await api('POST', '/collections', {
    collection,
    meta: { singleton: true, ...meta },
    schema: {},
    fields: [idField()],
  })
  // Singletons have no POST route — PATCH upserts the single row (id=1).
  await api('PATCH', `/items/${collection}`, { id: 1 })
}

export async function addFields(collection, fields) {
  for (const f of fields) {
    await api('POST', `/fields/${collection}`, { ...f, meta: { ...f.meta, group: f.meta?.group } })
  }
}

export async function addRelations(relations) {
  for (const r of relations) {
    await api('POST', '/relations', r)
  }
}

export async function setPublicRead(collections) {
  const { data: existingPerms } = await api('GET', `/permissions?filter[policy][_eq]=${PUBLIC_POLICY}&limit=-1`)
  const already = new Set(existingPerms.map((p) => `${p.collection}:${p.action}`))
  for (const collection of collections) {
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
  console.log(`✓ public read permissions set for: ${collections.join(', ')}`)
}
