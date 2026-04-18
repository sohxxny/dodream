'use client';

import { useMemo } from 'react';
import BookmarkButton from '@/components/features/post/bookmark-button';
import { useGetMyBookmarksByPostId } from '@/hooks/bookmark/use-get-my-bookmarked-posts';
import PostDeleteButton from './post-delete-button';
import PostEditButton from './post-edit-button';
import PostLinkButton from './post-link-button';

interface PostHeaderButtonsProps {
  postId: bigint;
  isOwner: boolean;
}

/**
 * 모집글 상세 페이지의 헤더 버튼
 * 작성자일 경우: 수정/삭제 버튼
 * 작성자가 아닐 경우: 북마크/링크 복사 버튼
 * @param isOwner - 작성자인지 여부
 */
export default function PostHeaderButtons({
  postId,
  isOwner,
}: PostHeaderButtonsProps) {
  const postIds = useMemo(() => [BigInt(postId).toString()], [postId]);
  const { data: bookmarkIds = new Set() } = useGetMyBookmarksByPostId(postIds);

  return (
    <div className="flex ml-auto gap-7">
      {isOwner ? (
        <>
          <PostEditButton postId={postId} />
          <PostDeleteButton postId={postId} />
        </>
      ) : (
        <>
          <BookmarkButton
            postId={postId}
            isBookmarked={bookmarkIds.has(BigInt(postId).toString())}
          />
          <PostLinkButton />
        </>
      )}
    </div>
  );
}
