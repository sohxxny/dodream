'use client';

import RecruitmentEmptyState from '@/components/features/mypage/my-posts/recruitments/recruitment-empty-state';
import RecruitmentUserRow from '@/components/features/mypage/my-posts/recruitments/recruitment-user-row';
import { RoleTabs } from '@/components/features/mypage/my-posts/recruitments/role-tabs';
import UserActions from '@/components/features/mypage/my-posts/recruitments/user-actions';
import ApplyDetailButton from '@/components/features/post/post-card/buttons/apply-detail-button';
import MathcingCancelButton from '@/components/features/post/post-card/buttons/matching-cancel-button';
import useGetPostMembers from '@/hooks/post/use-get-post-members';

interface MembersTabContentProps {
  postId: bigint;
}

export default function MembersTabContent({ postId }: MembersTabContentProps) {
  const { data: users } = useGetPostMembers(BigInt(postId));

  if (!users || users?.users.length === 0) {
    return <RecruitmentEmptyState tab="members" />;
  }

  const roles = [
    ...new Set(
      users.users
        .filter((user) => !!user.jobGroups[0])
        .map((user) => user.jobGroups[0]),
    ),
  ];

  return (
    <RoleTabs defaultValue={roles[0]}>
      <RoleTabs.List>
        {roles.map((role) => (
          <RoleTabs.Trigger key={role} value={role}>
            {role}
          </RoleTabs.Trigger>
        ))}
      </RoleTabs.List>

      {roles.map((role) => (
        <RoleTabs.Content key={role} value={role} columns={8}>
          <div className="grid grid-cols-subgrid col-span-full gap-6 divide-y divide-border-primary">
            {users?.users
              .filter(({ jobGroups }) => jobGroups[0] === role)
              .map((user) => (
                <RecruitmentUserRow
                  postId={BigInt(postId)}
                  key={user.userId}
                  {...user}
                  role={user.jobGroups[0]}
                  profileImageCode={user.profileImage}
                  actions={
                    <UserActions>
                      {user.applicationId && (
                        <>
                          <ApplyDetailButton
                            postId={BigInt(postId)}
                            applicationId={BigInt(user.applicationId)}
                            variant="outline"
                            applicationType="received"
                          />
                          <MathcingCancelButton
                            ownerNickname={user.nickname}
                            postId={BigInt(postId)}
                            matchingId={BigInt(user.matchedId)}
                            variant="outline"
                          />
                        </>
                      )}
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
