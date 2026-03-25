import { useMutation } from '@tanstack/react-query';
import { QUERY_KEY } from '@/constants/query-key.constant';
import { queryClient } from '@/lib/query-client';
import { clientApis } from '@/services/client.api';

export default function useToggleBookmark() {
  return useMutation({
    mutationFn: (postId: bigint) => clientApis.bookmarks.toggleBookmark(postId),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.auth, QUERY_KEY.posts],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.auth, QUERY_KEY.postDetail, postId.toString()],
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
      const raw = queryClient.getQueryData<{ bookmarkedPostIds: string[] }>([
        QUERY_KEY.auth,
        QUERY_KEY.bookmarkIds,
      ]);
      const ids = raw?.bookmarkedPostIds ?? [];
      const isBookmarked = ids.includes(postId.toString());

      queryClient.setQueryData([QUERY_KEY.auth, QUERY_KEY.bookmarkIds], {
        bookmarkedPostIds: isBookmarked
          ? ids.filter((id) => id !== postId.toString())
          : [...ids, postId.toString()],
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
