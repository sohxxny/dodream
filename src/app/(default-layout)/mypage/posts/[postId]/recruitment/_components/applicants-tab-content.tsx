'use client';

import Skeleton from '@/components/commons/skeleton';
import useGetMyPostApplications from '@/hooks/my/use-get-my-post-applications';
import useGetPostMembers from '@/hooks/post/use-get-post-members';
import { useGetPostDetail } from '@/hooks/post/use-get-posts';
import AppliedApplicantsSection from './applicants/applied-applicants-section';
import OfferedApplicantsSection from './applicants/offered-applicants-section';
import RecruitmentTabSkeleton from './recruitment-tab-skeleton';

interface ApplicantsTabContentProps {
  postId: bigint;
}

export default function ApplicantsTabContent({
  postId,
}: ApplicantsTabContentProps) {
  const { data: applications, isPending: isApplicationsPending } =
    useGetMyPostApplications(postId);
  const { data: postDetail, isPending: isPostDetailPending } =
    useGetPostDetail(postId);
  const { data: members, isPending: isMembersPending } =
    useGetPostMembers(postId);

  const isPending =
    isApplicationsPending || isPostDetailPending || isMembersPending;

  if (isPending) {
    return (
      <div className="col-span-full flex flex-col gap-6">
        <Skeleton count={1} itemClassName="h-[25px] w-35" />
        <RecruitmentTabSkeleton />
      </div>
    );
  }

  if (!applications || !postDetail) return null;

  return (
    <div className="col-span-full flex flex-col gap-11">
      <OfferedApplicantsSection
        postId={postId}
        applications={applications}
        postDetail={postDetail}
        members={members}
      />
      <AppliedApplicantsSection
        postId={postId}
        applications={applications}
        postDetail={postDetail}
        members={members}
      />
    </div>
  );
}
