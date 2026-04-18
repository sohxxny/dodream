import { useMutation } from '@tanstack/react-query';
import { QUERY_KEY } from '@/constants/query-key.constant';
import { queryClient } from '@/lib/query-client';
import { clientApis } from '@/services/client.api';

export default function useToggleBookmark() {
  return useMutation({
    mutationFn: (postId: bigint) => clientApis.bookmarks.toggleBookmark(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.auth, QUERY_KEY.posts],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.auth, QUERY_KEY.myBookmarkedPosts],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.auth, QUERY_KEY.myAppliedPosts],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.auth, QUERY_KEY.mySuggestedPosts],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.auth, QUERY_KEY.myMatchedPosts],
      });
    },
    // 낙관적 업데이트
    onMutate: (postId) => {
      const id = BigInt(postId).toString(); // 통일
      const raw = queryClient.getQueryData<{ bookmarkedPostIds: string[] }>([
        QUERY_KEY.auth,
        QUERY_KEY.bookmarkIds,
      ]);
      const ids = raw?.bookmarkedPostIds ?? [];
      const isBookmarked = ids.includes(id);

      queryClient.setQueryData([QUERY_KEY.auth, QUERY_KEY.bookmarkIds], {
        bookmarkedPostIds: isBookmarked
          ? ids.filter((i) => i !== id)
          : [...ids, id],
      });

      return { previousRaw: raw };
    },
    // 롤백
    onError: (_, __, context) => {
      if (context?.previousRaw) {
        queryClient.setQueryData(
          [QUERY_KEY.auth, QUERY_KEY.bookmarkIds],
          context.previousRaw,
        );
      }
    },
  });
}
