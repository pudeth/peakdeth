'use client'

import React, { useState } from 'react'
import { SkillCategory } from '@/data/cv-data'
import { AboutSkill } from '@/types/database'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Code2, 
  Plus, 
  Trash2, 
  X, 
  Sparkles, 
  Layers, 
  Check, 
  FolderPlus,
  Loader2,
  Tag
} from 'lucide-react'
import { toast } from 'sonner'

interface CVSkillsManagerProps {
  coreCompetencies: string[]
  technicalExpertise: SkillCategory[]
  aboutSkills: AboutSkill[]
  onUpdateCompetencies: (updated: string[]) => Promise<void>
  onUpdateExpertise: (updated: SkillCategory[]) => Promise<void>
  onAddAboutSkill?: (name: string, icon?: string) => Promise<void>
  onDeleteAboutSkill?: (id: string) => Promise<void>
  saving?: boolean
}

export function CVSkillsManager({
  coreCompetencies,
  technicalExpertise,
  aboutSkills,
  onUpdateCompetencies,
  onUpdateExpertise,
  onAddAboutSkill,
  onDeleteAboutSkill,
  saving = false,
}: CVSkillsManagerProps) {
  // Core competencies input state
  const [newCompetency, setNewCompetency] = useState('')

  // Technical expertise state
  const [newCategoryName, setNewCategoryName] = useState('')
  const [skillInputs, setSkillInputs] = useState<Record<number, string>>({})

  // About skill state
  const [newAboutSkillName, setNewAboutSkillName] = useState('')
  const [newAboutSkillIcon, setNewAboutSkillIcon] = useState('⚡')

  // Core Competency Handlers
  const handleAddCompetency = async () => {
    if (!newCompetency.trim()) return
    const trimmed = newCompetency.trim()
    if (coreCompetencies.includes(trimmed)) {
      toast.error('Competency already exists')
      return
    }
    const updated = [...coreCompetencies, trimmed]
    await onUpdateCompetencies(updated)
    setNewCompetency('')
  }

  const handleRemoveCompetency = async (index: number) => {
    const updated = coreCompetencies.filter((_, idx) => idx !== index)
    await onUpdateCompetencies(updated)
  }

  // Technical Expertise Handlers
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name is required')
      return
    }
    const updated = [...technicalExpertise, { category: newCategoryName.trim(), skills: [] }]
    await onUpdateExpertise(updated)
    setNewCategoryName('')
  }

  const handleRemoveCategory = async (catIndex: number) => {
    if (!confirm('Are you sure you want to remove this skill category?')) return
    const updated = technicalExpertise.filter((_, idx) => idx !== catIndex)
    await onUpdateExpertise(updated)
  }

  const handleAddSkillToCategory = async (catIndex: number) => {
    const text = skillInputs[catIndex]?.trim()
    if (!text) return
    const targetCat = technicalExpertise[catIndex]
    if (targetCat.skills.includes(text)) {
      toast.error('Skill already exists in this category')
      return
    }
    const updated = [...technicalExpertise]
    updated[catIndex] = {
      ...targetCat,
      skills: [...targetCat.skills, text],
    }
    await onUpdateExpertise(updated)
    setSkillInputs({ ...skillInputs, [catIndex]: '' })
  }

  const handleRemoveSkillFromCategory = async (catIndex: number, skillIndex: number) => {
    const targetCat = technicalExpertise[catIndex]
    const updated = [...technicalExpertise]
    updated[catIndex] = {
      ...targetCat,
      skills: targetCat.skills.filter((_, idx) => idx !== skillIndex),
    }
    await onUpdateExpertise(updated)
  }

  // About Skills Handlers
  const handleAddAboutSkill = async () => {
    if (!newAboutSkillName.trim()) return
    if (onAddAboutSkill) {
      await onAddAboutSkill(newAboutSkillName.trim(), newAboutSkillIcon.trim() || '⚡')
      setNewAboutSkillName('')
    }
  }

  return (
    <div className="space-y-8">
      {/* ── SECTION 1: Core Competencies (CV Sidebar) ── */}
      <Card className="bg-zinc-900/60 border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <CardHeader className="bg-gradient-to-r from-amber-950/20 to-zinc-900/40 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-white">
                1. Core Competencies (CV Left Sidebar)
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Key strategic strengths rendered as high-priority bullet points on the dark left column of your CV.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Add input */}
          <div className="flex gap-2">
            <Input
              value={newCompetency}
              onChange={(e) => setNewCompetency(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddCompetency()
                }
              }}
              placeholder="e.g. POS & Billing Systems, Real-Time Cloud Databases..."
              className="bg-zinc-950/70 border-white/10 text-white placeholder:text-zinc-600 rounded-xl"
            />
            <Button
              onClick={handleAddCompetency}
              disabled={saving || !newCompetency.trim()}
              className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl px-4 text-xs shrink-0"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Competency
            </Button>
          </div>

          {/* Badges List */}
          <div className="p-4 rounded-xl bg-zinc-950/50 border border-white/5">
            {coreCompetencies.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-2">
                No core competencies defined. Type above and press Enter.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {coreCompetencies.map((comp, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 border-amber-500/30 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 group transition-all"
                  >
                    <span>{comp}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCompetency(idx)}
                      disabled={saving}
                      className="text-amber-400/60 hover:text-red-400 transition-colors p-0.5"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── SECTION 2: Technical Expertise (Categorized Skill Pills) ── */}
      <Card className="bg-zinc-900/60 border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-950/20 to-zinc-900/40 border-b border-white/5 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-white">
                  2. Technical Expertise (Categorized Skill Badges)
                </CardTitle>
                <CardDescription className="text-xs text-zinc-400">
                  Organized technical domains (Web, Enterprise, Cloud, Design) displayed as pills on your CV.
                </CardDescription>
              </div>
            </div>

            {/* Add Category Trigger */}
            <div className="flex items-center gap-2">
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddCategory()
                  }
                }}
                placeholder="New Category Name..."
                className="h-8 text-xs bg-zinc-950/70 border-white/10 text-white rounded-lg w-44"
              />
              <Button
                size="sm"
                onClick={handleAddCategory}
                disabled={saving || !newCategoryName.trim()}
                className="h-8 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-3 shrink-0"
              >
                <FolderPlus className="w-3.5 h-3.5 mr-1" />
                Add Category
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {technicalExpertise.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-zinc-900/30 border border-white/5 text-zinc-500 text-xs">
              No categories defined. Add your first category using the input above!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {technicalExpertise.map((cat, catIdx) => (
                <div
                  key={catIdx}
                  className="p-4 rounded-xl bg-zinc-950/60 border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      {cat.category}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCategory(catIdx)}
                      className="h-6 w-6 p-0 text-zinc-500 hover:text-red-400"
                      title="Remove Category"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Skills Pills */}
                  <div className="flex flex-wrap gap-1.5 min-h-[40px] items-center">
                    {cat.skills.length === 0 ? (
                      <span className="text-[11px] text-zinc-600 italic">No skills added yet</span>
                    ) : (
                      cat.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-zinc-200 group"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkillFromCategory(catIdx, sIdx)}
                            className="text-zinc-500 hover:text-red-400 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  {/* Add skill input */}
                  <div className="flex gap-1.5 pt-1">
                    <Input
                      value={skillInputs[catIdx] || ''}
                      onChange={(e) =>
                        setSkillInputs({ ...skillInputs, [catIdx]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddSkillToCategory(catIdx)
                        }
                      }}
                      placeholder="+ Add skill (e.g. Next.js)..."
                      className="h-7 text-xs bg-zinc-900 border-white/10 text-white rounded-lg"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddSkillToCategory(catIdx)}
                      disabled={saving || !skillInputs[catIdx]?.trim()}
                      className="h-7 text-xs bg-white/10 hover:bg-white/20 text-white rounded-lg px-2.5"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── SECTION 3: About Page Skills (With Icons) ── */}
      {onAddAboutSkill && (
        <Card className="bg-zinc-900/60 border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-950/20 to-zinc-900/40 border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-white">
                  3. About Page Featured Skills (With Icons)
                </CardTitle>
                <CardDescription className="text-xs text-zinc-400">
                  Featured skills highlighted with icons on your public /about website page.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* Add About Skill */}
            <div className="flex gap-2">
              <Input
                value={newAboutSkillIcon}
                onChange={(e) => setNewAboutSkillIcon(e.target.value)}
                placeholder="Icon"
                className="w-16 text-center bg-zinc-950/70 border-white/10 text-white rounded-xl text-sm"
              />
              <Input
                value={newAboutSkillName}
                onChange={(e) => setNewAboutSkillName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddAboutSkill()
                  }
                }}
                placeholder="e.g. POS & Billing Systems"
                className="bg-zinc-950/70 border-white/10 text-white placeholder:text-zinc-600 rounded-xl"
              />
              <Button
                onClick={handleAddAboutSkill}
                disabled={saving || !newAboutSkillName.trim()}
                className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl px-4 text-xs shrink-0"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Skill
              </Button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {aboutSkills.map((s) => (
                <div
                  key={s.id}
                  className="p-3 rounded-xl bg-zinc-950/60 border border-white/10 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-base">{s.icon || '⚡'}</span>
                    <span className="text-xs font-medium text-white truncate">{s.name}</span>
                  </div>
                  {onDeleteAboutSkill && (
                    <button
                      type="button"
                      onClick={() => onDeleteAboutSkill(s.id)}
                      className="text-zinc-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
