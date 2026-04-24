import Skeleton from '@/components/commons/skeleton';

export default function RecruitmentTabSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton
        count={3}
        listClassName="flex gap-4"
        itemClassName="h-9 w-20 rounded-full"
      />
      <Skeleton
        count={2}
        listClassName="flex flex-col gap-3"
        itemClassName="h-14 w-full"
      />
    </div>
  );
}
