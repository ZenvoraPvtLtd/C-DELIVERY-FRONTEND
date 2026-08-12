import { useState, useEffect, useCallback } from 'react';
import { DeliveryOrder } from '@/types/delivery';
import { DeliveryPartner } from '@/types/partner';
import { assignmentService } from '@/services/assignments/assignmentService';
import { partnerService } from '@/services/partners/partnerService';
import { useAppEvent } from '@/lib/events';

export function useOrderDetail(orderId: string) {
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [assignedPartner, setAssignedPartner] = useState<DeliveryPartner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await assignmentService.getOrderDetails(orderId);
      setOrder(data);
      
      if (data.partnerId) {
        const partnerData = await partnerService.getPartnerById(data.partnerId);
        setAssignedPartner(partnerData);
      } else {
        setAssignedPartner(null);
      }
    } catch (err: any) {
      setError(err.message || 'Unable to load order details.');
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  useAppEvent('refresh:deliveries', fetchOrder);

  return {
    order,
    assignedPartner,
    isLoading,
    error,
    refresh: fetchOrder
  };
}


