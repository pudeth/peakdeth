import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const PRIMARY_DATA_DIR = path.join(process.cwd(), 'data')
const TMP_DATA_DIR = path.join('/tmp', 'data')
const IS_VERCEL = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME)

async function ensureDir(dir: string): Promise<void> {
  try {
    await mkdir(dir, { recursive: true })
  } catch {}
}

export async function readJsonStorage<T>(filename: string, fallback: T): Promise<T> {
  if (IS_VERCEL) {
    try {
      const tmpPath = path.join(TMP_DATA_DIR, filename)
      const raw = await readFile(tmpPath, 'utf-8')
      const clean = raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw
      return JSON.parse(clean) as T
    } catch {}
  }

  try {
    const primaryPath = path.join(PRIMARY_DATA_DIR, filename)
    const raw = await readFile(primaryPath, 'utf-8')
    const clean = raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw
    return JSON.parse(clean) as T
  } catch {
    return fallback
  }
}

export async function writeJsonStorage<T>(filename: string, data: T): Promise<void> {
  try {
    await ensureDir(PRIMARY_DATA_DIR)
    await writeFile(path.join(PRIMARY_DATA_DIR, filename), JSON.stringify(data, null, 2), 'utf-8')
    return
  } catch {}

  try {
    await ensureDir(TMP_DATA_DIR)
    await writeFile(path.join(TMP_DATA_DIR, filename), JSON.stringify(data, null, 2), 'utf-8')
  } catch (err) {
    console.warn(`writeJsonStorage error for ${filename}:`, err)
  }
}
