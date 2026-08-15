import { Router } from 'express';
import { login, refresh, getMe, logout } from '../controllers/auth.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/login', asyncHandler(login));
router.post('/refresh', asyncHandler(refresh));
router.post('/logout', asyncHandler(logout)); // Could be protected, but safe as public

// Protected routes
router.get('/me', requireAuth, asyncHandler(getMe));

export default router;
