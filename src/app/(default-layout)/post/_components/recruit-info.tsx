import Image from 'next/image';
import { DURATION_LABELS, PROJECT_MAP } from '@/constants/post.constant';
import { ACTIVITY_MODE, TECH_STACK_MAP } from '@/constants/profile.constant';
import type { DurationType, ProjectType } from '@/types/post.type';
import type { ActivityModeType, TechStackType } from '@/types/profile.type';
import { formatDate } from '@/utils/date.util';
import { cn } from '@/utils/style.util';

interface RecruitInfoProps {
  projectType: ProjectType;
  deadlineDate: string;
  activityMode: ActivityModeType;
  interestKeywords: string[];
  duration: DurationType;
  techStacks: string[];
  align?: 'vertical' | 'horizontal';
}

/**
 * 모집 요약 컴포넌트
 * @param projectType - 모집 유형 (예: 프로젝트, 스터디)
 * @param deadlineDate - 모집 마감일
 * @param activityMode - 활동 방식
 * @param interestKeywords - 관심 분야 목록
 * @param duration - 활동 기간 (예: 1개월, 3개월)
 * @param techStacks - 사용 기술 스택 목록
 * @param align - 배치 방법
 */
export default function RecruitInfo({
  projectType,
  deadlineDate,
  activityMode,
  interestKeywords,
  duration,
  techStacks,
  align = 'horizontal',
}: RecruitInfoProps) {
  if (align === 'vertical') {
    return (
      <div className="flex flex-col gap-6">
        <h3 className="heading-md">모집 요약</h3>

        <dl className="flex flex-col gap-4">
          <RecruitInfoItem label="모집 유형" size="sm">
            {PROJECT_MAP[projectType]}
          </RecruitInfoItem>
          <RecruitInfoItem label="관심 분야" size="sm">
            <ul className="flex gap-4">
              {interestKeywords.map((interest) => (
                <li key={interest}>{interest}</li>
              ))}
            </ul>
          </RecruitInfoItem>
          <RecruitInfoItem label="모집 마감" size="sm">
            <time>{formatDate(deadlineDate)}</time>
          </RecruitInfoItem>
          <RecruitInfoItem label="활동 기간" size="sm">
            {DURATION_LABELS[duration]}
          </RecruitInfoItem>
          <RecruitInfoItem label="활동 방식" size="sm">
            {ACTIVITY_MODE[activityMode]}
          </RecruitInfoItem>
          <RecruitInfoItem label="기술 스택" size="sm">
            <ul className="flex flex-wrap gap-3">
              {techStacks.map((stack) => (
                <Image
                  key={stack}
                  src={`/logo/stacks/${TECH_STACK_MAP[stack as TechStackType]}/24.svg`}
                  alt={`${stack}`}
                  width={24}
                  height={24}
                />
              ))}
            </ul>
          </RecruitInfoItem>
        </dl>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <h3 className="heading-lg">모집 요약</h3>
      <dl className="grid grid-cols-[282px_282px] gap-4 body-lg-medium">
        <RecruitInfoItem label="모집 유형">
          {PROJECT_MAP[projectType]}
        </RecruitInfoItem>
        <RecruitInfoItem label="관심 분야">
          <ul className="flex gap-4">
            {interestKeywords.map((interest) => (
              <li key={interest}>{interest}</li>
            ))}
          </ul>
        </RecruitInfoItem>
        <RecruitInfoItem label="모집 마감">
          <time>{formatDate(deadlineDate)}</time>
        </RecruitInfoItem>
        <RecruitInfoItem label="활동 기간">
          {DURATION_LABELS[duration]}
        </RecruitInfoItem>
        <RecruitInfoItem label="활동 방식">
          {ACTIVITY_MODE[activityMode]}
        </RecruitInfoItem>
        <RecruitInfoItem label="기술 스택" className="col-span-2">
          <ul className="flex flex-wrap gap-3">
            {techStacks.map((stack) => (
              <li key={stack}>
                <Image
                  src={`/logo/stacks/${TECH_STACK_MAP[stack as TechStackType]}/24.svg`}
                  alt={`${stack}`}
                  width={24}
                  height={24}
                />
              </li>
            ))}
          </ul>
        </RecruitInfoItem>
      </dl>
    </div>
  );
}

interface RecruitInfoItemProps {
  label: string;
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

/**
 * 모집 요약 요소
 * @param label - 모집 요약 종류 (모집 유형, 모집 마감 등)
 * @param size - 글씨 크기
 */
function RecruitInfoItem({
  label,
  size = 'md',
  children,
  className = '',
}: RecruitInfoItemProps) {
  return (
    <div className={cn('flex gap-7', size === 'sm' && 'gap-4', className)}>
      <dt className="text-subtle w-19.5 shrink-0">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
