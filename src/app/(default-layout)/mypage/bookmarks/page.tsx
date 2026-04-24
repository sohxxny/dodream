'use client';

import { Tabs } from '@/components/commons/tabs';
import MyPageHeader from '@/components/features/mypage/commons/mypage-header';
import { PROJECT_MAP, PROJECT_TAB_VALUES } from '@/constants/post.constant';
import useQueryParams from '@/hooks/filter/use-query-params';
import type { ProjectType } from '@/types/post.type';
import BookmarkContent from './_components/bookmark-content';

export default function BookmarkPage() {
  const { getParam, setParams } = useQueryParams();
  const currentProjectType = (getParam('projectType') ??
    PROJECT_TAB_VALUES[0]) as ProjectType;
  const currentPage = Number(getParam('page') ?? 1);

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

        <Tabs.Content value={currentProjectType} columns={1}>
          <BookmarkContent
            projectType={currentProjectType}
            page={currentPage}
          />
        </Tabs.Content>
      </Tabs>
    </>
  );
}
