import acceptLanguage from 'accept-language'
import { parse } from 'cookie'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { fallbackLng, languages } from './app/i18n/settings'

const cookieName = 'i18next'

const publicPages = [
  '/ar',
  '/ar/otp-login',
  '/ar/register',
  '/ar/update-register-info',
  '/ar/complete-register-info',
  '/en',
  '/en/otp-login',
  '/en/register',
  '/en/update-register-info',
  '/en/complete-register-info',
  '/ar/gatekeep',
  '/en/gatekeep',
  '/ar/gatekeep/stats',
  '/en/gatekeep/stats',
]

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  if (req.url.startsWith('/_next/static/css/app/[lng]/')) {
    return Response.redirect(new URL('/_next/static/css/app/main.css.map', req.url))
  }
  const cookies1 = parse(req.headers.get('cookie') || '')
  const refreshToken = cookies1.refreshToken
  const accessToken = cookies1.accessToken
  const headerList = headers()

  const host = headerList?.get('x-forwarded-host') || headerList?.get('host')

  let lng
  if (req.cookies.has(cookieName)) lng = acceptLanguage.get(req?.cookies.get(cookieName)?.value)
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'))
  if (!lng) {
    lng = fallbackLng
    req.headers.set('Accept-Language', lng)
  }

  if (
    req.url.includes('favicon') ||
    req.url.includes('excel-templates') ||
    req.url.includes('/.well-known')
  ) {
    return NextResponse.next()
  }

  if (req.url.includes('session')) {
    return NextResponse.next({ headers: req.headers })
  }
  if (req.url.includes('sounds')) {
    return NextResponse.next()
  }

  if (
    !accessToken &&
    !refreshToken &&
    req.url.includes('admin') &&
    !req.url.includes('tokenFromBialah')
  ) {
    return NextResponse.redirect(new URL(`/${lng}?needLogin`, req.url))
  } else if (
    !accessToken &&
    refreshToken &&
    !req.url.includes('admin') &&
    host?.includes('.atraslink.com')
  ) {
    return NextResponse.redirect(new URL(`/${lng}/admin`, req.url))
  }

  // Redirect if lng in path is not supported
  if (
    !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(
      new URL(
        `/${lng}${req.nextUrl.pathname}${req.nextUrl.search ? req.nextUrl.search : ''}`,
        req.url
      )
    )
  }

  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer')!)
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`))
    const response = NextResponse.next({ headers: req.headers })
    response.headers.set('x-pathname', pathname) // custom header
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
    return response
  }

  if (
    accessToken &&
    publicPages.includes(req.nextUrl.pathname) &&
    host?.includes('.atraslink.com') &&
    !req.nextUrl.pathname?.includes('gatekeep')
  ) {
    const url = req.nextUrl.clone()
    url.pathname = `/${lng}/admin`
    return NextResponse.redirect(url)
  }
  const response = NextResponse.next({ headers: req.headers })
  response.headers.set('x-pathname', pathname) // custom header

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|videos|flags|sounds|img|favicon.ico|sw.js).*)'],
}
