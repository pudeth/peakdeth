import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const isDevAdmin = cookieStore.get('admin_dev_session')?.value === 'true'

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if ((authError || !user) && !isDevAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    const ext = file.name.split('.').pop() || 'jpg'
    const safeName = `${Date.now()}_${crypto.randomBytes(4).toString('hex')}.${ext}`
    const filePath = path.join(uploadsDir, safeName)

    await writeFile(filePath, buffer)

    const publicUrl = `/uploads/${safeName}`
    const publicId = publicUrl

    return NextResponse.json({
      public_id: publicId,
      secure_url: publicUrl,
      width: 1200,
      height: 800,
      format: ext,
      resource_type: 'image',
    })
  } catch (error) {
    console.error('Local upload error:', error)
    return NextResponse.json({ error: 'Failed to upload image locally' }, { status: 500 })
  }
}