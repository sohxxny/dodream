'use client';

import { Tabs } from '@/components/commons/tabs';
import MyPageHeader from '@/components/features/mypage/commons/mypage-header';
import { PROJECT_MAP, PROJECT_TAB_VALUES } from '@/constants/post.constant';
import useQueryParams from '@/hooks/filter/use-query-params';
import type { ProjectType } from '@/types/post.type';
import MyPostsContent from './_components/my-posts-content';

export default function MyPostsPage() {
  const { getParam, setParams } = useQueryParams();
  const currentProjectType = (getParam('projectType') ??
    PROJECT_TAB_VALUES[0]) as ProjectType;
  const currentPage = Number(getParam('page') ?? 1);

  const handleTabChange = (value: string) => {
    setParams({ projectType: value, page: null });
  };

  return (
    <>
      <MyPageHeader title="내가 쓴 글" />

      <Tabs value={currentProjectType} onValueChange={handleTabChange}>
        <Tabs.List>
          {PROJECT_TAB_VALUES.map((value) => (
            <Tabs.Trigger key={value} value={value}>
              {PROJECT_MAP[value as ProjectType]}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <MyPostsContent projectType={currentProjectType} page={currentPage} />
      </Tabs>
    </>
  );
}
