import { mockPostApplicantProfiles } from '@/mocks/data/my';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ userId: string; postId: string }> },
) {
  const { userId } = await params;
  const data =
    mockPostApplicantProfiles[
      Number(userId) as keyof typeof mockPostApplicantProfiles
    ];

  if (!data) {
    return Response.json({ message: 'Not Found' }, { status: 404 });
  }

  return Response.json(data);
}
