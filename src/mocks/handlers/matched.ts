import { HttpResponse, http } from 'msw';
import { BASE_URL } from '@/constants/auth.constant';
import {
  mockMyAppliedPosts,
  mockMyMatchedPosts,
  mockPostApplications,
  mockPostMembers,
  mockPostSuggestions,
} from '../data/my';
import { mockPostDetails } from '../data/posts';
import { mockRecommendationProfiles } from '../data/recommendations';

export const matchedHandlers = [
  /** 지원자 수락 */
  http.post(
    `${BASE_URL}/api/matched/:id/applications/:applicationId/accept`,
    ({ params }) => {
      const postIdNum = Number(params.id);
      const applicationIdNum = Number(params.applicationId);

      const applications =
        mockPostApplications[postIdNum as keyof typeof mockPostApplications];
      if (!applications) return new HttpResponse(null, { status: 404 });

      const applicantIndex = applications.users.findIndex(
        (u) => u.applicationId === applicationIdNum,
      );
      if (applicantIndex === -1) return new HttpResponse(null, { status: 404 });

      const applicant = applications.users[applicantIndex];
      applications.users.splice(applicantIndex, 1);

      const newMatchedId = Date.now();
      const members = mockPostMembers as unknown as Record<
        number,
        {
          users: {
            matchedId: number;
            suggestionId: number | null;
            applicationId: number;
            userId: number;
            nickname: string;
            profileImage: number;
            status: string;
            createdAt: string;
            experience: string;
            jobGroups: string[];
          }[];
          nextCursor: number;
          hasNext: boolean;
        }
      >;
      if (!members[postIdNum]) {
        members[postIdNum] = { users: [], nextCursor: 0, hasNext: false };
      }
      members[postIdNum].users.push({
        matchedId: newMatchedId,
        suggestionId: applicant.suggestionId,
        applicationId: applicant.applicationId,
        userId: applicant.userId,
        nickname: applicant.nickname,
        profileImage: applicant.profileImage,
        status: 'ACCEPTED',
        createdAt: new Date().toISOString(),
        experience: applicant.experience,
        jobGroups: applicant.jobGroups,
      });

      return new HttpResponse(null, { status: 204 });
    },
  ),

  /** 매칭 취소 */
  http.post(`${BASE_URL}/api/matched/:id/cancel`, ({ params }) => {
    const matchingIdNum = Number(params.id);

    const members = mockPostMembers as unknown as Record<
      number,
      { users: { matchedId: number }[]; nextCursor: number; hasNext: boolean }
    >;
    for (const group of Object.values(members)) {
      const idx = group.users.findIndex((u) => u.matchedId === matchingIdNum);
      if (idx !== -1) {
        group.users.splice(idx, 1);
        break;
      }
    }

    let matchedIdx = mockMyMatchedPosts.findIndex(
      (p) => p.id === matchingIdNum,
    );
    if (matchedIdx === -1) {
      const detailByMatchedId = mockPostDetails.find(
        (p) => p.matchedId === matchingIdNum,
      );
      if (detailByMatchedId) {
        matchedIdx = mockMyMatchedPosts.findIndex(
          (p) => p.postId === detailByMatchedId.id,
        );
      }
    }

    if (matchedIdx !== -1) {
      const postId = mockMyMatchedPosts[matchedIdx].postId;
      mockMyMatchedPosts.splice(matchedIdx, 1);

      const detail = mockPostDetails.find((p) => p.id === postId);
      if (detail) detail.applicationId = null;
    }

    return new HttpResponse(null, { status: 204 });
  }),

  /** 지원 취소 */
  http.delete(
    `${BASE_URL}/api/my/applications/:applicationId/cancel`,
    ({ params }) => {
      const id = Number(params.applicationId);

      const appliedIdx = mockMyAppliedPosts.findIndex((p) => p.id === id);
      if (appliedIdx !== -1) {
        const postId = mockMyAppliedPosts[appliedIdx].postId;
        mockMyAppliedPosts.splice(appliedIdx, 1);

        const detail = mockPostDetails.find((p) => p.id === postId);
        if (detail) detail.applicationId = null;
      }

      return new HttpResponse(null, { status: 204 });
    },
  ),

  /** 제안하기 */
  http.post(
    `${BASE_URL}/api/my/suggestions/:postId/suggestions`,
    async ({ request, params }) => {
      const postId = Number(params.postId);
      const { toUserId } = (await request.json()) as { toUserId: string };
      const userId = Number(toUserId);

      const newSuggestionId = Date.now();

      const profileGroup = mockRecommendationProfiles[postId] as
        | {
            profiles: {
              userId: number;
              suggestionId: number | null;
              nickname: string;
              profileImageCode: number;
              experience: string;
              roles: string[];
            }[];
          }
        | undefined;

      const profile = profileGroup?.profiles.find((p) => p.userId === userId);
      if (profile) profile.suggestionId = newSuggestionId;

      const applications =
        mockPostApplications[postId as keyof typeof mockPostApplications];
      const applicant = applications?.users.find((u) => u.userId === userId);
      if (applicant) {
        applicant.suggestionId = newSuggestionId;
        return HttpResponse.json({ suggestionId: newSuggestionId });
      }

      const newEntry = {
        suggestionId: newSuggestionId,
        userId,
        nickname: profile?.nickname ?? '',
        profileImage: profile?.profileImageCode ?? 0,
        status: 'SUGGESTED',
        createdAt: new Date().toISOString(),
        experience: profile?.experience ?? '',
        jobGroups: profile?.roles ?? [],
      };

      const suggestions = mockPostSuggestions as Record<
        number,
        { users: (typeof newEntry)[]; nextCursor: number; hasNext: boolean }
      >;
      if (!suggestions[postId]) {
        suggestions[postId] = { users: [], nextCursor: 0, hasNext: false };
      }
      suggestions[postId].users.push(newEntry);

      return HttpResponse.json({ suggestionId: newSuggestionId });
    },
  ),

  /** 제안 취소 */
  http.delete(
    `${BASE_URL}/api/my/suggestions/suggestions/:suggestionId/cancel`,
    ({ params }) => {
      const suggestionId = Number(params.suggestionId);

      for (const group of Object.values(mockRecommendationProfiles)) {
        const profile = (
          group as { profiles: { suggestionId: number | null }[] }
        ).profiles.find((p) => p.suggestionId === suggestionId);
        if (profile) {
          profile.suggestionId = null;
          break;
        }
      }

      for (const applications of Object.values(mockPostApplications)) {
        const applicant = applications.users.find(
          (u) => u.suggestionId === suggestionId,
        );
        if (applicant) {
          applicant.suggestionId = null;
          return new HttpResponse(null, { status: 204 });
        }
      }

      const suggestions = mockPostSuggestions as Record<
        number,
        {
          users: { suggestionId: number }[];
          nextCursor: number;
          hasNext: boolean;
        }
      >;
      for (const group of Object.values(suggestions)) {
        const idx = group.users.findIndex(
          (u) => u.suggestionId === suggestionId,
        );
        if (idx !== -1) {
          group.users.splice(idx, 1);
          break;
        }
      }

      return new HttpResponse(null, { status: 204 });
    },
  ),
];
