import { ALL_LABELS } from '@/constants/filter.constant';
import { INTERESTS, ROLE } from '@/constants/profile.constant';

/** 필터링 시 영문 -> 한글 라벨 */
export const getLabel = (key: string): string => {
  return ALL_LABELS[key] ?? key;
};

/**
 * 페이지 번호를 검증하고 유효한 범위로 보정 (1-based)
 * @param page - 검증할 페이지 번호
 * @param totalPage - 전체 페이지 수 (선택사항)
 * @returns 유효한 페이지 번호 (1-based)
 */
export function getValidPage(
  page: string | number | null,
  totalPage?: number,
): number {
  if (!page) return 1;

  const pageNum = Number(page);
  if (!pageNum || pageNum < 1) return 1;

  if (totalPage && pageNum > totalPage) return totalPage;

  return pageNum;
}

/**
 * URLSearchParams를 API 쿼리 스트링으로 변환
 * 클라이언트와 서버 양쪽에서 공유
 */
export function buildApiQueryString(searchParams: {
  forEach: (cb: (value: string, key: string) => void) => void;
}): string {
  const params = new URLSearchParams();

  searchParams.forEach((value, key) => {
    if (key === 'roles') {
      const label = ROLE[value as keyof typeof ROLE];
      if (label) params.append(key, label);
    } else if (key === 'interests') {
      const label = INTERESTS[value as keyof typeof INTERESTS];
      if (label) params.append(key, label);
    } else if (key === 'page') {
      params.append(key, String(getValidPage(value) - 1));
    } else {
      params.append(key, value);
    }
  });

  return params.toString();
}
