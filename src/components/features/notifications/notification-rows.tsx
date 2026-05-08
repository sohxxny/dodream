'use client';

import { useRouter } from 'next/navigation';
import { overlay } from 'overlay-kit';
import { DropdownMenu } from 'radix-ui';
import ProfileImage from '@/components/commons/profile-image';
import { NOTIFICATION_ICON } from '@/constants/notification.constant';
import useGetMyNotifications from '@/hooks/notification/use-get-my-notifications';
import useReadNotifications from '@/hooks/notification/use-read-notification';
import useToast from '@/hooks/use-toast';
import { clientApis } from '@/services/client.api';
import type { NotificationResponseType } from '@/types/notification.type';
import { getDateCategory, getRelativeTime } from '@/utils/date.util';
import CreateReviewModal from '../reviews/create-review-modal';
import ViewReviewModal from '../reviews/view-review-modal';

/**
 * 알림 행 전체 컴포넌트
 */
export default function NotificationRows() {
  const { data: notifications = [] } = useGetMyNotifications();

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center body-sm-medium text-subtle pt-3 pb-7">
        <p>확인할 알림이 없습니다</p>
        <p>이곳에 활동에 대한 알림이 표시됩니다</p>
      </div>
    );
  }

  // 날짜별로 그룹화
  const groupedByDate = notifications.reduce(
    (acc, notification) => {
      const date = getDateCategory(notification.createdAt);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(notification);
      return acc;
    },
    {} as Record<string, typeof notifications>,
  );

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(groupedByDate).map(([date, items]) => (
        <section key={date}>
          <h3
            id={`notification-${date}`}
            className="body-sm-medium text-subtle px-4"
          >
            {date}
          </h3>
          <ul>
            {items.map((notification) => (
              <li key={`notification-${notification.id}`}>
                <NotificationRow notification={notification} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

interface NotificationRowProps {
  notification: NotificationResponseType;
}

/**
 * 알림 행 개별 요소 컴포넌트
 * @param notification - 알림 데이터 1개
 */
function NotificationRow({ notification }: NotificationRowProps) {
  const router = useRouter();
  const toast = useToast();
  const { mutate: readNotification } = useReadNotifications();
  const NotificationIcon = NOTIFICATION_ICON[notification.type];

  const handleClickNotification = async () => {
    // 알림 읽음 처리
    readNotification(notification.id);

    if (
      notification.type === 'PROPOSAL_SENT' ||
      notification.type === 'BOOKMARK_DEADLINE'
    ) {
      // 제안 수신 / 북마크 마감 임박 - 해당 게시글로 이동
      router.push(`/post/${BigInt(notification.targetPostId)}`);
    } else if (notification.type === 'PROPOSAL_APPLIED') {
      // 지원자 발생 - 내 게시글 모집 현황 페이지로 이동
      router.push(
        `/mypage/posts/${BigInt(notification.targetPostId)}/recruitment?tab=applicants`,
      );
    } else if (notification.type === 'APPLICATION_ACCEPTED') {
      // 내 지원 수락 - 참여 중인 프로젝트 탭으로 이동
      router.push('/mypage/participations?tab=matched');
    } else if (notification.type === 'APPLICANT_ACCEPTED') {
      // 내 모집글 지원자 수락 - 해당 모집글 멤버 탭으로 이동
      router.push(
        `/mypage/posts/${BigInt(notification.targetPostId)}/recruitment?tab=members`,
      );
    } else if (notification.type === 'REVIEW_ACTIVATED') {
      // 후기 작성 가능 알림 - 이미 작성했으면 토스트, 아니면 모달
      const reviews = await clientApis.review.getMyReviewsByPost(
        BigInt(notification.targetPostId),
      );

      if (reviews?.length > 0) {
        toast({ title: '이미 리뷰를 작성했습니다.' });
      } else {
        overlay.open(({ isOpen, close }) => (
          <CreateReviewModal
            isOpen={isOpen}
            onClose={close}
            postId={BigInt(notification.targetPostId)}
          />
        ));
      }
    } else if (notification.type === 'FEEDBACK_WRITTEN') {
      // 피드백 수신 알림 - 받은 피드백 모달
      overlay.open(({ isOpen, close }) => (
        <ViewReviewModal
          isOpen={isOpen}
          onClose={close}
          postId={BigInt(notification.targetPostId)}
        />
      ));
    }
  };

  return (
    <DropdownMenu.Item asChild>
      <button
        type="button"
        className="flex w-full gap-4 py-4 hover:bg-container-secondary-hover rounded-md px-4 focus:outline-none"
        aria-label={`${notification.read ? '' : '읽지 않음 - '}${notification.message} - ${getRelativeTime(notification.createdAt)}`}
        aria-describedby={`notification-time-${notification.id}`}
        onClick={handleClickNotification}
      >
        <div className="relative shrink-0">
          <ProfileImage code={notification.profileImageCode} size={44} />
          <div className="absolute bg-surface w-7 h-7 rounded-full top-6 left-6 flex items-center justify-center">
            <NotificationIcon className="text-icon-dark" aria-hidden="true" />
          </div>
        </div>
        <div className="w-full">
          <div className="flex w-full justify-between gap-4">
            <p
              className={`body-sm-medium text-start ${notification.read && 'text-subtle'}`}
            >
              {notification.message}
            </p>
            {!notification.read && (
              <span
                className="w-1.75 h-1.75 bg-brand rounded-full shrink-0 mt-1.25"
                aria-hidden="true"
              />
            )}
          </div>
          <time
            id={`notification-time-${notification.id}`}
            className="flex body-sm-regular text-subtle"
            dateTime={notification.createdAt}
          >
            {getRelativeTime(notification.createdAt)}
          </time>
        </div>
      </button>
    </DropdownMenu.Item>
  );
}
