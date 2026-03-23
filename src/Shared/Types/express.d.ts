//extend Express Request to include req.user
import { UserRole } from '@shared/Enums/user.role.type';
import { Owner_Verification_Status } from '@shared/Enums/owner.verification.status';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: UserRole;
                verificationStatus?: Owner_Verification_Status;
            };
        }
    }
}
