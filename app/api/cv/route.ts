import { NextResponse } from 'next/server'
import { getDynamicCVData } from '@/lib/cv-service'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const cv = await getDynamicCVData()
    return NextResponse.json(
      { cv, success: true },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )
  } catch (error) {
    console.error('Failed to get dynamic CV API:', error)
    return NextResponse.json({ error: 'Failed to retrieve CV data' }, { status: 500 })
  }
}
