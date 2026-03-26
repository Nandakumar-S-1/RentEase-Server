import { Router } from 'express';
import { container } from 'tsyringe';
import { UserRoutes } from './Auth/user.routes';
import { AdminRoutes } from './Admin/admin.routes';
import { OwnerRoutes } from './owner/owner.routes';
const router = Router();
const userRoutes = container.resolve(UserRoutes);
const adminRoutes = container.resolve(AdminRoutes);
const ownerRoutes = container.resolve(OwnerRoutes);

router.use('/users', userRoutes.router);
router.use('/admin', adminRoutes.router);
router.use('/owner', ownerRoutes.router);
export default router;
