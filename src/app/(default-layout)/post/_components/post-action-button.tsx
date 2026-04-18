'use client';

import ApplyButton from '@/components/features/post/post-card/buttons/apply-button';
import ApplyCancelButton from '@/components/features/post/post-card/buttons/apply-cancel-button';
import MathcingCancelButton from '@/components/features/post/post-card/buttons/matching-cancel-button';
import type { PostDetailType } from '@/types/post.type';

interface PostActionButtonProps {
  postId: bigint;
  postData: PostDetailType;
  profileExists: { exists: boolean };
}

/**
 * 모집글 상세 페이지의 액션 버튼 (지원하기/지원취소/매칭취소)
 * 사용자 상태에 따라 적절한 버튼을 표시
 */
export default function PostActionButton({
  postId,
  postData,
  profileExists,
}: PostActionButtonProps) {
  // 비로그인 상태: 지원하기 버튼
  if (!profileExists?.exists) {
    return (
      <ApplyButton
        postId={postData.id}
        applicationId={postData.applicationId}
        matchedId={postData.matchedId}
        deadlineDate={postData.deadlineDate}
        status={postData.status}
        roles={postData.roles.map((r) => r.role)}
        profileExists={profileExists}
        variant="brand"
        size="md"
      />
    );
  }

  // 지원한 상태 (대기 중): 지원 취소 버튼
  if (!postData.matchedId && postData.applicationId) {
    return (
      <ApplyCancelButton
        postId={postId}
        applicationId={BigInt(postData.applicationId)}
        ownerNickname={postData.ownerNickname}
        variant="brand"
        size="md"
      />
    );
  }

  // 매칭된 경우: 매칭 취소 버튼
  if (postData.applicationId && postData.matchedId) {
    return (
      <MathcingCancelButton
        postId={postId}
        ownerNickname={postData.ownerNickname}
        matchingId={postData.matchedId}
        variant="brand"
        size="md"
      />
    );
  }

  // 지원 가능한 상태: 지원하기 버튼 (지원 가능/매칭 취소 상태)
  return (
    <ApplyButton
      postId={postData.id}
      applicationId={postData.applicationId}
      matchedId={postData.matchedId}
      deadlineDate={postData.deadlineDate}
      status={postData.status}
      roles={postData.roles.map((r) => r.role)}
      profileExists={profileExists}
      variant="brand"
      size="md"
    />
  );
}
