import { useState } from 'react';
import Button from '@/components/commons/buttons/button';
import Modal from '@/components/commons/modal';
import TechStackTabs from './tech-stack-tabs';
import TechStackTags from './tech-stack-tags';

interface TechStackSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStacks: number[];
  onSave?: (stacks: number[]) => void;
  maxCount?: number;
}

/**
 * 기술 스택 선택 모달
 */
export default function TechStackSelectModal({
  isOpen,
  onClose,
  initialStacks,
  onSave,
  maxCount = 5,
}: TechStackSelectModalProps) {
  const [stacks, setStacks] = useState<number[]>(initialStacks);

  const toggleStacks = (stack: number) => {
    const newStacks = stacks.includes(stack)
      ? stacks.filter((element) => element !== stack)
      : stacks.length >= maxCount
        ? stacks
        : [...stacks, stack];

    setStacks(newStacks);
  };

  // 저장 버튼 클릭 시 실제 기술 스택 리스트 세팅
  const handleSave = () => {
    onSave?.(stacks);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content
        className="flex flex-col items-center py-5 px-7 h-120"
        size="lg"
      >
        <Modal.Title>기술 스택 선택</Modal.Title>
        <Modal.Description>기술 스택을 선택하세요</Modal.Description>
        <header>
          <h3 className="body-lg-medium pb-5">기술 스택</h3>
        </header>

        {/* 기술 스택 선택 탭 */}
        <TechStackTabs draftStacks={stacks} toggleStacks={toggleStacks} />

        {/* 현재 선택된 태그 */}
        <div className="py-4 mr-auto">
          {stacks.length === 0 ? (
            <span className="text-subtle body-md-regular">
              {`최대 ${maxCount}개까지 선택해주세요.`}
            </span>
          ) : (
            <TechStackTags stacks={stacks} removeStacks={toggleStacks} />
          )}
        </div>

        <footer className="w-full flex justify-between items-center pt-4 border-t border-border-primary">
          <span>
            {stacks.length}/{maxCount} 선택됨
          </span>
          <Button variant="solid" size="xs" onClick={handleSave}>
            저장
          </Button>
        </footer>
        <Modal.Close />
      </Modal.Content>
    </Modal>
  );
}
