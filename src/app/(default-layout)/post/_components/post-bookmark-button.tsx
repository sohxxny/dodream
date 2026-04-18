'use client';

import { useMemo } from 'react';
import BookmarkIcon from '@/assets/icons/bookmark/24.svg';
import { useGetMyBookmarksByPostId } from '@/hooks/bookmark/use-get-my-bookmarked-posts';
import useToggleBookmark from '@/hooks/bookmark/use-toggle-bookmark';
import { useGetProfileExists } from '@/hooks/profile/use-get-profile';

interface PostBookmarkButtonProps {
  postId: bigint;
}

/**
 * 게시글 상세의 북마크 버튼 컴포넌트
 * @param postId - 모집글 ID
 */
export default function PostBookmarkButton({
  postId,
}: PostBookmarkButtonProps) {
  const postIds = useMemo(() => [postId.toString()], [postId]);
  const { data: bookmarkIds = new Set() } = useGetMyBookmarksByPostId(postIds);
  const { mutate, isPending } = useToggleBookmark();
  const { data: profileExists } = useGetProfileExists();

  const isBookmarked = bookmarkIds.has(postId.toString());

  const handleToggleBookmark = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    if (!profileExists?.exists || isPending) {
      return;
    }
    mutate(postId);
  };

  return (
    <button
      type="button"
      aria-label={isBookmarked ? '북마크 해제' : '북마크 추가'}
      onClick={handleToggleBookmark}
      disabled={isPending}
    >
      <BookmarkIcon
        className={
          isBookmarked
            ? 'fill-bg-brand text-bg-brand'
            : 'fill-none text-icon-light'
        }
      />
    </button>
  );
}
