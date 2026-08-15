import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditLog.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { requireAuth, requirePermission } from '../middleware/auth.middleware';
import { PERMISSIONS } from '../constants/permissions';

const router = Router();

// Protect all audit routes
router.use(requireAuth);

router.get('/', requirePermission(PERMISSIONS.AUDIT_VIEW), asyncHandler(getAuditLogs));

export default router;
