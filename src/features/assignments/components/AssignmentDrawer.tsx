"use client";
import React, { useState } from 'react';
import { useAssignmentDrawer } from '@/features/assignments/hooks/useAssignmentDrawer';
import { useOrderDetail } from '@/features/assignments/hooks/useOrderDetail';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, X, Loader2, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Skeleton } from '@/components/ui/Skeleton';

interface AssignmentDrawerProps {
  orderId: string | null;
  onAssignmentComplete: () => void;
  onClose: () => void;
}

export function AssignmentDrawer({ orderId, onAssignmentComplete, onClose }: AssignmentDrawerProps) {
  const {
    isOpen, search, setSearch, partners, isLoadingPartners,
    selectedPartnerId, setSelectedPartnerId, isAssigning,
    assignmentError, handleAssign, close, clearError
  } = useAssignmentDrawer(orderId, onAssignmentComplete);

  const { order, isLoading: isLoadingOrder } = useOrderDetail(orderId || '');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClose = () => {
    close();
    onClose();
  };

  const onConfirmAssignmentClick = () => {
    if (selectedPartnerId) {
      setShowConfirm(true);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        style={{ 
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', 
          zIndex: 50, display: 'flex', justifyContent: 'flex-end',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={handleClose}
      >
        <div 
          style={{ 
            width: '100%', maxWidth: 500, backgroundColor: 'var(--color-surface)',
            height: '100%', display: 'flex', flexDirection: 'column',
            boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
            animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ padding: 'var(--spacing-4) var(--spacing-6)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-background)' }}>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, margin: 0 }}>Assign Delivery Partner</h2>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X size={20} />
            </Button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            {/* Order Details Preview */}
            <div>
              <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-3)' }}>
                Order Details
              </h3>
              {isLoadingOrder ? (
                <Skeleton style={{ height: 100 }} />
              ) : order ? (
                <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-2)' }}>
                    <span style={{ fontWeight: 600 }}>{order.orderId}</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Rs. {order.orderAmount.toFixed(2)}</span>
                  </div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text)', marginBottom: 'var(--spacing-1)' }}>{order.customerName}</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{order.deliveryAddress}</div>
                </div>
              ) : (
                <div style={{ color: 'var(--color-danger)' }}>Failed to load order details.</div>
              )}
            </div>

            {/* Error Message */}
            {assignmentError && (
              <div style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--color-danger)', color: 'white', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center' }}>
                <AlertCircle size={16} />
                <span style={{ flex: 1 }}>{assignmentError}</span>
                <button onClick={clearError} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={14}/></button>
              </div>
            )}

            {/* Partner Selection */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-3)' }}>
                Select Delivery Partner
              </h3>
              
              <Input 
                placeholder="Search partners by name or ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                leftSection={<Search size={16} color="var(--color-text-muted)" />}
                style={{ marginBottom: 'var(--spacing-4)' }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                {isLoadingPartners ? (
                  [1,2,3].map(i => <Skeleton key={i} style={{ height: 80 }} />)
                ) : partners.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 'var(--spacing-8) 0', color: 'var(--color-text-muted)' }}>
                    No partners found matching your search.
                  </div>
                ) : (
                  partners.map(({ partner, isEligible, reason }) => {
                    const isSelected = selectedPartnerId === partner.id;
                    return (
                      <div 
                        key={partner.id}
                        onClick={() => isEligible && setSelectedPartnerId(partner.id)}
                        style={{
                          padding: 'var(--spacing-3) var(--spacing-4)',
                          borderRadius: 'var(--radius-md)',
                          border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                          backgroundColor: isSelected ? 'var(--color-primary-light)' : (isEligible ? 'var(--color-surface)' : 'var(--color-background)'),
                          cursor: isEligible ? 'pointer' : 'not-allowed',
                          opacity: isEligible ? 1 : 0.6,
                          display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ 
                          width: 20, height: 20, borderRadius: '50%', 
                          border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-text-muted)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} />}
                        </div>
                        
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{partner.name}</span>
                            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 500, color: 'var(--color-text-secondary)' }}>{partner.partnerId}</span>
                          </div>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{partner.mobile}</span>
                            {!isEligible ? (
                              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger)', fontWeight: 500 }}>{reason}</span>
                            ) : (
                              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <CheckCircle2 size={12} /> Available
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{ padding: 'var(--spacing-4) var(--spacing-6)', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)' }}>
            <Button variant="ghost" onClick={handleClose} disabled={isAssigning}>Cancel</Button>
            <Button onClick={onConfirmAssignmentClick} disabled={!selectedPartnerId || isAssigning}>
              {isAssigning ? <><Loader2 size={16} className="spin" /> Assigning...</> : 'Assign Partner'}
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog 
        isOpen={showConfirm}
        title="Confirm Assignment"
        description={
          selectedPartnerId 
            ? `Assign this delivery to ${partners.find(p => p.partner.id === selectedPartnerId)?.partner.name}? The delivery will move to Assigned status.` 
            : 'Are you sure?'
        }
        confirmText="Confirm Assignment"
        cancelText="Cancel"
        isDestructive={false}
        onConfirm={async () => {
          setShowConfirm(false);
          await handleAssign();
        }}
        onClose={() => setShowConfirm(false)}
      />
    </>
  );
}
