'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { ArrowRight, Sparkles, CheckCircle2, MessageSquare, Terminal } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'

export function CtaSection() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/80 via-zinc-950 to-black p-8 sm:p-12 md:p-16 shadow-2xl backdrop-blur-xl">
      {/* Ambient background glow effects */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-wide"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>START A CONVERSATION</span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase leading-tight"
        >
          {t.cta.headline}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base md:text-lg text-zinc-300 font-light leading-relaxed max-w-2xl mx-auto"
        >
          {t.cta.sub}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <Link
            href="/contact"
            className="px-7 py-3.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold text-sm transition-all duration-300 flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t.cta.contactBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#services"
            className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm border border-white/10 hover:border-white/25 transition-all duration-300 flex items-center gap-2"
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>{t.cta.demosBtn}</span>
          </a>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400"
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Full-Stack &amp; Scalable Architecture</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Direct Client Collaboration</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Production Deployment Ready</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
