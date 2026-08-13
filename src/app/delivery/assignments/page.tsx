"use client";
import React from 'react';
import { RouteGuard } from '@/features/auth/RouteGuard';
import { AssignmentManagement } from '@/features/assignments/components/AssignmentManagement';

export default function AssignmentsPage() {
  return (
    <RouteGuard permission="DELIVERY_VIEW">
      <AssignmentManagement />
    </RouteGuard>
  );
}
