export async function GET(request: Request) {
  const url = new URL(request.url)
  if (url.pathname.endsWith('.js') || url.pathname.includes('script')) {
    return new Response('/* Vercel Insights Dev Mock */', {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    })
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export async function POST() {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
