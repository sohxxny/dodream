import { INTEREST_KEYWORDS } from '@/constants/interest.constant';
import { ROLES } from '@/constants/role.constant';
import { TECH_SKILLS } from '@/constants/tech-skill.constant';
import { mockPostMembers } from '@/mocks/data/my';
import { mockPostDetails, mockPostList } from '@/mocks/data/posts';
import { mockProfile } from '@/mocks/data/user';
import type { UpdateProfileRequestType } from '@/types/profile.type';

export async function GET() {
  return Response.json(mockProfile);
}

export async function PUT(request: Request) {
  const body: UpdateProfileRequestType = await request.json();

  const newProfile = {
    nickname: body.nickname,
    experience: body.experience,
    activityMode: body.activityMode,
    introText: body.introText,
    profileImageCode: body.profileImageCode,
    roles: body.roleNames
      .map((name) => ROLES.find((r) => r.name === name))
      .filter((r) => r !== undefined),
    techSkills: body.techSkillIds
      .map((id) => TECH_SKILLS.find((s) => s.id === id))
      .filter((s) => s !== undefined),
    interestKeywords: body.interestKeywordIds
      .map((id) => INTEREST_KEYWORDS.find((k) => k.id === id))
      .filter((k) => k !== undefined),
    profileUrls: Object.values(body.profileUrls).map((url, index) => ({
      id: index + 1,
      profileId: 1,
      url,
    })),
  };

  if (body.nickname !== mockProfile.nickname) {
    mockPostList.forEach((post) => {
      if (post.author === mockProfile.nickname) post.author = body.nickname;
    });
    mockPostDetails.forEach((post) => {
      if (post.ownerNickname === mockProfile.nickname)
        post.ownerNickname = body.nickname;
    });
    Object.values(mockPostMembers).forEach((group) => {
      group.users.forEach((user) => {
        if (user.userId === 1) user.nickname = body.nickname;
      });
    });
  }

  Object.assign(mockProfile, newProfile);
  return new Response(null, { status: 204 });
}
