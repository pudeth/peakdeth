'use client'

import React from 'react'
import Image from 'next/image'
import { cvData as defaultCvData, CVData } from '@/data/cv-data'
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  ExternalLink,
  Award,
  GraduationCap,
  Briefcase,
  Code2,
  Sparkles,
  Layers,
  CheckCircle2,
} from 'lucide-react'

interface CVDocumentProps {
  interactive?: boolean
  data?: CVData
}

export function CVDocument({ interactive = true, data }: CVDocumentProps) {
  const cv = data || defaultCvData

  return (
    <div
      id="cv-printable-document"
      className="print-sheet mx-auto font-sans transition-all duration-300 relative rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.08)] print:border-none print:shadow-none print:ring-0 print:rounded-none print:overflow-hidden print:w-full print:max-w-none"
      style={{
        width: '100%',
        maxWidth: '820px',
        backgroundColor: '#13161f',
        backgroundImage: 'linear-gradient(to right, #13161f 0%, #13161f 41.666667%, #ffffff 41.666667%, #ffffff 100%)',
        color: '#1e293b',
      }}
    >
      {/* ================= UNIFIED EXECUTIVE GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-12 print:grid-cols-12 min-h-[1160px] print:h-[1160px]">
        {/* ================= LEFT SIDEBAR (Dark Obsidian Column: 38%) ================= */}
        <aside
          className="md:col-span-5 print:col-span-5 p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden order-1 text-slate-200 h-full min-h-full"
          style={{
            backgroundColor: '#13161f',
            borderRight: '1px solid rgba(223, 134, 43, 0.25)',
          }}
        >
          {/* Subtle architectural ambient background glow */}
          <div
            className="absolute -top-16 -left-16 w-56 h-56 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(223,134,43,0.18) 0%, transparent 70%)',
              filter: 'blur(30px)',
            }}
          />

          <div className="relative z-10 space-y-4">
            {/* ── 1. AVATAR PORTRAIT ── */}
            <div className="flex flex-col items-center text-center pt-1 pb-1">
              <div
                className="relative rounded-full overflow-hidden flex-shrink-0"
                style={{
                  width: '136px',
                  height: '136px',
                  border: '3px solid #df862b',
                  boxShadow: '0 0 0 4px rgba(223,134,43,0.25), 0 12px 28px rgba(0,0,0,0.7)',
                  backgroundColor: '#1f2430',
                }}
              >
                <Image
                  src={cv.photoUrl}
                  alt={cv.name}
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="136px"
                />
              </div>

              {/* Mobile Only: Name & Title under avatar */}
              <div className="block md:hidden print:hidden mt-3">
                <h1 className="text-2xl font-black tracking-wide uppercase text-white">
                  {cv.name}
                </h1>
                <div className="text-xs font-bold uppercase tracking-wider text-[#df862b] mt-0.5">
                  {cv.roleTitle}
                </div>
              </div>
            </div>

            {/* ── 2. CONTACT DETAILS ── */}
            <div>
              <div className="flex items-center gap-2 pb-1.5 mb-2.5 border-b border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#df862b]" />
                <h2 className="text-xs font-black tracking-widest uppercase text-white">
                  CONTACT
                </h2>
              </div>

              <div className="space-y-2 text-[11px]">
                {cv.phone && (
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <div className="w-5 h-5 rounded-md bg-[#df862b]/15 flex items-center justify-center text-[#df862b] shrink-0">
                      <Phone className="w-3 h-3" />
                    </div>
                    <span className="font-medium text-slate-200">{cv.phone}</span>
                  </div>
                )}

                {cv.email && (
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <div className="w-5 h-5 rounded-md bg-[#df862b]/15 flex items-center justify-center text-[#df862b] shrink-0">
                      <Mail className="w-3 h-3" />
                    </div>
                    <span className="font-medium text-slate-200 truncate">{cv.email}</span>
                  </div>
                )}

                {cv.location && (
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <div className="w-5 h-5 rounded-md bg-[#df862b]/15 flex items-center justify-center text-[#df862b] shrink-0">
                      <MapPin className="w-3 h-3" />
                    </div>
                    <span className="font-medium text-slate-200">{cv.location}</span>
                  </div>
                )}

                {cv.website && (
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <div className="w-5 h-5 rounded-md bg-[#df862b]/15 flex items-center justify-center text-[#df862b] shrink-0">
                      <Globe className="w-3 h-3" />
                    </div>
                    <a
                      href={cv.website.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#df862b] hover:underline inline-flex items-center gap-1 truncate"
                    >
                      <span>{cv.website.label}</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* ── 3. CORE COMPETENCIES ── */}
            {cv.coreCompetencies && cv.coreCompetencies.length > 0 && (
              <div>
                <div className="flex items-center gap-2 pb-1.5 mb-2.5 border-b border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#df862b]" />
                  <h2 className="text-xs font-black tracking-widest uppercase text-white">
                    CORE COMPETENCIES
                  </h2>
                </div>

                <ul className="space-y-1 text-[10.5px]">
                  {cv.coreCompetencies.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-tight text-slate-300">
                      <span className="text-[#df862b] font-black text-xs leading-none shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── 4. TECHNICAL EXPERTISE ── */}
            {cv.technicalExpertise && cv.technicalExpertise.length > 0 && (
              <div>
                <div className="flex items-center gap-2 pb-1.5 mb-2.5 border-b border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#df862b]" />
                  <h2 className="text-xs font-black tracking-widest uppercase text-white">
                    TECHNICAL EXPERTISE
                  </h2>
                </div>

                <div className="space-y-2.5 text-[10px]">
                  {cv.technicalExpertise.map((cat, idx) => (
                    <div key={idx}>
                      <div className="font-bold text-[10.5px] text-white flex items-center gap-1.5 mb-1">
                        <span className="w-1 h-2.5 bg-[#df862b] rounded-sm shrink-0" />
                        <span>{cat.category}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 leading-snug pl-2.5">
                        {cat.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="inline-block px-1.5 py-0.5 rounded text-[9.5px] font-medium bg-white/5 border border-white/10 text-slate-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── 5. EDUCATION (Clean Executive Layout, No White Box!) ── */}
            {cv.education && cv.education.length > 0 && (
              <div>
                <div className="flex items-center gap-2 pb-1.5 mb-2.5 border-b border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#df862b]" />
                  <h2 className="text-xs font-black tracking-widest uppercase text-white">
                    EDUCATION
                  </h2>
                </div>

                <div className="space-y-2 text-[10.5px]">
                  {cv.education.map((edu, idx) => (
                    <div key={idx} className="bg-white/5 rounded-lg p-2.5 border border-white/5">
                      <div className="font-bold text-white text-[11px] leading-tight">
                        {edu.institution}
                      </div>
                      <div className="text-slate-300 font-medium text-[10px] mt-0.5">
                        {edu.degree}
                      </div>
                      {(edu.location || edu.year) && (
                        <div className="text-slate-400 text-[9.5px] mt-1 flex items-center justify-between">
                          {edu.location && <span>{edu.location}</span>}
                          {edu.year && (
                            <span className="px-1.5 py-0.2 rounded bg-[#df862b]/20 text-[#df862b] font-semibold">
                              {edu.year}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── 6. SIDEBAR FOOTER NOTE ── */}
          <div className="relative z-10 pt-2.5 mt-auto border-t border-white/10 text-[9.5px] text-slate-400 flex items-center justify-between">
            <span>Verified Portfolio</span>
            <span className="text-[#df862b] font-semibold">{cv.website?.label}</span>
          </div>
        </aside>

        {/* ================= RIGHT MAIN COLUMN (Executive Crisp White: 62%) ================= */}
        <main
          className="md:col-span-7 print:col-span-7 p-5 sm:p-6 flex flex-col justify-between order-2 bg-white text-slate-800 h-full min-h-full"
          style={{ minHeight: '100%' }}
        >
          <div className="space-y-3.5">
            {/* ── 1. MAIN HEADER (Name, Title, Accent Line) — DESKTOP ONLY ── */}
            <div className="hidden md:block print:block border-b border-slate-100 pb-3">
              <div className="flex items-baseline justify-between gap-4">
                <h1 className="text-2xl sm:text-[32px] font-black tracking-tight text-slate-950 font-sans uppercase leading-none">
                  {cv.name}
                </h1>
                <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-amber-50 text-[#df862b] border border-amber-200/80">
                  CV / Resume
                </span>
              </div>

              <div className="mt-1.5 text-xs sm:text-[12px] font-bold tracking-wider uppercase text-[#df862b]">
                {cv.roleTitle}
              </div>

              {/* Refined gradient accent bar */}
              <div className="h-1 w-16 bg-gradient-to-r from-[#df862b] via-amber-400 to-amber-200 rounded-full mt-2" />
            </div>

            {/* ── 2. PROFESSIONAL SUMMARY ── */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-1.5 h-3.5 bg-[#df862b] rounded-full" />
                <h2 className="text-xs sm:text-[12.5px] font-black tracking-wider uppercase text-slate-900">
                  PROFESSIONAL SUMMARY
                </h2>
              </div>
              <p className="text-[10.5px] sm:text-[11px] leading-relaxed text-slate-700 text-justify">
                {cv.summary}
              </p>
            </div>

            {/* ── 3. PROFESSIONAL EXPERIENCE ── */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-3.5 bg-[#df862b] rounded-full" />
                <h2 className="text-xs sm:text-[12.5px] font-black tracking-wider uppercase text-slate-900">
                  PROFESSIONAL EXPERIENCE
                </h2>
              </div>

              <div className="space-y-2.5">
                {cv.experiences.map((exp, idx) => (
                  <div
                    key={idx}
                    className="relative pl-3 border-l-2 border-slate-200 hover:border-[#df862b] transition-colors"
                  >
                    {/* Glowing timeline node dot */}
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#df862b] ring-2 ring-white" />

                    {/* Company & Period */}
                    <div className="flex flex-wrap items-baseline justify-between gap-1 leading-snug">
                      <span className="text-xs sm:text-[12px] font-black text-slate-900">
                        {exp.company}
                      </span>
                      <span className="text-[9.5px] sm:text-[10px] font-semibold text-[#df862b] bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/60">
                        {exp.period}
                      </span>
                    </div>

                    {/* Role | Location */}
                    <div className="text-[10.5px] font-semibold text-slate-600 mb-0.5 flex items-center gap-1.5">
                      <span className="text-slate-800">{exp.role}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 font-normal">{exp.location}</span>
                    </div>

                    {/* Bullets */}
                    <ul className="space-y-0.5 list-none pl-0 mb-1">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li
                          key={bIdx}
                          className="flex items-start gap-1.5 text-[10px] sm:text-[10.5px] leading-relaxed text-slate-700"
                        >
                          <span className="shrink-0 font-bold text-[#df862b] select-none">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Technologies Tag Pills */}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="text-[9px] font-bold text-slate-400 mr-0.5">Stack:</span>
                        {exp.technologies.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="inline-block px-1.5 py-0.2 rounded text-[9px] font-medium bg-slate-50 border border-slate-200/80 text-slate-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── 4. HONORS & AWARDS ── */}
            {cv.awards && cv.awards.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-1.5 h-3.5 bg-[#df862b] rounded-full" />
                  <h2 className="text-xs sm:text-[12.5px] font-black tracking-wider uppercase text-slate-900">
                    HONORS & AWARDS
                  </h2>
                </div>

                <div className="space-y-1.5">
                  {cv.awards.map((award, aIdx) => (
                    <div
                      key={aIdx}
                      className="p-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-baseline gap-1.5 min-w-0 pr-2">
                        <span className="font-bold text-[10.5px] text-slate-900 truncate">
                          {award.title}
                        </span>
                        <span className="text-[9.5px] text-slate-500 truncate">
                          • {award.organization}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-[#df862b] shrink-0 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/60">
                        {award.year}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── 5. REFERENCES / VERIFICATION FOOTER ── */}
          <div className="pt-2.5 mt-auto border-t border-slate-100">
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span className="italic">
                References & architecture proofs available upon request.
              </span>
              <a
                href={cv.website?.url || 'https://peakdeth.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#df862b] hover:underline inline-flex items-center gap-1"
              >
                <span>Live Portfolio</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

