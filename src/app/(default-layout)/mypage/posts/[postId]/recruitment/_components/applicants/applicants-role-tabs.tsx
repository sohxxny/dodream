import { useMemo } from 'react';
import ApplyAcceptButton from '@/components/features/mypage/my-posts/recruitments/buttons/apply-accept-button';
import RecruitmentUserRow from '@/components/features/mypage/my-posts/recruitments/recruitment-user-row';
import { RoleTabs } from '@/components/features/mypage/my-posts/recruitments/role-tabs';
import RoleTabsHeader from '@/components/features/mypage/my-posts/recruitments/role-tabs-header';
import UserActions from '@/components/features/mypage/my-posts/recruitments/user-actions';
import ApplyDetailButton from '@/components/features/post/post-card/buttons/apply-detail-button';
import type { ApplicantRowUserType } from '@/types/my.type';
import type { PostDetailType, PostMembersType } from '@/types/post.type';

type ApplicantsRoleTabsProps = {
  postId: bigint;
  postDetail: PostDetailType;
  members: PostMembersType | undefined;
  users: ApplicantRowUserType[];
  headerRight?: React.ReactNode;
  emptyMessage: string;
};

export default function ApplicantsRoleTabs({
  postId,
  postDetail,
  members,
  users,
  headerRight,
  emptyMessage,
}: ApplicantsRoleTabsProps) {
  // 각 역할별 현재 인원 수 계산
  const currentCounts = useMemo(() => {
    if (!members?.users) return {};

    return members.users.reduce(
      (acc, member) => {
        const role = member.jobGroups?.[0];
        if (role) {
          acc[role] = (acc[role] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [members?.users]);

  // 역할이 꽉 찼는지 확인
  const isRoleFull = (roleName: string) => {
    const role = postDetail.roles.find((r) => r.role === roleName);
    if (!role) return false;
    return (currentCounts[roleName] || 0) >= role.headcount;
  };

  // 역할별 유저 필터링
  const getUsersByRole = (roleName: string) => {
    return users.filter(({ role }) => role === roleName);
  };

  return (
    <RoleTabs defaultValue={postDetail.roles[0].role}>
      <RoleTabsHeader
        roles={postDetail.roles.map((role) => role.role)}
        headerRight={headerRight}
      />
      {postDetail.roles.map((role) => {
        const roleUsers = getUsersByRole(role.role);

        return (
          <RoleTabs.Content key={role.role} value={role.role} columns={8}>
            {roleUsers.length === 0 ? (
              <p className="body-lg-medium col-span-full text-primary">
                {emptyMessage}
              </p>
            ) : (
              <div className="grid grid-cols-subgrid col-span-full gap-6 divide-y divide-border-primary">
                {roleUsers.map((user) => (
                  <RecruitmentUserRow
                    key={user.userId}
                    postId={postId}
                    {...user}
                    profileImageCode={user.profileImage}
                    actions={
                      <UserActions>
                        <ApplyDetailButton
                          postId={BigInt(postId)}
                          applicationId={BigInt(user.applicationId)}
                          variant="outline"
                          applicationType="received"
                        />
                        <ApplyAcceptButton
                          postId={BigInt(postId)}
                          isRecruitCompleted={postDetail.status === 'COMPLETED'}
                          isRoleFull={isRoleFull(user.role)}
                          applicationId={BigInt(user.applicationId)}
                        />
                      </UserActions>
                    }
                    href={`/profile/${BigInt(postId)}/${BigInt(user.userId)}`}
                  />
                ))}
              </div>
            )}
          </RoleTabs.Content>
        );
      })}
    </RoleTabs>
  );
}
