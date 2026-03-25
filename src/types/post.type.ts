import type { PaginationInfo } from '@/types/api.type';
import type { RoleName } from '@/types/role.type';
import type { TechSkillName } from '@/types/tech-skill.type';
import type { ActivityModeType } from './profile.type';

/** 게시글 데이터 타입 */
export type PostType = {
  posts: {
    totalPages: number;
    number: number;
    content: PostContentType[];
  };
};

/** 게시글 데이터 내용 타입 */
export type PostContentType = {
  id: bigint;
  title: string;
  projectType: string;
  roles: string[];
  techs: string[];
  interests: string[];
  author: string;
  authorProfileImageCode: number;
  viewCount: number;
  deadline: string;
  status: string;
  activityMode: string;
  createdAt: string;
};

/** 게시글 컨텐츠 타입 / 게시글 상세 타입 */
export type PostDetailType = {
  id: bigint;
  applicationId: bigint;
  matchedId: bigint;
  title: string;
  content: string;
  status: PostStatusType;
  createdAt: string;
  ownerNickname: string;
  ownerProfileImageUrl: number;
  projectType: ProjectType;
  activityMode: ActivityModeType;
  duration: DurationType;
  deadlineDate: string;
  interestKeywords: string[];
  viewCount: number;
  stacks: string[];
  roles: {
    role: string;
    headcount: number;
  }[];
  owner: boolean;
  isBookmarked: boolean;
};

/** 상세 페이지 멤버 내역 */
export type PostMembersType = {
  users: PostMemberUserType[];
  nextCursor: 0;
  hasNext: true;
};

export type PostMemberUserType = {
  matchedId: bigint;
  suggestionId: bigint;
  applicationId: bigint;
  userId: bigint;
  nickname: string;
  profileImage: number;
  status: string;
  createdAt: string;
  experience: string;
  jobGroups: string[];
};

/** AI 추천 게시글 타입 */
export type RecommendedPostsType = {
  posts: RecommendedPostContentType[];
  nextCursor: number;
  hasNext: boolean;
};

/** AI 추천 게시글 컨텐츠 타입 */
export type RecommendedPostContentType = {
  postId: bigint;
  title: string;
  projectType: ProjectType;
  activityMode: ActivityModeType;
  deadlineAt: string;
  similarity: number;
  fields: string[];
};

/** 모집글 생성 응답 타입 */
export type CreatePostResponseType = PostContentType;

/** 모집글 수정 응답 타입 */
export type UpdatePostResponseType = PostContentType;

/** 내가 지원한 글 목록 타입 */
export type MyAppliedPostType = {
  id: bigint;
  postId: bigint;
  postTitle: string;
  projectType: ProjectType;
  activityMode: ActivityModeType;
  postStatus: PostStatusType;
  deadlineAt: string;
  leaderName: string;
  leaderProfileImage: number;
  myStatus: MyStatusType;
  appliedAt: Date;
  roles: RoleName[];
  stacks: TechSkillName[];
  viewCount: number;
  bookmarked: boolean;
  postCreatedAt: Date;
  reviewCount: number;
};
export type GetMyAppliedPostsResponseType = PaginationInfo & {
  content: MyAppliedPostType[];
};

/** 내가 제안받은 글 목록 타입 */
export type MySuggestedPostType = MyAppliedPostType;
export type GetMySuggestedPostResponseType = GetMyAppliedPostsResponseType;

/** 내가 매칭된 글 목록 타입 */
export type MyMatchedPostType = Omit<MyAppliedPostType, 'appliedAt'> & {
  applicationId: bigint;
  matchedAt: Date;
};

export type GetMyMatchedPostsResponseType = PaginationInfo & {
  content: MyMatchedPostType[];
};

/** 내 모집글 추천 유저 타입 */
export type MyPostRecommendedUsersType = {
  profiles: MyPostRecommendedUserProfileType[];
  nextCursor: 0;
  hasNext: true;
};

export type MyPostRecommendedUserProfileType = {
  userId: bigint;
  suggestionId: bigint;
  nickname: string;
  experience: string;
  profileImageCode: number;
  interestKeywords: string[];
  roles: string[];
  tags: string[];
};

/** 내가 북마크한 글 목록 타입 */
export type MyBookmarkedPostType = Omit<
  MyAppliedPostType,
  'id' | 'myStatus' | 'appliedAt'
> & {
  bookmarkedCreatedAt: Date;
};
export type GetMyBookmarkedPostsResponseType = PaginationInfo & {
  content: MyBookmarkedPostType[];
};

export type BookmarkIdsType = {
  bookmarkedPostIds: string[];
};

export type ProjectType = 'PROJECT' | 'STUDY';
export type HomeProjectType = ProjectType | 'ALL';

export type PostStatusType = 'COMPLETED' | 'RECRUITING';
export type MyStatusType =
  | 'PENDING'
  | 'APPLIED'
  | 'WITHDRAWN'
  | 'ACCEPTED'
  | 'REJECTED';

/** 기간 타입 */
export type DurationType =
  | 'UNDECIDED'
  | 'UNDER_ONE_MONTH'
  | 'ONE_MONTH'
  | 'TWO_MONTHS'
  | 'THREE_MONTHS'
  | 'FOUR_MONTHS'
  | 'FIVE_MONTHS'
  | 'SIX_MONTHS'
  | 'LONG_TERM';
