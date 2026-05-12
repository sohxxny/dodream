'use client';

import { notFound } from 'next/navigation';
import { use } from 'react';
import { Tabs } from '@/components/commons/tabs';
import MyPageHeader from '@/components/features/mypage/commons/mypage-header';
import useQueryParams from '@/hooks/filter/use-query-params';
import { useGetPostDetail } from '@/hooks/post/use-get-posts';
import type { ErrorType } from '@/types/error.type';
import ApplicantsTabContent from './_components/applicants-tab-content';
import MembersTabContent from './_components/members-tab-content';
import OfferTabContent from './_components/offer-tab-content';

const RECRUITMENT_TABS = [
  { tabValue: 'offers', label: '제안한 내역', Content: OfferTabContent },
  {
    tabValue: 'applicants',
    label: '지원자 내역',
    Content: ApplicantsTabContent,
  },
  { tabValue: 'members', label: '멤버 내역', Content: MembersTabContent },
];

interface PostRecruitmentPageProps {
  params: Promise<{ postId: string }>;
}

export default function PostRecruitmentPage({
  params,
}: PostRecruitmentPageProps) {
  const { postId } = use(params);
  const { isError, error } = useGetPostDetail(BigInt(postId));
  const { getParam, setParams } = useQueryParams();

  if (isError && (error as unknown as ErrorType)?.code === 404) notFound();

  const currentTab = getParam('tab') ?? RECRUITMENT_TABS[0].tabValue;

  const currentTabConfig = RECRUITMENT_TABS.find(
    (tab) => tab.tabValue === currentTab,
  );
  const CurrentContent = currentTabConfig?.Content;

  const handleTabChange = (value: string) => {
    setParams({ tab: value });
  };

  return (
    <>
      <MyPageHeader title="모집 내역" isRecruitmentPage />

      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <Tabs.List>
          {RECRUITMENT_TABS.map(({ tabValue, label }) => (
            <Tabs.Trigger key={tabValue} value={tabValue}>
              {label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {CurrentContent && <CurrentContent postId={BigInt(postId)} />}
      </Tabs>
    </>
  );
}
