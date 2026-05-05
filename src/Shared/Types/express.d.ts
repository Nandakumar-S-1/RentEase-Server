import { UserEntity } from '@core/entities/user.entity';
import { Owner_Verification_Status } from 'shared/enums/owner-verification-status.enum';

declare global {
    namespace Express {
        interface Request {
            user?: UserEntity;
        }
    }
}
