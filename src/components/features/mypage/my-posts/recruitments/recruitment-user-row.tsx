import Link from 'next/link';
import RecommendTags from '@/app/(default-layout)/(home)/_components/recommend-tags';
import ProfileImage from '@/components/commons/profile-image';
import { EXPERIENCE } from '@/constants/profile.constant';
import type { RecommendType } from '@/types/post.type';
import { parseExperienceValue } from '@/utils/profile.util';

interface RecruitmentUserRowProps {
  postId: bigint;
  userId: bigint;
  nickname: string;
  profileImageCode: number;
  experience: string;
  role: string;
  actions?: React.ReactNode;
  href?: string;
  matchReasons?: RecommendType[];
}

export default function RecruitmentUserRow({
  nickname,
  profileImageCode,
  experience,
  role,
  actions,
  href,
  matchReasons,
}: RecruitmentUserRowProps) {
  const InnerContent = (
    <>
      <div className="col-span-2 flex items-center gap-3 overflow-x-hidden">
        <ProfileImage code={profileImageCode} size={40} userName={nickname} />
        <div className="flex flex-col">
          <span className="body-lg-medium truncate">{nickname}</span>
          <div className="body-sm-regular text-secondary flex items-center gap-1">
            <span>{role}</span>
            <span>·</span>
            <span>
              경력 {EXPERIENCE[parseExperienceValue(experience) ?? 'new']}
            </span>
          </div>
        </div>
      </div>

      {matchReasons && (
        <div className="col-span-4 flex items-center gap-2">
          <RecommendTags labels={matchReasons} />
        </div>
      )}
    </>
  );

  return (
    <div className="grid grid-cols-subgrid col-span-full pb-6">
      {href ? (
        <Link href={href} className="grid grid-cols-subgrid col-span-6">
          {InnerContent}
        </Link>
      ) : (
        <div className="grid grid-cols-subgrid col-span-6">{InnerContent}</div>
      )}

      <div className="col-span-2 flex gap-4 justify-end">{actions}</div>
    </div>
  );
}
