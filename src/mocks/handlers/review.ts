import { HttpResponse, http } from 'msw';
import { BASE_URL } from '@/constants/auth.constant';
import { mockPostList } from '@/mocks/data/posts';
import {
  mockMyReviews,
  mockReceivedReviews,
  mockReviewMembers,
  mockUserReviews,
} from '@/mocks/data/review';
import type { ReviewRequestType } from '@/types/review.type';

export const reviewHandlers = [
  /** 리뷰 작성 */
  http.post(`${BASE_URL}/api/feedbacks`, async ({ request }) => {
    const body = (await request.json()) as ReviewRequestType;
    const postId = Number(body.postId);
    const post = mockPostList.find((p) => p.id === postId);

    if (!mockMyReviews[postId]) mockMyReviews[postId] = [];
    mockMyReviews[postId].push({
      feedbackId: Date.now(),
      postId,
      postTitle: post?.title ?? '',
      feedbackType: body.feedbackType,
      options: body.options,
      receivedAt: new Date().toISOString(),
    });

    return new HttpResponse(null, { status: 204 });
  }),

  /** 리뷰 작성 가능한 멤버 조회 */
  http.get(`${BASE_URL}/api/feedbacks/:postId/members`, ({ params }) => {
    const postId = Number(params.postId);
    return HttpResponse.json(mockReviewMembers[postId] ?? []);
  }),

  /** 유저가 받은 전체 리뷰 조회 */
  http.get(`${BASE_URL}/api/feedbacks/users/:userId`, ({ params }) => {
    const userId = Number(params.userId);
    return HttpResponse.json(mockUserReviews[userId] ?? []);
  }),

  /** 특정 게시글에서 내가 받은 리뷰 조회 */
  http.get(`${BASE_URL}/api/feedbacks/my/post/:postId`, ({ params }) => {
    const postId = Number(params.postId);
    return HttpResponse.json(mockReceivedReviews[postId] ?? []);
  }),

  /** 특정 게시글에서 내가 작성한 리뷰 조회 */
  http.get(`${BASE_URL}/api/feedbacks/my/:postId`, ({ params }) => {
    const postId = Number(params.postId);
    return HttpResponse.json(mockMyReviews[postId] ?? []);
  }),
];
