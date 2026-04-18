import Link from 'next/link';
import React from 'react';
import ProfileImage from '@/components/commons/profile-image';
import TechCategories from '@/components/commons/tech-categories';
import BookmarkButton from '@/components/features/post/bookmark-button';
import PostCardProjectType from '@/components/features/post/post-card/post-card-project-type';
import PostCardRoles from '@/components/features/post/post-card/post-card-roles';
import PostCardStatus from '@/components/features/post/post-card/post-card-status';
import PostCardViews from '@/components/features/post/post-card/post-card-views';
import type { PostStatusType, ProjectType } from '@/types/post.type';

/**
 * 카드 전체 레이아웃
 */
function Root({
  children,
  imageCode,
  href = '#',
}: {
  children: React.ReactNode;
  imageCode?: number;
  href?: string;
}) {
  const childArray = React.Children.toArray(children);
  const contents = childArray.filter(
    (child) => React.isValidElement(child) && child.type !== Actions,
  );
  const actions = childArray.filter(
    (child) => React.isValidElement(child) && child.type === Actions,
  );

  return (
    <article className="rounded-lg border-1 border-border-primary p-7 bg-surface">
      <Link href={href} className="flex gap-4">
        {/* 왼쪽 아바타 영역 */}
        <ProfileImage code={imageCode} size={36} />

        {/* 오른쪽 영역 */}
        <div className="flex flex-col w-full gap-4">{contents}</div>
      </Link>

      {actions.length > 0 ? actions : null}
    </article>
  );
}

/**
 * 카드 헤더 - 닉네임, 남은 기한, 종류(프로젝트/스터디), 북마크 아이콘
 */
function Header({
  postId,
  nickname,
  elapsedTime,
  projectType,
  isBookmarked,
  showBookmarkIcon = true,
}: {
  postId: bigint;
  nickname: string;
  elapsedTime: string;
  projectType: ProjectType;
  isBookmarked: boolean;
  showBookmarkIcon?: boolean;
}) {
  return (
    <header className="flex justify-between w-full items-center">
      <div className="flex gap-3 items-center">
        <span className="body-md-medium text-primary">{nickname}</span>
        {/* TODO: time 태그 형식 맞추기 */}
        <time
          className="body-md-regular text-subtle"
          dateTime={elapsedTime}
          title={elapsedTime}
        >
          {elapsedTime}
        </time>
      </div>

      <div className="flex gap-3 items-center">
        <PostCardProjectType projectType={projectType} />
        {showBookmarkIcon && (
          <BookmarkButton isBookmarked={isBookmarked} postId={postId} />
        )}
      </div>
    </header>
  );
}

/**
 * 메인 영역 (본문 영역 래퍼)
 */
function Main({ children }: { children: React.ReactNode }) {
  return <section className="flex flex-col gap-8">{children}</section>;
}

/**
 * 카드 제목 (두 줄 clamp + 고정 높이 유지)
 */
function Title({ children }: { children: React.ReactNode }) {
  // TODO: 고정 높이로 되어있는 h-[50px] 바꾸기
  return <h2 className="heading-sm line-clamp-2 h-12.5">{children}</h2>;
}

/**
 * 카드 푸터 - 조회수, 모집 상태
 */
function Footer({ views, status }: { views: number; status: PostStatusType }) {
  return (
    <footer className="flex gap-5 text-secondary">
      <PostCardViews views={views} />
      <PostCardStatus status={status} />
    </footer>
  );
}

function Actions({ children }: { children: React.ReactNode }) {
  return <div className="ml-[52px] mt-4 flex gap-3">{children}</div>;
}

export const PostCard = Object.assign(Root, {
  Header,
  Main,
  Title,
  TechCategories: TechCategories,
  Roles: PostCardRoles,
  Footer,
  Actions,
});
