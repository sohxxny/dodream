'use client';

import Link from 'next/link';
import { useState } from 'react';
import ArrowDownIcon from '@/assets/icons/chevron-down/14.svg';
import ArrowUpIcon from '@/assets/icons/chevron-up/14.svg';
import ProfileImage from '@/components/commons/profile-image';
import Skeleton from '@/components/commons/skeleton';
import useGetPostMembers from '@/hooks/post/use-get-post-members';

interface RecruitStatusProps {
  postId: bigint;
  roles: {
    role: string;
    headcount: number;
  }[];
}

/**
 * 모집자 현황 컴포넌트
 * @param postId - 게시물 ID
 * @param roles - 모집중인 직군 리스트
 */
export default function RecruitStatus({ postId, roles }: RecruitStatusProps) {
  const { data: postMembers } = useGetPostMembers(postId);
  const [visibleCount, setVisibleCount] = useState(3);

  if (!postMembers) {
    const skeletonRoles = roles.length > 3 ? roles.slice(0, 3) : roles;
    return (
      <div className="bg-surface shadow-card py-5 px-6 rounded-md">
        <ul className="flex flex-col [&>li]:relative [&>li]:border-b [&>li]:border-border-primary [&>li:not(:first-child)]:pt-4 [&>li:not(:last-child)]:pb-4 [&>li:last-child]:border-none">
          {skeletonRoles.map((role) => (
            <li key={role.role} className="flex items-center">
              <span className="w-20.5 body-lg-medium">{role.role}</span>
              <Skeleton
                count={1}
                listClassName="flex flex-1"
                itemClassName="h-8 w-full"
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const shouldShowButton = roles.length > 3;
  const visibleRoles = roles.slice(0, visibleCount);
  const isExpanded = visibleCount === roles.length;

  const handleToggle = () => {
    if (isExpanded) {
      setVisibleCount(3);
    } else {
      setVisibleCount((prev) => Math.min(prev + 3, roles.length));
    }
  };

  return (
    <div className="bg-surface shadow-card py-5 px-6 rounded-md">
      <ul className="flex flex-col [&>li]:relative [&>li]:border-b [&>li]:border-border-primary [&>li:not(:first-child)]:pt-4 @max-[50vw]/chatting:[&>li:not(:first-child)]:pt-3 [&>li:not(:last-child)]:pb-4 [&>li:last-child]:border-none">
        {visibleRoles.map((roleInfo) => {
          // 해당 직군을 가진 멤버들만 필터링
          const membersForRole = postMembers?.users.filter((member) =>
            member.jobGroups.includes(roleInfo.role),
          );

          return (
            <li key={roleInfo.role} className="flex items-center">
              <span className="w-20.5 body-lg-medium @max-[50vw]/chatting:body-md-medium h-8 flex items-center">
                {roleInfo.role}
              </span>
              <ul className="flex flex-row-reverse flex-1 justify-end [&>li]:relative [&>li:not(:last-child)]:-ml-3">
                {membersForRole.map((member) => (
                  <MemberInfo
                    key={member.userId}
                    member={{
                      id: member.userId,
                      nickname: member.nickname,
                      profileUrl: member.profileImage,
                    }}
                  />
                ))}
              </ul>
              <span className="@max-[50vw]/chatting:body-md-medium">
                {membersForRole.length}/{roleInfo.headcount}명
              </span>
            </li>
          );
        })}
      </ul>

      {shouldShowButton && (
        <button
          type="button"
          onClick={handleToggle}
          className="w-full flex justify-center items-center mt-5 text-secondary body-md-medium"
        >
          {isExpanded ? (
            <div className="flex gap-2 items-center">
              접기 <ArrowUpIcon />
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              더보기 <ArrowDownIcon />
            </div>
          )}
        </button>
      )}
    </div>
  );
}

interface MemberInfoProps {
  member: {
    id: bigint;
    nickname: string;
    profileUrl: number;
  };
}

/**
 * 개별 멤버 컴포넌트
 * @param member.id - 멤버 ID
 * @param member.nickname - 멤버 닉네임
 * @param member.profileUrl - 멤버 프로필 이미지
 */
function MemberInfo({ member }: MemberInfoProps) {
  return (
    <li className="relative group">
      <Link href="#">
        <ProfileImage
          code={member.profileUrl}
          size={32}
          className="border border-white @max-[50vw]/chatting:border-3"
        />
        <span className="absolute hidden group-hover:block top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 body-sm-regular text-text-on-brand bg-toast-black-80 px-3 py-2 rounded-md">
          {member.nickname}
        </span>
      </Link>
    </li>
  );
}
