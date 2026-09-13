export function isPlaceholderSupabaseUrl(url?: string): boolean {
  if (!url) return true
  return url.includes('placeholder.supabase.co') || url.includes('placeholder')
}

export function getMockFetch(): typeof fetch {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const urlStr =
      typeof input === 'string'
        ? input
        : input instanceof URL
        ? input.toString()
        : (input as Request).url || ''

    const headers = new Headers(init?.headers)
    const accept = headers.get('accept') || ''

    // Mock auth user responses
    if (urlStr.includes('/auth/v1/user') || urlStr.includes('/auth/v1/token')) {
      return new Response(JSON.stringify({ user: null, session: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Mock single-object queries (e.g. .single())
    if (accept.includes('vnd.pgrst.object+json')) {
      return new Response(
        JSON.stringify({
          code: 'PGRST116',
          details: 'The result contains 0 rows',
          hint: null,
          message: 'JSON object requested, multiple (or no) rows returned',
        }),
        {
          status: 406,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Mock table queries (.select())
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Range': '0-0/0',
      },
    })
  }
}
