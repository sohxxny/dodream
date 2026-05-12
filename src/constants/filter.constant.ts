import type { SortType } from '@/types/filter.type';
import { ACTIVITY_MODE, INTERESTS, ROLE } from './profile.constant';

/** 필터링 탭에 제외할 파라미터 */
export const PRESERVE_PARAMS = [
  'sort',
  'onlyRecruiting',
  'type',
  'page',
  'keyword',
] as const;

/** 정렬 기준 */
export const SORT_LABELS: Record<SortType, string> = {
  LATEST: '최신순',
  POPULAR: '인기순',
  DEADLINE: '마감일순',
};

export const SORT_LABEL_LIST = Object.entries(SORT_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  }),
);

export const ALL_LABELS: Record<string, string> = {
  ...ROLE,
  ...INTERESTS,
  ...ACTIVITY_MODE,
  ...SORT_LABELS,
};
