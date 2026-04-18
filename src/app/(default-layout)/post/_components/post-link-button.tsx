'use client';

import LinkIcon from '@/assets/icons/link/24.svg';
import useToast from '@/hooks/use-toast';

/**
 * 링크 복사 버튼 컴포넌트
 */
export default function PostLinkButton() {
  const toast = useToast();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: '링크를 복사했습니다',
      });
    } catch {
      toast({
        title: '링크를 복사하지 못했습니다. 잠시 후 다시 시도해주세요.',
      });
    }
  };

  return (
    <button type="button" aria-label="링크 복사" onClick={handleCopyLink}>
      <LinkIcon className="text-icon-light" aria-hidden="true" />
    </button>
  );
}
