'use client';

import useToast from '../use-toast';

export const useLogout = () => {
  // const router = useRouter();
  // const queryClient = useQueryClient();
  const toast = useToast();

  const logout = () => {
    toast({ title: '데모 버전에서는 사용할 수 없습니다.' });
    // try {
    //   await clientApis.auth.logout();

    //   queryClient.removeQueries({ queryKey: [QUERY_KEY.user] });
    //   queryClient.removeQueries({ queryKey: [QUERY_KEY.auth] });

    //   router.refresh();
    // } catch {
    //   console.error('로그아웃 실패');
    // }
  };

  return { logout };
};
