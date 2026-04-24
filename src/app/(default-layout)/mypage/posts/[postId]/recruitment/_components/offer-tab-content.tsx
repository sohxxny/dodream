'use client';

import OfferCancelButton from '@/components/features/mypage/my-posts/recruitments/buttons/offer-cancel-button';
import RecruitmentEmptyState from '@/components/features/mypage/my-posts/recruitments/recruitment-empty-state';
import RecruitmentUserRow from '@/components/features/mypage/my-posts/recruitments/recruitment-user-row';
import { RoleTabs } from '@/components/features/mypage/my-posts/recruitments/role-tabs';
import UserActions from '@/components/features/mypage/my-posts/recruitments/user-actions';
import useGetMyPostOffers from '@/hooks/my/use-get-my-post-offers';
import RecruitmentTabSkeleton from './recruitment-tab-skeleton';

interface OfferTabContentProps {
  postId: bigint;
}

export default function OfferTabContent({ postId }: OfferTabContentProps) {
  const { data: offers, isPending } = useGetMyPostOffers(postId);

  if (isPending) {
    return <RecruitmentTabSkeleton />;
  }

  if (!offers || offers.users.length === 0) {
    return <RecruitmentEmptyState tab="offers" />;
  }

  // users에 존재하는 역할만 추출
  const availableRoles = Array.from(
    new Set(offers.users.map((user) => user.jobGroups[0])),
  );

  return (
    <RoleTabs defaultValue={availableRoles[0]}>
      {/* TODO: API Response 형식 보고 RoleTabsHeader 컴포넌트로 대체 */}
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
            {offers.users
              .filter(({ jobGroups }) => jobGroups[0] === role)
              .map((user) => (
                <RecruitmentUserRow
                  postId={BigInt(postId)}
                  profileImageCode={user.profileImage}
                  key={user.userId}
                  {...user}
                  role={user.jobGroups[0]}
                  actions={
                    <UserActions>
                      <OfferCancelButton
                        postId={postId}
                        suggestionId={user.suggestionId}
                      />
                    </UserActions>
                  }
                />
              ))}
          </div>
        </RoleTabs.Content>
      ))}
    </RoleTabs>
  );
}
