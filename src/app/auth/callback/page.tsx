import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { serverApis } from '@/services/server.api';

interface AuthCallBackPageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function AuthCallBackPage({
  searchParams,
}: AuthCallBackPageProps) {
  const params = await searchParams;
  const { userId, email, name } = params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');

  if (!userId || !email || !name || !accessToken) {
    redirect('/');
  }

  const redirectCookie = cookieStore.get('OAUTH2_FRONTEND_URL');
  const redirectPath = redirectCookie?.value || '/';

  const { exists } = await serverApis.profile.getProfileExists();

  if (exists) {
    redirect(redirectPath);
  } else {
    const createProfileUrl =
      redirectPath !== '/'
        ? `/create-profile?redirect=${encodeURIComponent(redirectPath)}`
        : '/create-profile';
    redirect(createProfileUrl);
  }
}
