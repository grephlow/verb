'use client'
import React from 'react'

const ADMIN_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,1,0');

/* ══════════════════════════════════════════════════════════
   VERBIVORE ADMIN — custom skin
══════════════════════════════════════════════════════════ */

/* ── Icon helper ─────────────────────────────────────── */
.v-icon-before::before {
  font-family: 'Material Symbols Rounded' !important;
  font-size: 17px;
  line-height: 1;
  font-style: normal;
  font-weight: 400;
  display: inline-flex;
  align-items: center;
  margin-right: 9px;
  vertical-align: middle;
  opacity: .82;
  flex-shrink: 0;
}

/* ── Nav link icons — collections ───────────────────── */
a[href$="/collections/users"]        { position:relative }
a[href$="/collections/news"]         { position:relative }
a[href$="/collections/gallery"]      { position:relative }
a[href$="/collections/faq"]          { position:relative }
a[href$="/collections/regulations"]  { position:relative }
a[href$="/collections/exam-times"]   { position:relative }
a[href$="/collections/committee"]    { position:relative }
a[href$="/collections/countries"]    { position:relative }
a[href$="/collections/partners"]     { position:relative }
a[href$="/collections/media"]        { position:relative }
a[href$="/collections/preliminary-resources"] { position:relative }
a[href$="/globals/site-settings"]    { position:relative }
a[href$="/globals/home-page"]        { position:relative }
a[href$="/globals/contact-page"]     { position:relative }

a[href$="/collections/users"]::before        { font-family:'Material Symbols Rounded'!important; font-style:normal; font-weight:400; font-size:17px; line-height:1; margin-right:9px; vertical-align:middle; opacity:.82; content:'person'; }
a[href$="/collections/news"]::before         { font-family:'Material Symbols Rounded'!important; font-style:normal; font-weight:400; font-size:17px; line-height:1; margin-right:9px; vertical-align:middle; opacity:.82; content:'newspaper'; }
a[href$="/collections/gallery"]::before      { font-family:'Material Symbols Rounded'!important; font-style:normal; font-weight:400; font-size:17px; line-height:1; margin-right:9px; vertical-align:middle; opacity:.82; content:'photo_library'; }
a[href$="/collections/faq"]::before          { font-family:'Material Symbols Rounded'!important; font-style:normal; font-weight:400; font-size:17px; line-height:1; margin-right:9px; vertical-align:middle; opacity:.82; content:'quiz'; }
a[href$="/collections/regulations"]::before  { font-family:'Material Symbols Rounded'!important; font-style:normal; font-weight:400; font-size:17px; line-height:1; margin-right:9px; vertical-align:middle; opacity:.82; content:'policy'; }
a[href$="/collections/exam-times"]::before   { font-family:'Material Symbols Rounded'!important; font-style:normal; font-weight:400; font-size:17px; line-height:1; margin-right:9px; vertical-align:middle; opacity:.82; content:'calendar_month'; }
a[href$="/collections/committee"]::before    { font-family:'Material Symbols Rounded'!important; font-style:normal; font-weight:400; font-size:17px; line-height:1; margin-right:9px; vertical-align:middle; opacity:.82; content:'science'; }
a[href$="/collections/countries"]::before    { font-family:'Material Symbols Rounded'!important; font-style:normal; font-weight:400; font-size:17px; line-height:1; margin-right:9px; vertical-align:middle; opacity:.82; content:'public'; }
a[href$="/collections/partners"]::before     { font-family:'Material Symbols Rounded'!important; font-style:normal; font-weight:400; font-size:17px; line-height:1; margin-right:9px; vertical-align:middle; opacity:.82; content:'handshake'; }
a[href$="/collections/media"]::before        { font-family:'Material Symbols Rounded'!important; font-style:normal; font-weight:400; font-size:17px; line-height:1; margin-right:9px; vertical-align:middle; opacity:.82; content:'image'; }
a[href$="/collections/editions"]::before     { font-family:'Material Symbols Rounded'!important; font-style:normal; font-weight:400; font-size:17px; line-height:1; margin-right:9px; vertical-align:middle; opacity:.82; content:'trophy'; }
a[href$="/globals/editions-page"]::before    { font-family:'Material Symbols Rounded'!important; font-style:normal; font-weight:400; font-size:17px; line-height:1; margin-right:9px; vertical-align:middle; opacity:.82; content:'auto_stories'; }
a[href$="/globals/about-page"]::before       { font-family:'Material Symbols Rounded'!important; font-style:normal; font-weight:400; font-size:17px; line-height:1; margin-right:9px; vertical-align:middle; opacity:.82; content:'info'; }
a[href$="/collections/certificates"]::before { font-family:'Material Symbols Rounded'!important; font-style:normal; font-weight:400; font-size:17px; line-height:1; margin-right:9px; vertical-align:middle; opacity:.82; content:'verified'; }
a[href$="/collections/inquiries"]::before    { font-family:'Material Symbols Rounded'!important; font-style:normal; font-weight:400; font-size:17px; line-height:1; margin-right:9px; vertical-align:middle; opacity:.82; content:'mark_email_read'; }
a[href$="/collections/preliminary-resources"]::before { font-family:'Material Symbols Rounded'!important; font-style:normal; font-weight:400; font-size:17px; line-height:1; margin-right:9px; vertical-align:middle; opacity:.82; content:'school'; }
a[href$="/globals/site-settings"]::before    { font-family:'Material Symbols Rounded'!important; font-style:normal; font-weight:400; font-size:17px; line-height:1; margin-right:9px; vertical-align:middle; opacity:.82; content:'settings'; }
a[href$="/globals/home-page"]::before        { font-family:'Material Symbols Rounded'!important; font-style:normal; font-weight:400; font-size:17px; line-height:1; margin-right:9px; vertical-align:middle; opacity:.82; content:'home'; }
a[href$="/globals/contact-page"]::before     { font-family:'Material Symbols Rounded'!important; font-style:normal; font-weight:400; font-size:17px; line-height:1; margin-right:9px; vertical-align:middle; opacity:.82; content:'mail'; }

