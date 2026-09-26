'use client'

import React, { useState } from 'react'
import { EducationItem } from '@/data/cv-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  X, 
  Check, 
  Loader2,
  Calendar,
  MapPin,
  Award,
  Building2
} from 'lucide-react'
import { toast } from 'sonner'
import { PeriodPicker } from './period-picker'
import { LocationPicker } from './location-picker'
import { InstitutionPicker } from './institution-picker'

interface CVEducationManagerProps {
  education: EducationItem[]
  onUpdate: (updated: EducationItem[]) => Promise<void>
  saving?: boolean
}

export function CVEducationManager({
  education,
  onUpdate,
  saving = false,
}: CVEducationManagerProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [form, setForm] = useState<EducationItem>({
    institution: '',
    degree: '',
    location: '',
    year: '',
  })

  const resetForm = () => {
    setEditingIndex(null)
    setForm({
      institution: '',
      degree: '',
      location: '',
      year: '',
    })
  }

  const handleStartEdit = (index: number, edu: EducationItem) => {
    setEditingIndex(index)
    setForm({
      institution: edu.institution,
      degree: edu.degree,
      location: edu.location || '',
      year: edu.year || '',
    })
    window.scrollTo({ top: 350, behavior: 'smooth' })
  }

  const handleSave = async () => {
    if (!form.institution.trim() || !form.degree.trim()) {
      toast.error('Institution and Degree are required')
      return
    }

    const cleanItem: EducationItem = {
      institution: form.institution.trim(),
      degree: form.degree.trim(),
      location: form.location?.trim() || undefined,
      year: form.year?.trim() || undefined,
    }

    if (editingIndex !== null) {
      const updated = [...education]
      updated[editingIndex] = cleanItem
      await onUpdate(updated)
      resetForm()
    } else {
      await onUpdate([cleanItem, ...education])
      resetForm()
    }
  }

  const handleDelete = async (index: number) => {
    if (!confirm('Are you sure you want to remove this education entry?')) return
    const updated = education.filter((_, idx) => idx !== index)
    await onUpdate(updated)
    if (editingIndex === index) resetForm()
  }

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= education.length) return
    const updated = [...education]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp
    await onUpdate(updated)
  }

  return (
    <div className="space-y-8 font-sans">
      {/* ── Form Card ── */}
      <Card className="bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl relative">
        <div className="absolute top-0 right-0 w-80 h-32 bg-blue-500/5 blur-3xl pointer-events-none" />

        {/* Top Metallic Accent Glow Beam */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
        
        <CardHeader className="bg-gradient-to-r from-zinc-900/95 via-slate-900/70 to-zinc-950/90 border-b border-white/10 pb-5 px-6 pt-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              {/* Elevated 3D Glowing Icon Container */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/25 via-indigo-500/15 to-transparent border border-blue-400/40 flex items-center justify-center text-blue-400 shadow-[0_0_24px_rgba(59,130,246,0.2)] shrink-0 transition-transform duration-200 hover:scale-105">
                <GraduationCap className="w-6 h-6 drop-shadow-[0_2px_4px_rgba(59,130,246,0.5)]" />
              </div>

              {/* Title & Metadata */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-blue-400/90 uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
                    CV STUDIO • ACADEMIC & CERTIFICATIONS
                  </span>
                  {editingIndex !== null && (
                    <span className="text-[10px] font-mono bg-blue-400/20 text-blue-300 border border-blue-400/40 px-2 py-0.5 rounded-full font-semibold">
                      Editing Entry #{editingIndex + 1}
                    </span>
                  )}
                </div>

                <CardTitle className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <span>{editingIndex !== null ? 'Edit Education & Qualifications' : 'Add Education & Certifications'}</span>
                </CardTitle>

                <CardDescription className="text-xs text-zinc-400 leading-relaxed max-w-xl">
                  {editingIndex !== null
                    ? 'Updating existing academic degree or certification. Changes will synchronize with your online and printable CV.'
                    : 'Manage degrees, university diplomas, and technical certifications displayed on your CV.'}
                </CardDescription>
              </div>
            </div>

            {/* Right Side Status & Cancel Button */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span>Live CV Sync</span>
              </div>

              {editingIndex !== null && (
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
          {/* Row 1: Institution & Degree */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="edu-inst" className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  Institution / School / University <span className="text-red-400">*</span>
                </Label>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Select university or type
                </span>
              </div>
              <InstitutionPicker
                value={form.institution}
                onChange={(val) => setForm({ ...form, institution: val })}
                placeholder="e.g. Royal University of Phnom Penh / Faculty of Science"
                accentColor="blue"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="edu-degree" className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-indigo-400" />
                  Degree / Qualification <span className="text-red-400">*</span>
                </Label>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Type or pick level
                </span>
              </div>
              <Input
                id="edu-degree"
                value={form.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
                placeholder="e.g. Primary School Certificate or Bachelor's in CS"
                className="bg-zinc-950/80 border-white/10 text-white placeholder:text-zinc-600 rounded-xl focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all h-10 text-xs"
              />
              {/* Quick Degree Level Presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[10px] text-zinc-600 font-mono flex items-center gap-1">
                  <Award className="w-2.5 h-2.5" /> Level:
                </span>
                {[
                  { label: 'Primary (បឋម)', val: 'Primary School Certificate (វិញ្ញាបនបត្របឋមសិក្សា)' },
                  { label: 'Bac II (បាក់ឌុប)', val: 'High School Diploma (Bac II / បាក់ឌុប)' },
                  { label: 'Bachelor (បរិញ្ញាបត្រ)', val: "Bachelor's Degree in Computer Science" },
                  { label: 'Associate (បរិញ្ញាបត្ររង)', val: 'Associate Degree in Information Technology' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setForm({ ...form, degree: item.val })}
                    className={`text-[10px] px-2 py-0.5 rounded-md border transition-all ${
                      form.degree === item.val
                        ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 font-semibold'
                        : 'bg-zinc-900/60 hover:bg-zinc-800 border-white/5 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Year & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="edu-year" className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  Year / Period
                </Label>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Select or type date
                </span>
              </div>
              <PeriodPicker
                value={form.year || ''}
                onChange={(val) => setForm({ ...form, year: val })}
                placeholder="e.g. 2020 — 2024"
                accentColor="blue"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="edu-location" className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  Location
                </Label>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Select city or remote
                </span>
              </div>
              <LocationPicker
                value={form.location || ''}
                onChange={(val) => setForm({ ...form, location: val })}
                placeholder="e.g. Phnom Penh, Cambodia"
                accentColor="emerald"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 flex items-center gap-3 border-t border-white/5">
            <Button
              onClick={handleSave}
              disabled={saving || !form.institution.trim() || !form.degree.trim()}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 px-6 h-10 text-xs transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving Education...
                </>
              ) : editingIndex !== null ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Update Education
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add to CV Education
                </>
              )}
            </Button>

            {editingIndex !== null && (
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

      {/* ── List of Existing Education ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <h3 className="text-sm font-bold text-white tracking-wide">
              Education on CV
            </h3>
            <Badge variant="outline" className="bg-blue-400/10 border-blue-400/25 text-blue-300 text-[10px] font-mono px-2 py-0.5">
              {education.length} {education.length === 1 ? 'Entry' : 'Entries'}
            </Badge>
          </div>
          <span className="text-[11px] text-zinc-500 hidden sm:inline">
            Rendered directly on your printed CV & Portfolio left column
          </span>
        </div>

        {education.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-zinc-900/30 border border-dashed border-white/10 text-zinc-500 text-xs space-y-2">
            <GraduationCap className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-zinc-400 font-medium">No education entries added yet</p>
            <p className="text-zinc-600 text-[11px]">Fill out the form above to add your university degree or professional certifications.</p>
          </div>
        ) : (
          <div className="grid gap-3.5">
            {education.map((edu, idx) => {
              const isBeingEdited = editingIndex === idx
              return (
                <div
                  key={idx}
                  className={`border transition-all duration-200 rounded-2xl overflow-hidden p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative ${
                    isBeingEdited
                      ? 'bg-gradient-to-r from-blue-500/10 via-zinc-900/90 to-zinc-900 border-blue-500/50 ring-1 ring-blue-500/40 shadow-xl'
                      : 'bg-zinc-900/60 hover:bg-zinc-900/90 border-white/10 hover:border-white/20 shadow-md'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono text-[10px] text-zinc-400">
                        #{idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-white tracking-wide">
                        {edu.institution}
                      </h4>
                    </div>

                    <p className="text-xs text-blue-400 font-semibold pl-8">
                      {edu.degree}
                    </p>

                    <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-zinc-400 pl-8 pt-1">
                      {edu.year && (
                        <span className="inline-flex items-center gap-1 font-mono text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                          <Calendar className="w-3 h-3 text-amber-400" />
                          {edu.year}
                        </span>
                      )}
                      {edu.location && (
                        <span className="inline-flex items-center gap-1 text-zinc-400">
                          <MapPin className="w-3 h-3 text-emerald-400" />
                          {edu.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-1 shrink-0 self-end sm:self-center bg-black/30 p-1 rounded-xl border border-white/5">
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
                      disabled={idx === education.length - 1 || saving}
                      onClick={() => handleMove(idx, 'down')}
                      className="h-7 w-7 p-0 text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-20 rounded-lg"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStartEdit(idx, edu)}
                      className="h-7 px-2.5 text-xs text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg"
                    >
                      <Edit3 className="w-3 h-3 mr-1 text-blue-400" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(idx)}
                      className="h-7 w-7 p-0 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
