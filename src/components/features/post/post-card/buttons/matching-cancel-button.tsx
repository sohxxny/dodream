'use client';

import { overlay } from 'overlay-kit';
import type { ComponentPropsWithoutRef } from 'react';
import Button from '@/components/commons/buttons/button';
import MatchingCancelModal from '@/components/features/mypage/my-posts/recruitments/modals/matching-cancel-modal';

interface MatchingCancelButtonProps
  extends Omit<
    ComponentPropsWithoutRef<typeof Button>,
    'onClick' | 'children'
  > {
  ownerNickname: string;
  postId: bigint;
  matchingId: bigint;
}

/**
 * 매칭 취소 버튼
 * @param ownerNickname - 모집글 작성자 닉네임
 * @param postId - 모집글 ID
 * @param matchingId - 매칭 ID
 */
export default function MathcingCancelButton({
  ownerNickname,
  postId,
  matchingId,
  ...props
}: MatchingCancelButtonProps) {
  const handleOpenMatchingCancelModal = () => {
    overlay.open(({ isOpen, close }) => (
      <MatchingCancelModal
        isOpen={isOpen}
        onClose={close}
        nickname={ownerNickname}
        postId={postId}
        matchingId={matchingId}
      />
    ));
  };

  return (
    <Button {...props} onClick={handleOpenMatchingCancelModal}>
      매칭 취소
    </Button>
  );
}
