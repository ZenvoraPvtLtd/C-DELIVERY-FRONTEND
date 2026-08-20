import { Router } from 'express';
import { getEligiblePartners, validateAssignment, getAssignmentMetrics, assignPartner, reassignPartner } from '../controllers/assignment.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { requireAuth, requirePermission } from '../middleware/auth.middleware';
import { PERMISSIONS } from '../constants/permissions';

const router = Router();

// Protect all assignment routes
router.use(requireAuth);

router.get('/metrics', requirePermission(PERMISSIONS.DELIVERY_VIEW), asyncHandler(getAssignmentMetrics));
router.get('/eligible-partners', requirePermission(PERMISSIONS.PARTNER_VIEW), asyncHandler(getEligiblePartners));
router.post('/validate', requirePermission(PERMISSIONS.DELIVERY_STATUS_UPDATE), asyncHandler(validateAssignment));

export default router;
