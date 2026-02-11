import { Router } from 'express';
import { container } from 'tsyringe';
import { UserRegisterController } from '@presentation/Controllers/Authentication/Register_user.controller';

const router = Router();

const userRegisterController = container.resolve(UserRegisterController);

router.post('/register', (req, res) => userRegisterController.register(req, res));
export default router;
