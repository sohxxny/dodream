import type {
  BookmarkIdsType,
  GetMyBookmarkedPostsResponseType,
  ProjectType,
} from '@/types/post.type';
import type { createApiMethods } from '../fetcher/create-api';

export function createBookmarksApi(
  apiClient: ReturnType<typeof createApiMethods>,
) {
  return {
    /** 북마크 토글 */
    toggleBookmark: (postId: bigint) =>
      apiClient.post(`/api/bookmarks/${BigInt(postId)}`),

    /** 특정 게시물의 북마크 일괄 조회 */
    getMyBookmarksByPostId: (postIds: string[]) =>
      apiClient.post<BookmarkIdsType>(`/api/bookmarks/status`, postIds),

    /** 내가 북마크한 글 목록 조회 */
    getMyBookmarkedPosts: (
      projectType: ProjectType,
      page?: number,
      size: number = 10,
    ) => {
      const params = new URLSearchParams();

      params.set('projectType', projectType);
      if (page) params.set('page', String(page));
      if (size) params.set('size', String(size));

      return apiClient.get<GetMyBookmarkedPostsResponseType>(
        `/api/bookmarks?${params.toString()}`,
      );
    },
  };
}
