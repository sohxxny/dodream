import EyeIcon from '@/assets/icons/eye/14.svg';

interface PostCardViewsProps {
  views: number;
}

export default function PostCardViews({ views }: PostCardViewsProps) {
  return (
    <div className="flex gap-2 items-center">
      <EyeIcon />
      <span className="body-md-medium" suppressHydrationWarning>
        {views}
      </span>
    </div>
  );
}