/* ── Remove Payload nav group connector/indent lines ── */
[class*="nav-group__content"],
[class*="NavGroup__content"],
[class*="nav-group-content"],
[class*="navGroupContent"],
[class*="nav__content"],
[class*="nav-group"] > div,
[class*="NavGroup"] > div {
  border-left: none !important;
  border-inline-start: none !important;
  padding-left: 0 !important;
  margin-left: 0 !important;
}
[class*="nav__link"],
[class*="NavLink"],
[class*="navLink"] {
  border-left: none !important;
  border-inline-start: none !important;
}

/* ── Nav group labels — make them pop ───────────────── */
[class*="nav-group__label"], [class*="NavGroup__label"],
[class*="nav-group"] > span, [class*="navGroup"] > span {
  font-size: 10px !important;
  letter-spacing: .12em !important;
  font-weight: 800 !important;
  text-transform: uppercase !important;
  opacity: .5 !important;
  padding-left: 2px !important;
}

/* ── Active nav link highlight ───────────────────────── */
a[class*="nav__link--active"], a[class*="active"] {
  color: #ff821a !important;
}
a[class*="nav__link--active"]::before, a[class*="active"]::before {
  opacity: 1 !important;
}

/* ── Dashboard header branding ───────────────────────── */
[class*="dashboard"] h1,
[class*="dashboard__header"] h1 {
  background: linear-gradient(90deg, #ff821a 0%, #ff5f00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ── Card / collection list items ───────────────────── */
[class*="card__body"], [class*="Card__body"] {
  border-radius: 14px !important;
}
[class*="collection-list__item"], [class*="CollectionList__item"] {
  border-radius: 12px !important;
  transition: transform .18s, box-shadow .18s !important;
}
[class*="collection-list__item"]:hover, [class*="CollectionList__item"]:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 24px rgba(0,0,0,.08) !important;
}
`

export function StyleProvider({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: ADMIN_CSS }} />
      {children}
    </>
  )
}
