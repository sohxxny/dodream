import Link from 'next/link';
import Logo from '@/assets/logo/logo.svg';
import { serverApis } from '@/services/server.api';
import LoginButton from './login-button';
import Navigation from './navigation';

export default async function Header() {
  const profileExists = await serverApis.profile.getProfileExists();

  return (
    <header className="h-13 sticky top-8 flex items-center shrink-0 bg-surface border-b border-border-primary z-50">
      <div className="content-layout flex justify-between items-center">
        <h1>
          <Link href="/">
            <Logo aria-hidden="true" className="text-brand" />
            <span className="sr-only">두드림</span>
          </Link>
        </h1>
        {profileExists.exists ? (
          // 로그인 상태: 네비게이션 바 노출
          <Navigation />
        ) : (
          // 미로그인 상태: 로그인 버튼 노출
          <LoginButton />
        )}
      </div>
    </header>
  );
}
