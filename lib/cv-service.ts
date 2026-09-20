import { createClient } from '@/lib/supabase/server'
import { getAboutContent, getContactContent } from '@/lib/site-content'
import { cvData, CVData, ExperienceItem, AwardItem } from '@/data/cv-data'

export async function getDynamicCVData(): Promise<CVData> {
  try {
    // 1. Fetch About content
    let about: any = null
    try {
      about = await getAboutContent()
    } catch {
      // fallback
    }

    // 2. Fetch Contacts content
    let contacts: any[] = []
    try {
      contacts = await getContactContent()
    } catch {
      // fallback
    }

    // 3. Fetch from Supabase for experiences, skills, and awards
    let experiences: ExperienceItem[] = cvData.experiences
    let awards: AwardItem[] = cvData.awards || []
    let dynamicSkills: string[] = []

    try {
      const { createAdminClient } = await import('@/lib/supabase/server')
      const supabase = createAdminClient()

      const [expRes, skillsRes, awardsRes] = await Promise.all([
        supabase.from('about_experience').select('*').order('order', { ascending: true }),
        supabase.from('about_skills').select('*').order('order', { ascending: true }),
        supabase.from('about_awards').select('*').order('order', { ascending: true }),
      ])

      if (expRes.data && expRes.data.length > 0) {
        experiences = expRes.data.map((exp: any, idx: number) => {
          const rawDesc = exp.description || ''
          const bulletLines = rawDesc
            .split('\n')
            .map((l: string) => l.replace(/^[\s•\-\*]+/, '').trim())
            .filter(Boolean)

          return {
            id: exp.id || `exp-${idx}`,
            company: exp.organization || 'Organization',
            period: exp.period || 'Present',
            role: exp.title || 'Role',
            location: exp.location || 'Phnom Penh, Cambodia',
            bullets: bulletLines.length > 0 ? bulletLines : [rawDesc || 'Key contributor to system development.'],
            technologies: exp.technologies ? (Array.isArray(exp.technologies) ? exp.technologies : [exp.technologies]) : undefined,
          }
        })
      }

      if (skillsRes.data && skillsRes.data.length > 0) {
        dynamicSkills = skillsRes.data.map((s: any) => s.name).filter(Boolean)
      }

      if (awardsRes.data && awardsRes.data.length > 0) {
        awards = awardsRes.data.map((a: any) => ({
          title: a.title,
          organization: a.organization,
          year: String(a.year || new Date().getFullYear()),
        }))
      }
    } catch {
      // Fall through to defaults
    }

    // Extract contact items
    const phoneItem = contacts.find((c: any) => c.type === 'phone' && c.is_active !== false)
    const emailItem = contacts.find((c: any) => c.type === 'email' && c.is_active !== false)
    const locationItem = contacts.find((c: any) => c.type === 'location' && c.is_active !== false)
    const websiteItem = contacts.find((c: any) => c.type === 'website' && c.is_active !== false)
    const instagramItem = contacts.find((c: any) => c.type === 'instagram' && c.is_active !== false)

    const finalPhoto = about?.profile_image_url || cvData.photoUrl
    const finalName = (about?.name && about.name !== 'Rithy Chanvirak') ? about.name : cvData.name
    const finalRole = about?.tagline || about?.title || cvData.roleTitle
    const finalBio = about?.bio || cvData.summary

    return {
      name: finalName.toUpperCase(),
      roleTitle: finalRole.toUpperCase(),
      phone: phoneItem?.value || cvData.phone,
      email: emailItem?.value || cvData.email,
      location: locationItem?.value || cvData.location,
      website: {
        label: websiteItem?.value ? websiteItem.value.replace(/^https?:\/\//, '').replace(/\/$/, '') : cvData.website.label,
        url: websiteItem?.value ? (websiteItem.value.startsWith('http') ? websiteItem.value : `https://${websiteItem.value}`) : cvData.website.url,
      },
      social: instagramItem?.value
        ? {
            platform: 'Instagram',
            label: instagramItem.value.startsWith('@') ? instagramItem.value : `@${instagramItem.value}`,
            url: `https://instagram.com/${instagramItem.value.replace(/^@/, '')}`,
          }
        : cvData.social,
      photoUrl: finalPhoto,
      summary: finalBio,
      experiences,
      education: cvData.education,
      awards,
      coreCompetencies: dynamicSkills.length > 0 ? dynamicSkills : cvData.coreCompetencies,
      technicalExpertise: cvData.technicalExpertise,
    }
  } catch (error) {
    console.error('Failed to get dynamic CV data, falling back to static:', error)
    return cvData
  }
}
