# Verbivore Next.js + Payload CMS

## Stack
- **Next.js 16** with App Router + Turbopack
- **Payload CMS v3** — embedded in Next.js
- **SQLite** via `@payloadcms/db-sqlite` (libsql) → `verbivore.db`

---

## Development

```bash
npm install
npm run dev          # auto-creates DB + seeds data on first run
```

Open `http://localhost:3000`. On first start, Payload creates all tables and seeds
initial demo content automatically.

---

## Production deployment

```bash
npm install

# Step 1 — initialise the database (only once, before first build)
npm run dev
# Wait until you see: "Seed complete." in the logs, then Ctrl+C

# Step 2 — build
npm run build

# Step 3 — start
npm run start
```

> After the DB exists, you can run `npm run build && npm run start` directly
> without repeating step 1.

---

## Admin panel

First launch → open `/admin` → **Create First User** → enter email + password.

---

## URLs

| URL | Description |
|-----|-------------|
| `/` | Public homepage |
| `/admin` | Payload CMS admin UI |
| `/api/<collection>` | Public REST API |

---

## Collections

| Collection | Slug | Pages |
|------------|------|-------|
| News | `news` | Homepage ticker |
| FAQ | `faq` | `/faq` |
| Committee | `committee` | `/verbivore/scientific-committee` |
| Countries | `countries` | `/verbivore/countries-territories` |
| Partners | `partners` | Homepage partner logos |
| Regulations | `regulations` | `/verbivore/regulations` |
| Exam Times | `exam-times` | `/verbivore/exam-time` |

---

## REST API (public, read-only)

```
GET /api/news
GET /api/faq
GET /api/committee
GET /api/countries
GET /api/partners
GET /api/regulations
GET /api/exam-times
```

Supports: `?limit=`, `?page=`, `?sort=`, `?where[field][equals]=value`

---

## Environment variables (`.env`)

```env
DATABASE_URI=file:./verbivore.db
PAYLOAD_SECRET=change-this-in-production
```
