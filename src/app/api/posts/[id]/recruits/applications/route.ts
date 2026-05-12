import { mockPostApplications } from '@/mocks/data/my';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const data = mockPostApplications[
    Number(id) as keyof typeof mockPostApplications
  ] ?? {
    users: [],
    nextCursor: 0,
    hasNext: false,
  };
  return Response.json(data);
}
