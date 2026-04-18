'use client';

import BookmarkIcon from '@/assets/icons/bookmark/24.svg';
import useToggleBookmark from '@/hooks/bookmark/use-toggle-bookmark';
import { useGetProfileExists } from '@/hooks/profile/use-get-profile';

interface BookmarkButtonProps {
  postId: bigint;
  isBookmarked: boolean;
}

/**
 * 북마크 버튼 컴포넌트
 * @param postId - 모집글 ID
 * @param isBookmarked - 북마크 여부
 */
export default function BookmarkButton({
  postId,
  isBookmarked,
}: BookmarkButtonProps) {
  const { mutate, isPending } = useToggleBookmark();
  const { data: profileExists } = useGetProfileExists();

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
