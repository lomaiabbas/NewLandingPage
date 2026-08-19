import { NextRequest, NextResponse } from 'next/server';
import { parse, serialize } from 'cookie';
import { jwtDecode } from 'jwt-decode';
import { clientConfig } from '@/config';
import { POST as setTokens } from "../set-tokens/route";
import Pako from 'pako';

let lastPageRequestAccessToken = "";

export async function GET(request: NextRequest) {
  const cookies = parse(request.headers.get('cookie') || '');

  let refreshToken = cookies.refreshToken ? Pako.ungzip(Buffer.from(cookies.refreshToken, 'base64'), { to: 'string' }) : undefined;
  let accessToken = cookies.accessToken ? Pako.ungzip(Buffer.from(cookies.accessToken, 'base64'), { to: 'string' }) : undefined;
  let companyInfo = cookies?.companyInfo ? JSON.parse(Pako.ungzip(Buffer.from(cookies.companyInfo, 'base64'), { to: 'string' })) : undefined;
  let tenant = cookies?.tenant ? Pako.ungzip(Buffer.from(cookies.tenant, 'base64'), { to: 'string' }) : undefined;
  let i18next = cookies.i18next;
  const rememberMe = cookies.rememberMe;
  let link = request?.headers?.get("x-forwarded-proto") + '://' + request?.headers?.get("x-forwarded-host");

  if (request?.url?.indexOf("from=") > -1 && !request.url?.substring(request?.url?.indexOf("from=") + 5)?.includes("admin")) {
    return NextResponse.json({
      refreshToken,
      accessToken,
      rememberMe,
      companyInfo,
      tenant
    });
  } else {
    // accessToken = "";
    // refreshToken = "";
    // if (accessToken && refreshToken) {
    //   let decoded = jwtDecode(accessToken);
    //   let expirationTime = decoded?.exp! * 1000
    //   let currentTime = new Date().getTime()
    //   if (expirationTime <= currentTime) {
    //     // if (lastPageRequestAccessToken !== request.url?.substring(request?.url?.indexOf("from=") + 5)) {
    //       console.log("refresh 1")
    //       const response = await fetch(`${clientConfig.url}/connect/token`, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //         body: new URLSearchParams({
    //           grant_type: 'refresh_token',
    //           client_id: clientConfig.client_id!,
    //           refresh_token: refreshToken,
    //         })
    //       });
    //       const data = await response.json();
      
    //       if (response.ok) {
    //         lastPageRequestAccessToken = request.url?.substring(request?.url?.indexOf("from=") + 5);

    //         const fakeRequest = new Request(`${link}/api/auth/set-tokens`, {
    //           method: "POST",
    //           headers: {
    //             'Content-Type': 'application/json',
    //             Accept: 'application/json'
    //           },
    //           body: JSON.stringify({
    //             refreshToken: data.refresh_token,
    //             accessToken: data.access_token,
    //             rememberMe: rememberMe
    //           })
    //         });
        
    //         let rr = await setTokens(fakeRequest);

    //         refreshToken = data.refresh_token;
    //         accessToken = data.access_token;
    //       } else {
    //         refreshToken = "";
    //         accessToken = "";
    //       }
    //     // }
    //   } else {
    //     return NextResponse.json({
    //       refreshToken,
    //       accessToken,
    //       rememberMe,
    //       companyInfo,
    //       tenant
    //     });
    //   }
    // } else if (!accessToken && refreshToken) {
    //   // if (lastPageRequestAccessToken !== request.url?.substring(request?.url?.indexOf("from=") + 5)) {
    //     console.log("refresh 2")
    //     const response = await fetch(`${clientConfig.url}/connect/token`, {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //       body: new URLSearchParams({
    //         grant_type: 'refresh_token',
    //         client_id: clientConfig.client_id!,
    //         refresh_token: refreshToken,
    //       })
    //     });
    //     const data = await response.json();
    //     if (response.ok) {
    //       // lastPageRequestAccessToken = request.url?.substring(request?.url?.indexOf("from=") + 5);
    //       const fakeRequest = new Request(`${link}/api/auth/set-tokens`, {
    //         method: "POST",
    //         headers: {
    //           'Content-Type': 'application/json',
    //           Accept: 'application/json'
    //         },
    //         body: JSON.stringify({
    //           refreshToken: data.refresh_token,
    //           accessToken: data.access_token,
    //           rememberMe: rememberMe
    //         })
    //       });
        
    //       let res = await setTokens(fakeRequest);
  
    //       refreshToken = data.refresh_token;
    //       accessToken = data.access_token;
    //     } else {
    //       refreshToken = "";
    //       accessToken = "";
    //     }
    //   // }
    // }
    if (!refreshToken && !accessToken) {
      const refreshTokenCookie = serialize('refreshToken', '0', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 0
      });

      const accessTokenCookie = serialize('accessToken', 'd', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 0
      });

      const tenantCookie = serialize('tenant', 'd', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 0
      });

      const companyInfoCookie = serialize('companyInfo', 'd', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 0
      });
      if (request.url.includes("admin")) {
        const response = NextResponse.redirect(new URL(`/${i18next ? i18next : 'ar'}?needLogin`, request.url));
        response.headers.append('Set-Cookie', refreshTokenCookie);
        response.headers.append('Set-Cookie', accessTokenCookie);
        response.headers.append('Set-Cookie', tenantCookie);
        response.headers.append('Set-Cookie', companyInfoCookie);
        return response;
}
     
    }

    return NextResponse.json({
      refreshToken,
      accessToken,
      rememberMe,
      companyInfo,
      tenant
    });
  }
}