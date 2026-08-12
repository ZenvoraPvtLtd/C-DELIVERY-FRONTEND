import { useState, useEffect } from 'react';
import { FailureReasonType } from '@/types/exception';
import { exceptionService } from '@/services/delivery/exceptionService';

export function useFailedDeliveryModal(orderId: string | null, onComplete: () => void) {
  const [isOpen, setIsOpen] = useState(false);
  
  const [reason, setReason] = useState<FailureReasonType | ''>('');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) setIsOpen(true);
    else setIsOpen(false);
  }, [orderId]);

  const handleSubmit = async () => {
    if (!orderId || !reason) return;
    if (reason === 'Other' && !notes.trim()) {
      setError('Please provide additional details for the reason.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    try {
      await exceptionService.markDeliveryFailed(orderId, reason, notes);
      onComplete();
      close();
    } catch (err: any) {
      setError(err.message || 'Unable to mark delivery as failed. The delivery may have changed since this screen was opened.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const close = () => {
    setIsOpen(false);
    setReason('');
    setNotes('');
    setError(null);
  };

  return {
    isOpen,
    reason, setReason,
    notes, setNotes,
    isSubmitting, error, clearError: () => setError(null),
    handleSubmit, close
  };
}
