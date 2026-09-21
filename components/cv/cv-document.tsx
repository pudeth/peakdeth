'use client'

import React from 'react'
import Image from 'next/image'
import { cvData as defaultCvData, CVData } from '@/data/cv-data'
import { ExternalLink } from 'lucide-react'

interface CVDocumentProps {
  interactive?: boolean
  data?: CVData
}

export function CVDocument({ interactive = true, data }: CVDocumentProps) {
  const cvData = data || defaultCvData
  return (
    <div
      id="cv-printable-document"
      className="print-sheet mx-auto font-sans transition-all duration-300 relative sm:rounded-2xl overflow-hidden border border-slate-700/80 sm:border-[#df862b]/40 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.95),0_0_50px_-5px_rgba(223,134,43,0.18)] ring-1 ring-white/10 print:border-none print:shadow-none print:ring-0 print:rounded-none print:overflow-hidden print:w-[210mm] print:max-w-[210mm] print:h-[297mm]"
      style={{
        width: '100%',
        maxWidth: '820px',
        backgroundColor: '#ffffff',
        color: '#2b2420',
      }}
    >
      {/* Executive top accent trim (visible on screen) */}
      <div className="hidden sm:block print:hidden h-1 w-full bg-gradient-to-r from-[#df862b] via-amber-400 to-[#df862b]" />

      {/* ================= UNIFIED TWO-COLUMN LAYOUT ================= */}
      <div className="grid grid-cols-1 md:grid-cols-12 print:grid-cols-12 min-h-[1100px] print:min-h-0 print:h-[297mm]">
        {/* ================= LEFT COLUMN (57% width on desktop) ================= */}
        {/* NOTE: order-2 on mobile so right column (name/skills) appears first */}
        <div
          className="md:col-span-7 print:col-span-7 flex flex-col order-2 md:order-1 print:order-1"
          style={{ backgroundColor: '#ffffff', color: '#2b2420' }}
        >
          {/* Left Header Graphic with Circle Photo — hidden on mobile, visible md+ and print */}
          <div
            className="relative overflow-hidden hidden md:block print:block"
            style={{
              backgroundColor: '#2e2520',
              height: '290px',
            }}
          >
            {/* ── Background SVG layers ── */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              preserveAspectRatio="none"
              viewBox="0 0 460 290"
            >
              {/* Deep dark base */}
              <rect width="460" height="290" fill="#1b1410" />

              {/* Mocha mid layer */}
              <rect width="460" height="290" fill="#2e2520" />

              {/* Top-left large triangular white cut — elegant geometry */}
              <polygon points="0,0 0,145 115,0" fill="#ffffff" />

              {/* Golden accent lines along the triangle hypotenuse */}
              <line x1="0" y1="145" x2="115" y2="0" stroke="#ff9100" strokeWidth="3" strokeLinecap="round" opacity="0.95" />
              <line x1="0" y1="152" x2="122" y2="0" stroke="#ff9100" strokeWidth="1" strokeDasharray="3 3" opacity="0.45" />

              {/* Bottom-right dark corner block for depth */}
              <polygon points="460,180 460,290 310,290" fill="#1b1410" opacity="0.5" />

              {/* Flowing white wave — bottom sweep */}
              <path
                d="M 0,235
                   C 60,230 120,252 200,255
                   C 280,258 370,270 460,290
                   L 460,290 L 0,290 Z"
                fill="#ffffff"
              />

              {/* Flowing golden accent line along bottom sweep */}
              <path
                d="M 0,235
                   C 60,230 120,252 200,255
                   C 280,258 370,270 460,290"
                fill="none"
                stroke="#ff9100"
                strokeWidth="2.5"
                opacity="0.9"
              />

              {/* Subtle inner wave layer for depth */}
              <path
                d="M 0,250
                   C 80,245 160,262 240,264
                   C 320,266 390,275 460,290
                   L 460,290 L 0,290 Z"
                fill="#ffffff"
                opacity="0.35"
              />

              {/* Decorative dot grid — top right area */}
              {[0, 1, 2, 3, 4].map((col) =>
                [0, 1, 2, 3].map((row) => (
                  <circle
                    key={`dot-${col}-${row}`}
                    cx={340 + col * 18}
                    cy={28 + row * 18}
                    r="2.2"
                    fill="#ff9100"
                    opacity="0.35"
                  />
                ))
              )}

              {/* Thin horizontal accent lines — right side */}
              <line x1="360" y1="105" x2="445" y2="105" stroke="#ff9100" strokeWidth="1.5" opacity="0.4" />
              <line x1="375" y1="115" x2="445" y2="115" stroke="#ff9100" strokeWidth="1" strokeDasharray="4 2" opacity="0.3" />

              {/* Architectural Concentric Rings behind photo */}
              <circle cx="230" cy="138" r="102" fill="none" stroke="#ff9100" strokeWidth="1.5" opacity="0.45" />
              <circle cx="230" cy="138" r="112" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 4" opacity="0.25" />
              <circle cx="230" cy="138" r="122" fill="none" stroke="#ff9100" strokeWidth="0.75" opacity="0.2" />

              {/* Precision architectural compass ticks */}
              <line x1="230" y1="18" x2="230" y2="28" stroke="#ff9100" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <line x1="230" y1="248" x2="230" y2="258" stroke="#ff9100" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <line x1="110" y1="138" x2="120" y2="138" stroke="#ff9100" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <line x1="340" y1="138" x2="350" y2="138" stroke="#ff9100" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
            </svg>

            {/* ── Circular Photo Frame — Centred & Elevated ── */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              {/* Outer radial ambient glow */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: '224px',
                  height: '224px',
                  background: 'radial-gradient(circle, rgba(255,145,0,0.28) 0%, rgba(255,145,0,0.08) 50%, transparent 75%)',
                  filter: 'blur(8px)',
                }}
              />

              {/* Luxury Photo Frame */}
              <div
                className="relative rounded-full overflow-hidden"
                style={{
                  width: '196px',
                  height: '196px',
                  border: '4px solid #ffffff',
                  boxShadow: `
                    0 0 0 3.5px #ff9100,
                    0 0 0 7px #2e2520,
                    0 0 0 9.5px rgba(255,145,0,0.45),
                    0 16px 36px rgba(0,0,0,0.65)
                  `,
                  backgroundColor: '#ffffff',
                  flexShrink: 0,
                }}
              >
                <Image
                  src={cvData.photoUrl}
                  alt={cvData.name}
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="196px"
                />
              </div>
            </div>
          </div>



          {/* Left Body: Professional Experience — pt-5 on mobile (no photo above), pt-2 on desktop */}
          <section className="p-6 sm:p-7 pt-5 md:pt-2 flex-1">
            {/* Section Heading */}
            <h2
              className="text-base sm:text-lg font-black tracking-wide uppercase mb-3"
              style={{ color: '#ff9100' }}
            >
              PROFESSIONAL EXPERIENCE
            </h2>

            <div className="space-y-3">
              {cvData.experiences.map((exp, index) => (
                <div key={exp.id}>
                  {/* Company & Period line */}
                  <div className="flex flex-wrap items-baseline gap-2 font-bold leading-snug">
                    <span
                      className="text-xs sm:text-sm font-black"
                      style={{ color: '#1a1412' }}
                    >
                      {exp.company}
                    </span>
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: '#332924' }}
                    >
                      ({exp.period})
                    </span>
                  </div>

                  {/* Role | Location */}
                  <div
                    className="text-[11px] font-medium mb-1 leading-snug"
                    style={{ color: '#443832' }}
                  >
                    <span>{exp.role}</span>
                    <span className="mx-1" style={{ color: '#887770' }}>
                      |
                    </span>
                    <span>{exp.location}</span>
                  </div>

                  {/* Bullets */}
                  <ul className="space-y-0.5 list-none pl-0">
                    {exp.bullets.map((bullet, bIdx) => (
                      <li
                        key={bIdx}
                        className="flex items-start gap-1.5 text-[10.5px] sm:text-[11px] leading-relaxed"
                        style={{ color: '#332924' }}
                      >
                        <span
                          className="shrink-0 select-none font-bold"
                          style={{ color: '#55443c' }}
                        >
                          •
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Technologies */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div
                      className="mt-1 text-[10px] sm:text-[10.5px] leading-relaxed"
                      style={{ color: '#443832' }}
                    >
                      <span className="font-bold">Technologies: </span>
                      <span>{exp.technologies.join(', ')}</span>
                    </div>
                  )}

                  {/* Dotted divider between experience items */}
                  {index < cvData.experiences.length - 1 && (
                    <div
                      className="my-2.5"
                      style={{
                        borderBottom: '1.5px dotted #a89f99',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* HONORS & AWARDS (from website) */}
            {cvData.awards && cvData.awards.length > 0 && (
              <div className="mt-5 pt-3" style={{ borderTop: '1.5px dotted #a89f99' }}>
                <h2
                  className="text-base sm:text-lg font-black tracking-wide uppercase mb-2.5"
                  style={{ color: '#ff9100' }}
                >
                  HONORS & AWARDS
                </h2>
                <div className="space-y-2">
                  {cvData.awards.map((award, aIdx) => (
                    <div key={aIdx} className="text-[11px] leading-snug">
                      <div className="font-black flex items-center justify-between" style={{ color: '#1a1412' }}>
                        <span>{award.title}</span>
                        <span className="font-bold" style={{ color: '#7a6a63' }}>{award.year}</span>
                      </div>
                      <div className="text-[10.5px] font-medium" style={{ color: '#55443c' }}>
                        {award.organization}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REFERENCES */}
            <div className="mt-5 pt-3" style={{ borderTop: '1.5px dotted #a89f99' }}>
              <h2
                className="text-base sm:text-lg font-black tracking-wide uppercase mb-1.5"
                style={{ color: '#ff9100' }}
              >
                REFERENCES
              </h2>
              <p className="text-[10.5px] sm:text-[11px] leading-relaxed italic" style={{ color: '#443832' }}>
                Available upon request. Live project portfolio, architecture documentation, and verified system demonstrations available at{' '}
                <a href={cvData.website.url} target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{ color: '#df862b' }}>
                  {cvData.website.label}
                </a>.
              </p>
            </div>
          </section>
        </div>

        {/* ================= RIGHT COLUMN (43% width on desktop) ================= */}
        {/* order-1 on mobile so it appears before experiences, order-2 on desktop (right side) */}
        <aside
          className="md:col-span-5 print:col-span-5 p-6 sm:p-7 flex flex-col justify-between space-y-3.5 relative overflow-hidden order-1 md:order-2 print:order-2 md:border-l border-amber-500/20"
          style={{
            backgroundColor: '#2e2520',
            color: '#f0ece8',
          }}
        >
          {/* Right Header Vertical Pill Shape Graphic */}
          <div
            className="absolute right-4 sm:right-6 top-0 w-20 sm:w-24 h-56 rounded-b-full pointer-events-none"
            style={{
              backgroundColor: '#43362f',
              opacity: 0.45,
            }}
          />

          {/* ── MOBILE-ONLY: Compact Photo + Name Hero ── */}
          <div className="block md:hidden print:hidden relative z-10 -mx-6 -mt-6 px-5 pt-5 pb-4 border-b border-amber-500/20"
            style={{ backgroundColor: '#2e2520' }}
          >
            <div className="flex items-center gap-4">
              {/* Compact circular photo */}
              <div
                className="relative rounded-full overflow-hidden flex-shrink-0"
                style={{
                  width: '84px',
                  height: '84px',
                  border: '2.5px solid #ffffff',
                  boxShadow: '0 0 0 2.5px #ff9100, 0 0 0 5px #2e2520, 0 0 0 7.5px rgba(255,145,0,0.45)',
                  backgroundColor: '#ffffff',
                }}
              >
                <Image
                  src={cvData.photoUrl}
                  alt={cvData.name}
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="84px"
                />
              </div>
              {/* Name + Role beside photo */}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-black tracking-wider uppercase leading-tight"
                  style={{ color: '#ffffff', letterSpacing: '0.04em' }}>
                  {cvData.name}
                </h1>
                <div className="mt-1 text-[10px] font-black tracking-wide uppercase leading-tight"
                  style={{ color: '#ff9100' }}>
                  {cvData.roleTitle}
                </div>
                <div className="mt-1.5 text-[10px] font-normal flex flex-wrap gap-x-1.5"
                  style={{ color: '#cfc7c2' }}>
                  <span>{cvData.location}</span>
                  <span>•</span>
                  <span>{cvData.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Header: Name & Role Title — DESKTOP ONLY */}
          <div className="relative z-10 pt-2 pb-4 hidden md:block print:block">
            <h1
              className="text-3xl sm:text-[34px] lg:text-[38px] font-black tracking-wider uppercase font-sans leading-none"
              style={{ color: '#ffffff', letterSpacing: '0.04em' }}
            >
              {cvData.name}
            </h1>

            <div
              className="mt-2.5 text-xs sm:text-[12.5px] font-black tracking-wide uppercase leading-tight"
              style={{ color: '#ff9100' }}
            >
              {cvData.roleTitle}
            </div>

            <div
              className="mt-2.5 text-[11px] font-normal tracking-wide flex flex-wrap items-center gap-1.5"
              style={{ color: '#cfc7c2' }}
            >
              <span>{cvData.location}</span>
              <span>•</span>
              <span>[{cvData.phone}]</span>
              {cvData.email && (
                <>
                  <span>•</span>
                  <span>{cvData.email}</span>
                </>
              )}
            </div>
          </div>

          {/* PROFESSIONAL SUMMARY */}
          <div className="relative z-10">
            <h2
              className="text-xs sm:text-sm font-black tracking-wide uppercase mb-1.5"
              style={{ color: '#ff9100' }}
            >
              PROFESSIONAL SUMMARY
            </h2>
            <p
              className="text-[10.5px] sm:text-[11px] leading-relaxed text-justify"
              style={{ color: '#e8e3df' }}
            >
              {cvData.summary}
            </p>
          </div>

          {/* Dotted Divider */}
          <div style={{ borderBottom: '1.5px dotted #6b5a52' }} />

          {/* EDUCATION (Solid White Box with Bold Black Text) */}
          <div className="relative z-10">
            <div
              className="w-full py-1 px-3 text-center mb-2.5 shadow-sm"
              style={{
                backgroundColor: '#ffffff',
                color: '#1a1412',
              }}
            >
              <h2 className="text-sm sm:text-base font-black tracking-widest uppercase">
                EDUCATION
              </h2>
            </div>

            <div className="space-y-2 text-[10.5px] sm:text-[11px]">
              {cvData.education.map((edu, idx) => (
                <div key={idx}>
                  <div
                    className="font-black leading-tight"
                    style={{ color: '#ffffff' }}
                  >
                    {edu.institution}
                  </div>
                  <div style={{ color: '#e8e3df' }}>{edu.degree}</div>
                  {edu.location && (
                    <div className="text-[10px]" style={{ color: '#c4b9b2' }}>
                      {edu.location}
                    </div>
                  )}
                  {edu.year && (
                    <div className="text-[10px]" style={{ color: '#c4b9b2' }}>
                      {edu.year}
                    </div>
                  )}
                  {idx < cvData.education.length - 1 && (
                    <div
                      className="my-1.5"
                      style={{ borderBottom: '1px dotted #5e4e46' }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Dotted Divider */}
          <div style={{ borderBottom: '1.5px dotted #6b5a52' }} />

          {/* CORE COMPETENCIES */}
          <div className="relative z-10">
            <h2
              className="text-[11px] sm:text-xs font-black tracking-wider uppercase mb-1.5"
              style={{ color: '#ffffff' }}
            >
              CORE COMPETENCIES
            </h2>
            <ul className="space-y-0.5 text-[10.5px] sm:text-[11px]">
              {cvData.coreCompetencies.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-1.5 leading-snug"
                  style={{ color: '#e8e3df' }}
                >
                  <span className="shrink-0" style={{ color: '#ff9100' }}>
                    •
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dotted Divider */}
          <div style={{ borderBottom: '1.5px dotted #6b5a52' }} />

          {/* TECHNICAL EXPERTISE */}
          <div className="relative z-10">
            <h2
              className="text-[11px] sm:text-xs font-black tracking-wider uppercase mb-2"
              style={{ color: '#ffffff' }}
            >
              TECHNICAL EXPERTISE
            </h2>

            <div className="space-y-2 text-[10px] sm:text-[10.5px]">
              {cvData.technicalExpertise.map((cat, idx) => (
                <div key={idx}>
                  <div
                    className="font-bold text-[10.5px] sm:text-[11px] mb-0.5"
                    style={{ color: '#ffffff' }}
                  >
                    {cat.category}
                  </div>
                  <div className="leading-snug" style={{ color: '#dbd2cb' }}>
                    {cat.skills.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dotted Divider */}
          <div style={{ borderBottom: '1.5px dotted #6b5a52' }} />

          {/* FOLLOW ME / PORTFOLIO */}
          <div className="relative z-10">
            <h2
              className="text-[11px] sm:text-xs font-black tracking-wider uppercase mb-1"
              style={{ color: '#ffffff' }}
            >
              PORTFOLIO & CONNECT
            </h2>
            <div className="space-y-1.5 text-[10.5px] sm:text-[11px]">
              <div>
                <div className="font-bold text-[10.5px]" style={{ color: '#ffffff' }}>
                  Official Website
                </div>
                <a
                  href={cvData.website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] hover:underline break-all inline-flex items-center gap-0.5 mt-0.5"
                  style={{ color: '#ff9100' }}
                >
                  <span>{cvData.website.label}</span>
                  <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                </a>
              </div>

              {cvData.social && (
                <div>
                  <div className="font-bold text-[10.5px]" style={{ color: '#ffffff' }}>
                    {cvData.social.platform}
                  </div>
                  <a
                    href={cvData.social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] hover:underline break-all inline-flex items-center gap-0.5 mt-0.5"
                    style={{ color: '#7bc5ff' }}
                  >
                    <span>{cvData.social.label}</span>
                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
