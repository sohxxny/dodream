import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  // 데모 모드에서는 인증 pass
  if (process.env.NEXT_PUBLIC_USE_MOCK === 'true') {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/mypage/:path*',
    '/chat/:path*',
    '/posts/:path*',

    '/create-profile',

    '/profile/edit',
    '/profile/me',
  ],
};
