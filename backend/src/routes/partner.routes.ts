import { Router } from 'express';
import { 
  getPartners, 
  getPartnerById, 
  createPartner, 
  updatePartner, 
  updatePartnerStatus, 
  updatePartnerAvailability 
} from '../controllers/partner.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { requireAuth, requirePermission } from '../middleware/auth.middleware';
import { PERMISSIONS } from '../constants/permissions';

const router = Router();

// Protect all partner routes
router.use(requireAuth);

router.get('/', requirePermission(PERMISSIONS.PARTNER_VIEW), asyncHandler(getPartners));
router.get('/:id', requirePermission(PERMISSIONS.PARTNER_VIEW), asyncHandler(getPartnerById));
router.post('/', requirePermission(PERMISSIONS.PARTNER_CREATE), asyncHandler(createPartner));
router.put('/:id', requirePermission(PERMISSIONS.PARTNER_EDIT), asyncHandler(updatePartner));
router.patch('/:id/status', requirePermission(PERMISSIONS.PARTNER_STATUS_UPDATE), asyncHandler(updatePartnerStatus));
router.patch('/:id/availability', requirePermission(PERMISSIONS.PARTNER_STATUS_UPDATE), asyncHandler(updatePartnerAvailability)); // Assuming availability update requires same permission or similar

export default router;
