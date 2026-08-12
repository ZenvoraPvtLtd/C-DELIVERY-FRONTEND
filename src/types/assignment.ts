export interface AssignmentFilters {
  search?: string;
  priority?: string | 'ALL';
}

export interface AssignmentValidationResult {
  isValid: boolean;
  reason?: string;
}
