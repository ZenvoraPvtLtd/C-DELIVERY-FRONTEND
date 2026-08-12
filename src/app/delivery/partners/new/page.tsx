"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { PartnerForm } from '@/features/partners/components/PartnerForm';
import { usePartnerMutation } from '@/features/partners/hooks/usePartnerMutation';
import { PartnerMutationPayload } from '@/types/partner';
import { Toast } from '@/components/ui/Toast';

export default function NewPartnerPage() {
  const router = useRouter();
  const { create, isMutating, error } = usePartnerMutation();
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (payload: PartnerMutationPayload) => {
    try {
      await create(payload);
      setShowToast(true);
      setTimeout(() => {
        router.push('/delivery/partners');
      }, 1500);
    } catch (err) {
      // Error is handled in the hook and form
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <PageHeader 
        title="Add Delivery Partner" 
        description="Create a new delivery partner profile."
      />
      
      <div style={{ maxWidth: 800 }}>
        <PartnerForm 
          onSubmit={handleSubmit}
          isMutating={isMutating}
          error={error}
        />
      </div>

      {showToast && (
        <Toast 
          type="success"
          title="Success"
          description="Delivery partner created successfully."
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
