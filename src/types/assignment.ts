export interface AssignmentFilters {
  search?: string;
  priority?: string | 'ALL';
}

export interface AssignmentValidationResult {
  isValid: boolean;
  reason?: string;
}

export interface AssignmentWorkspaceFilters {
  search?: string;
  status?: string | 'ALL';
  partnerId?: string | 'ALL';
  dateRange?: string | 'ALL';
}

export interface AssignmentMetrics {
  pending: number;
  assignedToday: number;
  active: number;
  reassignments: number;
}
