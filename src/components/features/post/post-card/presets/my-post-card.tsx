import { PostCard } from '@/components/features/post/post-card';
import RecruitmentButton from '@/components/features/post/post-card/buttons/recruitment-button';
import type { MyPostsContentType } from '@/types/my.type';
import type { PostStatusType, ProjectType } from '@/types/post.type';
import { getRelativeTime, isReviewAvailable } from '@/utils/date.util';
import CreateReviewButton from '../buttons/create-review-button';
import ViewReviewButton from '../buttons/view-review-button';

interface MyPostCardProps {
  post: MyPostsContentType;
  nickname: string;
  profileImageCode: number;
}

export default function MyPostCard({
  post,
  nickname,
  profileImageCode,
}: MyPostCardProps) {
  const reviewAvailable = isReviewAvailable(post.deadlineAt);

  return (
    <PostCard
      href={`/post/${BigInt(post.postId)}`}
      imageCode={profileImageCode}
    >
      <PostCard.Header
        postId={post.postId}
        nickname={nickname}
        elapsedTime={getRelativeTime(post.createdAt)}
        projectType={post.projectType as ProjectType}
        isBookmarked={false}
        showBookmarkIcon={false}
      />

      <PostCard.Main>
        <PostCard.Title>{post.title}</PostCard.Title>

        <div className="flex flex-col gap-4">
          <PostCard.TechCategories techCategories={post.stacks} />
          <PostCard.Roles
            roles={post.roleRequirements.map((role) => role.roleName)}
          />
        </div>
      </PostCard.Main>

      <PostCard.Footer
        views={post.viewCount}
        status={post.status as PostStatusType}
      />

      <PostCard.Actions>
        {reviewAvailable ? (
          <>
            <ViewReviewButton
              disabled={post.reviewCount === 0}
              postId={BigInt(post.postId)}
            />
            <CreateReviewButton postId={BigInt(post.postId)} />
          </>
        ) : (
          <RecruitmentButton postId={post.postId} />
        )}
      </PostCard.Actions>
    </PostCard>
  );
}
