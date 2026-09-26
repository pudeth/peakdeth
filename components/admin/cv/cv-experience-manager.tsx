'use client'

import React, { useState } from 'react'
import { ExperienceItem } from '@/data/cv-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Briefcase, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  X, 
  Check, 
  Loader2, 
  MapPin, 
  Calendar, 
  Layers, 
  FileText, 
  Building2
} from 'lucide-react'
import { toast } from 'sonner'
import { WordDocumentEditor } from './word-document-editor'
import { TechStackInput } from './tech-stack-input'
import { PeriodPicker } from './period-picker'
import { LocationPicker } from './location-picker'

interface CVExperienceManagerProps {
  experiences: ExperienceItem[]
  onUpdate: (updated: ExperienceItem[]) => Promise<void>
  saving?: boolean
}

export function CVExperienceManager({
  experiences,
  onUpdate,
  saving = false,
}: CVExperienceManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    company: '',
    role: '',
    period: '',
    location: '',
    bullets: [''] as string[],
    bulletsText: '',
    technologiesText: '',
  })

  const resetForm = () => {
    setEditingId(null)
    setForm({
      company: '',
      role: '',
      period: '',
      location: '',
      bullets: [''],
      bulletsText: '',
      technologiesText: '',
    })
  }

  const handleStartEdit = (exp: ExperienceItem) => {
    setEditingId(exp.id)
    const cleanBullets = Array.isArray(exp.bullets) && exp.bullets.length > 0 ? exp.bullets : ['']
    setForm({
      company: exp.company,
      role: exp.role,
      period: exp.period,
      location: exp.location || '',
      bullets: cleanBullets,
      bulletsText: cleanBullets.join('\n'),
      technologiesText: (exp.technologies || []).join(', '),
    })
    window.scrollTo({ top: 350, behavior: 'smooth' })
  }

  const handleSave = async () => {
    if (!form.role.trim() || !form.company.trim()) {
      toast.error('Role and Company are required')
      return
    }

    const rawBullets = form.bullets && form.bullets.length > 0 && form.bullets.some(b => b.trim())
      ? form.bullets
      : form.bulletsText.split('\n')

    const bullets = rawBullets
      .map((b) => b.replace(/^[\s•\-\*]+/, '').trim())
      .filter(Boolean)

    const technologies = form.technologiesText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    if (editingId) {
      // Update existing
      const updated = experiences.map((exp) => {
        if (exp.id === editingId) {
          return {
            ...exp,
            company: form.company.trim(),
            role: form.role.trim(),
            period: form.period.trim() || 'Present',
            location: form.location.trim() || 'Phnom Penh, Cambodia',
            bullets: bullets.length > 0 ? bullets : ['Key contributor to systems development.'],
            technologies: technologies.length > 0 ? technologies : undefined,
          }
        }
        return exp
      })
      await onUpdate(updated)
      resetForm()
    } else {
      // Add new
      const newExp: ExperienceItem = {
        id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        company: form.company.trim(),
        role: form.role.trim(),
        period: form.period.trim() || 'Present',
        location: form.location.trim() || 'Phnom Penh, Cambodia',
        bullets: bullets.length > 0 ? bullets : ['Key contributor to systems development.'],
        technologies: technologies.length > 0 ? technologies : undefined,
      }
      await onUpdate([newExp, ...experiences])
      resetForm()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this experience?')) return
    const updated = experiences.filter((e) => e.id !== id)
    await onUpdate(updated)
    if (editingId === id) resetForm()
  }

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= experiences.length) return
    const updated = [...experiences]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp
    await onUpdate(updated)
  }

  return (
    <div className="space-y-8 font-sans">
      {/* ── Form Card ── */}
      <Card className="bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl relative">
        <div className="absolute top-0 right-0 w-80 h-32 bg-amber-500/5 blur-3xl pointer-events-none" />
        
        {/* Top Metallic Accent Glow Beam */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
        
        <CardHeader className="bg-gradient-to-r from-zinc-900/95 via-slate-900/70 to-zinc-950/90 border-b border-white/10 pb-5 px-6 pt-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              {/* Elevated 3D Glowing Icon Container */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/25 via-amber-500/15 to-transparent border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.2)] shrink-0 transition-transform duration-200 hover:scale-105">
                <Briefcase className="w-5 h-5 drop-shadow-[0_2px_4px_rgba(245,158,11,0.5)]" />
              </div>

              {/* Title & Metadata */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400/90 uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                    CV STUDIO • CAREER TIMELINE
                  </span>
                  {editingId && (
                    <span className="text-[10px] font-mono bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-semibold">
                      Editing Active Role
                    </span>
                  )}
                </div>

                <CardTitle className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <span>{editingId ? 'Edit Professional Experience' : 'Add Professional Experience'}</span>
                </CardTitle>

                <CardDescription className="text-xs text-zinc-400 leading-relaxed max-w-xl">
                  {editingId
                    ? 'Updating existing career milestone. Changes will immediately sync to your online CV and printable document.'
                    : 'Document your software engineering leadership, system architecture milestones, and technical achievements.'}
                </CardDescription>
              </div>
            </div>

            {/* Right Side Status & Cancel Button */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span>Live CV Sync</span>
              </div>

              {editingId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetForm}
                  className="h-8 text-xs text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border-white/10 rounded-xl transition-all"
                >
                  <X className="w-3.5 h-3.5 mr-1 text-red-400" />
                  Cancel Edit
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-5">
          {/* Row 1: Role & Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="exp-role" className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                Job Title / Role <span className="text-red-400">*</span>
              </Label>
              <Input
                id="exp-role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g. Senior Full-Stack Engineer & Systems Architect"
                className="bg-zinc-950/80 border-white/10 text-white placeholder:text-zinc-600 rounded-xl focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all h-10 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="exp-company" className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-purple-400" />
                Company / Organization <span className="text-red-400">*</span>
              </Label>
              <Input
                id="exp-company"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="e.g. Peak Deth Solutions / Tech Enterprise"
                className="bg-zinc-950/80 border-white/10 text-white placeholder:text-zinc-600 rounded-xl focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all h-10 text-xs"
              />
            </div>
          </div>

          {/* Row 2: Period & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="exp-period" className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  Period / Timeline
                </Label>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Select or type date
                </span>
              </div>
              <PeriodPicker
                value={form.period}
                onChange={(val) => setForm({ ...form, period: val })}
                placeholder="e.g. 2022 — Present or Oct 2023 — Present"
                accentColor="amber"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="exp-location" className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  Location
                </Label>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Select city or remote
                </span>
              </div>
              <LocationPicker
                value={form.location}
                onChange={(val) => setForm({ ...form, location: val })}
                placeholder="e.g. Phnom Penh, Cambodia (or Remote)"
                accentColor="emerald"
              />
            </div>
          </div>

          {/* Row 3: Word Document Style Milestones Editor */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-zinc-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                Key Responsibilities & Achievements
              </Label>
              <span className="text-[11px] text-zinc-500">
                Word style • Press <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/10 rounded font-mono text-[10px] text-zinc-300">Enter</kbd> to add new lines
              </span>
            </div>

            <WordDocumentEditor
              bullets={form.bullets}
              onChange={(updatedBullets) => {
                setForm({
                  ...form,
                  bullets: updatedBullets,
                  bulletsText: updatedBullets.join('\n'),
                })
              }}
              placeholder="e.g. Architected and deployed bespoke enterprise software systems..."
            />
          </div>

          {/* Row 4: Technologies / Stack */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="exp-tech" className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                Technologies & Tools Applied
              </Label>
              <span className="text-[11px] text-zinc-500">
                Press Enter or Comma to add tag
              </span>
            </div>

            <TechStackInput
              value={form.technologiesText}
              onChange={(updatedText) => setForm({ ...form, technologiesText: updatedText })}
              placeholder="Type tech (e.g. Next.js, Docker) and press Enter..."
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 flex items-center gap-3 border-t border-white/5">
            <Button
              onClick={handleSave}
              disabled={saving || !form.role.trim() || !form.company.trim()}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 px-6 h-10 text-xs transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving Milestone...
                </>
              ) : editingId ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Update Milestone
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Career Timeline
                </>
              )}
            </Button>

            {editingId && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetForm}
                className="h-10 text-xs border-white/10 text-zinc-300 rounded-xl hover:text-white hover:bg-white/5"
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── List of Existing Experiences ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <h3 className="text-sm font-bold text-white tracking-wide">
              Career Milestones on CV
            </h3>
            <Badge variant="outline" className="bg-amber-400/10 border-amber-400/25 text-amber-300 text-[10px] font-mono px-2 py-0.5">
              {experiences.length} {experiences.length === 1 ? 'Milestone' : 'Milestones'}
            </Badge>
          </div>
          <span className="text-[11px] text-zinc-500 hidden sm:inline">
            Top item appears first on printed CV & Portfolio
          </span>
        </div>

        {experiences.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-zinc-900/30 border border-dashed border-white/10 text-zinc-500 text-xs space-y-2">
            <Briefcase className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-zinc-400 font-medium">No professional milestones recorded yet</p>
            <p className="text-zinc-600 text-[11px]">Fill out the form above to document your career history.</p>
          </div>
        ) : (
          <div className="grid gap-3.5">
            {experiences.map((exp, idx) => {
              const isBeingEdited = editingId === exp.id
              return (
                <div
                  key={exp.id || idx}
                  className={`border transition-all duration-200 rounded-2xl overflow-hidden p-5 space-y-3.5 relative ${
                    isBeingEdited
                      ? 'bg-gradient-to-r from-amber-500/10 via-zinc-900/90 to-zinc-900 border-amber-500/50 ring-1 ring-amber-500/40 shadow-xl'
                      : 'bg-zinc-900/60 hover:bg-zinc-900/90 border-white/10 hover:border-white/20 shadow-md'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono text-[10px] text-zinc-400">
                          #{idx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-white tracking-wide">
                          {exp.role}
                        </h4>
                        <span className="text-zinc-500 text-xs">at</span>
                        <span className="text-xs font-semibold text-amber-400">
                          {exp.company}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-zinc-400 pt-0.5">
                        <span className="inline-flex items-center gap-1 font-mono text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                          <Calendar className="w-3 h-3 text-amber-400" />
                          {exp.period}
                        </span>
                        {exp.location && (
                          <span className="inline-flex items-center gap-1 text-zinc-400">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            {exp.location}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto bg-black/30 p-1 rounded-xl border border-white/5">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={idx === 0 || saving}
                        onClick={() => handleMove(idx, 'up')}
                        className="h-7 w-7 p-0 text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-20 rounded-lg"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={idx === experiences.length - 1 || saving}
                        onClick={() => handleMove(idx, 'down')}
                        className="h-7 w-7 p-0 text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-20 rounded-lg"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartEdit(exp)}
                        className="h-7 px-2.5 text-xs text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg"
                      >
                        <Edit3 className="w-3 h-3 mr-1 text-amber-400" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(exp.id)}
                        className="h-7 w-7 p-0 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Bullets List */}
                  {exp.bullets && exp.bullets.length > 0 && (
                    <div className="space-y-1.5 pl-1 pt-1">
                      {exp.bullets.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 mt-1.5 shrink-0 shadow-sm" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tech Pills */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/5">
                      <span className="text-[10px] font-mono text-zinc-500">Tech:</span>
                      {exp.technologies.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-medium bg-white/5 border border-white/10 text-zinc-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
