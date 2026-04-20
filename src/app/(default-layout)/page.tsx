import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import Banner from '@/app/(default-layout)/(home)/_components/banner';
import HomePosts from '@/app/(default-layout)/(home)/_components/home-posts';
import RecommendedPosts from '@/app/(default-layout)/(home)/_components/recommended-posts';
import { QUERY_KEY } from '@/constants/query-key.constant';
import { getQueryClient } from '@/lib/query-client';
import { serverApis } from '@/services/server.api';
import { buildApiQueryString } from '@/utils/filter.util';

interface HomeProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Home({ searchParams }: HomeProps) {
  const queryClient = getQueryClient();
  const rawParams = await searchParams;

  const urlSearchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(rawParams)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) urlSearchParams.append(key, v);
    } else {
      urlSearchParams.append(key, value);
    }
  }
  const query = buildApiQueryString(urlSearchParams);

  // 프리패치
  const [profileExists] = await Promise.all([
    queryClient.fetchQuery({
      queryKey: [QUERY_KEY.auth, QUERY_KEY.profileExists],
      queryFn: () => serverApis.profile.getProfileExists(),
    }),
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEY.auth, QUERY_KEY.posts, query],
      queryFn: () => serverApis.posts.getPosts(query),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="grid grid-cols-12 gap-x-7 gap-y-12">
        <Banner profileExists={profileExists.exists} />
        <RecommendedPosts profileExists={profileExists.exists} />
        <HomePosts />
      </div>
    </HydrationBoundary>
  );
}
