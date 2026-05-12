import { HttpResponse, http } from 'msw';
import { BASE_URL } from '@/constants/auth.constant';
import {
  mockBookmarkedPostIds,
  mockMyApplicationDetails,
  mockMyAppliedPosts,
  mockMyMatchedPosts,
  mockMySuggestedPosts,
  mockPostApplicantDetails,
} from '../data/my';

export const myHandlers = [
  /** 내 모집글 지원자 상세 정보 */
  http.get(
    `${BASE_URL}/api/posts/:postId/recruits/applications/:applicationId`,
    ({ params }) => {
      const applicationId = Number(params.applicationId);
      const data =
        mockPostApplicantDetails[
          applicationId as keyof typeof mockPostApplicantDetails
        ];
      if (!data) return new HttpResponse(null, { status: 404 });
      return HttpResponse.json(data);
    },
  ),

  /** 내 지원 상세 */
  http.get(`${BASE_URL}/api/my/applications/:applicationId`, ({ params }) => {
    const data =
      mockMyApplicationDetails[
        Number(params.applicationId) as keyof typeof mockMyApplicationDetails
      ];
    if (!data) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(data);
  }),

  /** 내가 지원한 글 목록 */
  http.get(`${BASE_URL}/api/my/applications`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 10);

    const totalElements = mockMyAppliedPosts.length;
    const totalPages = Math.ceil(totalElements / size);
    const content = mockMyAppliedPosts
      .slice(page * size, (page + 1) * size)
      .map((p) => ({
        ...p,
        bookmarked: mockBookmarkedPostIds.has(String(p.postId)),
      }));

    return HttpResponse.json({
      content,
      page,
      size,
      totalElements,
      totalPages,
      hasNext: page < totalPages - 1,
    });
  }),

  /** 제안받은 글 목록 */
  http.get(`${BASE_URL}/api/my/suggestions`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 10);

    const totalElements = mockMySuggestedPosts.length;
    const totalPages = Math.ceil(totalElements / size);
    const content = mockMySuggestedPosts
      .slice(page * size, (page + 1) * size)
      .map((p) => ({
        ...p,
        bookmarked: mockBookmarkedPostIds.has(String(p.postId)),
      }));

    return HttpResponse.json({
      content,
      page,
      size,
      totalElements,
      totalPages,
      hasNext: page < totalPages - 1,
    });
  }),

  /** 매칭된 글 목록 */
  http.get(`${BASE_URL}/api/matched`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 10);

    const totalElements = mockMyMatchedPosts.length;
    const totalPages = Math.ceil(totalElements / size);
    const content = mockMyMatchedPosts
      .slice(page * size, (page + 1) * size)
      .map((p) => ({
        ...p,
        bookmarked: mockBookmarkedPostIds.has(String(p.postId)),
      }));

    return HttpResponse.json({
      content,
      page,
      size,
      totalElements,
      totalPages,
      hasNext: page < totalPages - 1,
    });
  }),
];
