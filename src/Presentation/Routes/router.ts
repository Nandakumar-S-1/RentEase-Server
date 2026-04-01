import { Router } from 'express';
import { container } from 'tsyringe';
import { UserRoutes } from './auth/user.routes';
import { AdminRoutes } from './admin/admin.routes';
import { OwnerRoutes } from './owner/owner.routes';
import { ProfileRoutes } from './profile/profile.routes';
const router = Router();
const userRoutes = container.resolve(UserRoutes);
const adminRoutes = container.resolve(AdminRoutes);
const ownerRoutes = container.resolve(OwnerRoutes);
const profileRoutes = container.resolve(ProfileRoutes);

router.use('/users', userRoutes.router);
router.use('/admin', adminRoutes.router);
router.use('/owner', ownerRoutes.router);
router.use('/profile', profileRoutes.router);
export default router;
