'use client';

import { PostCard } from '@/components/features/post/post-card';
import ApplyButton from '@/components/features/post/post-card/buttons/apply-button';
import ChatButton from '@/components/features/post/post-card/buttons/chat-button';
import { useGetProfileExists } from '@/hooks/profile/use-get-profile';
import type { MySuggestedPostType } from '@/types/post.type';
import { getRelativeTime } from '@/utils/date.util';

interface SuggestedPostCardProps {
  mySuggestedPost: MySuggestedPostType;
}

export default function SuggestedPostCard({
  mySuggestedPost,
}: SuggestedPostCardProps) {
  const { data: profileExists } = useGetProfileExists();

  return (
    <PostCard
      href={`/post/${BigInt(mySuggestedPost.postId)}`}
      imageCode={mySuggestedPost.leaderProfileImage}
    >
      <PostCard.Header
        postId={mySuggestedPost.postId}
        nickname={mySuggestedPost.leaderName}
        elapsedTime={getRelativeTime(mySuggestedPost.postCreatedAt)}
        projectType={mySuggestedPost.projectType}
        isBookmarked={mySuggestedPost.bookmarked}
      />

      <PostCard.Main>
        <PostCard.Title>{mySuggestedPost.postTitle}</PostCard.Title>

        <div className="flex flex-col gap-4">
          <PostCard.TechCategories techCategories={mySuggestedPost.stacks} />
          <PostCard.Roles roles={mySuggestedPost.roles} />
        </div>
      </PostCard.Main>

      <PostCard.Footer
        views={mySuggestedPost.viewCount}
        status={mySuggestedPost.postStatus}
      />

      <PostCard.Actions>
        <ChatButton postId={mySuggestedPost.postId} className="py-3" />
        <ApplyButton
          postId={mySuggestedPost.postId}
          deadlineDate={mySuggestedPost.deadlineAt}
          status={mySuggestedPost.postStatus}
          roles={mySuggestedPost.roles}
          profileExists={profileExists}
          variant="solid"
          size="md"
        />
      </PostCard.Actions>
    </PostCard>
  );
}
