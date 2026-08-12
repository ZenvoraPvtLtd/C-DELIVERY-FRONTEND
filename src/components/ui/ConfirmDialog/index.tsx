import React from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function ConfirmDialog({
  isOpen, onClose, onConfirm, title, description,
  confirmText = "Confirm", cancelText = "Cancel", isDestructive = false
}: ConfirmDialogProps) {
  const footer = (
    <>
      <Button variant="ghost" onClick={onClose}>{cancelText}</Button>
      <Button variant={isDestructive ? "danger" : "primary"} onClick={() => { onConfirm(); onClose(); }}>
        {confirmText}
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer}>
      <div style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: 'var(--font-size-sm)' }}>
        {description}
      </div>
    </Modal>
  );
}
