import Button from '@/components/commons/buttons/button';
import Modal from '@/components/commons/modal';
import useToast from '@/hooks/use-toast';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
}: DeleteAccountModalProps) {
  // const { mutate: deleteUser } = useDeleteUser();
  const toast = useToast();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content size="lg">
        <header>
          <Modal.Title>계정 삭제</Modal.Title>
          <Modal.Description>계정 삭제</Modal.Description>

          <Modal.Close />
        </header>

        <section className="flex flex-col gap-3 pt-6 pb-9">
          <p className="heading-md text-primary">정말 계정을 삭제하시겠어요?</p>
          <p className="body-lg-regular text-primary">
            삭제하시면 프로필, 활동 내역 등 모든 데이터가 영구적으로 사라지며
            복구할 수 없습니다
            <br />
            AI 추천 등의 맞춤 서비스 이용도 더 이상 불가합니다
          </p>
        </section>

        <footer className="flex justify-end gap-5">
          <Button variant="outline" size="xs" onClick={onClose}>
            취소
          </Button>
          {/* <Button variant="solid" size="xs" onClick={() => deleteUser()}> */}
          <Button
            variant="solid"
            size="xs"
            onClick={() =>
              toast({ title: '데모 버전에서는 사용할 수 없습니다.' })
            }
          >
            삭제
          </Button>
        </footer>
      </Modal.Content>
    </Modal>
  );
}
