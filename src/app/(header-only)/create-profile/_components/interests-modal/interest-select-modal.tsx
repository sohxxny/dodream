import { useState } from 'react';
import Button from '@/components/commons/buttons/button';
import Modal from '@/components/commons/modal';
import InterestTabs from './interest-tabs';
import InterestTags from './interest-tags';

interface InterestSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialInterests: number[];
  onSave?: (interests: number[]) => void;
  maxCount?: number;
  tagVariant?: 'light' | 'dark' | 'sm';
}

/**
 * 관심분야 선택 모달
 */
export default function InterestSelectModal({
  isOpen,
  onClose,
  initialInterests,
  onSave,
  maxCount = 5,
  tagVariant = 'dark',
}: InterestSelectModalProps) {
  const [interests, setInterests] = useState<number[]>(initialInterests);

  const toggleInterests = (interestId: number) => {
    const newInterests = interests.includes(interestId)
      ? interests.filter((id) => id !== interestId)
      : interests.length >= maxCount
        ? interests
        : [...interests, interestId];

    setInterests(newInterests);
  };

  // 저장 버튼 클릭 시 실제 관심분야 리스트 세팅
  const handleSave = () => {
    onSave?.(interests);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content
        className="flex flex-col items-center py-5 px-7 h-120"
        size="lg"
      >
        <Modal.Title>관심 분야 선택</Modal.Title>
        <Modal.Description>관심 분야를 선택하세요</Modal.Description>
        <header>
          <h3 className="body-lg-medium pb-5">관심 분야</h3>
        </header>

        {/* 관심 분야 선택 탭 */}
        <InterestTabs
          draftInterests={interests}
          toggleInterests={toggleInterests}
        />

        {/* 현재 선택된 태그 */}
        <div className="py-6 mr-auto">
          {interests.length === 0 ? (
            <span className="text-subtle body-md-regular">
              {`가장 관심 있는 분야부터 순서대로 최대 ${maxCount}개까지 선택해주세요.`}
            </span>
          ) : (
            <InterestTags
              interests={interests}
              removeInterest={toggleInterests}
              variant={tagVariant}
            />
          )}
        </div>

        <footer className="w-full flex justify-between items-center pt-4 border-t border-border-primary">
          <span>
            {interests.length}/{maxCount} 선택됨
          </span>
          <Button
            variant="solid"
            size="xs"
            onClick={handleSave}
            disabled={interests.length === 0}
          >
            저장
          </Button>
        </footer>
        <Modal.Close />
      </Modal.Content>
    </Modal>
  );
}
