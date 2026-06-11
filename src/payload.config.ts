import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { buildConfig } from 'payload'
import { az } from '@payloadcms/translations/languages/az'
import sharp from 'sharp'

import { News } from './collections/News'
import { FAQ } from './collections/FAQ'
import { Committee } from './collections/Committee'
import { Countries } from './collections/Countries'
import { Partners } from './collections/Partners'
import { Regulations } from './collections/Regulations'
import { ExamTimes } from './collections/ExamTimes'
import { Media } from './collections/Media'
import { Gallery } from './collections/Gallery'
import { Editions } from './collections/Editions'
import { Certificates } from './collections/Certificates'
import { Inquiries } from './collections/Inquiries'
import { PreliminaryResources } from './collections/PreliminaryResources'
import { Categories } from './collections/Categories'

import { SiteSettings } from './globals/SiteSettings'
import { HomePage } from './globals/HomePage'
import { ContactPage } from './globals/ContactPage'
import { EditionsPageGlobal } from './globals/EditionsPage'
import { AboutPage } from './globals/AboutPage'

export default buildConfig({
  i18n: {
    supportedLanguages: { az },
    fallbackLanguage: 'az',
  },
  admin: {
    meta: {
      titleSuffix: '— Verbivore CMS',
      description: 'Verbivore The Contest content management system.',
    },
    components: {
      providers: [
        {
          path: '/src/components/admin/StyleProvider',
          exportName: 'StyleProvider',
        },
      ],
      beforeDashboard: [
        {
          path: '/src/components/admin/DashboardGuide',
          exportName: 'DashboardGuide',
        },
      ],
    },
  },

  collections: [News, FAQ, Committee, Countries, Partners, Regulations, ExamTimes, Media, Gallery, Editions, Certificates, Inquiries, PreliminaryResources, Categories],

  globals: [SiteSettings, HomePage, ContactPage, EditionsPageGlobal, AboutPage],

  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./verbivore.db',
    },
    push: true,
  }),

  secret: process.env.PAYLOAD_SECRET || 'verbivore-secret-change-in-production',

  sharp,

  upload: {
    limits: {
      fileSize: 10_000_000, // 10 MB
    },
  },

  /* ── Seed initial data on first launch ─────────────── */
  onInit: async (payload) => {
    /* ── Seed admin user if none exist ─────────────── */
    const { totalDocs: userCount } = await payload.count({ collection: 'users' })
    if (userCount === 0) {
      payload.logger.info('Creating admin user...')
      await payload.create({ collection: 'users', data: { email: 'admin@verbivore.org', password: 'admin123' } })
      await payload.create({ collection: 'users', data: { email: 'boris_abramow@proton.me', password: 'Verbivore2026!' } })
    }

    /* ── Seed countries first — everything else relates to them ─ */
    const { totalDocs: countriesCount } = await payload.count({ collection: 'countries' })
    if (countriesCount === 0) {
      payload.logger.info('Seeding countries...')
      await Promise.all(
        ([
          ['Azerbaijan',     '🇦🇿', 'Active',   'Global Olympiad Center', 1],
          ['Türkiye',        '🇹🇷', 'Active',   'Türkiye English Olympiad Foundation', 2],
          ['United Kingdom', '🇬🇧', 'Active',   'SchoolConnect UK', 3],
          ['Kazakhstan',     '🇰🇿', 'Active',   'Kazakhstan Academic Network', 4],
          ['Italy',          '🇮🇹', 'Active',   'Italian Education Network', 5],
          ['Germany',        '🇩🇪', 'Observer', 'DeutschConnect', 6],
          ['United States',  '🇺🇸', 'Observer', 'American Language League', 7],
          ['France',         '🇫🇷', 'Observer', 'EduFrance International', 8],
          ['Singapore',      '🇸🇬', 'Observer', 'SEAMEO RELC', 9],
          ['Japan',          '🇯🇵', 'Observer', 'Japan English Olympiad Association', 10],
          ['Uzbekistan',     '🇺🇿', 'Pending',  '', 11],
          ['Kyrgyzstan',     '🇰🇬', 'Pending',  '', 12],
          ['Turkmenistan',   '🇹🇲', 'Pending',  '', 13],
        ] as [string, string, string, string, number][]).map(([name, flag, status, accreditedOrganization, order]) =>
          payload.create({ collection: 'countries', data: { name, flag, status, accreditedOrganization, representative: '', order } })
        )
      )
    }

    const { docs: countryDocs } = await payload.find({ collection: 'countries', limit: 100 })
    const countryMap: Record<string, string | number> = Object.fromEntries(countryDocs.map((c: any) => [c.name, c.id]))

    const [{ totalDocs: newsCount }, { totalDocs: certCount }, { totalDocs: categoriesCount }, { totalDocs: prelimCount }] = await Promise.all([
      payload.count({ collection: 'news' }),
      payload.count({ collection: 'certificates' }),
      payload.count({ collection: 'categories' }),
      payload.count({ collection: 'preliminary-resources' }),
    ])

    /* ── Seed preliminary resources ──────────────────── */
    if (prelimCount === 0) {
      payload.logger.info('Seeding preliminary resources...')
      const cats = [
        { category: 'Kiçik A', grade: '3–4-cü sinif' },
        { category: 'Kiçik B', grade: '5–6-cı sinif' },
        { category: 'Orta səviyyə', grade: '7–8-ci sinif' },
        { category: 'Böyük', grade: '9–11-ci sinif' },
      ]
      const sampleCounts = [4, 2, 3, 1]
      let ord = 1
      for (let ci = 0; ci < cats.length; ci++) {
        for (let fi = 1; fi <= sampleCounts[ci]; fi++) {
          await payload.create({ collection: 'preliminary-resources', data: {
            type: 'sample-question', roundLabel: 'Preliminary Round / İlkin seçim', roundIcon: '🟠',
            category: cats[ci].category, grade: cats[ci].grade,
            title: `Nümunə sual ${fi}`, pdfUrl: '#', order: ord++,
          }})
        }
      }
      for (let ci = 0; ci < cats.length; ci++) {
        await payload.create({ collection: 'preliminary-resources', data: {
          type: 'syllabus', roundLabel: 'Preliminary Round / İlkin seçim', roundIcon: '📘',
          category: cats[ci].category, grade: cats[ci].grade,
          title: `${cats[ci].category} — Preliminary sillabus`, pdfUrl: '#', order: ci + 1,
        }})
      }
      const resultCountries = ['Azerbaijan', 'Türkiye', 'Kazakhstan', 'Uzbekistan', 'Kyrgyzstan', 'Turkmenistan']
      for (let ri = 0; ri < resultCountries.length; ri++) {
        await payload.create({ collection: 'preliminary-resources', data: {
          type: 'result', roundLabel: 'Preliminary Round Results / İlkin seçim nəticələri', roundIcon: '🏅',
          country: countryMap[resultCountries[ri]], countryMeta: 'Preliminary Round results PDF', pdfUrl: '#', order: ri + 1,
        }})
      }
    }

    if (newsCount === 0) {
    payload.logger.info('Seeding initial content...')

    await Promise.all([
      /* ── News ───────────────────────────────────────── */
      ...([
        ['🌍 Verbivore 2026 Grand Final will be held in the United Kingdom.', 1],
        ['📅 Preliminary Round registrations open soon — check your country calendar.', 2],
        ['📘 Sample questions and guidelines are now available online.', 3],
        ['🏫 Partner schools and accredited organizations will be announced progressively.', 4],
        ['🏆 Gold, Silver, Bronze and Honorable Mention certificates issued at every round.', 5],
        ['✅ Verify your certificate instantly at verbivore.org/certificate-verify', 6],
      ] as [string, number][]).map(([text, order]) =>
        payload.create({ collection: 'news', data: { text, order } })
      ),

      /* ── FAQ ─────────────────────────────────────────── */
      ...([
        ['Students & Parents', 'Who can participate in Verbivore?', 'Students in grades 3–11 who are enrolled at a school in a participating country can take part. Participation is organized through the accredited national representative for each country. There are four categories: Junior A (grades 3–4), Junior B (grades 5–6), Intermediate (grades 7–8) and Senior (grades 9–11).', 1],
        ['Students & Parents', 'How do I register?', "Registration is managed by the accredited national organization in your country. Contact your school or find your country's representative on the Countries & Territories page. There is no direct online registration through this website.", 2],
        ['Students & Parents', 'How can I check exam dates?', 'Open the Exam Time page, choose the contest year and country, then review the round status and planned exam date. Dates are published progressively as each country confirms its schedule with the national representative.', 3],
        ['Students & Parents', 'What happens if I qualify for the National Final?', 'Qualified students are notified by their national representative with an invitation letter. The National Final is a separate exam, longer and more demanding than the Preliminary Round. Top performers in the National Final earn an invitation to the international Grand Final.', 4],
        ['Students & Parents', 'What does a Verbivore certificate look like and how do I verify it?', 'Each certificate has a unique code printed on it (format: VERB-YEAR-CC-###). You can verify any certificate at any time using the Certificate Verification page — just enter the code and the system will display the full record if the certificate is genuine.', 5],
        ['Students & Parents', 'Can a student participate from a country that is not yet listed?', 'Participation is currently only available in countries with an accredited representative. If your country is not listed, you can contact the Verbivore team — we are actively expanding our network.', 6],
        ['Schools & Educators', 'Can our school become a partner or exam center?', 'Schools can become official Verbivore partner schools by registering through their national representative. As a partner school, you gain access to official promotional materials, priority registration and a dedicated contact at the national level.', 7],
        ['Schools & Educators', 'What support does Verbivore provide to schools?', 'Verbivore provides preparation guidelines, sample question sets, teacher information packs and official branding materials. In the CMS version of the platform, schools will also have access to a dedicated school portal.', 8],
        ['Schools & Educators', 'Where are results published?', "Results are published in the Results section, organized by year and edition. Individual student results are visible through the Certificate Verification system using the student's unique certificate code.", 9],
        ['Grand Final & Editions', 'Who pays for travel to the Grand Final?', 'Travel and accommodation costs for the Grand Final are typically covered by the national representative or the participating school, not by Verbivore directly. Contact your national representative for details.', 10],
        ['Grand Final & Editions', 'How is the Grand Final host country selected?', 'The Grand Final host country and city are selected through a formal application process by interested national representatives. The selection considers logistics capacity, cultural program potential and organizational experience.', 11],
        ['Grand Final & Editions', 'Can parents attend the Grand Final?', 'Parents are welcome to travel to the host city independently and attend the opening and award ceremonies where tickets are available. The exam day itself is restricted to participants and supervisors only.', 12],
      ] as [string, string, string, number][]).map(([group, question, answer, order]) =>
        payload.create({ collection: 'faq', data: { group, question, answer, order } })
      ),

      /* ── Committee ───────────────────────────────────── */
      ...([
        ['Prof. Elena Petrov',  'University of Cambridge',       'Linguistics & Psycholinguistics',               'United Kingdom', true,  'Chair of the International Scientific Committee with expertise in applied psycholinguistics and exam design.', 1],
        ['Dr. Mehmet Aydin',    'Ankara University',             'Applied Linguistics & Vocabulary Research',     'Türkiye',         false, 'Expert in vocabulary acquisition and frequency-based lexical research for EFL learners.', 2],
        ['Dr. Sofia Russo',     'University of Milan',           'Reading Comprehension & Exam Design',           'Italy',           false, 'Specialist in reading assessment and standardised exam design for multilingual settings.', 3],
        ['Prof. James Carter',  'Oxford University Press',       'Academic Publishing & Lexicography',            'United Kingdom', false, 'Expert in academic publishing, dictionary design and lexicographical methodology.', 4],
        ['Dr. Nigar Karimova',  'Global Olympiad Center, Baku',  'National Rep. Assessment & Coordination',       'Azerbaijan',      false, 'Specialist in national representative assessment and regional coordination.', 5],
        ['Dr. Priya Wongkham',  'SEAMEO RELC',                   'EFL Assessment & South-East Asia Coordination', 'Singapore',       false, 'Expert in EFL assessment methodology and educational coordination across South-East Asia.', 6],
        ['Prof. Alexei Volkov', 'Nazarbayev University',         'Computational Linguistics & Scoring',           'Kazakhstan',      false, 'Specialist in computational approaches to language scoring and automated assessment.', 7],
        ['Dr. Laura Hughes',    'SchoolConnect UK',              'Secondary Education & 2026 Host Liaison',       'United Kingdom', false, 'Lead coordinator for the 2026 Grand Final in London and secondary education curriculum specialist.', 8],
      ] as [string, string, string, string, boolean, string, number][]).map(([name, organization, title, country, isChair, bio, order]) =>
        payload.create({ collection: 'committee', data: { name, organization, title, country: countryMap[country], isChair, bio, order } })
      ),

      /* ── Partners (logos uploaded manually in admin) ─── */
      ...([
        ['Global Olympiad Center', 'https://goc.edu.az',        'Gold',     1],
        ['EduPress International', 'https://edupressinternational.com', 'Academic', 2],
        ['LinguaNet Foundation',   'https://linguanet.org',     'Academic', 3],
        ['SchoolConnect UK',       'https://schoolconnect.uk',  'Silver',   4],
        ['TravelEdu Agency',       '#',                         'Media',    5],
      ] as [string, string, string, number][]).map(([name, websiteUrl, tier, order]) =>
        payload.create({ collection: 'partners', data: { name, websiteUrl, tier, order } })
      ),

      /* ── Regulations ─────────────────────────────────── */
      ...([
        ['Eligibility & Registration', '👤', 'Students in grades 3–11 enrolled at a school in a participating country may register. Registration is managed exclusively through the accredited national representative.\n• Students must be enrolled at a participating school\n• Age must correspond to category grade range\n• Each student may only register in one category per year\n• Repeat participation is permitted in subsequent years', 1],
        ['Exam Format & Content',      '📝', 'The exam tests vocabulary, reading comprehension, grammar, logic and communication.\n• Preliminary Round: 60 questions, 90 min, multiple choice\n• National Final: 80 questions, 120 min, mixed format\n• Grand Final: 100 questions, 150 min, full mixed + open response', 2],
        ['Scoring & Medal Criteria',   '🏅', 'Scores are calculated by the ISC after collection of all answer sheets.\n• Gold Medal: Top 5% of all participants in the category\n• Silver Medal: Top 15%\n• Bronze Medal: Top 30%\n• Honorable Mention: Top 50%\n• Participation Certificate: All remaining participants', 3],
        ['Country Representative Obligations', '🌍', 'Accredited national representatives must:\n• Adhere to the official exam calendar\n• Distribute official materials without modification\n• Collect and submit answer sheets within the deadline\n• Maintain confidentiality of exam content\n• Submit a post-round report to the coordination team', 4],
        ['Disputes & Appeals',         '⚖️', 'Appeals must be submitted in writing within 5 business days of results publication. The ISC reviews all appeals and issues a final, binding decision within 10 business days.\n\nAppeals must include: student name and certificate code, specific question(s) disputed, and grounds for the appeal with justification.', 5],
        ['Privacy & Data Use',         '🔒', 'Participant data is collected solely for administering the contest. Data is shared only with accredited national representatives and the ISC. Certificates and public results display only first name and country. Full data is retained for 5 years for verification purposes.', 6],
      ] as [string, string, string, number][]).map(([title, icon, content, order]) =>
        payload.create({ collection: 'regulations', data: { title, icon, content, order } })
      ),

      /* ── Exam Times ──────────────────────────────────── */
      ...([
        ['Azerbaijan',     'Preliminary', '27 Sep 2026',     'TBA',       'Baku, Sumgayit, Ganja',   'TBC',         1],
        ['Türkiye',        'Preliminary', 'TBA',             'TBA',       'Istanbul, Ankara, Izmir', 'TBC',         2],
        ['United Kingdom', 'Grand Final', 'Jul 14–18, 2026', '09:00 BST', 'London',                  'Grand Final', 3],
        ['Kazakhstan',     'Preliminary', 'Oct 2026',        'TBA',       'Almaty, Astana',          'TBC',         4],
        ['Italy',          'Preliminary', 'TBA',             'TBA',       'Rome, Milan',             'TBC',         5],
      ] as [string, string, string, string, string, string, number][]).map(([country, round, date, time, venue, status, order]) =>
        payload.create({ collection: 'exam-times', data: { country: countryMap[country], year: 2026, round, date, time, venue, status, order } })
      ),

      /* ── Globals ─────────────────────────────────────── */
      payload.updateGlobal({
        slug: 'site-settings',
        data: {
          siteName: 'Verbivore The Contest',
          footerDescription:
            'Verbivore The Contest is an international English challenge platform for students, parents, schools and country representatives.',
          footerCopyright: 'Verbivore The Contest. All rights reserved.',
          contactEmail: 'info@verbivore.org',
          representativesEmail: 'representatives@verbivore.org',
          partnersEmail: 'partners@verbivore.org',
          representativesDescription: 'For country representative inquiries and accreditation applications.',
          partnersDescription: 'For sponsorship, academic partnership and media inquiries.',
          responseTime: '2–3 business days',
          statsCountries: '35+',
          statsSchools: '500+',
          statsStudents: '10K+',
          statsRounds: '3',
          grandFinalLabel: '🏁 Grand Final countdown — July 14, 2026',
          grandFinalISODate: '2026-07-14T09:00:00',
        },
      }),

      payload.updateGlobal({
        slug: 'home-page',
        data: {
          heroEyebrow: 'Global English Olympiad Experience',
          heroTitle: 'English becomes a colorful challenge.',
          heroSubtitle:
            'Verbivore brings students into a friendly international contest environment where vocabulary, reading, logic and communication skills are tested with excitement and confidence.',
          heroCta1Label: 'Explore Verbivore →',
          heroCta1Url: '/verbivore/about',
          heroCta2Label: 'Check Exam Time',
          heroCta2Url: '/verbivore/exam-time',
          statsKicker: 'Platform metrics',
          statsTitle: 'Designed for students, parents and schools.',
          statsText:
            'The homepage gives fast access to core numbers, contest structure, announcements and public exam information.',
          partnersKicker: 'Partners',
          partnersTitle: 'Our institutional partners.',
        },
      }),

      payload.updateGlobal({
        slug: 'contact-page',
        data: {
          heroTitle: 'Contact Us',
          heroSubtitle:
            'Reach the Verbivore coordination team for any questions about participation, accreditation or partnerships.',
          formTitle: 'Send a message',
          formSuccessMessage: 'We will get back to you within 2–3 business days.',
        },
      }),

      /* ── About page global ───────────────────────────── */
      payload.updateGlobal({
        slug: 'about-page',
        data: {
          heroTitle: 'About Verbivore',
          heroSubtitle: 'The international English olympiad designed for school students aged 9–17, in partnership with schools and national educational bodies across 35+ countries.',
          whatIsTitle: 'What is Verbivore?',
          whatIsText1: 'Verbivore is a structured international English competition that tests vocabulary depth, reading comprehension, logical reasoning, grammar in context and short written communication.',
          whatIsText2: 'Unlike translation-focused olympiads, Verbivore measures genuine communicative competence in age-appropriate, culturally neutral contexts.',
          missionTitle: 'Our Mission',
          missionCards: [
            { icon: '🎯', title: 'Skill-based', text: 'Test real English ability, not rote memorisation.' },
            { icon: '🌍', title: 'International', text: 'Connect students across 35+ countries.' },
            { icon: '📈', title: 'Motivating', text: 'Inspire through recognition and achievement.' },
            { icon: '🏫', title: 'School-friendly', text: 'Easy for schools and representatives to run.' },
          ],
          timelineItems: [
            { year: '2023', text: 'Verbivore founded. First pilot edition with 3 countries.' },
            { year: '2024', text: 'First full edition. 18 countries, 3,000+ students.' },
            { year: '2025', text: '28 countries. National Finals introduced.' },
            { year: '2026', text: 'Grand Final in London, UK. 35+ countries.' },
          ],
          examTopics: [
            { label: 'Vocabulary' }, { label: 'Reading Comprehension' }, { label: 'Grammar in Context' },
            { label: 'Logical Reasoning' }, { label: 'Short Writing' }, { label: 'Word Formation' },
            { label: 'Idioms & Phrases' }, { label: 'Text Coherence' },
          ],
          participateText: 'Participation is through accredited national representatives. Find your country below or apply to represent yours.',
        },
      }),

      /* ── Editions ─────────────────────────────────────── */
      payload.create({ collection: 'editions', data: {
        shortTitle: '2026 UK',
        slug: '2026-uk',
        year: 2026,
        hostCountry: countryMap['United Kingdom'],
        hostCity: 'London',
        flag: '🇬🇧',
        status: 'current',
        dates: 'July 14–18, 2026',
        organizer: 'SchoolConnect UK',
        description: 'Grand Final host edition — the 2026 Verbivore Grand Final takes place in London, United Kingdom. Five days of contest, culture and connection.',
        aboutTitle: 'Welcome to the United Kingdom',
        aboutText: 'The 2026 Verbivore Grand Final brings together student delegates from 35+ countries to London — one of the world\'s most culturally diverse and historically rich cities. Over five days, participants will compete in the international Grand Final examination, join guided cultural tours, attend the Opening Ceremony at Royal Lancaster Hall and celebrate their achievements at the Gala Award Ceremony. London offers an unmatched environment for an international academic competition: world-class venues, outstanding transport links and an English-speaking host nation that makes every participant feel at home.',
        participantsCount: '35+',
        duration: '5 days',
        destinationCards: [
          { icon: '🏨', imageUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=900&q=80', title: 'Accommodation', content: 'Participating delegations are accommodated at Kensington Hall, a comfortable student residence located 12 minutes from the exam venue by underground. All rooms are double or triple occupancy with en-suite bathrooms. Linens, towels and daily housekeeping are included.' },
          { icon: '🍽️', imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80', title: 'Food & Meals', content: 'All meals are provided from arrival dinner to farewell breakfast — breakfast, lunch and dinner daily at the residence dining hall. Special dietary requirements including vegetarian, vegan, halal and gluten-free options are available with advance notice to the organizer.' },
          { icon: '✈️', imageUrl: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=900&q=80', title: 'Getting There', content: 'London is served by five international airports: Heathrow (LHR), Gatwick (LGW), Stansted (STN), Luton (LTN) and City (LCY). Shuttle transfers from Heathrow and Gatwick are arranged for official arrival and departure days. Team leaders are asked to share flight details by June 30.' },
          { icon: '🏛️', imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=900&q=80', title: 'Places to Visit', content: 'Cultural activities include a guided tour of the British Museum, a Thames river cruise, a visit to the Tower of London and an afternoon in Covent Garden. All cultural activities are included in the programme. Participants will also have free time to explore London\'s neighbourhoods.' },
          { icon: '🌦️', imageUrl: 'https://images.unsplash.com/photo-1538935732373-f7a495fea3f6?auto=format&fit=crop&w=900&q=80', title: 'Climate & Packing', content: 'London in July is warm with average temperatures of 18–24°C. Light rain is possible — participants are advised to pack a light jacket or waterproof alongside summer clothing. Evenings can be cooler, especially near the Thames.' },
          { icon: '🗣️', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80', title: 'Language & Culture', content: 'English is the official language of the host nation — an ideal setting for an English olympiad. London is exceptionally multicultural; participants will encounter speakers of dozens of languages and find the city welcoming, well-signed and easy to navigate.' },
        ],
        hostInstitution: {
          name: 'SchoolConnect UK',
          description: 'SchoolConnect UK is a leading educational organization specializing in international academic competitions and school-to-school partnerships. Based in London, SchoolConnect has hosted international academic events since 2011 and brings deep expertise in logistics, student welfare and cross-cultural program delivery.',
          description2: 'For the 2026 Grand Final, SchoolConnect UK serves as the sole local organizer, responsible for all venue arrangements, accommodation, transport, catering, cultural programming and ceremony logistics. The organization works in close coordination with the Verbivore International Secretariat and the International Scientific Committee.',
          address: '14 Great George Street, Westminster, London SW1P 3AD, United Kingdom',
          website: 'https://schoolconnect.uk',
          email: 'contact@schoolconnect.uk',
          phone: '+44 20 7946 0958',
        },
        academicPartner: {
          name: 'Oxford Faculty of Linguistics',
          description: 'The Oxford Faculty of Linguistics serves as the academic validation partner for the 2026 Grand Final. Faculty members contributed to the final examination design, language level calibration and answer key verification — ensuring the highest standards of academic rigour across all four categories. The faculty\'s involvement guarantees that the 2026 examination reflects current best practices in applied linguistics and language assessment.',
        },
        venuePartner: {
          name: 'Central London Conference Centre',
          description: 'The Central London Conference Centre, located in the heart of Westminster, provides the examination halls and ceremony spaces for the 2026 Grand Final. The venue features 12 dedicated exam rooms accommodating up to 40 students each, a 400-seat main auditorium for the Opening Ceremony and Award Gala, full accessibility facilities and on-site technical support throughout all event days.',
        },
        organizerResponsibilities: 'Coordinating all local logistics, accommodation, transfers and meals for participating delegations\nProviding examination rooms, invigilation staff and technical equipment on exam day\nLiaising with the ISC on programme scheduling, security procedures and academic content delivery\nArranging all cultural activities, guided tours and evening programmes\nManaging accreditation, ID cards, lanyards and participant welcome packs\nHosting the Opening Ceremony and Gala Award Ceremony at Royal Lancaster Hall\nEnsuring student welfare, first-aid coverage and medical support throughout the programme\nPublishing the final programme and logistics guide to all registered team leaders\nCoordinating shuttle transfers from Heathrow and Gatwick airports on arrival and departure days',
        committeeMembers: [
          { name: 'Sarah Thompson',  role: 'Head of Events & Logistics',              badge: 'Host Representative' },
          { name: 'James Mitchell',  role: 'Programme Director',                      badge: 'Academic Liaison' },
          { name: 'Emily Roberts',   role: 'Student Welfare Officer',                 badge: 'Welfare' },
          { name: 'Daniel Patel',    role: 'Technical & AV Manager',                  badge: 'Technical' },
          { name: 'Fiona Clarke',    role: 'Cultural Programme Lead',                 badge: 'Cultural' },
          { name: 'Andrew Wilson',   role: 'Transport & Transfers Coordinator',        badge: 'Logistics' },
          { name: 'Laura Hughes',    role: 'ISC Liaison & Secondary Education Lead',  badge: 'ISC Liaison' },
          { name: 'Benjamin Nash',   role: 'Finance & Administration Manager',         badge: 'Administration' },
        ],
        contactBlocks: [
          { label: 'General enquiries',             value: 'contact@schoolconnect.uk' },
          { label: 'Student welfare & emergencies', value: '+44 7700 900123 (24 h during event)' },
          { label: 'Team leader WhatsApp group',    value: 'Invitation sent to all registered team leaders' },
        ],
        scheduleDays: [
          {
            dayLabel: 'Day 0 — July 14 (Tue)',
            dayTitle: 'Arrival Day',
            dayNote: 'Shuttle transfers available from Heathrow and Gatwick from 12:00.',
            items: [
              { time: '12:00–18:00', activity: 'Arrival & Check-in at Kensington Hall',         note: 'Reception desk open',            highlight: false },
              { time: '14:00–16:00', activity: 'Free time — explore local area',                 note: 'Kensington Gardens nearby',      highlight: false },
              { time: '19:00–21:00', activity: 'Welcome Dinner',                                 note: 'Residence dining hall',          highlight: false },
            ],
          },
          {
            dayLabel: 'Day 1 — July 15 (Wed)',
            dayTitle: 'Registration & Opening Ceremony',
            dayNote: 'All participants must register before 10:00 to receive their accreditation.',
            items: [
              { time: '09:00–10:00', activity: 'Registration & Accreditation',                   note: 'Main Hall — bring passport/ID',   highlight: false },
              { time: '10:00–11:00', activity: 'Orientation & City Tour Briefing',               note: 'Auditorium B',                   highlight: false },
              { time: '11:00–13:00', activity: 'Guided City Tour',                               note: 'Westminster & South Bank',       highlight: false },
              { time: '13:00–14:00', activity: 'Lunch',                                          note: 'Residence dining hall',          highlight: false },
              { time: '14:00–15:30', activity: 'Team Leaders\' Meeting',                         note: 'Exam briefing & logistics Q&A',  highlight: false },
              { time: '15:30–17:30', activity: 'Free Time & Sightseeing',                        note: '',                               highlight: false },
              { time: '18:00–20:00', activity: 'Opening Ceremony',                               note: 'Royal Lancaster Hall',           highlight: true  },
              { time: '20:00–21:30', activity: 'Welcome Gala Dinner',                            note: 'Ceremony venue',                 highlight: false },
            ],
          },
          {
            dayLabel: 'Day 2 — July 16 (Thu)',
            dayTitle: 'Grand Final Examination Day',
            dayNote: 'Exam rooms open 30 minutes early. Students must carry their delegation ID card.',
            items: [
              { time: '08:30–09:00', activity: 'Exam Day Registration & ID Check',               note: 'CLCC — Main Entrance',           highlight: true  },
              { time: '09:00–11:30', activity: 'Grand Final Examination — All Categories',       note: 'Exam Halls 1–12',                highlight: true  },
              { time: '11:30–12:00', activity: 'Answer Sheet Collection & Processing',           note: 'ISC invigilators only',          highlight: false },
              { time: '12:00–13:30', activity: 'Lunch',                                          note: 'Residence dining hall',          highlight: false },
              { time: '13:30–15:00', activity: 'Cultural Workshop — British Language & Lit.',    note: 'Seminar Room 2',                 highlight: false },
              { time: '15:00–17:00', activity: 'British Museum Guided Tour',                     note: 'Transport provided',             highlight: false },
              { time: '18:30–20:00', activity: 'Informal Evening — Team Mixer',                  note: 'Rooftop Lounge',                 highlight: false },
            ],
          },
          {
            dayLabel: 'Day 3 — July 17 (Fri)',
            dayTitle: 'Cultural Day & Gala Award Ceremony',
            dayNote: 'Dress code for the evening ceremony: smart casual or national costume.',
            items: [
              { time: '09:00–10:00', activity: 'Breakfast & Departure Briefing',                 note: 'Dining hall',                    highlight: false },
              { time: '10:00–13:00', activity: 'Thames River Cruise & Tower of London',          note: 'Full group activity',            highlight: false },
              { time: '13:00–14:30', activity: 'Lunch at Borough Market',                        note: 'Borough Market, Southwark',      highlight: false },
              { time: '14:30–16:00', activity: 'Covent Garden Free Time',                        note: '',                               highlight: false },
              { time: '16:00–17:30', activity: 'ISC Question Review Session',                    note: 'Team leaders only',              highlight: false },
              { time: '18:00–19:00', activity: 'Formal Dress & Preparation',                     note: 'Residence',                      highlight: false },
              { time: '19:00–22:00', activity: 'Gala Award Ceremony',                            note: 'Royal Lancaster Hall',           highlight: true  },
            ],
          },
          {
            dayLabel: 'Day 4 — July 18 (Sat)',
            dayTitle: 'Departure Day',
            dayNote: 'Shuttle transfers to Heathrow and Gatwick from 09:00. Please arrange flights accordingly.',
            items: [
              { time: '08:00–09:00', activity: 'Farewell Breakfast',                             note: 'Dining hall',                    highlight: false },
              { time: '09:00–11:00', activity: 'Checkout & Luggage Collection',                  note: 'Reception',                      highlight: false },
              { time: '09:00–14:00', activity: 'Shuttle Transfers to Heathrow & Gatwick',        note: 'Confirm slot with logistics',    highlight: false },
              { time: '11:00–12:00', activity: 'Closing Words from the ISC Chair',               note: 'Auditorium B',                   highlight: false },
            ],
          },
        ],
        scheduleNotes: 'All times are in British Summer Time (BST, UTC+1)\nExam rooms open 30 minutes before the scheduled start — arrive promptly\nStudents must carry their delegation ID card to all official events and the examination\nThe Award Ceremony on Day 3 (July 17) is open to invited guests and family members with a valid ticket\nTeam leaders should carry the emergency contact numbers provided in the logistics pack\nDress code for the Award Ceremony: smart casual or national costume',
        ruleDocuments: [
          { title: 'Verbivore Grand Final 2026 — Official Regulations', description: 'Full participation and conduct regulations for all student delegates, team leaders and national representatives.', downloadUrl: '/downloads/verbivore-2026-regulations.pdf' },
          { title: 'Examination Format Guide', description: 'Category-specific question breakdowns, section weightings and scoring rubrics for the Grand Final examination.', downloadUrl: '/downloads/verbivore-2026-exam-guide.pdf' },
          { title: 'Team Leader Information Pack', description: 'Logistics, accommodation, transport, welfare and emergency contact guide for registered team leaders.', downloadUrl: '/downloads/verbivore-2026-team-leader-pack.pdf' },
        ],
        ruleSections: [
          { icon: '👤', title: 'Eligibility & Registration', content: 'Students in grades 3–11 enrolled at an accredited school may participate.\n• Junior A: grades 3–4\n• Junior B: grades 5–6\n• Intermediate: grades 7–8\n• Senior: grades 9–11\n• Each student may only register in one category per year\n• All registrations must be confirmed through the accredited national representative before the deadline' },
          { icon: '📝', title: 'Exam Format', content: 'The Grand Final consists of 100 questions completed in 150 minutes.\n• Section 1 — Vocabulary: 30 questions (multiple choice)\n• Section 2 — Reading Comprehension: 25 questions\n• Section 3 — Grammar in Context: 20 questions\n• Section 4 — Logical Reasoning: 15 questions\n• Section 5 — Short Writing Response: 10 points\n• No dictionaries, electronic devices or aids permitted during the examination' },
          { icon: '🔇', title: 'Conduct & Fair Play', content: 'All participants are expected to uphold the highest standards of academic integrity.\n• Any communication between students during the exam constitutes immediate disqualification\n• Mobile devices must be surrendered at the exam room entrance before the start\n• Disruptive behavior will result in immediate removal from the examination\n• The invigilation team has final authority on all in-room decisions\n• Violations are reported to the ISC within 24 hours for review' },
          { icon: '🏅', title: 'Awards & Certificates', content: 'Medals are awarded based on final percentage scores across all participants in the same category globally.\n• Gold Medal: top 5% of all participants in category\n• Silver Medal: top 15%\n• Bronze Medal: top 30%\n• Honorable Mention: top 50%\n• Participation Certificate: all remaining participants\n• Certificates are issued digitally within 30 days of the Grand Final and are verifiable at verbivore.org' },
        ],
        medalTable: [
          { country: countryMap['Azerbaijan'],     gold: 3, silver: 4, bronze: 5, honorable: 6, participation: 2, hasDetails: true  },
          { country: countryMap['United Kingdom'], gold: 2, silver: 3, bronze: 4, honorable: 5, participation: 3, hasDetails: true  },
          { country: countryMap['Germany'],        gold: 2, silver: 2, bronze: 3, honorable: 4, participation: 1, hasDetails: true  },
          { country: countryMap['Türkiye'],        gold: 1, silver: 3, bronze: 4, honorable: 5, participation: 2, hasDetails: true  },
          { country: countryMap['Kazakhstan'],     gold: 1, silver: 2, bronze: 3, honorable: 4, participation: 2, hasDetails: true  },
          { country: countryMap['France'],         gold: 0, silver: 2, bronze: 3, honorable: 4, participation: 2, hasDetails: true  },
          { country: countryMap['Italy'],          gold: 0, silver: 1, bronze: 2, honorable: 5, participation: 3, hasDetails: true  },
          { country: countryMap['United States'],  gold: 0, silver: 1, bronze: 1, honorable: 3, participation: 2, hasDetails: false },
          { country: countryMap['Singapore'],      gold: 0, silver: 0, bronze: 1, honorable: 2, participation: 1, hasDetails: false },
          { country: countryMap['Japan'],          gold: 0, silver: 0, bronze: 0, honorable: 3, participation: 2, hasDetails: false },
        ],
        countryDelegations: [
          { country: countryMap['Azerbaijan'], teamLeader: 'Dr. Nigar Aliyeva', organization: 'Global Olympiad Center', students: [
            { name: 'Ayla Mammadova',     class: '7B',  category: 'Junior B',     score: '94/100', medal: 'Gold'             },
            { name: 'Kamran Aliyev',      class: '8A',  category: 'Intermediate', score: '87/100', medal: 'Silver'           },
            { name: 'Leyla Hasanova',     class: '6A',  category: 'Junior B',     score: '85/100', medal: 'Silver'           },
            { name: 'Murad Hajiyev',      class: '9C',  category: 'Senior',       score: '76/100', medal: 'Bronze'           },
            { name: 'Sabina Quliyeva',    class: '5B',  category: 'Junior B',     score: '74/100', medal: 'Bronze'           },
            { name: 'Tarlan Rzayev',      class: '10A', category: 'Senior',       score: '65/100', medal: 'Honorable Mention'},
            { name: 'Zulfiya Mammadli',   class: '3C',  category: 'Junior A',     score: '52/100', medal: 'Participation'    },
            { name: 'Elvin Gasimov',      class: '4A',  category: 'Junior A',     score: '91/100', medal: 'Gold'             },
          ]},
          { country: countryMap['United Kingdom'], teamLeader: 'James Bradford', organization: 'SchoolConnect UK', students: [
            { name: 'Oliver Smith',       class: '8B',  category: 'Intermediate', score: '91/100', medal: 'Gold'             },
            { name: 'Charlotte Evans',    class: '7A',  category: 'Junior B',     score: '84/100', medal: 'Silver'           },
            { name: 'Noah Williams',      class: '9A',  category: 'Senior',       score: '75/100', medal: 'Bronze'           },
            { name: 'Amelia Jones',       class: '6B',  category: 'Junior B',     score: '63/100', medal: 'Honorable Mention'},
            { name: 'Harry Brown',        class: '10B', category: 'Senior',       score: '82/100', medal: 'Silver'           },
            { name: 'Isla Taylor',        class: '5A',  category: 'Junior B',     score: '73/100', medal: 'Bronze'           },
            { name: 'George Wilson',      class: '4B',  category: 'Junior A',     score: '48/100', medal: 'Participation'    },
            { name: 'Sophie Moore',       class: '11A', category: 'Senior',       score: '93/100', medal: 'Gold'             },
          ]},
          { country: countryMap['Germany'], teamLeader: 'Dr. Klara Becker', organization: 'DeutschConnect', students: [
            { name: 'Leon Müller',        class: '8A',  category: 'Intermediate', score: '95/100', medal: 'Gold'             },
            { name: 'Hannah Schmidt',     class: '9B',  category: 'Senior',       score: '86/100', medal: 'Silver'           },
            { name: 'Maximilian Wagner',  class: '7A',  category: 'Junior B',     score: '77/100', medal: 'Bronze'           },
            { name: 'Sophie Fischer',     class: '6A',  category: 'Junior B',     score: '68/100', medal: 'Honorable Mention'},
            { name: 'Lukas Weber',        class: '10A', category: 'Senior',       score: '92/100', medal: 'Gold'             },
          ]},
          { country: countryMap['Türkiye'], teamLeader: 'Dr. Ayşe Yıldız', organization: 'Türkiye English Olympiad Foundation', students: [
            { name: 'Emre Yildirim',      class: '9A',  category: 'Senior',       score: '88/100', medal: 'Silver'           },
            { name: 'Zeynep Arslan',      class: '8B',  category: 'Intermediate', score: '78/100', medal: 'Bronze'           },
            { name: 'Mehmet Kaya',        class: '7B',  category: 'Junior B',     score: '83/100', medal: 'Silver'           },
            { name: 'Fatma Öztürk',       class: '6A',  category: 'Junior B',     score: '66/100', medal: 'Honorable Mention'},
            { name: 'Ahmet Demir',        class: '10B', category: 'Senior',       score: '72/100', medal: 'Bronze'           },
            { name: 'Ayse Sahin',         class: '5A',  category: 'Junior B',     score: '50/100', medal: 'Participation'    },
          ]},
          { country: countryMap['Kazakhstan'], teamLeader: 'Prof. Ainur Bekova', organization: 'Kazakhstan Academic Network', students: [
            { name: 'Asel Nurmagambetova',class: '10A', category: 'Senior',       score: '82/100', medal: 'Bronze'           },
            { name: 'Daniyar Seitkali',   class: '8B',  category: 'Intermediate', score: '81/100', medal: 'Silver'           },
            { name: 'Aigerim Bekova',     class: '7A',  category: 'Junior B',     score: '64/100', medal: 'Honorable Mention'},
            { name: 'Nursultan Akhmetov', class: '9C',  category: 'Senior',       score: '71/100', medal: 'Bronze'           },
          ]},
          { country: countryMap['France'], teamLeader: 'Mme. Sophie Leblanc', organization: 'EduFrance International', students: [
            { name: 'Emma Martin',        class: '7A',  category: 'Junior B',     score: '76/100', medal: 'Honorable Mention'},
            { name: 'Louis Bernard',      class: '8A',  category: 'Intermediate', score: '80/100', medal: 'Silver'           },
            { name: 'Chloé Dupont',       class: '9B',  category: 'Senior',       score: '70/100', medal: 'Bronze'           },
            { name: 'Hugo Petit',         class: '6B',  category: 'Junior B',     score: '45/100', medal: 'Participation'    },
          ]},
          { country: countryMap['Italy'], teamLeader: 'Prof. Marco Conti', organization: 'Italian Education Network', students: [
            { name: 'Giulia Rossi',       class: '9A',  category: 'Senior',       score: '79/100', medal: 'Honorable Mention'},
            { name: 'Luca Ferrari',       class: '8A',  category: 'Intermediate', score: '73/100', medal: 'Bronze'           },
            { name: 'Sofia Bianchi',      class: '7B',  category: 'Junior B',     score: '61/100', medal: 'Honorable Mention'},
            { name: 'Marco Romano',       class: '6A',  category: 'Junior B',     score: '47/100', medal: 'Participation'    },
            { name: 'Valentina Esposito', class: '10A', category: 'Senior',       score: '89/100', medal: 'Silver'           },
          ]},
        ],
        participantsNote: 'Results are final as reviewed by the International Scientific Committee. Medal criteria: Gold top 5%, Silver top 15%, Bronze top 30%, Honorable Mention top 50%.',
        order: 1,
      }}),
      payload.create({ collection: 'editions', data: { shortTitle: '2027 TBA', year: 2027, hostCountryLabel: 'TBA', flag: '🌍', status: 'upcoming', description: 'Future edition — host country and program details to be announced.', order: 2 } }),
      payload.create({ collection: 'editions', data: { shortTitle: 'Archive', hostCountryLabel: 'Archive', flag: '📁', status: 'past', description: 'Past editions, result tables and participant records.', order: 3 } }),

      payload.updateGlobal({
        slug: 'editions-page',
        data: {
          heroTitle: 'Verbivore Editions',
          heroSubtitle: 'Every year, a new host country. Every Grand Final, a new chapter in international English excellence.',
          statsEditions: '3',
          statsCountries: '35+',
          statsAlumni: '500+',
        },
      }),
    ])
    }

    /* ── Seed categories ──────────────────────────────── */
    if (categoriesCount === 0) {
      payload.logger.info('Seeding categories...')
      await Promise.all(
        ([
          {
            name: 'Junior A', slug: 'junior-a', gradeRange: 'Grades 3–4', ageRange: 'Ages 9–10', color: '#ff821a',
            description: 'The entry level for the youngest participants. Questions are visual, playful and designed to build confidence in English.',
            topics: ['Basic vocabulary', 'Simple reading', 'Word matching', 'Short sentences'],
            contentSections: [
              { icon: '📝', title: 'Exam Format', content: '30 questions, 60 minutes\nMultiple choice and picture-matching\nNo written response required\nFriendly, low-pressure exam environment' },
              { icon: '🎯', title: 'Topics Covered', content: 'Basic vocabulary (animals, colours, family, school)\nSimple reading passages of 2–3 sentences\nWord-to-picture matching\nShort, everyday sentences' },
              { icon: '🏅', title: 'Scoring & Advancement', content: 'Scored out of 100 points\nTop scorers advance to the National Final\nAll participants receive a certificate of participation' },
            ],
            order: 1,
          },
          {
            name: 'Junior B', slug: 'junior-b', gradeRange: 'Grades 5–6', ageRange: 'Ages 11–12', color: '#2aa7ff',
            description: 'A step up in complexity. Students read short passages and answer questions that test comprehension and grammar awareness.',
            topics: ['Intermediate vocabulary', 'Reading paragraphs', 'Fill-in-the-blank', 'Error correction'],
            contentSections: [
              { icon: '📝', title: 'Exam Format', content: '40 questions, 75 minutes\nMultiple choice, fill-in-the-blank and short reading passages\nNo written response required' },
              { icon: '🎯', title: 'Topics Covered', content: 'Intermediate vocabulary across everyday topics\nShort reading paragraphs with comprehension questions\nFill-in-the-blank grammar exercises\nBasic error correction' },
              { icon: '🏅', title: 'Scoring & Advancement', content: 'Scored out of 100 points\nTop scorers advance to the National Final\nGold, Silver, Bronze and Honorable Mention awarded by percentile' },
            ],
            order: 2,
          },
          {
            name: 'Intermediate', slug: 'intermediate', gradeRange: 'Grades 7–8', ageRange: 'Ages 13–14', color: '#7d5cff',
            description: 'Challenging reading texts with inference questions. Vocabulary tested at near-academic level.',
            topics: ['Advanced vocabulary', 'Long-form reading', 'Logical deduction', 'Word formation'],
            contentSections: [
              { icon: '📝', title: 'Exam Format', content: '60 questions, 90 minutes\nMultiple choice with longer reading passages\nIncludes logical deduction and word-formation items' },
              { icon: '🎯', title: 'Topics Covered', content: 'Advanced and academic vocabulary\nLong-form reading comprehension with inference questions\nWord formation (prefixes, suffixes, parts of speech)\nLogical reasoning based on text' },
              { icon: '🏅', title: 'Scoring & Advancement', content: 'Scored out of 100 points\nTop scorers advance to the National Final, then potentially the Grand Final\nGold, Silver, Bronze and Honorable Mention awarded by percentile' },
            ],
            order: 3,
          },
          {
            name: 'Senior', slug: 'senior', gradeRange: 'Grades 9–11', ageRange: 'Ages 15–17', color: '#2fcf7f',
            description: 'The most demanding category. Includes short written responses and near-academic comprehension passages.',
            topics: ['Academic vocabulary', 'Critical reading', 'Idioms & phrases', 'Short writing'],
            contentSections: [
              { icon: '📝', title: 'Exam Format', content: '80–100 questions, 120–150 minutes\nMultiple choice plus a short written response section\nMost demanding format across all categories' },
              { icon: '🎯', title: 'Topics Covered', content: 'Academic and near-academic vocabulary\nCritical reading of longer, complex passages\nIdioms, phrases and text coherence\nShort written responses (Grand Final level)' },
              { icon: '🏅', title: 'Scoring & Advancement', content: 'Scored out of 100 points\nTop scorers represent their country at the Grand Final\nGold, Silver, Bronze and Honorable Mention awarded by percentile' },
            ],
            order: 4,
          },
        ]).map((cat) =>
          payload.create({ collection: 'categories', data: {
            ...cat,
            topics: cat.topics.map((topic) => ({ topic })),
          }})
        )
      )
    }

    /* ── Seed certificates (after countries + editions exist) ─ */
    if (certCount === 0) {
      payload.logger.info('Seeding certificates...')
      const { docs: editionDocs } = await payload.find({ collection: 'editions', where: { slug: { equals: '2026-uk' } }, limit: 1 })
      const edition2026Id = editionDocs[0]?.id
      await Promise.all(
        ([
          ['VERB-2026-AZ-001', 'Ayla Mammadova',          'Azerbaijan',     '7',  '15 Aug 2026', '94/100', '🥇 Gold Medal',        'Grand Final'],
          ['VERB-2026-AZ-012', 'Kamran Aliyev',           'Azerbaijan',     '8',  '15 Aug 2026', '87/100', '🥈 Silver Medal',      'Grand Final'],
          ['VERB-2026-TR-007', 'Emre Yildirim',           'Türkiye',        '9',  '15 Aug 2026', '88/100', '🥈 Silver Medal',      'Grand Final'],
          ['VERB-2026-UK-003', 'Oliver Smith',            'United Kingdom', '8',  '15 Aug 2026', '91/100', '🥇 Gold Medal',        'Grand Final'],
          ['VERB-2026-KZ-004', 'Asel Nurmagambetova',     'Kazakhstan',     '10', '15 Aug 2026', '82/100', '🥉 Bronze Medal',      'Grand Final'],
          ['VERB-2026-IT-005', 'Giulia Rossi',            'Italy',          '9',  '15 Aug 2026', '79/100', '🏅 Honorable Mention', 'Grand Final'],
          ['VERB-2026-DE-006', 'Leon Müller',             'Germany',        '8',  '15 Aug 2026', '95/100', '🥇 Gold Medal',        'Grand Final'],
          ['VERB-2026-FR-008', 'Emma Martin',             'France',         '7',  '15 Aug 2026', '76/100', '🏅 Honorable Mention', 'Grand Final'],
        ] as [string, string, string, string, string, string, string, string][]).map(
          ([code, nameSurname, country, grade, examDate, score, achievement, examType]) =>
            payload.create({ collection: 'certificates', data: { code, nameSurname, country: countryMap[country], edition: edition2026Id, grade, examDate, score, achievement, examType } })
        )
      )
    }

    payload.logger.info('Seed complete.')
  },
})
