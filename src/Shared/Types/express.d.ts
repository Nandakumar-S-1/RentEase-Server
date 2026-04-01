//extend Express Request to include req.user
import { UserRole } from 'shared/enums/user-role.enum';
import { Owner_Verification_Status } from 'shared/enums/owner-verification-status.enum';

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
