'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PRESERVE_PARAMS } from '@/constants/filter.constant';
import {
  INTERESTS_ID_MAP,
  TECH_STACK_ID_MAP,
} from '@/constants/profile.constant';
import { buildApiQueryString } from '@/utils/filter.util';

/** 파라미터 관리 훅 */
export default function useQueryParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  /** 개별 파라미터 (단일값) */
  const getParam = (key: string, defaultValue?: string) => {
    const value = searchParams.get(key);

    // sort의 기본값
    if (key === 'sort' && !value) {
      return defaultValue ?? 'LATEST';
    }

    return value ?? defaultValue ?? null;
  };

  /** 개별 파라미터 (배열) */
  const getArrayParam = (key: string) => {
    return searchParams.getAll(key);
  };

  /** 개별 파라미터 (boolean 값) */
  const getBoolParam = (key: string, defaultValue: boolean = false) => {
    const value = getParam(key);
    if (value === null) return defaultValue;
    return value === 'true';
  };

  /** 파라미터 설정 */
  const setParams = (
    newParams: Record<
      string,
      string | number | string[] | number[] | null | undefined
    >,
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      // 기존 값 삭제
      params.delete(key);

      if (value === null || value === undefined || value === '') {
        return;
      }

      // techs의 경우 number[] -> TechStackType[] 변환
      if (key === 'techs' && Array.isArray(value)) {
        const techNames = (value as number[])
          .map((id) => TECH_STACK_ID_MAP[id])
          .filter(Boolean);

        techNames.forEach((tech) => {
          params.append(key, tech);
        });
        return;
      }

      if (key === 'interests' && Array.isArray(value)) {
        const interestTypes = (value as number[])
          .map((id) => INTERESTS_ID_MAP[id])
          .filter(Boolean);

        interestTypes.forEach((interest) => {
          params.append(key, interest);
        });
        return;
      }

      // 배열인 경우 여러 값 추가
      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (v !== null && v !== undefined && v !== '') {
            params.append(key, String(v));
          }
        });
        // 단일 값인 경우
      } else {
        params.set(key, String(value));
      }
    });

    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(url, { scroll: false });
  };

  /** 파라미터 설정 (boolean 값) */
  const setBoolParam = (key: string, value: boolean) => {
    setParams({ [key]: value ? 'true' : 'false' });
  };

  /** 필터 파라미터 설정 (page 리셋 포함) */
  const setFilterParams = (
    newParams: Record<
      string,
      string | number | string[] | number[] | null | undefined
    >,
  ) => {
    setParams({ ...newParams, page: null });
  };

  /** 필터 파라미터 설정 (page 리셋 포함) */
  const setFilterBoolParam = (key: string, value: boolean) => {
    setParams({ [key]: value ? 'true' : 'false', page: null });
  };

  /** 개별 파라미터 삭제 */
  const removeParam = (key: string) => {
    setParams({ [key]: null });
  };

  /** 모든 파라미터 삭제 */
  const clearParams = () => {
    const params = new URLSearchParams();

    PRESERVE_PARAMS.forEach((key) => {
      const values = searchParams.getAll(key);
      values.forEach((value) => {
        if (value) params.append(key, value);
      });
    });

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  /** 필터링 탭에 나타나는 파라미터 (정렬, 모집글만 보기, 프로젝트 타입, 페이지 제외) */
  const filterParams = Array.from(searchParams.entries()).filter(
    ([key]) => !(PRESERVE_PARAMS as readonly string[]).includes(key),
  );

  /** 쿼리 스트링 생성 */
  const getApiQueryString = () => buildApiQueryString(searchParams);

  return {
    getParam,
    getArrayParam,
    filterParams,
    setParams,
    setFilterParams,
    getBoolParam,
    setBoolParam,
    setFilterBoolParam,
    removeParam,
    clearParams,
    getApiQueryString,
  };
}
