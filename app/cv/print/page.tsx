import { Metadata } from 'next'
import { getDynamicCVData } from '@/lib/cv-service'
import { CVPrintView } from '@/components/cv/cv-print-view'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const data = await getDynamicCVData()
  return {
    title: `${data.name} - Print CV`,
    description: `${data.name} - ${data.roleTitle}`,
  }
}

export default async function PrintCVPage() {
  const initialData = await getDynamicCVData()
  return <CVPrintView initialData={initialData} />
}
