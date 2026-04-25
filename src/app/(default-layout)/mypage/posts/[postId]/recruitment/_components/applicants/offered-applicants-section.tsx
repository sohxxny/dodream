import type {
  ApplicantRowUserType,
  MyPostApplicationsType,
} from '@/types/my.type';
import type { PostDetailType, PostMembersType } from '@/types/post.type';
import ApplicantsRoleTabs from './applicants-role-tabs';

interface OfferedApplicantsSectionProps {
  postId: bigint;
  applications: MyPostApplicationsType;
  postDetail: PostDetailType;
  members: PostMembersType | undefined;
}

/**
 * 지원자 내역 - 내가 제안한 지원자
 */
export default function OfferedApplicantsSection({
  postId,
  applications,
  postDetail,
  members,
}: OfferedApplicantsSectionProps) {
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
        postDetail={postDetail}
        members={members}
        users={transformedOfferedApplicants}
        emptyMessage="합류를 제안한 멤버가 아직 제안에 응답하지 않았습니다"
      />
    </div>
  );
}
