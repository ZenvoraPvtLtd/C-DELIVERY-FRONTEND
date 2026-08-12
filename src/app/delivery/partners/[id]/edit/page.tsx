"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { PartnerForm } from '@/features/partners/components/PartnerForm';
import { usePartnerDetail } from '@/features/partners/hooks/usePartnerDetail';
import { usePartnerMutation } from '@/features/partners/hooks/usePartnerMutation';
import { PartnerMutationPayload } from '@/types/partner';
import { Toast } from '@/components/ui/Toast';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';

export default function EditPartnerPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const { partner, isLoading, error: fetchError, refresh } = usePartnerDetail(id);
  const { update, isMutating, error: mutationError } = usePartnerMutation();
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (payload: PartnerMutationPayload) => {
    try {
      await update(id, payload);
      setShowToast(true);
      setTimeout(() => {
        router.push(`/delivery/partners/${id}`);
      }, 1500);
    } catch (err) {
      // Handled in form/hook
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
        <Skeleton style={{ height: 80 }} />
        <Skeleton style={{ height: 400, maxWidth: 800 }} />
      </div>
    );
  }

  if (fetchError || !partner) {
    return <ErrorState title="Partner not found" description={fetchError || 'Unable to load details.'} onRetry={refresh} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <PageHeader 
        title="Edit Partner" 
        description={`Editing profile for ${partner.name}`}
      />
      
      <div style={{ maxWidth: 800 }}>
        <PartnerForm 
          initialData={partner}
          onSubmit={handleSubmit}
          isMutating={isMutating}
          error={mutationError}
        />
      </div>

      {showToast && (
        <Toast 
          type="success"
          title="Success"
          description="Delivery partner updated successfully."
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
