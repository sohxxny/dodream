import { mockPostSuggestions } from '@/mocks/data/my';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const postId = Number(id);
  const data = mockPostSuggestions[
    postId as keyof typeof mockPostSuggestions
  ] ?? {
    users: [],
    nextCursor: 0,
    hasNext: false,
  };
  return Response.json(data);
}
