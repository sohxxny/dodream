'use client';

import Link from 'next/link';
import { overlay } from 'overlay-kit';
import LoginModal from '@/app/auth/_components/login-modal';

export default function BannerButton({
  profileExists,
}: {
  profileExists: boolean;
}) {
  const handleLogin = () => {
    overlay.open(({ isOpen, close }) => (
      <LoginModal isOpen={isOpen} onClose={close} />
    ));
  };

  return profileExists ? (
    <Link
      href="/posts/new"
      className="relative z-10 bg-brand text-text-on-brand mb-8 ml-9 rounded-md w-fit px-4 py-2 body-md-medium"
    >
      모집글 작성하기
    </Link>
  ) : (
    <button
      type="button"
      onClick={handleLogin}
      className="relative z-10 bg-brand text-text-on-brand mb-8 ml-9 rounded-md w-fit px-4 py-2 body-md-medium"
    >
      로그인하고 AI 추천 받아보기
    </button>
  );
}
