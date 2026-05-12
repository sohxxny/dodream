import { mockPostMembers } from '@/mocks/data/my';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const data = mockPostMembers[Number(id) as keyof typeof mockPostMembers] ?? {
    users: [],
    nextCursor: 0,
    hasNext: false,
  };
  return Response.json(data);
}
