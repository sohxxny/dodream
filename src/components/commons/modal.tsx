import clsx from 'clsx';
import { Dialog } from 'radix-ui';
import { twMerge } from 'tailwind-merge';
import CloseButton from './buttons/close-button';

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onExit?: () => void;
}

/**
 * Dialog를 기반으로 한 Modal 컴포넌트
 * @example
 * ```tsx
 * <Modal isOpen={isOpen} onClose={close}>
 *    <Modal.Overlay />
 *    <Modal.Content>
 *        <Modal.Title>제목</Modal.Title>
 *        <Modal.Description>설명</Modal.Description>
 *            <모달 내용 />
 *        <Modal.Close />
 *    </Modal.Content>
 * </Modal>
 * ```
 */
export default function Modal({ children, isOpen, onClose }: ModalProps) {
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>{children}</Dialog.Portal>
    </Dialog.Root>
  );
}

Modal.Title = ({ children }: { children: React.ReactNode }) => {
  return <Dialog.Title className="sr-only">{children}</Dialog.Title>;
};

Modal.Description = ({ children }: { children: React.ReactNode }) => {
  return (
    <Dialog.Description className="sr-only">{children}</Dialog.Description>
  );
};

Modal.Overlay = ({
  onClick,
  className = '',
}: {
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <Dialog.Overlay
      onClick={() => onClick?.()}
      className={`fixed inset-0 z-50 bg-overlay ${className}`}
    />
  );
};

interface ModalContentProps {
  children: React.ReactNode;
  size?: 'md' | 'lg' | 'xl';
  className?: string;
}

Modal.Content = ({
  children,
  size = 'md',
  className = '',
}: ModalContentProps) => {
  return (
    <Dialog.Content
      className={twMerge(
        clsx(
          'fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface pt-9 pb-7 px-6 shadow-card rounded-md',
          {
            'w-modal-md': size === 'md',
            'w-modal-lg': size === 'lg',
            'w-modal-xl': size === 'xl',
          },
        ),
        className,
      )}
    >
      {children}
    </Dialog.Content>
  );
};

interface ModalCloseProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

Modal.Close = ({ children, onClick, className }: ModalCloseProps) => {
  return (
    <div className={clsx('absolute top-5 right-7', className)}>
      <Dialog.Close asChild onClick={onClick}>
        {children ?? <CloseButton size="md" />}
      </Dialog.Close>
    </div>
  );
};
