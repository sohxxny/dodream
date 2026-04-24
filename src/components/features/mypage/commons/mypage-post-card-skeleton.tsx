import Skeleton from '@/components/commons/skeleton';

export default function MyPagePostCardSkeleton() {
  return (
    <Skeleton
      count={4}
      listClassName="grid grid-cols-2 gap-7"
      itemClassName="h-[272px]"
    />
  );
}
