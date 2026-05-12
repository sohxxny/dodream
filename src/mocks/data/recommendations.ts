export const mockRecommendedPosts = {
  PROJECT: {
    posts: [
      {
        postId: 7,
        title: 'AI 기반 식단 관리 앱 개발 팀원 모집',
        projectType: 'PROJECT',
        deadlineAt: '2027-05-10T00:00:00',
        matchReasons: ['MATCHING_TECH', 'MATCHING_FIELD'],
      },
      {
        postId: 19,
        title: '교육 플랫폼 서비스 개발 (에듀테크)',
        projectType: 'PROJECT',
        deadlineAt: '2027-05-10T00:00:00',
        matchReasons: ['MATCHING_TECH', 'MATCHING_FIELD'],
      },
      {
        postId: 11,
        title: 'SNS 앱 실서비스 런칭 도전',
        projectType: 'PROJECT',
        deadlineAt: '2027-05-20T00:00:00',
        matchReasons: ['MATCHING_TECH', 'MATCHING_MODE'],
      },
      {
        postId: 16,
        title: '패션 커머스 플랫폼 MVP 개발',
        projectType: 'PROJECT',
        deadlineAt: '2027-06-01T00:00:00',
        matchReasons: ['MATCHING_FIELD', 'MATCHING_MODE'],
      },
    ],
    nextCursor: 0,
    hasNext: false,
  },

  STUDY: {
    posts: [
      {
        postId: 1,
        title: "[온라인] 'Clean Code' 3판 완독 및 리팩토링 스터디 (4주)",
        projectType: 'STUDY',
        deadlineAt: '2027-05-20T00:00:00',
        matchReasons: ['MATCHING_TECH', 'MATCHING_ROLE'],
      },
      {
        postId: 17,
        title: 'GraphQL + React 스터디 (주 1회)',
        projectType: 'STUDY',
        deadlineAt: '2027-05-20T00:00:00',
        matchReasons: ['MATCHING_TECH', 'MATCHING_ROLE'],
      },
      {
        postId: 12,
        title: 'CS 기술 면접 스터디 (주 2회 모의 면접)',
        projectType: 'STUDY',
        deadlineAt: '2027-05-30T00:00:00',
        matchReasons: ['MATCHING_TECH', 'MATCHING_ROLE'],
      },
      {
        postId: 2,
        title:
          '2027 상반기 공채 대비 코딩테스트(알고리즘) 스터디 (백준 골드 목표)',
        projectType: 'STUDY',
        deadlineAt: '2027-05-25T00:00:00',
        matchReasons: ['MATCHING_TECH', 'MATCHING_ROLE'],
      },
    ],
    nextCursor: 0,
    hasNext: false,
  },
};

const EXTRA_MATCH_TAGS = [
  'MATCHING_TECH',
  'MATCHING_FIELD',
  'MATCHING_MODE',
] as const;
const EXPERIENCES = [
  '신입',
  '일년이상삼년미만',
  '삼년이상오년미만',
  '오년이상',
] as const;

let generatedUserIdCounter = 9000;

export function generateProfilesForPost(roles: string[]) {
  const profiles = [];

  for (const role of roles) {
    const count = Math.floor(Math.random() * 3) + 1;

    for (let i = 1; i <= count; i++) {
      const extraTag =
        Math.random() > 0.3
          ? EXTRA_MATCH_TAGS[
              Math.floor(Math.random() * EXTRA_MATCH_TAGS.length)
            ]
          : null;

      profiles.push({
        userId: generatedUserIdCounter++,
        suggestionId: null,
        nickname: `${role}추천유저${i}`,
        experience: EXPERIENCES[Math.floor(Math.random() * EXPERIENCES.length)],
        profileImageCode: Math.floor(Math.random() * 15) + 1,
        roles: [role],
        matchReasons: extraTag
          ? ['MATCHING_ROLE', extraTag]
          : ['MATCHING_ROLE'],
      });
    }
  }

  return { profiles, nextCursor: 0, hasNext: false };
}

