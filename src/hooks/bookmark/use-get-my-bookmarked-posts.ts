import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '@/constants/query-key.constant';
import { queryClient } from '@/lib/query-client';
import { clientApis } from '@/services/client.api';
import type { ProjectType } from '@/types/post.type';
import { useGetProfileExists } from '../profile/use-get-profile';

/** 마이페이지 북마크 내역 조회 */
export default function useGetMyBookmarkedPosts(
  projectType: ProjectType,
  page: number,
  size?: number,
) {
  const { data: profileExists, isSuccess } = useGetProfileExists();

  return useQuery({
    queryKey: [QUERY_KEY.auth, QUERY_KEY.myBookmarkedPosts, projectType, page],
    queryFn: () =>
      clientApis.bookmarks.getMyBookmarkedPosts(projectType, page, size),
    enabled: isSuccess && profileExists.exists === true,
  });
}

/** 특정 게시물의 북마크 여부 조회 */
export function useGetMyBookmarksByPostId(postIds: string[]) {
  const { data: profileExists, isSuccess } = useGetProfileExists();

  const raw = queryClient.getQueryData<{ bookmarkedPostIds: string[] }>([
    QUERY_KEY.auth,
    QUERY_KEY.bookmarkIds,
  ]);
  const existing = raw?.bookmarkedPostIds ?? [];

  const missingIds = postIds.filter((id) => !existing.includes(id));

  return useQuery({
    queryKey: [QUERY_KEY.auth, QUERY_KEY.bookmarkIds],
    queryFn: () => clientApis.bookmarks.getMyBookmarksByPostId(missingIds),
    enabled:
      isSuccess && profileExists.exists === true && missingIds.length > 0,
    select: (data) => new Set([...existing, ...data.bookmarkedPostIds]),
    staleTime: Infinity, // 캐시 유지
  });
}
