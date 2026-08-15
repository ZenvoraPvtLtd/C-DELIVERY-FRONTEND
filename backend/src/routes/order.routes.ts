import { Router } from 'express';
import { getOrders, getOrderById } from '../controllers/order.controller';
import { getDeliveryById, updateDeliveryStatus } from '../controllers/delivery.controller';
import { assignPartner, reassignPartner, getEligibleReassignmentPartners } from '../controllers/assignment.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { requireAuth, requirePermission } from '../middleware/auth.middleware';
import { PERMISSIONS } from '../constants/permissions';

const router = Router();

// Protect all order routes
router.use(requireAuth);

router.get('/', requirePermission(PERMISSIONS.DELIVERY_VIEW), asyncHandler(getOrders));
router.get('/:orderId', requirePermission(PERMISSIONS.DELIVERY_VIEW), asyncHandler(getOrderById));
router.get('/:orderId/delivery', requirePermission(PERMISSIONS.DELIVERY_VIEW), asyncHandler(getDeliveryById));
router.patch('/:orderId/delivery/status', requirePermission(PERMISSIONS.DELIVERY_STATUS_UPDATE), asyncHandler(updateDeliveryStatus));

// Assignment routes
router.post('/:orderId/assignments', requirePermission(PERMISSIONS.DELIVERY_STATUS_UPDATE), asyncHandler(assignPartner));
router.get('/:orderId/assignments/eligible-partners', requirePermission(PERMISSIONS.PARTNER_VIEW), asyncHandler(getEligibleReassignmentPartners));
router.post('/:orderId/assignments/reassign', requirePermission(PERMISSIONS.DELIVERY_STATUS_UPDATE), asyncHandler(reassignPartner));

export default router;
