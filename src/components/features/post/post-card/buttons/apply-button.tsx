'use client';

import { isPast } from 'date-fns';
import { overlay } from 'overlay-kit';
import Button from '@/components/commons/buttons/button';
import ApplyModal from '@/components/features/mypage/participations/modals/apply-modal';
import useToast from '@/hooks/use-toast';
import type { PostStatusType } from '@/types/post.type';

interface ApplyButtonProps {
  postId: bigint;
  applicationId?: bigint;
  matchedId?: bigint;
  deadlineDate: string;
  status: PostStatusType;
  roles: string[];
  profileExists?: { exists: boolean };
  variant?: 'default' | 'brand' | 'solid' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * 지원하기 버튼
 */
export default function ApplyButton({
  postId,
  applicationId,
  matchedId,
  deadlineDate,
  status,
  roles,
  profileExists,
  variant,
  size,
  className,
  ...props
}: ApplyButtonProps) {
  const toast = useToast();

  /** 지원하기 */
  const handleOpenApplyModal = () => {
    // 로그인하지 않았을 경우 disabled가 아닌 토스트 메시지 띄우기
    if (!profileExists?.exists) {
      toast({ title: '로그인이 필요합니다' });
      return;
    }

    if (applicationId) {
      toast({ title: '이미 지원한 공고입니다' });
      return;
    }

    if (matchedId) {
      toast({ title: '매칭이 취소된 공고는 다시 지원할 수 없습니다.' });
      return;
    }

    // 데드라인 날짜 이후일 경우 실패 처리
    if (isPast(new Date(deadlineDate)) || status === 'COMPLETED') {
      toast({ title: '마감된 공고입니다.' });
      return;
    }

    overlay.open(({ isOpen, close }) => (
      <ApplyModal
        postId={postId}
        roles={roles}
        isOpen={isOpen}
        onClose={close}
      />
    ));
  };

  return (
    <Button
      onClick={handleOpenApplyModal}
      variant={variant}
      size={size}
      disabled={status === 'COMPLETED'}
      {...props}
    >
      {status === 'RECRUITING' ? '지원하기' : '모집 마감'}
    </Button>
  );
}
