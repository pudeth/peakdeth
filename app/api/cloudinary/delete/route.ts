import { createHash } from 'node:crypto'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getCloudinaryConfig } from '@/lib/cloudinary-config'

interface DeleteRequestBody {
  publicIds?: string[]
}

function createCloudinarySignature(params: Record<string, string>, apiSecret: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&')

  return createHash('sha1').update(`${toSign}${apiSecret}`).digest('hex')
}

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

    const { cloudName, apiKey, apiSecret, isConfigured } = getCloudinaryConfig()
    const isPlaceholder = !isConfigured

    const body = (await request.json().catch(() => ({}))) as DeleteRequestBody
    const publicIds = Array.isArray(body.publicIds)
      ? body.publicIds.filter((id): id is string => typeof id === 'string' && id.trim().length > 0)
      : []

    if (publicIds.length === 0) {
      return NextResponse.json({ error: 'No public IDs provided' }, { status: 400 })
    }

    const results = await Promise.all(
      publicIds.map(async (publicId) => {
        if (isPlaceholder || publicId.startsWith('local_') || publicId.startsWith('/uploads/')) {
          if (publicId.startsWith('/uploads/')) {
            try {
              const { unlink } = await import('node:fs/promises')
              const { join, basename } = await import('node:path')
              const filePath = join(process.cwd(), 'public', 'uploads', basename(publicId))
              await unlink(filePath).catch(() => {})
            } catch {}
          }
          return { publicId, ok: true, success: true, result: 'ok' }
        }

        const timestamp = Math.floor(Date.now() / 1000)
        const paramsToSign = {
          invalidate: 'true',
          public_id: publicId,
          timestamp: String(timestamp),
        }
        const signature = createCloudinarySignature(paramsToSign, apiSecret)

        const formData = new URLSearchParams({
          public_id: publicId,
          timestamp: String(timestamp),
          invalidate: 'true',
          api_key: apiKey,
          signature,
        })

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        })

        const payload = (await response.json().catch(() => ({}))) as { result?: string; error?: { message?: string } }

        if (!response.ok) {
          return {
            publicId,
            ok: false,
            result: payload.error?.message || payload.result || `HTTP ${response.status}`,
          }
        }

        const result = payload.result || 'unknown'
        const ok = result === 'ok' || result === 'not found'
        return {
          publicId,
          ok,
          result,
        }
      })
    )

    const failed = results.filter((item) => !item.ok)
    if (failed.length > 0) {
      return NextResponse.json(
        {
          error: 'Some Cloudinary assets could not be deleted',
          results,
        },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    return NextResponse.json({ error: 'Failed to delete assets from Cloudinary' }, { status: 500 })
  }
}
