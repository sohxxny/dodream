'use client';

import Pagination from '@/components/commons/pagination';
import { Tabs } from '@/components/commons/tabs';
import MyPageEmptyState from '@/components/features/mypage/commons/mypage-empty-state';
import MyPagePostCardSkeleton from '@/components/features/mypage/commons/mypage-post-card-skeleton';
import MyPostsEmptyState from '@/components/features/mypage/my-posts/my-posts-empty-state';
import MyPostCard from '@/components/features/post/post-card/presets/my-post-card';
import useQueryParams from '@/hooks/filter/use-query-params';
import useGetMyPosts from '@/hooks/my/use-get-my-posts';
import { useGetProfile } from '@/hooks/profile/use-get-profile';
import type { ProjectType } from '@/types/post.type';
import { getValidPage } from '@/utils/filter.util';

interface MyPostsContentProps {
  projectType: ProjectType;
  page: number;
}

export default function MyPostsContent({
  projectType,
  page,
}: MyPostsContentProps) {
  const { setParams } = useQueryParams();
  const { data: posts, isPending } = useGetMyPosts(projectType, page - 1);
  const { data: profile } = useGetProfile();

  if (isPending) {
    return <MyPagePostCardSkeleton />;
  }

  if (!posts) {
    return (
      <MyPageEmptyState
        title="데이터를 불러오지 못했습니다"
        description="잠시 후 다시 시도해 주세요"
      />
    );
  }

  if (posts.posts.length === 0) {
    return <MyPostsEmptyState />;
  }

  return (
    <Tabs.Content
      value={projectType}
      showPagination
      paginationSlot={
        <Pagination
          currentPage={getValidPage(page, posts.totalPages)}
          totalPages={posts.totalPages}
          onPageChange={(p) => setParams({ page: p })}
          className="justify-center mt-6"
        />
      }
    >
      {profile &&
        posts.posts.map((post) => (
          <MyPostCard
            key={post.postId}
            post={post}
            nickname={profile.nickname}
            profileImageCode={profile.profileImageCode}
          />
        ))}
    </Tabs.Content>
  );
}
