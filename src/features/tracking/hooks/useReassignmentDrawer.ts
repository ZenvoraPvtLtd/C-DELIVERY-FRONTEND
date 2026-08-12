import { useState, useEffect, useCallback } from 'react';
import { DeliveryPartner } from '@/types/partner';
import { ReassignmentReason } from '@/types/exception';
import { reassignmentService } from '@/services/delivery/reassignmentService';

export function useReassignmentDrawer(orderId: string | null, onComplete: () => void) {
  const [isOpen, setIsOpen] = useState(false);
  
  const [search, setSearch] = useState('');
  const [partners, setPartners] = useState<{ partner: DeliveryPartner; isEligible: boolean; reason?: string }[]>([]);
  const [isLoadingPartners, setIsLoadingPartners] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  
  const [reason, setReason] = useState<ReassignmentReason | ''>('');
  const [notes, setNotes] = useState('');
  
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) setIsOpen(true);
    else setIsOpen(false);
  }, [orderId]);

  const fetchPartners = useCallback(async () => {
    if (!isOpen || !orderId) return;
    setIsLoadingPartners(true);
    try {
      const result = await reassignmentService.getEligiblePartners(orderId, search);
      setPartners(result);
      
      if (selectedPartnerId && !result.some((r: any) => r.partner.id === selectedPartnerId)) {
        setSelectedPartnerId(null);
      }
    } catch (err) {
      console.error(err);
      setError('Unable to load eligible partners.');
    } finally {
      setIsLoadingPartners(false);
    }
  }, [isOpen, orderId, search]); 

  // Debounced fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPartners();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchPartners, search]);

  const handleSubmit = async () => {
    if (!orderId || !selectedPartnerId || !reason) return;
    if (reason === 'Other' && !notes.trim()) {
      setError('Please provide additional details for the reason.');
      return;
    }
    
    setIsAssigning(true);
    setError(null);
    try {
      await reassignmentService.reassignDelivery(orderId, selectedPartnerId, reason, notes);
      onComplete();
      close();
    } catch (err: any) {
      setError(err.message || 'Reassignment failed. Please try again.');
    } finally {
      setIsAssigning(false);
    }
  };

  const close = () => {
    setIsOpen(false);
    setSearch('');
    setSelectedPartnerId(null);
    setReason('');
    setNotes('');
    setError(null);
  };

  return {
    isOpen,
    search, setSearch,
    partners, isLoadingPartners,
    selectedPartnerId, setSelectedPartnerId,
    reason, setReason,
    notes, setNotes,
    isAssigning, error, clearError: () => setError(null),
    handleSubmit, close
  };
}


