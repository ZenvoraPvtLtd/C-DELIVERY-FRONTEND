import { Router } from 'express';
import { getOverview } from '../controllers/report.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { requireAuth, requirePermission } from '../middleware/auth.middleware';
import { PERMISSIONS } from '../constants/permissions';

const router = Router();

// Protect all report routes
router.use(requireAuth);

router.get('/overview', requirePermission(PERMISSIONS.REPORT_VIEW), asyncHandler(getOverview));

export default router;
