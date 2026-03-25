import Image from 'next/image';
import { Suspense } from 'react';
import BannerButton from './banner-button';

export default function Banner({ profileExists }: { profileExists: boolean }) {
  return (
    <aside
      className="col-span-12 flex flex-col justify-between relative h-51 shadow-card bg-white border border-border-primary rounded-lg overflow-hidden"
      aria-labelledby="banner-heading"
    >
      <Image
        src={
          profileExists
            ? '/banner/authenticated.png'
            : '/banner/unauthenticated.png'
        }
        alt="banner"
        className="object-cover"
        fill
        preload
        sizes="100vw"
        fetchPriority="high"
      />

      <div className="relative z-10 mt-8 ml-9">
        <h2 className="heading-lg w-81.5" id="banner-heading">
          {profileExists
            ? '모집글을 작성하고 모집글과 꼭 맞는 AI 지원자 추천을 경험해 보세요.'
            : '놓치고 있는 기회가 있을지 몰라요!'}
        </h2>
        {!profileExists && (
          <p className="text-secondary body-md-regular mt-3">
            AI가 회원님의 프로필과 관심사를 분석하여 최적의 글을 추천해
            드립니다.
            <br />
            지금 로그인하고 숨겨진 기회를 두드려보세요.
          </p>
        )}
      </div>

      <Suspense>
        <BannerButton profileExists={profileExists} />
      </Suspense>
    </aside>
  );
}
