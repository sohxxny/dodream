import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { QUERY_KEY } from '@/constants/query-key.constant';
import { queryClient } from '@/lib/query-client';
import { clientApis } from '@/services/client.api';
import type { ProjectType } from '@/types/post.type';
import { useGetProfileExists } from '../profile/use-get-profile';

const BOOKMARK_IDS_KEY = [QUERY_KEY.auth, QUERY_KEY.bookmarkIds];

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
  const enabled = isSuccess && profileExists.exists === true;

  useEffect(() => {
    let cancelled = false;

    async function fetchMissing() {
      if (!enabled || postIds.length === 0) return;

      const cached = queryClient.getQueryData<{ bookmarkedPostIds: string[] }>(
        BOOKMARK_IDS_KEY,
      );
      const existing = cached?.bookmarkedPostIds ?? [];
      const existingSet = new Set(existing);
      const missingIds = postIds.filter((id) => !existingSet.has(id));

      if (missingIds.length === 0) return;

      const data =
        await clientApis.bookmarks.getMyBookmarksByPostId(missingIds);

      if (cancelled) return;

      queryClient.setQueryData(
        BOOKMARK_IDS_KEY,
        (old: { bookmarkedPostIds: string[] } | undefined) => ({
          bookmarkedPostIds: [
            ...(old?.bookmarkedPostIds ?? []),
            ...data.bookmarkedPostIds,
          ],
        }),
      );
    }

    fetchMissing();

    return () => {
      cancelled = true;
    };
  }, [postIds, enabled]);

  return useQuery({
    queryKey: BOOKMARK_IDS_KEY,
    queryFn: () => ({ bookmarkedPostIds: [] as string[] }),
    enabled,
    staleTime: Infinity,
    select: (data) => new Set(data.bookmarkedPostIds),
  });
}
