import Link from 'next/link';
import EditIcon from '@/assets/icons/edit/24.svg';

interface PostEditButtonProps {
  postId: bigint;
}

export default function PostEditButton({ postId }: PostEditButtonProps) {
  return (
    <Link href={`/posts/edit/${BigInt(postId)}`} aria-label="모집글 수정">
      <EditIcon className="text-icon-light" />
    </Link>
  );
}
