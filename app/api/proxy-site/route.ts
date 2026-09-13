import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const targetUrl = searchParams.get('url')

  if (!targetUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 })
  }

  try {
    const parsed = new URL(targetUrl)
    const response = await fetch(parsed.toString(), {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    })

    if (!response.ok) {
      return new NextResponse(`Failed to fetch target URL: ${response.status}`, {
        status: response.status,
      })
    }

    let html = await response.text()

    // Base directory for relative links
    const baseHref = parsed.origin + parsed.pathname.substring(0, parsed.pathname.lastIndexOf('/') + 1)
    const origin = parsed.origin

    // Strip any strict meta CSP from the upstream HTML so it does not conflict inside the preview iframe
    html = html.replace(/<meta[^>]*http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi, '')

    // Rewrite root-relative src and href attributes to full absolute URLs
    html = html.replace(/(src|href)=(["'])\/(?!\/)/gi, `$1=$2${origin}/`)

    const isFoodSite = parsed.origin.includes('weppage-1.onrender.com') || parsed.pathname.includes('home.html')

    // Client-side script to intercept relative API and fetch requests so they resolve to target origin instead of host origin
    const interceptScript = `
    <base href="${baseHref}">
    ${isFoodSite ? `
    <style>
      /* Hide the 3s green splash preloader immediately so real homepage is visible instantly */
      #loadingScreen, .loading-screen { display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; }
      /* Unlock all food items: show actual prices, Add to Cart and Pre-Order buttons */
      .price-lock-wrap, .pd-price-lock-wrap { display: none !important; }
      .item-price, .pd-price { display: block !important; }
      .preorder-btn, .add-btn { display: inline-flex !important; }
      .item-preorder-hint { display: block !important; }
      #pdBar { display: flex !important; }
    </style>
    ` : ''}
    <script>
      (function() {
        var targetOrigin = "${parsed.origin}";
        var localOrigin = window.location.origin;

        ${isFoodSite ? `
        // Auto set customer-logged-in on body
        function ensureLoggedInClass() {
          if (document.body && !document.body.classList.contains('customer-logged-in')) {
            document.body.classList.add('customer-logged-in');
          }
        }
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', ensureLoggedInClass);
        } else {
          ensureLoggedInClass();
        }
        ` : ''}

        function rewriteUrl(url) {
          if (!url || typeof url !== 'string') return url;
          if (url.startsWith('//')) return 'https:' + url;
          if (url.startsWith('/')) return targetOrigin + url;
          if (url.startsWith(localOrigin)) return url.replace(localOrigin, targetOrigin);
          return url;
        }

        if (window.fetch) {
          var _origFetch = window.fetch;
          window.fetch = function(resource, init) {
            try {
              var urlStr = typeof resource === 'string' ? resource : (resource && resource.url ? resource.url : '');
              
              ${isFoodSite ? `
              // Automatically mock a customer session so all product prices and order buttons unlock
              if (urlStr.includes('/auth/customer/session') || urlStr.includes('/customer/profile') || urlStr.includes('/api/customer/profile')) {
                var mockCustomer = {
                  id: "guest-user-1",
                  name: "ស (Guest)",
                  email: "customer@snadainek.com",
                  phone: "+855 68 656 263"
                };
                var responsePayload = urlStr.includes('profile')
                  ? { success: true, customer: mockCustomer, data: mockCustomer }
                  : { loggedIn: true, customer: mockCustomer };
                return Promise.resolve(new Response(JSON.stringify(responsePayload), {
                  status: 200,
                  headers: { 'Content-Type': 'application/json' }
                }));
              }
              ` : ''}

              if (typeof resource === 'string') {
                resource = rewriteUrl(resource);
              } else if (resource && resource.url) {
                var newUrl = rewriteUrl(resource.url);
                resource = new Request(newUrl, resource);
              }
            } catch (e) {}
            return _origFetch.call(this, resource, init);
          };
        }

        if (window.XMLHttpRequest) {
          var _origOpen = XMLHttpRequest.prototype.open;
          XMLHttpRequest.prototype.open = function(method, url) {
            try {
              arguments[1] = rewriteUrl(url);
            } catch (e) {}
            return _origOpen.apply(this, arguments);
          };
        }
      })();
    </script>
    `

    // Inject base and interceptor script
    if (html.includes('<head>')) {
      html = html.replace('<head>', '<head>' + interceptScript)
    } else if (html.includes('<head ')) {
      html = html.replace(/<head[^>]*>/, '$&' + interceptScript)
    } else {
      html = interceptScript + html
    }

    if (isFoodSite) {
      // Ensure body has customer-logged-in class
      html = html.replace(/<body([^>]*)class="([^"]*)"/i, '<body$1class="$2 customer-logged-in"')
      html = html.replace(/<body(?![^>]*class=)([^>]*)>/i, '<body class="customer-logged-in"$1>')

      // Unlock prices by rewriting customerSession check in priceHtml
      html = html.replace(/const\s+priceHtml\s*=\s*customerSession/g, 'const priceHtml = true')
      html = html.replace(/customerSession\s*\?\s*\(gobbleVal/g, 'true ? (gobbleVal')

      // Rewrite hardcoded API_URL definitions that use window.location.origin
      html = html.replace(/window\.location\.origin\s*\+\s*['"]\/api['"]/g, `'${parsed.origin}/api'`)
      html = html.replace(/window\.location\.origin\s*\+\s*['"]\/auth['"]/g, `'${parsed.origin}/auth'`)
      html = html.replace(/src="\/socket\.io\/socket\.io\.js"/g, `src="${parsed.origin}/socket.io/socket.io.js"`)
    }

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0',
        'Access-Control-Allow-Origin': '*',
        'Content-Security-Policy':
          "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; font-src * data:; img-src * data: blob:; connect-src *; media-src * data: blob:; frame-src *; worker-src * blob:; manifest-src *; base-uri *;",
        'X-Frame-Options': 'SAMEORIGIN',
      },
    })
  } catch (error: any) {
    return new NextResponse(`Proxy error: ${error?.message || 'Unknown error'}`, {
      status: 500,
    })
  }
}
