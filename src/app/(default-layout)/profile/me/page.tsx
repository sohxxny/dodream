import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import Link from 'next/link';
import ProfileContent from '@/components/features/profile/profile-content';
import { userQueryOptions } from '@/hooks/auth/use-get-user';
import { profileQueryOptions } from '@/hooks/profile/use-get-profile';
import { getQueryClient } from '@/lib/query-client';
import { serverApis } from '@/services/server.api';

export default async function ProfilePage() {
  const queryClient = getQueryClient();

  const [user, profile] = await Promise.all([
    queryClient.fetchQuery({
      ...userQueryOptions,
      queryFn: () => serverApis.auth.getUser(),
    }),
    queryClient.fetchQuery({
      ...profileQueryOptions,
      queryFn: () => serverApis.profile.getProfile(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileContent
        userId={user.id}
        nickname={profile.nickname}
        profileImage={profile.profileImageCode}
        controller={
          <Link
            href="/profile/edit"
            className="w-fit h-fit bg-primary px-5 py-3 rounded-full body-md-medium"
            aria-label="프로필 정보 수정하기"
          >
            수정하기
          </Link>
        }
        role={profile.roles[0].name}
        experience={profile.experience}
        introText={profile.introText}
        interests={profile.interestKeywords}
        activityMode={profile.activityMode}
        profileUrls={profile.profileUrls}
        techSkills={profile.techSkills.map((stack) => stack.name)}
      />
    </HydrationBoundary>
  );
}
