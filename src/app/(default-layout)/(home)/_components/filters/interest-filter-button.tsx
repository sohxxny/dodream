import { DropdownMenu } from 'radix-ui';
import { useState } from 'react';
import InterestTabs from '@/app/(header-only)/create-profile/_components/interests-modal/interest-tabs';
import InterestTags from '@/app/(header-only)/create-profile/_components/interests-modal/interest-tags';
import useQueryParams from '@/hooks/filter/use-query-params';
import type { InterestsType } from '@/types/profile.type';
import { convertInterestToId } from '@/utils/profile.util';
import HomeFilterButton from './home-filter-button';

export default function InterestFilterButton() {
  const { getArrayParam, setFilterParams } = useQueryParams();
  const [interests, setInterests] = useState<number[]>([]);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      const currentInterests = getArrayParam('interests') as InterestsType[];
      setInterests(
        currentInterests
          .map(convertInterestToId)
          .filter((id): id is number => id !== undefined),
      );
    }
  };

  const toggleInterests = (interestId: number) => {
    const newInterests = interests.includes(interestId)
      ? interests.filter((id) => id !== interestId)
      : [...interests, interestId];
    setInterests(newInterests);
    setFilterParams({
      interests: newInterests.length > 0 ? newInterests : null,
    });
  };

  return (
    <DropdownMenu.Root onOpenChange={handleOpenChange}>
      <DropdownMenu.Trigger asChild>
        <HomeFilterButton className="hover:bg-primary">
          관심 분야
        </HomeFilterButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={8}
          className="z-50 flex flex-col items-center bg-surface py-5 px-7 h-120 w-modal-lg shadow-card rounded-md outline-none"
        >
          <header>
            <h3 className="body-lg-medium pb-5">관심 분야</h3>
          </header>
          <InterestTabs
            draftInterests={interests}
            toggleInterests={toggleInterests}
          />
          <div className="py-6 mr-auto">
            {interests.length === 0 ? (
              <span className="text-subtle body-md-regular">
                선택된 태그가 없습니다
              </span>
            ) : (
              <InterestTags
                interests={interests}
                removeInterest={toggleInterests}
                variant="sm"
              />
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
