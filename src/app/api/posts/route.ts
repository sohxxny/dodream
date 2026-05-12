import {
  INTERESTS,
  INTERESTS_ID_MAP,
  TECH_STACK_ID_MAP,
} from '@/constants/profile.constant';
import { ROLES } from '@/constants/role.constant';
import { mockPostDetails, mockPostList } from '@/mocks/data/posts';
import {
  generateProfilesForPost,
  mockRecommendationProfiles,
} from '@/mocks/data/recommendations';

export async function POST(req: Request) {
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

  const newId = Math.max(...mockPostList.map((p) => p.id)) + 1;
  const now = new Date().toISOString();
  const deadline = new Date(body.deadlineAt).toISOString().split('T')[0];

  const roleNames = body.roles
    .map((r) => ROLES.find((role) => role.id === r.roleId)?.name ?? '')
    .filter(Boolean)
    .sort(
      (a, b) =>
        ROLES.findIndex((r) => r.name === a) -
        ROLES.findIndex((r) => r.name === b),
    );
  const techNames = body.stackIds
    .map((id) => TECH_STACK_ID_MAP[id] ?? '')
    .filter(Boolean);
  const interestNames = body.interestIds
    .map((id) => INTERESTS[INTERESTS_ID_MAP[id]] ?? '')
    .filter(Boolean);

  const listItem = {
    id: newId,
    title: body.title,
    projectType: body.projectType,
    roles: roleNames,
    techs: techNames,
    interests: interestNames,
    author: '데모유저',
    authorProfileImageCode: 1,
    viewCount: 0,
    deadline: `${deadline}T00:00:00`,
    status: 'RECRUITING',
    activityMode: body.activityMode,
    createdAt: now,
  };

  const detailItem = {
    id: newId,
    title: body.title,
    content: body.content,
    status: 'RECRUITING',
    createdAt: now,
    ownerNickname: '데모유저',
    ownerProfileImageUrl: 1,
    projectType: body.projectType,
    activityMode: body.activityMode,
    duration: body.duration,
    deadlineDate: deadline,
    interestKeywords: interestNames,
    viewCount: 0,
    stacks: techNames,
    roles: body.roles
      .map((r) => ({
        role: ROLES.find((role) => role.id === r.roleId)?.name ?? '',
        headcount: r.count,
      }))
      .sort(
        (a, b) =>
          ROLES.findIndex((r) => r.name === a.role) -
          ROLES.findIndex((r) => r.name === b.role),
      ),
    applicationId: null,
    matchedId: null,
    owner: true,
  };

  mockPostList.unshift(listItem);
  mockPostDetails.unshift(detailItem);
  mockRecommendationProfiles[newId] = generateProfilesForPost(roleNames);

  return Response.json(listItem, { status: 201 });
}
