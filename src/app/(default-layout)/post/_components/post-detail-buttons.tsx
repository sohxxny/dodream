'use client';

import Skeleton from '@/components/commons/skeleton';
import ChatButton from '@/components/features/post/post-card/buttons/chat-button';
import { useGetPostDetail } from '@/hooks/post/use-get-posts';
import { useGetProfileExists } from '@/hooks/profile/use-get-profile';
import { formatDeadlineAt } from '@/utils/date.util';
import PostActionButton from './post-action-button';

interface PostDetailButtonsProps {
  postId: bigint;
}

/**
 * 모집글 상세 페이지 우측 상단의 버튼 그룹
 * @param postData - 모집글 상세 정보
 */
export default function PostDetailButtons({ postId }: PostDetailButtonsProps) {
  const { data: postData } = useGetPostDetail(postId);
  const { data: profileExists } = useGetProfileExists();

  if (!postData || !profileExists)
    return <Skeleton count={1} listClassName="h-12.5" itemClassName="h-full" />;

  const isClosed = new Date(postData.deadlineDate) < new Date();

  // 작성자인 경우: 마감일만 표시
  if (postData.owner) {
    return (
      <div className="flex items-center justify-center h-12.5 body-lg-medium bg-brand text-text-on-brand p-3 w-full rounded-md">
        마감 {formatDeadlineAt(new Date(postData.deadlineDate))}
      </div>
    );
  }

  // 작성자가 아닌 경우: 채팅하기 + 액션 버튼
  return (
    <>
      {!isClosed ? (
        <div className="flex gap-4 h-12.5 body-lg-medium">
          <ChatButton postId={postData.id} />
          <PostActionButton
            postId={postData.id}
            postData={postData}
            profileExists={profileExists}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-12.5 body-lg-medium bg-disabled text-text-on-brand p-3 w-full rounded-md">
          모집 마감
        </div>
      )}
    </>
  );
}
