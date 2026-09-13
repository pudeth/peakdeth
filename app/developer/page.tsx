import { getServices } from '@/lib/services'
import { DeveloperView } from '@/components/developer-view'
import type { Metadata } from 'next'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'Developer (Coding) | Peak Deth',
  description: 'Explore full-stack web & mobile applications, enterprise POS architectures, and live digital systems by Peak Deth.',
}

export default async function DeveloperPage() {
  const services = await getServices()

  return (
    <main className="min-h-screen bg-[#030303]">
      <DeveloperView services={services} />
    </main>
  )
}
