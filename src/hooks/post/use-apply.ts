import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { QUERY_KEY } from '@/constants/query-key.constant';
import { queryClient } from '@/lib/query-client';
import { clientApis } from '@/services/client.api';
import type { ErrorType } from '@/types/error.type';

/** 지원 */
export function useApply() {
  const router = useRouter();

  return useMutation<
    void,
    ErrorType,
    {
      postId: bigint;
      roleId: number;
      message?: string;
    }
  >({
    mutationFn: ({
      postId,
      roleId,
      message = '',
    }: {
      postId: bigint;
      roleId: number;
      message?: string;
    }) => clientApis.posts.apply(postId, { roleId, message }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEY.auth,
          QUERY_KEY.postDetail,
          BigInt(variables.postId).toString(),
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.auth, QUERY_KEY.myAppliedPosts],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.auth, QUERY_KEY.mySuggestedPosts],
      });
      router.refresh();
    },
  });
}
