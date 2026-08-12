"use client";
import React, { useState } from 'react';
import { DeliveryOrder } from '@/types/delivery';
import { REASSIGNMENT_REASONS } from '@/types/exception';
import { useReassignmentDrawer } from '@/features/tracking/hooks/useReassignmentDrawer';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, MapPin, Phone, AlertCircle, Clock } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface ReassignmentDrawerProps {
  order: DeliveryOrder | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReassignmentDrawer({ order, onClose, onSuccess }: ReassignmentDrawerProps) {
  const { 
    isOpen, search, setSearch, partners, isLoadingPartners,
    selectedPartnerId, setSelectedPartnerId, reason, setReason,
    notes, setNotes, isAssigning, error, clearError, handleSubmit, close: closeHook
  } = useReassignmentDrawer(order?.id || null, onSuccess);

  const [showConfirm, setShowConfirm] = useState(false);

  const handleClose = () => {
    setShowConfirm(false);
    closeHook();
    onClose();
  };

  const handleConfirmSubmit = async () => {
    setShowConfirm(false);
    await handleSubmit();
  };

  if (!order) return null;

  const currentPartner = partners.find(p => p.partner.id === order.partnerId)?.partner;
  const newPartner = partners.find(p => p.partner.id === selectedPartnerId)?.partner;

  return (
    <>
      <Drawer
        isOpen={isOpen && !showConfirm}
        onClose={handleClose}
        title="Reassign Delivery Partner"
        footer={
          <div style={{ display: 'flex', gap: 'var(--spacing-3)', width: '100%', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={handleClose} disabled={isAssigning}>Cancel</Button>
            <Button 
              variant="primary" 
              onClick={() => setShowConfirm(true)} 
              disabled={isAssigning || !selectedPartnerId || !reason || (reason === 'Other' && !notes.trim())}
            >
              Reassign Partner
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          {/* Current Assignment Summary */}
          <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 2 }}>Order ID</div>
            <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{order.orderId}</div>
            
            <div style={{ marginTop: 'var(--spacing-3)', paddingTop: 'var(--spacing-3)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 2 }}>Current Partner</div>
                <div style={{ fontWeight: 500 }}>{currentPartner?.name || order.partnerId || 'Unknown'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 2 }}>Status</div>
                <div style={{ fontWeight: 500 }}>{order.status.replace(/_/g, ' ')}</div>
              </div>
            </div>
          </div>

          {/* Reassignment Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
                Reassignment Reason <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <select 
                value={reason}
                onChange={(e) => { setReason(e.target.value as any); if (error) clearError(); }}
                style={{ 
                  width: '100%', height: 40, padding: '0 var(--spacing-3)', borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)',
                  fontSize: 'var(--font-size-sm)', color: 'var(--color-text)', cursor: 'pointer'
                }}
              >
                <option value="" disabled>Select reason...</option>
                {REASSIGNMENT_REASONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {reason === 'Other' && (
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
                  Additional Details <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <Input 
                  value={notes} 
                  onChange={e => { setNotes(e.target.value); if(error) clearError(); }} 
                  placeholder="Provide details about the reassignment..."
                />
              </div>
            )}
          </div>

          {/* Select New Partner */}
          <div>
            <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--spacing-4)' }}>
              Select New Delivery Partner
            </div>
            <Input 
              placeholder="Search partner by name, ID or mobile..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              leftSection={<Search size={16} color="var(--color-text-muted)" />}
            />
          </div>

          {/* Partner List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {isLoadingPartners ? (
              <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', textAlign: 'center', padding: 'var(--spacing-4)' }}>Loading partners...</div>
            ) : partners.length === 0 ? (
              <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', textAlign: 'center', padding: 'var(--spacing-4)' }}>
                No eligible delivery partners available.
              </div>
            ) : (
              partners.map(p => {
                const isSelected = selectedPartnerId === p.partner.id;
                const isCurrent = p.partner.id === order.partnerId;

                return (
                  <div 
                    key={p.partner.id}
                    onClick={() => {
                      if (p.isEligible && !isCurrent) {
                        setSelectedPartnerId(p.partner.id);
                        if (error) clearError();
                      }
                    }}
                    style={{
                      border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      borderRadius: 'var(--radius-lg)',
                      padding: 'var(--spacing-4)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--spacing-2)',
                      cursor: (p.isEligible && !isCurrent) ? 'pointer' : 'not-allowed',
                      opacity: (p.isEligible && !isCurrent) ? 1 : 0.6,
                      backgroundColor: isSelected ? '#FFF7ED' : 'var(--color-surface)',
                      transition: 'border-color 0.2s, background-color 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                          {p.partner.name}
                          {isCurrent && (
                            <span style={{ fontSize: 10, padding: '2px 6px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                              CURRENT
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', display: 'flex', gap: 'var(--spacing-3)', marginTop: 4 }}>
                          <span>{p.partner.partnerId}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={12} /> {p.partner.mobile}</span>
                        </div>
                      </div>
                      
                      {!p.isEligible && (
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger)', fontWeight: 500 }}>
                          {p.reason}
                        </div>
                      )}
                      {p.isEligible && isSelected && (
                        <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'white' }} />
                        </div>
                      )}
                      {p.isEligible && !isSelected && !isCurrent && (
                        <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid var(--color-border)' }} />
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
          
          {error && (
            <div style={{ padding: 'var(--spacing-3)', backgroundColor: '#FEE2E2', color: '#B91C1C', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center' }}>
              <AlertCircle size={16} />
              <span style={{ flex: 1 }}>{error}</span>
            </div>
          )}
        </div>
      </Drawer>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmSubmit}
        title="Confirm Reassignment"
        confirmText={isAssigning ? "Reassigning..." : "Confirm Reassignment"}
        description={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div>
              <span style={{ color: 'var(--color-text-secondary)' }}>Order:</span> <strong>{order.orderId}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-secondary)' }}>Current Partner:</span> <strong>{currentPartner?.name || 'Unknown'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-secondary)' }}>New Partner:</span> <strong>{newPartner?.name || 'Unknown'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-secondary)' }}>Reason:</span> <strong>{reason}</strong>
            </div>
            <p style={{ marginTop: 'var(--spacing-4)', color: 'var(--color-text-secondary)' }}>
              The current assignment will be closed/superseded and a new assignment will be created.
            </p>
          </div>
        }
      />
    </>
  );
}
