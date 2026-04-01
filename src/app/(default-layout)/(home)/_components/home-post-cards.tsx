import { memo, useMemo } from 'react';
import DefaultPostCard from '@/components/features/post/post-card/presets/default-post-card';
import { useGetMyBookmarksByPostId } from '@/hooks/bookmark/use-get-my-bookmarked-posts';
import type {
  PostContentType,
  PostStatusType,
  ProjectType,
} from '@/types/post.type';

interface HomePostCardsProps {
  posts: PostContentType[];
}

function HomePostCards({ posts }: HomePostCardsProps) {
  const postIds = useMemo(
    () => posts.map((post) => BigInt(post.id).toString()),
    [posts],
  );
  const { data: bookmarkIds = new Set() } = useGetMyBookmarksByPostId(postIds);

  return (
    <ul className="grid grid-cols-3 gap-7">
      {posts.map((post) => {
        return (
          <li key={post.id}>
            <DefaultPostCard
              id={BigInt(post.id)}
              title={post.title}
              status={post.status as PostStatusType}
              ownerProfileImageCode={post.authorProfileImageCode}
              ownerNickname={post.author}
              projectType={post.projectType as ProjectType}
              createDate={post.createdAt}
              viewCount={post.viewCount}
              stacks={post.techs}
              roles={post.roles}
              isBookmarked={bookmarkIds.has(BigInt(post.id).toString())}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default memo(HomePostCards);
