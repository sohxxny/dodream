'use client';

import Pagination from '@/components/commons/pagination';
import MyPageEmptyState from '@/components/features/mypage/commons/mypage-empty-state';
import MyPagePostCardSkeleton from '@/components/features/mypage/commons/mypage-post-card-skeleton';
import DefaultPostCard from '@/components/features/post/post-card/presets/default-post-card';
import { PROJECT_MAP } from '@/constants/post.constant';
import { useGetMyBookmarkedPosts } from '@/hooks/bookmark/use-get-my-bookmarked-posts';
import useQueryParams from '@/hooks/filter/use-query-params';
import type { ProjectType } from '@/types/post.type';
import { getValidPage } from '@/utils/filter.util';

interface BookmarkContentProps {
  projectType: ProjectType;
  page: number;
}

/**
 * 북마크 리스트
 * @param projectType - 프로젝트 또는 스터디
 */
export default function BookmarkContent({
  projectType,
  page,
}: BookmarkContentProps) {
  const { setParams } = useQueryParams();
  const { data: bookmarkedPosts, isPending } = useGetMyBookmarkedPosts(
    projectType,
    page - 1,
  );

  if (isPending) {
    return <MyPagePostCardSkeleton />;
  }

  if (!bookmarkedPosts) {
    return (
      <MyPageEmptyState
        title="데이터를 불러오지 못했습니다"
        description="잠시 후 다시 시도해 주세요"
      />
    );
  }

  if (bookmarkedPosts.totalElements === 0) {
    return (
      <MyPageEmptyState
        title="북마크한 글이 없습니다"
        description={`관심 있는 ${PROJECT_MAP[projectType]}를 북마크해 보세요`}
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-7">
        {bookmarkedPosts.content.map((post) => (
          <DefaultPostCard
            key={post.postId}
            id={post.postId}
            title={post.postTitle}
            status={post.postStatus}
            ownerNickname={post.leaderName}
            ownerProfileImageCode={post.leaderProfileImage}
            projectType={post.projectType}
            createDate={post.postCreatedAt.toString()}
            viewCount={post.viewCount}
            stacks={post.stacks}
            roles={post.roles}
            isBookmarked={post.bookmarked}
          />
        ))}
      </div>
      <Pagination
        currentPage={getValidPage(page, bookmarkedPosts.totalPages)}
        totalPages={bookmarkedPosts.totalPages}
        onPageChange={(p) => setParams({ page: p })}
        className="justify-center mt-6"
      />
    </>
  );
}
