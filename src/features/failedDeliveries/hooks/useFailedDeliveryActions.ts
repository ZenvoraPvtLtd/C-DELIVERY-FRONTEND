import { useState } from 'react';
import { failedDeliveryService } from '@/services/deliveries/failedDeliveryService';
import { DeliveryOrder } from '@/types/delivery';
import { AuditActor } from '@/types/audit';

export function useFailedDeliveryActions(onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (actionFn: () => Promise<DeliveryOrder>) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await actionFn();
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'An error occurred while performing the action.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const investigate = async (orderId: string, actor?: AuditActor | string) => {
    await handleAction(() => failedDeliveryService.markInvestigating(orderId, actor));
  };

  const resolve = async (orderId: string, resolution: string, actor?: AuditActor | string) => {
    await handleAction(() => failedDeliveryService.resolveFailure(orderId, resolution, actor));
  };

  const retry = async (orderId: string, actor?: AuditActor | string) => {
    await handleAction(() => failedDeliveryService.retryDelivery(orderId, actor));
  };

  const addNote = async (orderId: string, note: string, actor?: AuditActor | string) => {
    await handleAction(() => failedDeliveryService.addInternalNote(orderId, note, actor));
  };

  return {
    isSubmitting,
    error,
    investigate,
    resolve,
    retry,
    addNote,
    clearError: () => setError(null)
  };
}
