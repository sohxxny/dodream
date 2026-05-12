import { mockPostDetails, mockPostList } from '@/mocks/data/posts';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const type = url.searchParams.get('type');
  const roles = url.searchParams.getAll('roles');
  const techs = url.searchParams.getAll('techs');
  const interests = url.searchParams.getAll('interests');
  const activityMode = url.searchParams.get('activityMode');
  const onlyRecruiting = url.searchParams.get('onlyRecruiting') !== 'false';
  const keyword = url.searchParams.get('keyword') ?? '';
  const sort = url.searchParams.get('sort') ?? 'LATEST';
  const page = Number(url.searchParams.get('page') ?? 0);
  const pageSize = Number(url.searchParams.get('size') ?? 10);

  let filtered = [...mockPostList];

  if (type && type !== 'ALL') {
    filtered = filtered.filter((p) => p.projectType === type);
  }
  if (roles.length > 0) {
    filtered = filtered.filter((p) => roles.some((r) => p.roles.includes(r)));
  }
  if (techs.length > 0) {
    filtered = filtered.filter((p) => techs.some((t) => p.techs.includes(t)));
  }
  if (interests.length > 0) {
    filtered = filtered.filter((p) =>
      interests.some((i) => p.interests.includes(i)),
    );
  }
  if (activityMode) {
    filtered = filtered.filter((p) => p.activityMode === activityMode);
  }
  if (onlyRecruiting) {
    filtered = filtered.filter((p) => p.status === 'RECRUITING');
  }
  if (keyword) {
    const lower = keyword.toLowerCase();
    filtered = filtered.filter((p) => {
      if (p.title.toLowerCase().includes(lower)) return true;
      const detail = mockPostDetails.find((d) => d.id === p.id);
      return detail?.content.toLowerCase().includes(lower) ?? false;
    });
  }

  if (sort === 'LATEST') {
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } else if (sort === 'POPULAR') {
    filtered.sort((a, b) => b.viewCount - a.viewCount);
  } else if (sort === 'DEADLINE') {
    filtered.sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
    );
  }

  const totalElements = filtered.length;
  const totalPages = Math.ceil(totalElements / pageSize);
  const content = filtered.slice(page * pageSize, (page + 1) * pageSize);

  return Response.json({
    posts: {
      content,
      totalPages,
      number: page,
      totalElements,
      size: pageSize,
      first: page === 0,
      last: page >= totalPages - 1,
      numberOfElements: content.length,
      empty: content.length === 0,
    },
  });
}
