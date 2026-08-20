import { Router } from 'express';
import { getDeliveries, getDeliveryById, updateDeliveryStatus, getDashboardSummary } from '../controllers/delivery.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { requireAuth, requirePermission } from '../middleware/auth.middleware';
import { PERMISSIONS } from '../constants/permissions';

const router = Router();

// Protect all delivery routes
router.use(requireAuth);

router.get('/', requirePermission(PERMISSIONS.DELIVERY_VIEW), asyncHandler(getDeliveries));
router.get('/dashboard-summary', requirePermission(PERMISSIONS.DELIVERY_VIEW), asyncHandler(getDashboardSummary));
router.get('/history', requirePermission(PERMISSIONS.DELIVERY_VIEW), asyncHandler(getDeliveries)); // Handled by same controller, queries distinct by ?history=true

export default router;
