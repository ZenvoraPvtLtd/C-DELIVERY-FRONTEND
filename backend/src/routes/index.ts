import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import deliveryRoutes from './delivery.routes';
import partnerRoutes from './partner.routes';
import assignmentRoutes from './assignment.routes';
import orderRoutes from './order.routes';
// import auditRoutes from './audit.routes';
import reportRoutes from './report.routes';
import notificationRoutes from './notification.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/deliveries', deliveryRoutes);
router.use('/delivery-partners', partnerRoutes);
router.use('/delivery/assignments', assignmentRoutes);
router.use('/orders', orderRoutes);
// router.use('/audit-logs', auditRoutes);
router.use('/reports', reportRoutes);
router.use('/notifications', notificationRoutes);

export default router;
