import ProfileImage from '@/components/commons/profile-image';
import { serverApis } from '@/services/server.api';
import { getRelativeTime } from '@/utils/date.util';
import PostBookmarkButton from '../_components/post-bookmark-button';
import PostContent from '../_components/post-content';
import PostDeleteButton from '../_components/post-delete-button';
import PostDetailButtons from '../_components/post-detail-buttons';
import PostEditButton from '../_components/post-edit-button';
import PostLinkButton from '../_components/post-link-button';
import RecommendedUsers from '../_components/recommended-users';
import RecruitInfo from '../_components/recruit-info';
import RecruitStatus from '../_components/recruit-status';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;
  const postId = BigInt(id);

  const [postData, profileExists] = await Promise.all([
    serverApis.posts.getPostDetail(postId),
    serverApis.profile.getProfileExists(),
  ]);

  return (
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
          <div className="flex ml-auto gap-7">
            {postData.owner ? (
              <>
                {/* 모집글 수정 버튼 */}
                <PostEditButton postId={postData.id} />
                {/* 모집글 삭제 버튼 */}
                <PostDeleteButton postId={postData.id} />
              </>
            ) : (
              <>
                {/* 북마크 버튼 */}
                <PostBookmarkButton
                  isBookmarked={postData.isBookmarked}
                  postId={BigInt(postData.id)}
                />
                {/* 링크 복사 버튼 */}
                <PostLinkButton />
              </>
            )}
          </div>
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

          {/* 추천 회원 */}
          <RecommendedUsers postId={postData.id} isOwner={postData.owner} />
        </div>
      </section>

      {/* 버튼 */}
      <aside className="col-start-10 col-span-3 flex flex-col gap-7">
        {/* 버튼 그룹 */}
        <PostDetailButtons postData={postData} profileExists={profileExists} />
        {/* 모집중인 직군 */}
        <RecruitStatus roles={postData.roles} postId={postData.id} />
      </aside>
    </article>
  );
}
