'use client';

import clsx from 'clsx';
import { useMemo, useState } from 'react';
import Button from '@/components/commons/buttons/button';
import Modal from '@/components/commons/modal';
import TextField from '@/components/commons/text-fields/text-field';
import {
  MATCHING_CANCEL_REASON_CODES,
  MATCHING_CANCEL_REASON_OPTIONS,
  type MatchingCancelReasonCode,
} from '@/constants/matching.constant';
import useCancelMatching from '@/hooks/matching/use-cancel-matching';
import useToast from '@/hooks/use-toast';

interface MatchingCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  nickname: string;
  postId: bigint;
  matchingId: bigint;
}

export default function MatchingCancelModal({
  isOpen,
  onClose,
  nickname,
  postId,
  matchingId,
}: MatchingCancelModalProps) {
  const [selectedCause, setSelectedCause] =
    useState<MatchingCancelReasonCode | null>(null);
  const [reasonText, setReasonText] = useState('');
  const toast = useToast();
  const { mutate: cancelMatching, isPending } = useCancelMatching(postId);

  const cancelReasons = useMemo(
    () =>
      MATCHING_CANCEL_REASON_CODES.map((code) => ({
        value: code,
        label: MATCHING_CANCEL_REASON_OPTIONS[code],
      })),
    [],
  );

  const handleSelectCause = (code: MatchingCancelReasonCode) => {
    setSelectedCause(code);
    if (code !== 'OTHER') {
      setReasonText('');
    }
  };

  const handleCancelMatching = () => {
    if (!selectedCause) {
      return;
    }
    const text = selectedCause === 'OTHER' ? reasonText.trim() : reasonText;

    if (selectedCause === 'OTHER' && text.length === 0) {
      return;
    }

    cancelMatching(
      { matchingId, reasonCode: selectedCause, reasonText: text },
      {
        onSuccess: () => {
          toast({ title: '매칭이 취소되었습니다.' });
          onClose();
        },
        onError: () => {
          toast({
            title: '매칭 취소에 실패했습니다.',
          });
        },
      },
    );
  };

  const isReasonTextDisabled = selectedCause !== 'OTHER';
  const disabled =
    !selectedCause ||
    isPending ||
    (selectedCause === 'OTHER' && reasonText.trim().length === 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content className="flex flex-col gap-5 py-5 px-7" size="lg">
        <header className="flex items-start justify-between">
          <Modal.Title>매칭 취소</Modal.Title>
          <Modal.Close />
        </header>

        <h2 className="body-lg-medium w-full text-center">매칭 취소</h2>

        <section className="flex flex-col gap-9">
          <div className="flex flex-col gap-3">
            <h3 className="heading-md">
              {nickname}님과의 매칭을 취소하시겠어요?
            </h3>
            {/* TODO: 매칭 취소 가능 횟수 구현 예정 */}
            {/* <p className="body-lg-regular">
              {getNoPaneltyDate(matchedAt)}까지 패널티 없이 취소할 수 있어요
            </p> */}
          </div>

          <div className="flex flex-col">
            <h4 className="body-lg-medium">
              매칭 취소 사유 <span className="text-error">*</span>
            </h4>
            <ul className="flex flex-col">
              {cancelReasons.map(({ value, label }) => (
                <li key={value}>
                  <CheckBoxWithLabel
                    name="cause"
                    id={value}
                    label={label}
                    checked={selectedCause === value}
                    onSelect={() => handleSelectCause(value)}
                  />
                </li>
              ))}
            </ul>

            <TextField
              className="w-[530px]"
              resizable={false}
              placeholder="매칭 취소 사유를 작성해 주세요."
              onChange={(event) => setReasonText(event.target.value)}
              value={reasonText}
              readOnly={isReasonTextDisabled}
            />
          </div>
        </section>

        <footer className="flex justify-end gap-5 border-t-1 border-border-primary pt-4">
          <Button variant="outline" size="xs" onClick={onClose}>
            돌아가기
          </Button>
          <Button
            variant="solid"
            size="xs"
            onClick={handleCancelMatching}
            disabled={disabled}
          >
            매칭 취소
          </Button>
        </footer>
      </Modal.Content>
    </Modal>
  );
}

interface CheckBoxWithLabelProps {
  name: string;
  id: string;
  label: string;
  checked: boolean;
  onSelect: () => void;
}

function CheckBoxWithLabel({
  name,
  id,
  label,
  checked,
  onSelect,
}: CheckBoxWithLabelProps) {
  return (
    <div className="px-3 py-2 flex items-center gap-4">
      <input
        type="radio"
        name={name}
        id={id}
        checked={checked}
        onChange={onSelect}
        className={clsx(
          'appearance-none border-1 border-icon-dark size-4 rounded-sm bg-no-repeat bg-center bg-size-[12px]',
          checked && 'bg-icon-dark',
        )}
        style={
          checked
            ? { backgroundImage: "url('/assets/icons/check/12.svg')" }
            : undefined
        }
      />

      <label htmlFor={id} className="body-lg-regular">
        {label}
      </label>
    </div>
  );
}
