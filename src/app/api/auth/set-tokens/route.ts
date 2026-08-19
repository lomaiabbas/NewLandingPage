import { NextResponse } from 'next/server';
import { serialize } from 'cookie';
import { jwtDecode } from 'jwt-decode';
import { gzipSync } from 'node:zlib';

export async function POST(request: Request) {
    const body = await request.json();
    const { refreshToken, accessToken, rememberMe, logout, tenant, companyInfo } = body;

    if (!refreshToken && !accessToken) {
        return NextResponse.json({ message: 'Refresh token and Access token are required' }, { status: 400 });
    }

    // Set HTTP-only cookie
    const refreshTokenCookie = serialize('refreshToken', gzipSync(refreshToken).toString('base64'), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: logout ? 0 : rememberMe ? 60 * 60 * 24 * 365 : undefined,
    });

    const rememberMeCookie = serialize('rememberMe', rememberMe, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: logout ? 0 : rememberMe ? 60 * 60 * 24 * 365 : undefined,
    });

    let expirationTime = 0;
    if (!logout) {
        let decoded = jwtDecode(accessToken);
        expirationTime = decoded?.exp! * 1000;
    }
    
    const accessTokenCookie = serialize('accessToken', gzipSync(accessToken).toString('base64'), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        // maxAge: logout ? 0 : expirationTime,
        expires:new Date(expirationTime)
    });
      
    const response = NextResponse.json({ message: 'Refresh and access tokens set successfully' });
    if (tenant || logout) {
        const tenantCookie = serialize('tenant', gzipSync(tenant).toString('base64'), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: logout ? 0 : rememberMe ? 60 * 60 * 24 * 365 : undefined,
        });
    
        const companyInfoCookie = serialize('companyInfo', gzipSync(JSON.stringify(companyInfo)).toString('base64'), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: logout ? 0 : rememberMe ? 60 * 60 * 24 * 365 : undefined,
        });

        response.headers.append('Set-Cookie', tenantCookie);
        response.headers.append('Set-Cookie', companyInfoCookie);
    }
    
    response.headers.append('Set-Cookie', refreshTokenCookie);
    response.headers.append('Set-Cookie', accessTokenCookie);
    response.headers.append('Set-Cookie', rememberMeCookie);

    return response;
}