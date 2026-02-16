import { Router } from 'express';
import { container } from 'tsyringe';
import { UserRoutes } from './Auth/user.routes';

const router = Router();
const userRoutes = container.resolve(UserRoutes);

router.use('/users', userRoutes.router);
export default router;
