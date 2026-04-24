'use client';

import Link from 'next/link';
import { Tabs } from 'radix-ui';
import { useState } from 'react';
import Skeleton from '@/components/commons/skeleton';
import useGetRecommendedPosts from '@/hooks/post/use-get-recommended-posts';
import type {
  ProjectType,
  RecommendedPostContentType,
} from '@/types/post.type';
import { formatDate } from '@/utils/date.util';
import RecommendTags from './recommend-tags';

export default function RecommendedPosts({
  profileExists,
}: {
  profileExists: boolean;
}) {
  const [activePostType, setActivePostType] = useState<ProjectType>('PROJECT');
  const { data: posts, isPending } = useGetRecommendedPosts(activePostType);

  if (!profileExists) return null;

  return (
    <section className="col-span-12 flex flex-col gap-8">
      <div className="flex justify-between">
        {/* 제목 */}
        <h2 className="heading-lg">관심 있어 할 만한 글을 AI가 찾아뒀어요</h2>

        {/* 게시글 종류 선택 탭 */}
        <PostTypeTabs
          value={activePostType}
          onValueChange={setActivePostType}
        />
      </div>

      {/* AI 추천 게시글 */}
      {isPending ? (
        <Skeleton
          count={4}
          listClassName="grid grid-cols-4 gap-x-7"
          itemClassName="h-40"
        />
      ) : !posts || posts.posts.length === 0 ? (
        <p className="mt-9 mb-23.5 body-lg-medium text-center">
          AI 추천 내역이 없습니다
        </p>
      ) : (
        <ul className="grid grid-cols-4 gap-x-7">
          {posts.posts.map((post) => (
            <RecommendedPost key={BigInt(post.postId)} post={post} />
          ))}
        </ul>
      )}
    </section>
  );
}

interface RecommendedPostProps {
  post: RecommendedPostContentType;
}

/**
 * 개별 게시글 컴포넌트
 */
function RecommendedPost({ post }: RecommendedPostProps) {
  return (
    <li className="flex-1 border border-border-primary rounded-lg px-6 py-5 h-40">
      <Link href={`/post/${BigInt(post.postId)}`}>
        <article className="flex flex-col h-full gap-5">
          <RecommendTags labels={post.matchReasons} />
          <h3 className="heading-sm line-clamp-2">{post.title}</h3>
          <div className="flex gap-3 text-subtle flex-1 items-end">
            <span>마감</span>
            <span>{formatDate(new Date(post.deadlineAt))}</span>
          </div>
        </article>
      </Link>
    </li>
  );
}

interface PostTypeTabsProps {
  value: ProjectType;
  onValueChange: (value: ProjectType) => void;
}

/**
 * 추천 게시글 Tabs 컴포넌트
 * @param value - 현재 선택된 탭
 * @param onValueChange - 탭 set 함수
 */
function PostTypeTabs({ value, onValueChange }: PostTypeTabsProps) {
  return (
    <Tabs.Root
      value={value}
      onValueChange={(value) => onValueChange(value as ProjectType)}
    >
      <Tabs.List
        className="flex gap-5 body-lg-medium text-subtle"
        aria-label="게시글 유형 선택"
      >
        <Tabs.Trigger
          value="PROJECT"
          className="data-[state=active]:text-primary"
        >
          프로젝트
        </Tabs.Trigger>
        <Tabs.Trigger
          value="STUDY"
          className="data-[state=active]:text-primary"
        >
          스터디
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  );
}
