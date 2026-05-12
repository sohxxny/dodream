import { BASE_URL } from '@/constants/auth.constant';
import type { ErrorType } from '@/types/error.type';
import { isErrorType } from '@/utils/error.util';
import { createApiMethods } from './create-api';

export async function fetcher<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  try {
    const url = `${BASE_URL}${endpoint}`;

    const res = await fetch(url, {
      ...options,
      credentials: options.credentials || 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const contentType = res.headers.get('content-type');

    // JSON이 아닌 응답 체크
    if (!contentType?.includes('application/json') && res.status !== 204) {
      // HTML 응답은 인증 에러로 간주
      if (contentType?.includes('text/html')) {
        const error: ErrorType = {
          code: 401,
          error: 'UNAUTHORIZED',
          message: '인증되지 않음',
        };
        throw error;
      }

      // text/plain 응답 처리
      if (contentType?.includes('text/plain')) {
        if (!res.ok) {
          const errorText = await res.text();
          console.error('에러 응답:', errorText);
          const error: ErrorType = {
            code: res.status,
            error: 'PLAIN_TEXT_ERROR',
            message: errorText || `HTTP 에러 ${res.status}`,
          };
          throw error;
        }
        // 성공 시 텍스트 반환
        return (await res.text()) as T;
      }

      const error: ErrorType = {
        code: res.status || 500,
        error: 'UNSUPPORTED_CONTENT_TYPE',
        message: `지원하지 않는 응답 형식: ${contentType}`,
      };
      throw error;
    }

    if (!res.ok) {
      try {
        const errorData = await res.json();
        const error: ErrorType = {
          code: res.status,
          error: errorData.error || 'UNKNOWN_ERROR',
          message: errorData.message || `HTTP 에러 ${res.status}`,
        };
        throw error;
      } catch (parseError) {
        // JSON 파싱 실패 시
        if ((parseError as ErrorType).code) {
          throw parseError;
        }

        const errorText = await res.text();
        const error: ErrorType = {
          code: res.status,
          error: 'PARSE_ERROR',
          message: errorText || `HTTP 에러 ${res.status}`,
        };
        throw error;
      }
    }

    return res.status === 204 ? ({} as T) : await res.json();
  } catch (error) {
    if (isErrorType(error)) {
      if (error.code === 401 || error.code === 403 || error.code === 404) {
        console.log(`[${error.code}] ${error.message}`);
      } else {
        console.error(
          `${endpoint} Fetch 요청 오류: [${error.code}] ${error.message}`,
        );
      }

      throw error;
    } else {
      // ErrorType이 아닌 에러는 ErrorType으로 변환
      console.error(`${endpoint} Fetch 요청 오류:`, error);

      const wrappedError: ErrorType = {
        code: 500,
        error: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : '네트워크 오류',
      };
      throw wrappedError;
    }
  }
}

/**
 * 클라이언트 API
 * 브라우저 쿠키 자동 전송
 */
export const api = createApiMethods(fetcher);
