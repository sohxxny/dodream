'use client';

import BookmarkedPageTabContent from '@/app/(default-layout)/mypage/bookmarks/_components/tab-content';
import Pagination from '@/components/commons/pagination';
import { Tabs } from '@/components/commons/tabs';
import MyPageHeader from '@/components/features/mypage/commons/mypage-header';
import { PROJECT_MAP, PROJECT_TAB_VALUES } from '@/constants/post.constant';
import useGetMyBookmarkedPosts from '@/hooks/bookmark/use-get-my-bookmarked-posts';
import useQueryParams from '@/hooks/filter/use-query-params';
import type { ProjectType } from '@/types/post.type';
import { getValidPage } from '@/utils/filter.util';

export default function BookmarkPage() {
  const { getParam, setParams } = useQueryParams();
  const currentProjectType = (getParam('projectType') ??
    PROJECT_TAB_VALUES[0]) as ProjectType;
  const currentPage = Number(getParam('page') ?? 1);

  const { data: bookmarkedPosts } = useGetMyBookmarkedPosts(
    currentProjectType,
    currentPage - 1,
  );

  if (!bookmarkedPosts) return null;

  // 탭 선택 핸들러
  const handleTabChange = (value: string) => {
    setParams({ projectType: value, page: null });
  };

  return (
    <>
      <MyPageHeader title="북마크" />

      <Tabs value={currentProjectType} onValueChange={handleTabChange}>
        <Tabs.List>
          {PROJECT_TAB_VALUES.map((value) => (
            <Tabs.Trigger key={value} value={value}>
              {PROJECT_MAP[value as ProjectType]}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value={currentProjectType}>
          <BookmarkedPageTabContent
            bookmarkedPosts={bookmarkedPosts}
            projectType={currentProjectType}
          />
        </Tabs.Content>
      </Tabs>

      {bookmarkedPosts.content.length !== 0 && (
        <Pagination
          currentPage={getValidPage(currentPage, bookmarkedPosts.totalPages)}
          totalPages={bookmarkedPosts.totalPages}
          onPageChange={(page) => setParams({ page })}
          className="justify-center mt-6"
        />
      )}
    </>
  );
}
