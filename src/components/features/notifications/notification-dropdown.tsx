'use client';

import { DropdownMenu } from 'radix-ui';
import BellIcon from '@/assets/icons/bell/20.svg';
import NotificationRows from './notification-rows';

/**
 * 알림 모달 (드롭다운)
 */
export default function NotificationDropdown() {
  return (
    <DropdownMenu.Root>
      {/* 트리거 - 알림 버튼 */}
      <DropdownMenu.Trigger asChild>
        <button type="button" aria-label="알림">
          <BellIcon className="text-icon-dark" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="w-95 max-h-130 flex flex-col bg-surface shadow-card rounded-lg overflow-hidden z-50"
          sideOffset={8}
          align="end"
        >
          <h2 className="body-md-medium px-4 py-5">알림</h2>

          <DropdownMenu.Separator className="h-px bg-border-primary" />

          <section className="py-5 bg-container-secondary overflow-y-auto">
            <NotificationRows />
          </section>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
