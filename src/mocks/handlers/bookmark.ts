import { HttpResponse, http } from 'msw';
import { BASE_URL } from '@/constants/auth.constant';
import { mockBookmarkedPostIds } from '../data/my';
import { mockPostList } from '../data/posts';

export const bookmarkHandlers = [
  /** 특정 게시물의 북마크 일괄 조회 - :postId 보다 먼저 등록해야 매칭 순서 충돌 없음 */
  http.post(`${BASE_URL}/api/bookmarks/status`, async ({ request }) => {
    const postIds = (await request.json()) as string[];
    const bookmarkedPostIds = postIds.filter((id) =>
      mockBookmarkedPostIds.has(id),
    );
    return HttpResponse.json({ bookmarkedPostIds });
  }),

  /** 북마크 토글 */
  http.post(`${BASE_URL}/api/bookmarks/:postId`, ({ params }) => {
    const postId = String(params.postId);
    if (mockBookmarkedPostIds.has(postId)) {
      mockBookmarkedPostIds.delete(postId);
    } else {
      mockBookmarkedPostIds.add(postId);
    }
    return new HttpResponse(null, { status: 204 });
  }),

  /** 내가 북마크한 글 목록 조회 */
  http.get(`${BASE_URL}/api/bookmarks`, ({ request }) => {
    const url = new URL(request.url);
    const projectType = url.searchParams.get('projectType');
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 10);

    const bookmarked = mockPostList
      .filter((p) => mockBookmarkedPostIds.has(String(p.id)))
      .filter((p) => !projectType || p.projectType === projectType)
      .map((p) => ({
        postId: p.id,
        postTitle: p.title,
        projectType: p.projectType,
        activityMode: p.activityMode,
        postStatus: p.status,
        deadlineAt: p.deadline,
        leaderName: p.author,
        leaderProfileImage: p.authorProfileImageCode,
        roles: p.roles,
        stacks: p.techs,
        viewCount: p.viewCount,
        bookmarked: true,
        postCreatedAt: p.createdAt,
        reviewCount: 0,
        bookmarkedCreatedAt: p.createdAt,
      }));

    const totalElements = bookmarked.length;
    const totalPages = Math.ceil(totalElements / size);
    const content = bookmarked.slice(page * size, (page + 1) * size);

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
