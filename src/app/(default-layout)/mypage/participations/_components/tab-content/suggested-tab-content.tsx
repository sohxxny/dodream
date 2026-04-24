'use client';

import Pagination from '@/components/commons/pagination';
import { Tabs } from '@/components/commons/tabs';
import MyPageEmptyState from '@/components/features/mypage/commons/mypage-empty-state';
import MyPagePostCardSkeleton from '@/components/features/mypage/commons/mypage-post-card-skeleton';
import SuggestedPostCard from '@/components/features/post/post-card/presets/suggested-post-card';
import useQueryParams from '@/hooks/filter/use-query-params';
import useGetMySuggestedPosts from '@/hooks/my/use-get-my-suggested.posts';

interface SuggestedTabContentProps {
  tabValue: string;
}

export default function SuggestedTabContent({
  tabValue,
}: SuggestedTabContentProps) {
  const { getParam, setParams } = useQueryParams();
  const currentPage = Number(getParam('page') ?? 1);

  const { data: suggestedPosts, isPending } = useGetMySuggestedPosts(
    currentPage - 1,
  );

  if (isPending) {
    return <MyPagePostCardSkeleton />;
  }

  if (!suggestedPosts) {
    return (
      <MyPageEmptyState
        title="데이터를 불러오지 못했습니다"
        description="잠시 후 다시 시도해 주세요"
      />
    );
  }

  if (suggestedPosts.content.length === 0) {
    return (
      <MyPageEmptyState
        title="제안받은 내역이 없습니다"
        description="프로필을 완성하고 더 많은 매칭 제안을 받으세요"
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
          totalPages={suggestedPosts.totalPages}
          onPageChange={(page) => setParams({ page })}
          className="justify-center mt-[36px]"
        />
      }
    >
      {suggestedPosts?.content.map((mySuggestedPost) => (
        <SuggestedPostCard
          key={mySuggestedPost.id}
          mySuggestedPost={mySuggestedPost}
        />
      ))}
    </Tabs.Content>
  );
}