export const mockRecommendationProfiles: Record<number, object> = {
  5: {
    profiles: [
      {
        userId: 201,
        suggestionId: 2001,
        nickname: '루시드',
        experience: '일년이상삼년미만',
        profileImageCode: 3,
        roles: ['프론트엔드'],
        matchReasons: ['MATCHING_ROLE', 'MATCHING_TECH'],
      },
      {
        userId: 202,
        suggestionId: null,
        nickname: '넥스트탐험가',
        experience: '신입',
        profileImageCode: 7,
        roles: ['프론트엔드'],
        matchReasons: ['MATCHING_ROLE', 'MATCHING_TECH'],
      },
      {
        userId: 203,
        suggestionId: 2003,
        nickname: '죠르디',
        experience: '삼년이상오년미만',
        profileImageCode: 11,
        roles: ['프론트엔드'],
        matchReasons: ['MATCHING_ROLE', 'MATCHING_MODE'],
      },
      {
        userId: 204,
        suggestionId: 2004,
        nickname: '김민수',
        experience: '일년이상삼년미만',
        profileImageCode: 2,
        roles: ['백엔드'],
        matchReasons: ['MATCHING_ROLE', 'MATCHING_TECH'],
      },
      {
        userId: 205,
        suggestionId: null,
        nickname: '백엔드취준생',
        experience: '신입',
        profileImageCode: 6,
        roles: ['백엔드'],
        matchReasons: ['MATCHING_ROLE', 'MATCHING_MODE'],
      },
      {
        userId: 206,
        suggestionId: null,
        nickname: 'FOREVERONE',
        experience: '삼년이상오년미만',
        profileImageCode: 10,
        roles: ['백엔드'],
        matchReasons: ['MATCHING_ROLE', 'MATCHING_FIELD'],
      },
      {
        userId: 207,
        suggestionId: null,
        nickname: '동그란맘',
        experience: '신입',
        profileImageCode: 4,
        roles: ['디자이너'],
        matchReasons: ['MATCHING_ROLE', 'MATCHING_MODE'],
      },
      {
        userId: 208,
        suggestionId: 2008,
        nickname: 'UX탐구생활',
        experience: '일년이상삼년미만',
        profileImageCode: 8,
        roles: ['디자이너'],
        matchReasons: ['MATCHING_ROLE', 'MATCHING_FIELD'],
      },
      {
        userId: 209,
        suggestionId: null,
        nickname: 'StillWithU',
        experience: '삼년이상오년미만',
        profileImageCode: 12,
        roles: ['디자이너'],
        matchReasons: ['MATCHING_ROLE'],
      },
      {
        userId: 210,
        suggestionId: 2010,
        nickname: 'PM뉴비',
        experience: '신입',
        profileImageCode: 5,
        roles: ['기획자'],
        matchReasons: ['MATCHING_ROLE', 'MATCHING_FIELD'],
      },
      {
        userId: 211,
        suggestionId: null,
        nickname: '낙낙',
        experience: '일년이상삼년미만',
        profileImageCode: 9,
        roles: ['기획자'],
        matchReasons: ['MATCHING_ROLE', 'MATCHING_MODE'],
      },
      {
        userId: 212,
        suggestionId: 2012,
        nickname: '말차라떼',
        experience: '삼년이상오년미만',
        profileImageCode: 13,
        roles: ['기획자'],
        matchReasons: ['MATCHING_ROLE', 'MATCHING_TECH'],
      },
    ],
    nextCursor: 0,
    hasNext: false,
  },
  6: {
    profiles: [
      {
        userId: 213,
        suggestionId: 2013,
        nickname: '취업시켜주세요',
        experience: '신입',
        profileImageCode: 1,
        roles: ['프론트엔드'],
        matchReasons: ['MATCHING_ROLE', 'MATCHING_TECH'],
      },
      {
        userId: 214,
        suggestionId: null,
        nickname: 'Olivia',
        experience: '일년이상삼년미만',
        profileImageCode: 14,
        roles: ['프론트엔드'],
        matchReasons: ['MATCHING_ROLE', 'MATCHING_TECH'],
      },
      {
        userId: 215,
        suggestionId: null,
        nickname: 'NextJS딸깍',
        experience: '신입',
        profileImageCode: 15,
        roles: ['프론트엔드'],
        matchReasons: ['MATCHING_ROLE', 'MATCHING_MODE'],
      },
    ],
    nextCursor: 0,
    hasNext: false,
  },
};
