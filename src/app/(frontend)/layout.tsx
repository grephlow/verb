import React from 'react'
import Script from 'next/script'
import { Baloo_2, Poppins } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

const baloo = Baloo_2({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-baloo',
  display: 'swap',
})
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata = {
  title: 'Verbivore The Contest',
  description: 'Verbivore — the international English olympiad for school students. Vocabulary, reading, logic and communication tested across 35+ countries.',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${baloo.variable} ${poppins.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        {/* Toast notification element */}
        <div id="verbToast">
          <span className="toast-icon">✅</span>
          <span id="verbToastMsg"></span>
          <button className="toast-close" onClick={undefined}>✕</button>
        </div>
        <Script src="/main.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
