import useGetMyPostApplications from '@/hooks/my/use-get-my-post-applications';
import type { ApplicantRowUserType } from '@/types/my.type';
import RecruitmentTabSkeleton from '../recruitment-tab-skeleton';
import ApplicantsRoleTabs from './applicants-role-tabs';

interface OfferedApplicantsSectionProps {
  postId: bigint;
}

/**
 * 지원자 내역 - 내가 제안한 지원자
 */
export default function OfferedApplicantsSection({
  postId,
}: OfferedApplicantsSectionProps) {
  const { data: applications, isPending } = useGetMyPostApplications(
    BigInt(postId),
  );

  if (isPending) {
    return (
      <div className="flex flex-col gap-6">
        <h3 className="heading-sm text-primary">내가 제안한 지원자</h3>
        <RecruitmentTabSkeleton />
      </div>
    );
  }

  if (!applications) return null;

  // 내가 제안한 지원자만 필터링
  const offeredApplicants = applications.users.filter(
    (user) => user.suggestionId,
  );

  // 내가 제안한 지원자 변환
  const transformedOfferedApplicants: ApplicantRowUserType[] =
    offeredApplicants.map((applicant) => ({
      ...applicant,
      role: applicant.jobGroups[0],
    }));

  return (
    <div className="flex flex-col gap-6">
      <h3 className="heading-sm text-primary">내가 제안한 지원자</h3>
      <ApplicantsRoleTabs
        postId={postId}
        users={transformedOfferedApplicants}
        emptyMessage="합류를 제안한 멤버가 아직 제안에 응답하지 않았습니다"
      />
    </div>
  );
}
