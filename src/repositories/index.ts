import { env } from '@/config/env';

import { mockDeliveryRepository } from './mock/mockDeliveryRepository';
import { apiDeliveryRepository } from './api/apiDeliveryRepository';

import { mockPartnerRepository } from './mock/mockPartnerRepository';
import { apiPartnerRepository } from './api/apiPartnerRepository';

import { mockAssignmentRepository } from './mock/mockAssignmentRepository';
import { apiAssignmentRepository } from './api/apiAssignmentRepository';

import { mockAuditRepository } from './mock/mockAuditRepository';
import { apiAuditRepository } from './api/apiAuditRepository';

import { mockReportRepository } from './mock/mockReportRepository';
import { apiReportRepository } from './api/apiReportRepository';

// Export Interfaces
export * from './interfaces/IDeliveryRepository';
export * from './interfaces/IPartnerRepository';
export * from './interfaces/IAssignmentRepository';
export * from './interfaces/IAuditRepository';
export * from './interfaces/IReportRepository';

const isMock = env.dataMode === 'mock';

export const repositoryFactory = {
  getDeliveryRepository() {
    return isMock ? mockDeliveryRepository : apiDeliveryRepository;
  },

  getPartnerRepository() {
    return isMock ? mockPartnerRepository : apiPartnerRepository;
  },

  getAssignmentRepository() {
    return isMock ? mockAssignmentRepository : apiAssignmentRepository;
  },

  getAuditRepository() {
    return isMock ? mockAuditRepository : apiAuditRepository;
  },

  getReportRepository() {
    return isMock ? mockReportRepository : apiReportRepository;
  }
};
