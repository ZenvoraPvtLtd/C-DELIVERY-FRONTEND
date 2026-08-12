import { useState } from 'react';
import { partnerService } from '@/services/partners/partnerService';
import { PartnerMutationPayload, PartnerStatus, PartnerAvailability } from '@/types/partner';

export function usePartnerMutation() {
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (payload: PartnerMutationPayload) => {
    setIsMutating(true);
    setError(null);
    try {
      const data = await partnerService.createPartner(payload);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to create partner');
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  const update = async (id: string, payload: PartnerMutationPayload) => {
    setIsMutating(true);
    setError(null);
    try {
      const data = await partnerService.updatePartner(id, payload);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to update partner');
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  const updateStatus = async (id: string, status: PartnerStatus) => {
    setIsMutating(true);
    setError(null);
    try {
      const data = await partnerService.updatePartnerStatus(id, status);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  const updateAvailability = async (id: string, availability: PartnerAvailability) => {
    setIsMutating(true);
    setError(null);
    try {
      const data = await partnerService.updatePartnerAvailability(id, availability);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to update availability');
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  return {
    create,
    update,
    updateStatus,
    updateAvailability,
    isMutating,
    error,
    clearError: () => setError(null)
  };
}
