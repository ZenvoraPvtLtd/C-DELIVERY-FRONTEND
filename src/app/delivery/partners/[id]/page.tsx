"use client";
import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { usePartnerDetail } from '@/features/partners/hooks/usePartnerDetail';
import { usePartnerMutation } from '@/features/partners/hooks/usePartnerMutation';
import { PartnerDetail } from '@/features/partners/components/PartnerDetail';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Toast } from '@/components/ui/Toast';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';
import { ChevronLeft } from 'lucide-react';

export default function PartnerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { partner, isLoading, error: fetchError, refresh } = usePartnerDetail(id);
  const { updateStatus, isMutating } = usePartnerMutation();
  
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleDeactivate = async () => {
    try {
      await updateStatus(id, 'INACTIVE');
      setToastMessage('Partner deactivated successfully.');
      setShowToast(true);
      refresh(); // Reload partner detail
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
        <Skeleton style={{ height: 200 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)' }}>
          <Skeleton style={{ height: 200 }} />
          <Skeleton style={{ height: 200 }} />
        </div>
      </div>
    );
  }

  if (fetchError || !partner) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
        <Button variant="ghost" style={{ width: 'fit-content' }} onClick={() => router.push('/delivery/partners')}>
          <ChevronLeft size={16} /> Back to Delivery Partners
        </Button>
        <ErrorState title="Partner not found" description={fetchError || 'Unable to load details.'} onRetry={refresh} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <Button variant="ghost" style={{ width: 'fit-content', color: 'var(--color-text-secondary)', padding: '0 var(--spacing-2)' }} onClick={() => router.push('/delivery/partners')}>
        <ChevronLeft size={16} /> Back to Delivery Partners
      </Button>

      <PartnerDetail 
        partner={partner}
        onEdit={() => router.push(`/delivery/partners/${id}/edit`)}
        onDeactivate={() => setShowDeactivateDialog(true)}
      />

      <ConfirmDialog 
        isOpen={showDeactivateDialog}
        title="Deactivate Partner?"
        description="This partner will no longer be available for new assignments."
        confirmText={isMutating ? "Deactivating..." : "Deactivate"}
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleDeactivate}
        onClose={() => setShowDeactivateDialog(false)}
      />

      {showToast && (
        <Toast 
          type="success"
          title="Success"
          description={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
