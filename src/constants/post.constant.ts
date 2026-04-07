import type {
  DurationType,
  HomeProjectType,
  ProjectType,
  RecommendType,
} from '@/types/post.type';

/** 기간 매핑 객체 */
export const DURATION_LABELS: Record<DurationType, string> = {
  UNDECIDED: '미정',
  UNDER_ONE_MONTH: '1개월 미만',
  ONE_MONTH: '1개월',
  TWO_MONTHS: '2개월',
  THREE_MONTHS: '3개월',
  FOUR_MONTHS: '4개월',
  FIVE_MONTHS: '5개월',
  SIX_MONTHS: '6개월',
  LONG_TERM: '장기',
};

export const DURATION_LIST = Object.entries(DURATION_LABELS).map(
  ([value, label]) => ({
    value: value as DurationType,
    label,
  }),
);

export const PROJECT_MAP: Record<ProjectType, string> = {
  PROJECT: '프로젝트',
  STUDY: '스터디',
};

export const PROJECT_TAB_VALUES = Object.keys(PROJECT_MAP);

export const HOME_PROJECT_MAP: Record<HomeProjectType, string> = {
  ALL: '전체',
  PROJECT: '프로젝트',
  STUDY: '스터디',
};

export const HOME_PROJECT_TAB_VALUES = Object.keys(HOME_PROJECT_MAP);

export const RECOMMEND_TYPE_LABEL: Record<RecommendType, string> = {
  MATCHING_ROLE: '내직군모집중',
  MATCHING_TECH: '나와맞는기술스택',
  MATCHING_MODE: '나와맞는활동방식',
  MATCHING_FIELD: '선호하는분야',
};
