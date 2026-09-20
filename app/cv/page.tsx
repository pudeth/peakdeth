import { Metadata } from 'next'
import { CVView } from '@/components/cv/cv-view'
import { getDynamicCVData } from '@/lib/cv-service'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const data = await getDynamicCVData()
  return {
    title: `${data.name} - CV / Resume`,
    description: `${data.name} - ${data.roleTitle}. ${data.summary.slice(0, 160)}...`,
    openGraph: {
      title: `${data.name} - Professional CV`,
      description: data.roleTitle,
      images: [data.photoUrl],
    },
  }
}

export default async function CVPage() {
  const initialData = await getDynamicCVData()
  return <CVView initialData={initialData} />
}
