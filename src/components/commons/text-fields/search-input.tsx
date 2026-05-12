import clsx from 'clsx';
import type { ComponentProps } from 'react';
import SearchIcon from '@/assets/icons/search/14.svg';
import XIcon from '@/assets/icons/x/14.svg';
import Input from '@/components/commons/text-fields/input';

interface SearchInputProps extends ComponentProps<typeof Input> {
  onSearch?: () => void;
  onClear?: () => void;
  buttonType?: 'button' | 'reset' | 'submit';
  className?: string;
}

/**
 * 검색 버튼이 있는 input 컴포넌트
 * @param onSearch - 검색 버튼 핸들러
 * @param onClear - 초기화 버튼 핸들러
 * @param buttonType - button의 타입 (검색일 경우 submit)
 */
export default function SearchInput({
  onSearch,
  onClear,
  buttonType = 'button',
  className,
  ...props
}: SearchInputProps) {
  const hasValue = Boolean(props.value);

  return (
    <div className="relative">
      <Input
        className={clsx('pl-8.5', hasValue && onClear && 'pr-6.5', className)}
        {...props}
      />
      <button
        type={buttonType}
        onClick={() => onSearch?.()}
        className="absolute left-3.5 top-1/2 -translate-y-1/2"
        aria-label="검색하기"
      >
        <SearchIcon className="text-icon-light" />
      </button>
      {hasValue && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3.5 top-1/2 -translate-y-1/2"
          aria-label="검색어 삭제"
        >
          <XIcon className="text-icon-light" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
