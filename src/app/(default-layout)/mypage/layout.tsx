import { redirect } from 'next/navigation';
import MyPageNavigation from '@/components/layout/header/mypage-navigation';
import { serverApis } from '@/services/server.api';

export default async function MyPageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  try {
    const { exists } = await serverApis.profile.getProfileExists();
    if (!exists) redirect('/');
  } catch {
    redirect('/');
  }

  return (
    <div className="w-full h-full grid grid-cols-12 gap-7">
      <MyPageNavigation />
      <section className="col-span-8 col-start-4 flex flex-col gap-9">
        {children}
      </section>
    </div>
  );
}
