'use client';

import Button from '@/components/commons/buttons/button';
import Pagination from '@/components/commons/pagination';
import { Tabs } from '@/components/commons/tabs';
import {
  HOME_PROJECT_MAP,
  HOME_PROJECT_TAB_VALUES,
} from '@/constants/post.constant';
import useQueryParams from '@/hooks/filter/use-query-params';
import { useGetPosts } from '@/hooks/post/use-get-posts';
import type { HomeProjectType } from '@/types/post.type';
import { getValidPage } from '@/utils/filter.util';
import HomeFilters from './filters/home-filters';
import HomePostCards from './home-post-cards';

export default function HomePosts() {
  const {
    getParam,
    setParams,
    setFilterParams,
    filterParams,
    getApiQueryString,
    clearParams,
  } = useQueryParams();
  const { data: posts } = useGetPosts(getApiQueryString());

  const activePostType = (getParam('type') as HomeProjectType) || 'ALL';

  // 탭 클릭 핸들러
  const handleTabChange = (value: string) => {
    if (value === 'ALL') {
      setFilterParams({ type: null });
    } else {
      setFilterParams({ type: value });
    }
  };

  // 페이지네이션 클릭 핸들러
  const handlePageChange = (page: number) => {
    setParams({ page: page });
  };

  return (
    <section
      className="col-span-12 flex flex-col gap-8"
      aria-labelledby="home-posts-heading"
    >
      <h2 id="home-posts-heading" className="sr-only">
        모집 게시글 목록
      </h2>
      <Tabs
        className="w-fit"
        value={activePostType}
        onValueChange={handleTabChange}
      >
        <Tabs.List
          className="col-span-2 flex p-3 gap-3 bg-primary rounded-lg"
          aria-label="게시글 타입 필터"
        >
          {HOME_PROJECT_TAB_VALUES.map((tabValue) => (
            <Tabs.Trigger key={tabValue} value={tabValue}>
              {HOME_PROJECT_MAP[tabValue as HomeProjectType]}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs>

      {/* 필터 */}
      <HomeFilters />

      {/* 게시물 리스트 */}
      {!posts ? null : posts.posts.content.length === 0 ? (
        Object.entries(filterParams).length === 0 ? (
          <section
            className="flex flex-col gap-2 items-center justify-center body-lg-medium pt-9 pb-44"
            aria-label="게시물 없음"
          >
            <p>아직 등록된 글이 없습니다</p>
            <p className="text-subtle">
              첫 번째 모집 글을 작성하고 팀원을 찾아보세요
            </p>
          </section>
        ) : (
          <section
            className="flex flex-col gap-2 items-center justify-center body-lg-medium pt-9 pb-25.5"
            aria-label="필터링 결과 없음"
          >
            <p>필터링 결과가 없습니다</p>
            <p className="text-subtle">
              필터 옵션을 변경하거나 검색어를 수정해 주세요
            </p>
            <Button
              variant="solid"
              size="md"
              className="mt-8"
              onClick={clearParams}
            >
              검색 및 필터 초기화
            </Button>
          </section>
        )
      ) : (
        <>
          <HomePostCards posts={posts.posts.content} />
          <Pagination
            currentPage={getValidPage(
              getParam('page'),
              posts?.posts.totalPages,
            )}
            totalPages={posts.posts.totalPages}
            onPageChange={handlePageChange}
            className="mt-[28px] w-full justify-center"
          />
        </>
      )}
    </section>
  );
}
