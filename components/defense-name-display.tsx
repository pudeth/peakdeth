'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion } from 'motion/react'

interface DefenseNameDisplayProps {
  name: string
  className?: string
}

export function DefenseNameDisplay({
  name = 'PEAK DETH',
  className = '',
}: DefenseNameDisplayProps) {
  const targetName = name.trim() || 'PEAK DETH'
  const isKhmer = /[\u1780-\u17FF]/.test(targetName)

  // Segment graphemes cleanly so Khmer vowels and subscript consonants stay unified
  const segmentGraphemes = useCallback(
    (str: string): string[] => {
      if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
        try {
          const segmenter = new (Intl as any).Segmenter(isKhmer ? 'km' : 'en', {
            granularity: 'grapheme',
          })
          return Array.from(segmenter.segment(str)).map((s: any) => s.segment)
        } catch {}
      }
      return str.split('')
    },
    [isKhmer]
  )

  const words = useMemo(() => {
    return targetName.split(' ').map((word) => ({
      raw: word,
      chars: segmentGraphemes(word),
    }))
  }, [targetName, segmentGraphemes])

  const [animKey, setAnimKey] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const handleTrigger = () => {
    setAnimKey((prev) => prev + 1)
  }

  let globalIndex = 0

  return (
    <div
      onClick={handleTrigger}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative inline-flex flex-col items-center justify-center select-none cursor-pointer group/hero-title max-w-full ${className}`}
      title="Click to trigger transition"
    >
      {/* 1. Dynamic Ambient Aura Glow */}
      <div className="absolute -inset-x-8 -inset-y-4 pointer-events-none -z-10 flex items-center justify-center">
        <motion.div
          animate={{
            scale: isHovered ? 1.2 : [1, 1.1, 1],
            opacity: isHovered ? 0.7 : [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: isHovered ? 0.3 : 5,
            repeat: isHovered ? 0 : Infinity,
            ease: 'easeInOut',
          }}
          className="w-full max-w-[580px] h-28 bg-radial from-emerald-500/25 via-teal-500/10 to-transparent blur-3xl"
        />
        <div className="absolute w-40 h-20 bg-cyan-400/15 blur-2xl rounded-full" />
      </div>

      {/* 2. Main High-Fashion Kinetic Typography */}
      <h1
        key={`${targetName}-${animKey}`}
        className={`relative z-10 flex flex-wrap items-center justify-center text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-tight text-white drop-shadow-[0_15px_35px_rgba(0,0,0,0.95)] ${
          isKhmer ? 'tracking-normal font-bold' : 'font-black tracking-tight sm:tracking-[0.03em]'
        }`}
        style={{
          fontFamily: '"Kantumruy Pro", system-ui, -apple-system, sans-serif',
        }}
      >
        {words.map((wordObj, wIdx) => (
          <span
            key={`w-${wIdx}-${targetName}`}
            className="inline-flex items-center whitespace-nowrap mx-1.5 sm:mx-3 md:mx-4"
          >
            {wordObj.chars.map((char, cIdx) => {
              const charIndex = globalIndex++
              const delay = charIndex * 0.04

              return (
                <motion.span
                  key={`c-${wIdx}-${cIdx}-${targetName}`}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.65,
                    delay,
                    ease: [0.16, 1, 0.3, 1], // Smooth Apple-grade spring curve
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.08,
                    color: '#34d399',
                    textShadow: '0 0 24px rgba(52, 211, 153, 0.8)',
                    transition: { type: 'spring', stiffness: 450, damping: 15 },
                  }}
                  className="relative inline-block text-white transition-colors duration-200"
                >
                  {char}
                </motion.span>
              )
            })}
          </span>
        ))}
      </h1>

      {/* 3. Subtle Underline Light Accent (Modern Minimalist Studio Beam) */}
      <div className="relative mt-2 sm:mt-3 flex items-center justify-center w-full max-w-[240px] sm:max-w-[320px]">
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent shadow-[0_0_12px_rgba(52,211,153,0.7)]"
        />
        <motion.div
          animate={{
            x: [-70, 70, -70],
            opacity: [0.3, 0.9, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-10 h-[2px] bg-white rounded-full blur-[1px]"
        />
      </div>
    </div>
  )
}
