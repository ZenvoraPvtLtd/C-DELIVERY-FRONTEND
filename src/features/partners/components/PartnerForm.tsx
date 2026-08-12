"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DeliveryPartner, PartnerMutationPayload } from '@/types/partner';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Save, X } from 'lucide-react';

interface PartnerFormProps {
  initialData?: DeliveryPartner;
  onSubmit: (data: PartnerMutationPayload) => Promise<void>;
  isMutating: boolean;
  error?: string | null;
}

export function PartnerForm({ initialData, onSubmit, isMutating, error }: PartnerFormProps) {
  const router = useRouter();
  
  const [formData, setFormData] = useState<PartnerMutationPayload>({
    partnerId: initialData?.partnerId || '',
    name: initialData?.name || '',
    mobile: initialData?.mobile || '',
    email: initialData?.email || '',
    availability: initialData?.availability || 'AVAILABLE',
    status: initialData?.status || 'ACTIVE'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes
  useEffect(() => {
    const isChanged = 
      formData.partnerId !== (initialData?.partnerId || '') ||
      formData.name !== (initialData?.name || '') ||
      formData.mobile !== (initialData?.mobile || '') ||
      formData.email !== (initialData?.email || '') ||
      formData.availability !== (initialData?.availability || 'AVAILABLE') ||
      formData.status !== (initialData?.status || 'ACTIVE');
      
    setHasChanges(isChanged);
  }, [formData, initialData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.partnerId.trim()) newErrors.partnerId = 'Partner ID is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile is required';
    else if (!/^\+?[\d\s-]{10,}$/.test(formData.mobile)) newErrors.mobile = 'Invalid mobile format';
    
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelDialog(true);
    } else {
      router.back();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
        {error && (
          <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-danger)', color: 'white', borderRadius: 'var(--radius-md)' }}>
            {error}
          </div>
        )}
        
        <Card>
          <CardContent style={{ padding: 'var(--spacing-6)' }}>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-2)' }}>
              Basic Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
              <Input 
                label="Partner ID *"
                placeholder="e.g. DP-1001"
                value={formData.partnerId}
                onChange={(e) => setFormData(prev => ({...prev, partnerId: e.target.value}))}
                error={errors.partnerId}
                disabled={!!initialData} // Usually read-only on edit
              />
              
              <Input 
                label="Name *"
                placeholder="Full name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                error={errors.name}
              />
              
              <Input 
                label="Mobile *"
                placeholder="+91..."
                value={formData.mobile}
                onChange={(e) => setFormData(prev => ({...prev, mobile: e.target.value}))}
                error={errors.mobile}
              />
              
              <Input 
                label="Email (Optional)"
                placeholder="email@example.com"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                error={errors.email}
              />
            </div>

            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginTop: 'var(--spacing-8)', marginBottom: 'var(--spacing-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-2)' }}>
              Operational Status
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--color-text)' }}>Availability</label>
                <select 
                  value={formData.availability}
                  onChange={(e) => setFormData(prev => ({...prev, availability: e.target.value as any}))}
                  style={{ 
                    height: 40, padding: '0 var(--spacing-3)', borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)',
                    fontSize: 'var(--font-size-sm)', color: 'var(--color-text)', outline: 'none'
                  }}
                  disabled={formData.status === 'INACTIVE'}
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="BUSY">Busy</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
                {formData.status === 'INACTIVE' && <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Must be active to change availability.</span>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--color-text)' }}>Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as any;
                    setFormData(prev => ({
                      ...prev, 
                      status: newStatus,
                      availability: newStatus === 'INACTIVE' ? 'INACTIVE' : prev.availability
                    }));
                  }}
                  style={{ 
                    height: 40, padding: '0 var(--spacing-3)', borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)',
                    fontSize: 'var(--font-size-sm)', color: 'var(--color-text)', outline: 'none'
                  }}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)' }}>
          <Button type="button" variant="ghost" onClick={handleCancel} disabled={isMutating}>
            <X size={16} /> Cancel
          </Button>
          <Button type="submit" disabled={isMutating}>
            <Save size={16} /> {isMutating ? 'Saving...' : initialData ? 'Save Changes' : 'Create Partner'}
          </Button>
        </div>
      </form>

      <ConfirmDialog 
        isOpen={showCancelDialog}
        title="Discard changes?"
        description="Your unsaved changes will be lost. Are you sure you want to discard them?"
        confirmText="Discard"
        cancelText="Keep Editing"
        isDestructive={true}
        onConfirm={() => router.back()}
        onClose={() => setShowCancelDialog(false)}
      />
    </>
  );
}
