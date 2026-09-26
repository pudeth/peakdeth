import { getCVContent, saveCVContentServer } from '@/lib/site-content'
import { cvData, CVData } from '@/data/cv-data'

export async function getDynamicCVData(): Promise<CVData> {
  try {
    return await getCVContent()
  } catch (error) {
    console.error('Failed to get dynamic CV data, falling back to static:', error)
    return cvData
  }
}

export async function saveDynamicCVData(data: Partial<CVData>): Promise<CVData> {
  return await saveCVContentServer(data)
}

