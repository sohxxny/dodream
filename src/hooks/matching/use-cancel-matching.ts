import { useMutation } from '@tanstack/react-query';
import { QUERY_KEY } from '@/constants/query-key.constant';
import { queryClient } from '@/lib/query-client';
import { clientApis } from '@/services/client.api';
import type { MatchingCancelReasonCode } from '@/types/my.type';

type CancelMatchingVariables = {
  matchingId: bigint;
  reasonCode: MatchingCancelReasonCode;
  reasonText?: string;
};

export default function useCancelMatching(postId: bigint) {
  return useMutation({
    mutationFn: ({
      matchingId,
      reasonCode,
      reasonText = '',
    }: CancelMatchingVariables) =>
      clientApis.matched.cancelMatching(matchingId, reasonCode, reasonText),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.auth, QUERY_KEY.myMatchedPosts],
      });
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEY.auth,
          QUERY_KEY.postDetail,
          BigInt(postId).toString(),
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.postMembers, BigInt(postId).toString()],
      });
    },
  });
}
