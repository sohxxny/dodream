import { HttpResponse, http, passthrough } from 'msw';
import { BASE_URL } from '@/constants/auth.constant';
import {
  INTERESTS,
  INTERESTS_ID_MAP,
  TECH_STACK_ID_MAP,
} from '@/constants/profile.constant';
import { ROLES } from '@/constants/role.constant';
import {
  mockMyApplicationDetails,
  mockMyAppliedPosts,
  mockMySuggestedPosts,
  mockPostApplications,
  mockPostMembers,
  mockPostSuggestions,
} from '../data/my';
import { mockPostDetails, mockPostList } from '../data/posts';
import {
  generateProfilesForPost,
  mockRecommendationProfiles,
} from '../data/recommendations';

export const postHandlers = [
  /** 모집글 생성 - 브라우저 상태 업데이트 후 API route로 passthrough */
  http.post(`${BASE_URL}/api/posts`, async ({ request }) => {
    const body = (await request.clone().json()) as {
      title: string;
      projectType: string;
      roles: { roleId: number; count: number }[];
      stackIds: number[];
      interestIds: number[];
      activityMode: string;
      duration: string;
      deadlineAt: string;
      content: string;
    };

    const newId = Math.max(0, ...mockPostList.map((p) => p.id)) + 1;
    const now = new Date().toISOString();
    const deadline = new Date(body.deadlineAt).toISOString().split('T')[0];

    const roleNames = body.roles
      .map((r) => ROLES.find((role) => role.id === r.roleId)?.name ?? '')
      .filter(Boolean);
    const techNames = body.stackIds
      .map((id) => TECH_STACK_ID_MAP[id] ?? '')
      .filter(Boolean);
    const interestNames = body.interestIds
      .map((id) => INTERESTS[INTERESTS_ID_MAP[id]] ?? '')
      .filter(Boolean);

    mockPostList.unshift({
      id: newId,
      title: body.title,
      projectType: body.projectType,
      roles: roleNames,
      techs: techNames,
      interests: interestNames,
      author: '데모유저',
      authorProfileImageCode: 1,
      viewCount: 0,
      deadline: `${deadline}T00:00:00`,
      status: 'RECRUITING',
      activityMode: body.activityMode,
      createdAt: now,
    });

    mockPostDetails.unshift({
      id: newId,
      title: body.title,
      content: body.content,
      status: 'RECRUITING',
      createdAt: now,
      ownerNickname: '데모유저',
      ownerProfileImageUrl: 1,
      projectType: body.projectType,
      activityMode: body.activityMode,
      duration: body.duration,
      deadlineDate: deadline,
      interestKeywords: interestNames,
      viewCount: 0,
      stacks: techNames,
      roles: body.roles.map((r) => ({
        role: ROLES.find((role) => role.id === r.roleId)?.name ?? '',
        headcount: r.count,
      })),
      applicationId: null,
      matchedId: null,
      owner: true,
    });

    mockRecommendationProfiles[newId] = generateProfilesForPost(roleNames);

    return passthrough();
  }),

  /** 내가 쓴 글 목록 조회 - 브라우저 상태 기준으로 반환 (삭제 반영) */
  http.get(`${BASE_URL}/api/posts/my`, ({ request }) => {
    const url = new URL(request.url);
    const tab = url.searchParams.get('tab');
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 10);
    const projectType = tab === 'study' ? 'STUDY' : 'PROJECT';

    const filtered = mockPostDetails
      .filter((p) => p.owner && p.projectType === projectType)
      .map((p) => ({
        postId: p.id,
        title: p.title,
        projectType: p.projectType,
        activityMode: p.activityMode,
        duration: p.duration,
        status: p.status,
        deadlineAt: p.deadlineDate,
        viewCount: p.viewCount,
        fields: p.interestKeywords,
        roleRequirements: p.roles.map((r) => ({
          roleName: r.role,
          headcount: r.headcount,
        })),
        stacks: p.stacks,
        createdAt: p.createdAt,
        updatedAt: p.createdAt,
        reviewCount: p.id === 40 ? 3 : 0,
      }));

    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / size);
    const posts = filtered.slice(page * size, (page + 1) * size);

    return HttpResponse.json({
      posts,
      totalCount,
      totalPages,
      currentPage: page,
      pageSize: size,
      hasNext: page < totalPages - 1,
      hasPrevious: page > 0,
    });
  }),

  /**
   * 모집글 상세 조회 (클라이언트 리페치용, SSR은 API route 사용)
   * 숫자가 아닌 경로(/api/posts/my 등)는 bypass해서 API route로 넘김
   */
  http.get(`${BASE_URL}/api/posts/:id`, ({ params }) => {
    if (Number.isNaN(Number(params.id))) return passthrough();
    const post = mockPostDetails.find((p) => p.id === Number(params.id));
    if (!post)
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
    return HttpResponse.json(post);
  }),

  /** 제안 내역 조회 */
  http.get(`${BASE_URL}/api/posts/:id/recruits/offers`, ({ params }) => {
    const postId = Number(params.id);
    const data = mockPostSuggestions[
      postId as keyof typeof mockPostSuggestions
    ] ?? { users: [], nextCursor: 0, hasNext: false };
    return HttpResponse.json(data);
  }),

  /** 지원자 목록 조회 */
  http.get(`${BASE_URL}/api/posts/:id/recruits/applications`, ({ params }) => {
    const postId = Number(params.id);
    const data = mockPostApplications[
      postId as keyof typeof mockPostApplications
    ] ?? { users: [], nextCursor: 0, hasNext: false };
    return HttpResponse.json(data);
  }),

  /** 멤버 내역 조회 */
  http.get(`${BASE_URL}/api/posts/:id/recruits/members`, ({ params }) => {
    const postId = Number(params.id);
    const data = mockPostMembers[postId as keyof typeof mockPostMembers] ?? {
      users: [],
      nextCursor: 0,
      hasNext: false,
    };
    return HttpResponse.json(data);
  }),

  /** 모집글 수정 - 브라우저 상태 업데이트 후 API route로 passthrough */
  http.put(`${BASE_URL}/api/posts/:id`, async ({ request, params }) => {
    const postId = Number(params.id);
    const body = (await request.json()) as {
      title: string;
      projectType: string;
      roles: { roleId: number; count: number }[];
      stackIds: number[];
      interestIds: number[];
      activityMode: string;
      duration: string;
      deadlineAt: string;
      content: string;
    };

    const deadline = new Date(body.deadlineAt).toISOString().split('T')[0];
    const roleNames = body.roles
      .map((r) => ROLES.find((role) => role.id === r.roleId)?.name ?? '')
      .filter(Boolean);
    const techNames = body.stackIds
      .map((id) => TECH_STACK_ID_MAP[id] ?? '')
      .filter(Boolean);
    const interestNames = body.interestIds
      .map((id) => INTERESTS[INTERESTS_ID_MAP[id]] ?? '')
      .filter(Boolean);

    const listIdx = mockPostList.findIndex((p) => p.id === postId);
    if (listIdx !== -1) {
      mockPostList[listIdx] = {
        ...mockPostList[listIdx],
        title: body.title,
        projectType: body.projectType,
        roles: roleNames,
        techs: techNames,
        interests: interestNames,
        activityMode: body.activityMode,
        deadline: `${deadline}T00:00:00`,
      };
    }

    const detailIdx = mockPostDetails.findIndex((p) => p.id === postId);
    if (detailIdx !== -1) {
      mockPostDetails[detailIdx] = {
        ...mockPostDetails[detailIdx],
        title: body.title,
        content: body.content,
        projectType: body.projectType,
        activityMode: body.activityMode,
        duration: body.duration,
        deadlineDate: deadline,
        interestKeywords: interestNames,
        stacks: techNames,
        roles: body.roles.map((r) => ({
          role: ROLES.find((role) => role.id === r.roleId)?.name ?? '',
          headcount: r.count,
        })),
      };
    }

    return passthrough();
  }),

  /** 모집글 삭제 - 브라우저 상태 업데이트 후 API route로 passthrough */
  http.delete(`${BASE_URL}/api/posts/:id`, ({ params }) => {
    const postId = Number(params.id);
    const listIdx = mockPostList.findIndex((p) => p.id === postId);
    if (listIdx !== -1) mockPostList.splice(listIdx, 1);
    const detailIdx = mockPostDetails.findIndex((p) => p.id === postId);
    if (detailIdx !== -1) mockPostDetails.splice(detailIdx, 1);
    return passthrough();
  }),

  /** 모집글 지원 */
  http.post(`${BASE_URL}/api/posts/:id/apply`, async ({ request, params }) => {
    const postId = Number(params.id);
    const post = mockPostDetails.find((p) => p.id === postId);
    if (!post)
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 });

    const { roleId, message = '' } = (await request.json()) as {
      roleId: number;
      message?: string;
    };

    const role = ROLES.find((r) => r.id === roleId);
    const appliedAt = new Date().toISOString();
    const newApplicationId =
      Math.max(0, ...mockMyAppliedPosts.map((p) => p.id)) + 1;

    post.applicationId = newApplicationId;

    mockMyAppliedPosts.unshift({
      id: newApplicationId,
      postId,
      postTitle: post.title,
      projectType: post.projectType,
      activityMode: post.activityMode,
      postStatus: post.status,
      deadlineAt: `${post.deadlineDate}T00:00:00`,
      leaderName: post.ownerNickname,
      leaderProfileImage: post.ownerProfileImageUrl,
      myStatus: 'PENDING',
      appliedAt,
      roles: post.roles.map((r) => r.role),
      stacks: post.stacks,
      viewCount: post.viewCount,
      postCreatedAt: post.createdAt,
      reviewCount: 0,
    });

    mockMyApplicationDetails[newApplicationId] = {
      applicationId: newApplicationId,
      postId,
      postTitle: post.title,
      projectType: post.projectType,
      activityMode: post.activityMode,
      status: post.status,
      leaderName: post.ownerNickname,
      leaderProfileImage: post.ownerProfileImageUrl,
      roleName: role?.name ?? '',
      roleCode: role?.code ?? '',
      message,
      appliedAt,
    };

    const suggestedIdx = mockMySuggestedPosts.findIndex(
      (p) => p.postId === postId,
    );
    if (suggestedIdx !== -1) mockMySuggestedPosts.splice(suggestedIdx, 1);

    return HttpResponse.json(
      { applicationId: newApplicationId },
      { status: 201 },
    );
  }),
];
