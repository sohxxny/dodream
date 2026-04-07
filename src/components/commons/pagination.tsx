import clsx from 'clsx';
import ArrowLeft from '@/assets/icons/chevron-left/16.svg';
import ArrowRight from '@/assets/icons/chevron-right/16.svg';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const ELLIPSIS = '···';

/**
 * 페이지네이션 컴포넌트
 * @param currentPage - 현재 페이지
 * @param totalPages - 전체 페이지 수
 * @param onPageChange - 페이지 버튼 클릭 핸들러
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationProps) {
  const getPageNumbers = () => {
    // 6개 이하면 모두 표시
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // 6개 초과일 때
    const pages: (number | string)[] = [];

    // currentPage가 앞쪽 (1, 2, 3)
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, ELLIPSIS, totalPages);
    }

    // currentPage가 뒤쪽 (total-2, total-1, total)
    else if (currentPage >= totalPages - 2) {
      pages.push(
        1,
        ELLIPSIS,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
    }
    // currentPage가 중간
    else {
      pages.push(
        1,
        ELLIPSIS,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        ELLIPSIS,
        totalPages,
      );
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className={`flex gap-5 items-center ${className}`}>
      {/* prev 버튼 */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 flex justify-center items-center"
        aria-label="이전 페이지"
      >
        <ArrowLeft className={clsx(currentPage === 1 && 'text-icon-disable')} />
      </button>

      {pageNumbers.map((page, index) => {
        // 줄임표
        if (page === ELLIPSIS) {
          return (
            <span
              key={index === 1 ? 'ellipsis-start' : 'ellipsis-end'}
              className="w-8 h-8 flex items-center justify-center"
            >
              {ELLIPSIS}
            </span>
          );
        }

        // 숫자 버튼
        return (
          <button
            type="button"
            key={page}
            onClick={() => onPageChange(page as number)}
            className={clsx(
              'w-8 h-8 rounded-full',
              currentPage === page && 'bg-button text-on-brand',
            )}
          >
            {page}
          </button>
        );
      })}

      {/* next 버튼 */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex justify-center items-center"
        aria-label="다음 페이지"
      >
        <ArrowRight
          className={clsx(currentPage === totalPages && 'text-icon-disable')}
        />
      </button>
    </nav>
  );
}
