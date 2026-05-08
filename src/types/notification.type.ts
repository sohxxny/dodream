/** 알림 타입 */
export type NotificationResponseType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  senderId: bigint;
  receiverId: bigint;
  type: NotificationType;
  message: string;
  targetPostId: bigint;
  targetPostTitle: string;
  read: boolean;
  profileImageCode: number;
};

/** 알림 종류 */
export type NotificationType =
  | 'PROPOSAL_SENT'
  | 'PROPOSAL_APPLIED'
  | 'APPLICATION_ACCEPTED'
  | 'APPLICANT_ACCEPTED'
  | 'BOOKMARK_DEADLINE'
  | 'REVIEW_ACTIVATED'
  | 'FEEDBACK_WRITTEN';
