'use client'

import React, { useState } from 'react'
import { AwardItem } from '@/data/cv-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Award, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  X, 
  Check, 
  Loader2,
  Calendar,
  Building2
} from 'lucide-react'
import { toast } from 'sonner'

interface CVAwardsManagerProps {
  awards: AwardItem[]
  onUpdate: (updated: AwardItem[]) => Promise<void>
  saving?: boolean
}

export function CVAwardsManager({
  awards,
  onUpdate,
  saving = false,
}: CVAwardsManagerProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [form, setForm] = useState<AwardItem>({
    title: '',
    organization: '',
    year: '',
  })

  const resetForm = () => {
    setEditingIndex(null)
    setForm({
      title: '',
      organization: '',
      year: '',
    })
  }

  const handleStartEdit = (index: number, award: AwardItem) => {
    setEditingIndex(index)
    setForm({
      title: award.title,
      organization: award.organization,
      year: award.year,
    })
    window.scrollTo({ top: 350, behavior: 'smooth' })
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.organization.trim()) {
      toast.error('Award Title and Organization are required')
      return
    }

    const cleanItem: AwardItem = {
      title: form.title.trim(),
      organization: form.organization.trim(),
      year: form.year?.trim() || String(new Date().getFullYear()),
    }

    if (editingIndex !== null) {
      const updated = [...awards]
      updated[editingIndex] = cleanItem
      await onUpdate(updated)
      resetForm()
    } else {
      await onUpdate([cleanItem, ...awards])
      resetForm()
    }
  }

  const handleDelete = async (index: number) => {
    if (!confirm('Are you sure you want to remove this award?')) return
    const updated = awards.filter((_, idx) => idx !== index)
    await onUpdate(updated)
    if (editingIndex === index) resetForm()
  }

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= awards.length) return
    const updated = [...awards]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp
    await onUpdate(updated)
  }

  return (
    <div className="space-y-6">
      {/* ── Form Card ── */}
      <Card className="bg-zinc-900/60 border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <CardHeader className="bg-gradient-to-r from-amber-950/20 to-zinc-900/40 border-b border-white/5 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-white">
                  {editingIndex !== null ? 'Edit Honor or Award' : 'Add Honor or Award'}
                </CardTitle>
                <CardDescription className="text-xs text-zinc-400">
                  Showcase professional recognition, certifications, or software competitions on your CV.
                </CardDescription>
              </div>
            </div>
            {editingIndex !== null && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetForm}
                className="h-8 text-xs text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Cancel Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5 md:col-span-1">
              <Label htmlFor="award-title" className="text-xs text-zinc-300">
                Award / Honor Title <span className="text-red-400">*</span>
              </Label>
              <Input
                id="award-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Excellence in Enterprise System Architecture"
                className="bg-zinc-950/70 border-white/10 text-white placeholder:text-zinc-600 rounded-xl"
              />
            </div>

            <div className="space-y-1.5 md:col-span-1">
              <Label htmlFor="award-org" className="text-xs text-zinc-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                Issuing Organization <span className="text-red-400">*</span>
              </Label>
              <Input
                id="award-org"
                value={form.organization}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                placeholder="e.g. Tech Innovations Summit"
                className="bg-zinc-950/70 border-white/10 text-white placeholder:text-zinc-600 rounded-xl"
              />
            </div>

            <div className="space-y-1.5 md:col-span-1">
              <Label htmlFor="award-year" className="text-xs text-zinc-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Year
              </Label>
              <Input
                id="award-year"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                placeholder="e.g. 2025"
                className="bg-zinc-950/70 border-white/10 text-white placeholder:text-zinc-600 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <Button
              onClick={handleSave}
              disabled={saving || !form.title.trim() || !form.organization.trim()}
              className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-lg px-5 h-9 text-xs font-semibold"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : editingIndex !== null ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-2" />
                  Update Award
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 mr-2" />
                  Add Award
                </>
              )}
            </Button>
            {editingIndex !== null && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetForm}
                className="h-9 text-xs border-white/10 text-zinc-300 rounded-xl hover:text-white"
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── List of Existing Awards ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span>Honors & Awards on CV</span>
            <Badge variant="outline" className="bg-white/5 border-white/10 text-zinc-400 text-[10px]">
              {awards.length} {awards.length === 1 ? 'item' : 'items'}
            </Badge>
          </h3>
          <span className="text-[11px] text-zinc-500">
            Rendered in the Honors & Awards section of CV
          </span>
        </div>

        {awards.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-zinc-900/30 border border-white/5 text-zinc-500 text-xs">
            No awards added yet. Add your honors above!
          </div>
        ) : (
          <div className="grid gap-3">
            {awards.map((award, idx) => {
              const isBeingEdited = editingIndex === idx
              return (
                <Card
                  key={idx}
                  className={`border transition-all duration-200 rounded-2xl overflow-hidden ${
                    isBeingEdited
                      ? 'bg-amber-950/20 border-amber-500/40 ring-1 ring-amber-500/30'
                      : 'bg-zinc-900/50 border-white/10 hover:border-white/20'
                  }`}
                >
                  <CardContent className="p-4 sm:p-5 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-wide">
                        {award.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mt-1">
                        <span className="text-zinc-300 font-medium">{award.organization}</span>
                        <span className="text-zinc-600">•</span>
                        <span className="inline-flex items-center gap-1 font-mono text-amber-400/90 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20 text-[10.5px]">
                          <Calendar className="w-3 h-3" />
                          {award.year}
                        </span>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={idx === 0 || saving}
                        onClick={() => handleMove(idx, 'up')}
                        className="h-7 w-7 p-0 text-zinc-400 hover:text-white"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={idx === awards.length - 1 || saving}
                        onClick={() => handleMove(idx, 'down')}
                        className="h-7 w-7 p-0 text-zinc-400 hover:text-white"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartEdit(idx, award)}
                        className="h-7 px-2.5 text-xs border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg"
                      >
                        <Edit3 className="w-3 h-3 mr-1 text-amber-400" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(idx)}
                        className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
