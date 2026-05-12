import { HttpResponse, http } from 'msw';
import { BASE_URL } from '@/constants/auth.constant';
import {
  mockRecommendationProfiles,
  mockRecommendedPosts,
} from '../data/recommendations';
import { mockExistingNicknames, mockProfileSettings } from '../data/user';

export const profileHandlers = [
  /** 내 계정 설정 조회 */
  http.get(`${BASE_URL}/api/profiles/settings`, () => {
    return HttpResponse.json(mockProfileSettings);
  }),

  /** 내 계정 설정 수정 */
  http.put(`${BASE_URL}/api/profiles/settings`, async ({ request }) => {
    const body = await request.json();
    Object.assign(mockProfileSettings, body);
    return HttpResponse.json(mockProfileSettings);
  }),

  /** 추천 게시글 조회 */
  http.get(`${BASE_URL}/api/recommendations`, ({ request }) => {
    const url = new URL(request.url);
    const projectType =
      (url.searchParams.get('projectType') as 'PROJECT' | 'STUDY') ?? 'PROJECT';
    const data =
      mockRecommendedPosts[projectType] ?? mockRecommendedPosts.PROJECT;
    return HttpResponse.json(data);
  }),

  /** 추천 프로필 조회 */
  http.get(`${BASE_URL}/api/recommendations/profiles/:postId`, ({ params }) => {
    const data = mockRecommendationProfiles[Number(params.postId)] ?? {
      profiles: [],
      nextCursor: 0,
      hasNext: false,
    };
    return HttpResponse.json(data);
  }),

  /** 닉네임 중복 여부 체크 */
  http.get(`${BASE_URL}/api/profiles/check-nickname`, ({ request }) => {
    const url = new URL(request.url);
    const nickname = url.searchParams.get('nickname') ?? '';
    return HttpResponse.json({
      available: !mockExistingNicknames.has(nickname),
      nickname,
    });
  }),
];
