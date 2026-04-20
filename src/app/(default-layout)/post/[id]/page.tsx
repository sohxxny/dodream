import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import ProfileImage from '@/components/commons/profile-image';
import { QUERY_KEY } from '@/constants/query-key.constant';
import { getQueryClient } from '@/lib/query-client';
import { serverApis } from '@/services/server.api';
import type { ErrorType } from '@/types/error.type';
import { getRelativeTime } from '@/utils/date.util';
import PostContent from '../_components/post-content';
import PostDetailButtons from '../_components/post-detail-buttons';
import PostHeaderButtons from '../_components/post-header-buttons';
import RecommendedUsers from '../_components/recommended-users';
import RecruitInfo from '../_components/recruit-info';
import RecruitStatus from '../_components/recruit-status';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;
  const postId = BigInt(id);
  const queryClient = getQueryClient();

  const postData = await queryClient
    .fetchQuery({
      queryKey: [QUERY_KEY.auth, QUERY_KEY.postDetail, postId.toString()],
      queryFn: () => serverApis.posts.getPostDetail(postId),
    })
    .catch((e: ErrorType) => {
      if (e.code === 404) notFound();
      throw e;
    });

  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEY.auth, QUERY_KEY.profileExists],
    queryFn: () => serverApis.profile.getProfileExists(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <article className="grid grid-cols-12 gap-x-7">
        <section className="col-span-8 flex flex-col">
          <div className="flex items-center body-lg-medium">
            {/* 프로필, 작성 시간 영역 */}
            <ProfileImage
              code={postData.ownerProfileImageUrl}
              size={40}
              userName={postData.ownerNickname}
            />
            <span className="ml-4 mr-3">{postData.ownerNickname}</span>
            <time className="text-subtle" dateTime={postData.deadlineDate}>
              {getRelativeTime(postData.createdAt)}
            </time>
            <PostHeaderButtons postId={postData.id} isOwner={postData.owner} />
          </div>

          {/* 제목 */}
          <h2 className="heading-xl mt-5 mb-9">{postData.title}</h2>

          {/* 내용 영역 */}
          <div className="flex flex-col gap-12">
            <div className="whitespace-pre-line">
              <h3 className="heading-lg mb-8">모집 내용</h3>
              <PostContent content={postData.content} maxHeight={450} />
            </div>

            {/* 모집 요약 */}
            <RecruitInfo
              projectType={postData.projectType}
              deadlineDate={postData.deadlineDate}
              activityMode={postData.activityMode}
              interestKeywords={postData.interestKeywords}
              duration={postData.duration}
              techStacks={postData.stacks}
            />

            {/* 글 작성자의 경우: 추천 회원 */}
            <RecommendedUsers postId={postData.id} isOwner={postData.owner} />
          </div>
        </section>

        {/* 버튼 그룹, 모집 현황 */}
        <aside className="col-start-10 col-span-3 flex flex-col gap-7">
          <PostDetailButtons postId={postData.id} />
          <RecruitStatus roles={postData.roles} postId={postData.id} />
        </aside>
      </article>
    </HydrationBoundary>
  );
}
