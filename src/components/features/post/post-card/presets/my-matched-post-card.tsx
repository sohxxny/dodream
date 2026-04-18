import { PostCard } from '@/components/features/post/post-card';
import ApplyDetailButton from '@/components/features/post/post-card/buttons/apply-detail-button';
import MathcingCancelButton from '@/components/features/post/post-card/buttons/matching-cancel-button';
import type { MyMatchedPostType } from '@/types/post.type';
import { getRelativeTime, isReviewAvailable } from '@/utils/date.util';
import CreateReviewButton from '../buttons/create-review-button';
import ViewReviewButton from '../buttons/view-review-button';

interface MatchedPostCardProps {
  myMatchedPost: MyMatchedPostType;
}

export default function MyMatchedPostCard({
  myMatchedPost,
}: MatchedPostCardProps) {
  const reviewAvailable = isReviewAvailable(myMatchedPost.deadlineAt);

  return (
    <PostCard
      href={`/post/${BigInt(myMatchedPost.postId)}`}
      imageCode={myMatchedPost.leaderProfileImage}
    >
      <PostCard.Header
        postId={myMatchedPost.postId}
        nickname={myMatchedPost.leaderName}
        elapsedTime={getRelativeTime(myMatchedPost.postCreatedAt)}
        projectType={myMatchedPost.projectType}
        isBookmarked={myMatchedPost.bookmarked}
      />

      <PostCard.Main>
        <PostCard.Title>{myMatchedPost.postTitle}</PostCard.Title>

        <div className="flex flex-col gap-4">
          <PostCard.TechCategories techCategories={myMatchedPost.stacks} />
          <PostCard.Roles roles={myMatchedPost.roles} />
        </div>
      </PostCard.Main>

      <PostCard.Footer
        views={myMatchedPost.viewCount}
        status={myMatchedPost.postStatus}
      />

      <PostCard.Actions>
        {reviewAvailable ? (
          <>
            <ViewReviewButton
              disabled={myMatchedPost.reviewCount === 0}
              postId={BigInt(myMatchedPost.postId)}
            />
            <CreateReviewButton postId={BigInt(myMatchedPost.postId)} />
          </>
        ) : (
          <>
            <MathcingCancelButton
              ownerNickname={myMatchedPost.leaderName}
              postId={myMatchedPost.postId}
              matchingId={myMatchedPost.id}
              variant="outline"
              size="md"
            />
            <ApplyDetailButton
              postId={BigInt(myMatchedPost.postId)}
              applicationId={myMatchedPost.applicationId}
              variant="solid"
              size="md"
            />
          </>
        )}
      </PostCard.Actions>
    </PostCard>
  );
}
