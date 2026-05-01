import { DropdownMenu } from 'radix-ui';
import { useState } from 'react';
import TechStackTabs from '@/app/(header-only)/create-profile/_components/tech-stack-modal/tech-stack-tabs';
import TechStackTags from '@/app/(header-only)/create-profile/_components/tech-stack-modal/tech-stack-tags';
import useQueryParams from '@/hooks/filter/use-query-params';
import type { TechStackType } from '@/types/profile.type';
import { convertTechStackToId } from '@/utils/profile.util';
import HomeFilterButton from './home-filter-button';

export default function TechStackFilterButton() {
  const { getArrayParam, setParams } = useQueryParams();
  const [stacks, setStacks] = useState<number[]>([]);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      const currentTechs = getArrayParam('techs') as TechStackType[];
      setStacks(
        currentTechs
          .map(convertTechStackToId)
          .filter((id): id is number => id !== undefined),
      );
    }
  };

  const toggleStacks = (stack: number) => {
    const newStacks = stacks.includes(stack)
      ? stacks.filter((element) => element !== stack)
      : [...stacks, stack];
    setStacks(newStacks);
    setParams({ techs: newStacks.length > 0 ? newStacks : null });
  };

  return (
    <DropdownMenu.Root onOpenChange={handleOpenChange}>
      <DropdownMenu.Trigger asChild>
        <HomeFilterButton className="hover:bg-primary">
          기술 스택
        </HomeFilterButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={8}
          className="z-50 flex flex-col items-center bg-surface py-5 px-7 h-120 w-modal-lg shadow-card rounded-md outline-none"
        >
          <header>
            <h3 className="body-lg-medium pb-5">기술 스택</h3>
          </header>
          <TechStackTabs draftStacks={stacks} toggleStacks={toggleStacks} />
          <div className="py-4 mr-auto">
            {stacks.length === 0 ? (
              <span className="text-subtle body-md-regular">
                선택된 태그가 없습니다.
              </span>
            ) : (
              <TechStackTags stacks={stacks} removeStacks={toggleStacks} />
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
