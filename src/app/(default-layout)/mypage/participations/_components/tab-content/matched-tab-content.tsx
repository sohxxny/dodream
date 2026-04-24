'use client';

import Pagination from '@/components/commons/pagination';
import { Tabs } from '@/components/commons/tabs';
import MyPageEmptyState from '@/components/features/mypage/commons/mypage-empty-state';
import MyPagePostCardSkeleton from '@/components/features/mypage/commons/mypage-post-card-skeleton';
import MyMatchedPostCard from '@/components/features/post/post-card/presets/my-matched-post-card';
import useQueryParams from '@/hooks/filter/use-query-params';
import useGetMatchedPosts from '@/hooks/post/use-get-matched-posts';

interface MatchedTabContentProps {
  tabValue: string;
}

export default function MatchedTabContent({
  tabValue,
}: MatchedTabContentProps) {
  const { getParam, setParams } = useQueryParams();
  const currentPage = Number(getParam('page') ?? 1);

  const { data: myMatchedPosts, isPending } = useGetMatchedPosts(
    currentPage - 1,
  );

  if (isPending) {
    return <MyPagePostCardSkeleton />;
  }

  if (!myMatchedPosts) {
    return (
      <MyPageEmptyState
        title="데이터를 불러오지 못했습니다"
        description="잠시 후 다시 시도해 주세요"
      />
    );
  }

  if (myMatchedPosts.content.length === 0) {
    return (
      <MyPageEmptyState
        title="매칭 내역이 없습니다."
        description="지금 지원하거나 새 글을 작성하여 매칭을 시작하세요."
      />
    );
  }

  return (
    <Tabs.Content
      key={tabValue}
      value={tabValue}
      showPagination
      paginationSlot={
        <Pagination
          currentPage={currentPage}
          totalPages={myMatchedPosts.totalPages}
          onPageChange={(page) => setParams({ page })}
          className="justify-center mt-[36px]"
        />
      }
    >
      {myMatchedPosts?.content?.map((myMatchedPost) => (
        <MyMatchedPostCard
          key={myMatchedPost.id}
          myMatchedPost={myMatchedPost}
        />
      ))}
    </Tabs.Content>
  );
}
