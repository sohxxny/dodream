import { useMutation } from '@tanstack/react-query';
import { QUERY_KEY } from '@/constants/query-key.constant';
import { queryClient } from '@/lib/query-client';
import { clientApis } from '@/services/client.api';

/** 지원 취소 */
export default function useCancelApply(postId: bigint) {
  return useMutation({
    mutationFn: (applicationId: bigint) =>
      clientApis.my.cancelApply(applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEY.auth,
          QUERY_KEY.postDetail,
          BigInt(postId).toString(),
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.auth, QUERY_KEY.myAppliedPosts],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.auth, QUERY_KEY.mySuggestedPosts],
      });
    },
  });
}
