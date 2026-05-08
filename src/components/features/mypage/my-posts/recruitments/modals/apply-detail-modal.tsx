import Button from '@/components/commons/buttons/button';
import LoadingSpinner from '@/components/commons/loading-spinner';
import Modal from '@/components/commons/modal';
import TextField from '@/components/commons/text-fields/text-field';
import ChatButton from '@/components/features/post/post-card/buttons/chat-button';
import useGetMyApplicationDetail from '@/hooks/my/use-get-my-application-detail';
import useGetMyPostApplicantDetail from '@/hooks/my/use-get-my-post-applicant-detail';

interface ApplyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: bigint;
  postId: bigint;
  type?: 'my' | 'received';
}

const INFO_LABEL_CLASS = 'text-primary body-lg-medium';

export default function ApplyDetailModal({
  isOpen,
  onClose,
  applicationId,
  postId,
  type = 'my',
}: ApplyDetailModalProps) {
  // 내 지원일 경우 데이터
  const { data: myApplicationDetail, isLoading: isMyApplicationLoading } =
    useGetMyApplicationDetail(applicationId, {
      enabled: type === 'my',
    });

  // 다른 사람의 지원일 경우 데이터
  const { data: myPostApplicantDetail, isLoading: isApplicantDetailLoading } =
    useGetMyPostApplicantDetail(postId, applicationId, {
      enabled: type === 'received',
    });

  const isLoading =
    type === 'my' ? isMyApplicationLoading : isApplicantDetailLoading;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content className="flex min-h-120 flex-col gap-6">
        <header className="flex items-start justify-between">
          <Modal.Title>지원 상세</Modal.Title>
          <Modal.Close />
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center my-auto pb-9">
            <LoadingSpinner variant="lg" size={28} />
          </div>
        ) : (
          <>
            <section className="flex flex-col gap-8">
              <dl className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <dt className={INFO_LABEL_CLASS}>지원 직군</dt>
                  <dd>
                    <span className="inline-flex rounded-full bg-chip-selected px-4 py-3 text-on-brand">
                      {type === 'my'
                        ? myApplicationDetail?.roleName
                        : myPostApplicantDetail?.appliedRoleName}
                    </span>
                  </dd>
                </div>

                <div className="flex flex-col gap-3">
                  <dt className={INFO_LABEL_CLASS}>지원 메시지</dt>
                  <dd>
                    <TextField
                      value={
                        type === 'my'
                          ? myApplicationDetail?.message
                          : myPostApplicantDetail?.message
                      }
                      className="w-full"
                      readOnly
                      resizable={false}
                    />
                  </dd>
                </div>
              </dl>
            </section>

            <footer className="flex justify-end gap-5 border-t-1 border-border-primary pt-4">
              {/* TODO: 채팅페이지로 넘어가도록 구현 */}
              <ChatButton postId={postId} />
              <Button variant="solid" size="xs" onClick={onClose}>
                확인
              </Button>
            </footer>
          </>
        )}
      </Modal.Content>
    </Modal>
  );
}
