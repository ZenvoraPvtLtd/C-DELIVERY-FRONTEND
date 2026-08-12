import { useState } from 'react';
import { DeliveryOrder, DeliveryStatus } from '@/types/delivery';
import { deliveryService } from '@/services/deliveries/deliveryService';

export function useDeliveryStatusUpdate(onSuccess?: () => void) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (orderId: string, newStatus: DeliveryStatus) => {
    setIsUpdating(true);
    setError(null);
    try {
      await deliveryService.updateDeliveryStatus(orderId, newStatus);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Unable to update delivery status.');
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateStatus,
    isUpdating,
    error,
    clearError: () => setError(null)
  };
}
