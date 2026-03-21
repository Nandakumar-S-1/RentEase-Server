import { Owner_Verification_Status  } from '@shared/Enums/owner.verification.status';
import { Request, Response, NextFunction } from 'express';

export const requireVerifiedOwner = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.verificationStatus !== Owner_Verification_Status .VERIFIED) {
    return res.status(403).json({
      success: false,
      message: 'Owner is not verified',
    });
  }
  next();
};
