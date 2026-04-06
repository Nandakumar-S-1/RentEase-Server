import { Router } from 'express';
import { container } from 'tsyringe';
import { UserRoutes } from './auth/user.routes';
import { AdminRoutes } from './admin/admin.routes';
import { OwnerRoutes } from './owner/owner.routes';
import { ProfileRoutes } from './profile/profile.routes';
import { API_PREFIXES } from 'shared/constants/routes';
const router = Router();
const userRoutes = container.resolve(UserRoutes);
const adminRoutes = container.resolve(AdminRoutes);
const ownerRoutes = container.resolve(OwnerRoutes);
const profileRoutes = container.resolve(ProfileRoutes);

router.use(API_PREFIXES.AUTH, userRoutes.router);
router.use(API_PREFIXES.ADMIN, adminRoutes.router);
router.use(API_PREFIXES.OWNER, ownerRoutes.router);
router.use(API_PREFIXES.PROFILE, profileRoutes.router);
export default router;
