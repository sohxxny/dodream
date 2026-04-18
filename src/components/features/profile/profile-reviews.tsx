'use client';

import { useState } from 'react';
import ArrowDownIcon from '@/assets/icons/chevron-down/14.svg';
import ArrowUpIcon from '@/assets/icons/chevron-up/14.svg';
import ThumbsUpIcon from '@/assets/icons/thumbs-up/14.svg';
import Skeleton from '@/components/commons/skeleton';
import useGetReceivedReviews from '@/hooks/review/use-get-received-reviews';
import { getReviewSummary } from '@/utils/review.util';
import { ReviewTagList } from '../reviews/review-tag-list';

interface ProfileReviewsProps {
  userId: bigint;
  nickname: string;
}

/** 프로필의 리뷰 섹션 */
export default function ProfileReviews({
  nickname,
  userId,
}: ProfileReviewsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: reviews, isLoading } = useGetReceivedReviews(BigInt(userId));
  const { positiveCount, result } = getReviewSummary(reviews ?? [], true);
  const visibleResult = isExpanded ? result : result.slice(0, 3);

  return (
    <section className="flex flex-col pb-13">
      <h3 className="heading-md mb-3">{nickname}님이 받은 후기</h3>

      {isLoading ? (
        <div className="flex flex-col gap-7">
          <Skeleton count={1} itemClassName="h-6 w-[280px]" />
          <Skeleton
            count={3}
            listClassName="flex flex-col gap-3"
            itemClassName="h-[50px] w-full"
          />
        </div>
      ) : result.length === 0 ? (
        <p className="body-md-medium text-secondary">아직 받은 후기가 없어요</p>
      ) : (
        <>
          <div className="flex items-center gap-2 text-secondary mb-7">
            <ThumbsUpIcon />
            <p className="body-md-medium">
              {(reviews ?? []).length}명 중 {positiveCount}명이 함께한 경험이
              좋았다고 말했어요
            </p>
          </div>
          <ReviewTagList reviews={visibleResult} />

          {result.length > 3 && (
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="w-full flex justify-center items-center mt-5 text-secondary body-md-medium"
            >
              {isExpanded ? (
                <div className="flex gap-2 items-center">
                  접기 <ArrowUpIcon />
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  더보기 <ArrowDownIcon />
                </div>
              )}
            </button>
          )}
        </>
      )}
    </section>
  );
}
