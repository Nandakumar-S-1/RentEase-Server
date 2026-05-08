import { UserEntity } from '@core/entities/user.entity';

declare global {
    namespace Express {
        interface Request {
            user?: UserEntity;
        }
    }
}
