import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Providers } from './providers';

const pretendard = localFont({
  src: [
    {
      path: './fonts/pretendard/Pretendard-Regular.subset.woff2',
      weight: '400',
    },
    {
      path: './fonts/pretendard/Pretendard-Medium.subset.woff2',
      weight: '500',
    },
    {
      path: './fonts/pretendard/Pretendard-SemiBold.subset.woff2',
      weight: '600',
    },
    {
      path: './fonts/pretendard/Pretendard-Bold.subset.woff2',
      weight: '700',
    },
  ],
  display: 'swap',
  variable: '--font-pretendard',
});

// TODO: 메타데이터 수정
export const metadata: Metadata = {
  title: '두드림',
  description: '두드림',
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko-KR"
      className={`${pretendard.variable} max-w-screen min-w-300`}
    >
      <body className="max-w-screen min-w-300 min-h-screen">
        <div className="fixed h-8 flex items-center justify-center w-full top-0 left-0 bg-surface border-b border-border-primary body-md-medium text-error z-50">
          데모 사이트입니다.
        </div>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
