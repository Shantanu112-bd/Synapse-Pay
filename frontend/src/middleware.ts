import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        const hasWalletCookie = request.cookies.has('wallet_connected');

        if (!hasWalletCookie) {
            const url = request.nextUrl.clone();
            url.pathname = '/';
            url.searchParams.set('error', 'wallet_required');
            return NextResponse.redirect(url);
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'],
};
