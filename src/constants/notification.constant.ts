import type { FC, SVGProps } from 'react';
import BookmarkIcon from '@/assets/icons/bookmark/12.svg';
import FileCheckIcon from '@/assets/icons/file-check/12.svg';
import HandShakeIcon from '@/assets/icons/hand-shake/12.svg';
import MailIcon from '@/assets/icons/mail/12.svg';
import MessageSquareQuoteIcon from '@/assets/icons/message-square-quote/12.svg';
import type { NotificationType } from '@/types/notification.type';

/** 알림 아이콘 매핑 */
export const NOTIFICATION_ICON: Record<
  NotificationType,
  FC<SVGProps<SVGElement>>
> = {
  PROPOSAL_SENT: MailIcon,
  PROPOSAL_APPLIED: FileCheckIcon,
  APPLICATION_ACCEPTED: HandShakeIcon,
  APPLICANT_ACCEPTED: HandShakeIcon,
  BOOKMARK_DEADLINE: BookmarkIcon,
  REVIEW_ACTIVATED: MessageSquareQuoteIcon,
  FEEDBACK_WRITTEN: MessageSquareQuoteIcon,
};
