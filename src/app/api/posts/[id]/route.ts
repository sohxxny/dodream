import {
  INTERESTS,
  INTERESTS_ID_MAP,
  TECH_STACK_ID_MAP,
} from '@/constants/profile.constant';
import { ROLES } from '@/constants/role.constant';
import { mockPostDetails, mockPostList } from '@/mocks/data/posts';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const post = mockPostDetails.find((p) => p.id === Number(id));
  if (!post) return Response.json({ message: 'Not Found' }, { status: 404 });
  return Response.json(post);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const postId = Number(id);
  const body = (await req.json()) as {
    title: string;
    projectType: string;
    roles: { roleId: number; count: number }[];
    stackIds: number[];
    interestIds: number[];
    activityMode: string;
    duration: string;
    deadlineAt: string;
    content: string;
  };

  const deadline = new Date(body.deadlineAt).toISOString().split('T')[0];
  const roleNames = body.roles
    .map((r) => ROLES.find((role) => role.id === r.roleId)?.name ?? '')
    .filter(Boolean);
  const techNames = body.stackIds
    .map((id) => TECH_STACK_ID_MAP[id] ?? '')
    .filter(Boolean);
  const interestNames = body.interestIds
    .map((id) => INTERESTS[INTERESTS_ID_MAP[id]] ?? '')
    .filter(Boolean);

  const listIdx = mockPostList.findIndex((p) => p.id === postId);
  if (listIdx !== -1) {
    mockPostList[listIdx] = {
      ...mockPostList[listIdx],
      title: body.title,
      projectType: body.projectType,
      roles: roleNames,
      techs: techNames,
      interests: interestNames,
      activityMode: body.activityMode,
      deadline: `${deadline}T00:00:00`,
    };
  }

  const detailIdx = mockPostDetails.findIndex((p) => p.id === postId);
  if (detailIdx !== -1) {
    mockPostDetails[detailIdx] = {
      ...mockPostDetails[detailIdx],
      title: body.title,
      content: body.content,
      projectType: body.projectType,
      activityMode: body.activityMode,
      duration: body.duration,
      deadlineDate: deadline,
      interestKeywords: interestNames,
      stacks: techNames,
      roles: body.roles.map((r) => ({
        role: ROLES.find((role) => role.id === r.roleId)?.name ?? '',
        headcount: r.count,
      })),
    };
  }

  return Response.json({ id: postId });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const postId = Number(id);

  const listIdx = mockPostList.findIndex((p) => p.id === postId);
  if (listIdx !== -1) mockPostList.splice(listIdx, 1);

  const detailIdx = mockPostDetails.findIndex((p) => p.id === postId);
  if (detailIdx !== -1) mockPostDetails.splice(detailIdx, 1);

  return new Response(null, { status: 204 });
}
