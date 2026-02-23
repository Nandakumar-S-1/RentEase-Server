import { Router } from 'express';
import { container } from 'tsyringe';
import { UserRoutes } from './Auth/user.routes';
import { AdminRoutes } from './Admin/admin.routes';

const router = Router();
const userRoutes = container.resolve(UserRoutes);
const adminRoutes = container.resolve(AdminRoutes);

router.use('/users', userRoutes.router);
router.use('/admin', adminRoutes.router);
export default router;
