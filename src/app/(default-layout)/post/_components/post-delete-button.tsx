'use client';

import { overlay } from 'overlay-kit';
import PostDeleteModal from '@/app/(default-layout)/post/_components/post-delete-modal';
import TrashIcon from '@/assets/icons/trash/24.svg';

interface PostDeleteButtonProps {
  postId: bigint;
}

export default function PostDeleteButton({ postId }: PostDeleteButtonProps) {
  const handleOpenDeleteModal = () => {
    overlay.open(({ isOpen, close }) => (
      <PostDeleteModal postId={postId} isOpen={isOpen} onClose={close} />
    ));
  };

  return (
    <button
      type="button"
      onClick={handleOpenDeleteModal}
      aria-label="모집글 삭제"
    >
      <TrashIcon className="text-icon-light" />
    </button>
  );
}
