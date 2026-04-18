'use client';

import Skeleton from '@/components/commons/skeleton';
import DefaultTooltip from '@/components/commons/tooltip/default-tooltip';
import OfferButton from '@/components/features/mypage/my-posts/recruitments/buttons/offer-button';
import RecruitmentUserRow from '@/components/features/mypage/my-posts/recruitments/recruitment-user-row';
import { RoleTabs } from '@/components/features/mypage/my-posts/recruitments/role-tabs';
import UserActions from '@/components/features/mypage/my-posts/recruitments/user-actions';
import { useGetRecommendedUsers } from '@/hooks/post/use-get-recommended-users';

interface RecommendedUsersProps {
  postId: bigint;
  isOwner: boolean;
}

/** 추천 유저 탭 */
export default function RecommendedUsers({
  postId,
  isOwner,
}: RecommendedUsersProps) {
  const { data: users } = useGetRecommendedUsers(postId);

  if (!isOwner) return null;

  if (!users) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex gap-3 items-center">
          <h3 className="heading-lg">AI가 추천하는 회원을 탐색해 보세요</h3>
          <DefaultTooltip
            content="회원님이 게시한 모집글 정보를 바탕으로 
가장 잘 맞을 지원자를 꼽아 추천해요.
목록에서 프로필을 확인하고 바로 합류 제안을 보내보세요."
          />
        </div>
        {/* 탭 목록 스켈레톤 */}
        <Skeleton
          count={3}
          listClassName="flex gap-4"
          itemClassName="h-9 w-20 rounded-full"
        />
        {/* 유저 목록 스켈레톤 */}
        <Skeleton
          count={3}
          listClassName="flex flex-col gap-3"
          itemClassName="h-14 w-full"
        />
      </div>
    );
  }

  // users에 존재하는 역할만 추출
  const availableRoles = Array.from(
    new Set(
      users.profiles
        .map((profile) => profile.roles[0])
        .filter((role) => role !== undefined),
    ),
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-3 items-center">
        <h3 className="heading-lg">AI가 추천하는 회원을 탐색해 보세요</h3>
        <DefaultTooltip
          content="회원님이 게시한 모집글 정보를 바탕으로 
  가장 잘 맞을 지원자를 꼽아 추천해요.
  목록에서 프로필을 확인하고 바로 합류 제안을 보내보세요."
        />
      </div>
      <RoleTabs defaultValue={availableRoles[0]}>
        {/* TODO: 탭 분리 */}
        <RoleTabs.List>
          {availableRoles.map((role) => (
            <RoleTabs.Trigger key={role} value={role}>
              {role}
            </RoleTabs.Trigger>
          ))}
        </RoleTabs.List>

        {availableRoles.map((role) => (
          <RoleTabs.Content key={role} value={role} columns={8}>
            <div className="grid grid-cols-subgrid col-span-full gap-6 divide-y divide-border-primary">
              {users.profiles
                .filter(({ roles }) => roles[0] === role)
                .map((user) => (
                  <RecruitmentUserRow
                    postId={BigInt(postId)}
                    key={user.userId}
                    {...user}
                    role={user.roles[0]}
                    actions={
                      <UserActions>
                        <OfferButton
                          postId={postId}
                          userId={user.userId}
                          disabled={!!user.suggestionId}
                        />
                      </UserActions>
                    }
                  />
                ))}
            </div>
          </RoleTabs.Content>
        ))}
      </RoleTabs>
    </div>
  );
}
