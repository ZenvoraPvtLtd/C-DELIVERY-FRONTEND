import { useState, useEffect, useCallback } from 'react';
import { DeliveryPartner } from '@/types/partner';
import { assignmentService } from '@/services/assignments/assignmentService';

export function useAssignmentDrawer(orderId: string | null, onAssignmentComplete: () => void) {
  const [isOpen, setIsOpen] = useState(false);
  
  const [search, setSearch] = useState('');
  const [partners, setPartners] = useState<{ partner: DeliveryPartner; isEligible: boolean; reason?: string }[]>([]);
  const [isLoadingPartners, setIsLoadingPartners] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) setIsOpen(true);
    else setIsOpen(false);
  }, [orderId]);

  const fetchPartners = useCallback(async () => {
    if (!isOpen || !orderId) return;
    setIsLoadingPartners(true);
    try {
      const result = await assignmentService.getPartnersForAssignment(search);
      setPartners(result);
      
      // Clear selection if selected partner is no longer in search results
      if (selectedPartnerId && !result.some(r => r.partner.id === selectedPartnerId)) {
        setSelectedPartnerId(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingPartners(false);
    }
  }, [isOpen, orderId, search]); // Removed selectedPartnerId to avoid loop

  // Debounced fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPartners();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchPartners, search]);

  const handleAssign = async () => {
    if (!orderId || !selectedPartnerId) return;
    
    setIsAssigning(true);
    setAssignmentError(null);
    try {
      const selectedPartner = partners.find(p => p.partner.id === selectedPartnerId)?.partner;
      if (!selectedPartner) throw new Error("Selected partner not found in list.");
      await assignmentService.assignPartner(orderId, selectedPartner.partnerId);
      onAssignmentComplete();
      close();
    } catch (err: any) {
      setAssignmentError(err.message || 'Assignment failed. Please try again.');
    } finally {
      setIsAssigning(false);
    }
  };

  const close = () => {
    setIsOpen(false);
    setSearch('');
    setSelectedPartnerId(null);
    setAssignmentError(null);
  };

  return {
    isOpen,
    search,
    setSearch,
    partners,
    isLoadingPartners,
    selectedPartnerId,
    setSelectedPartnerId,
    isAssigning,
    assignmentError,
    handleAssign,
    close,
    clearError: () => setAssignmentError(null)
  };
}
