import { Http_StatusCodes } from '@shared/Enums/Http_StatusCodes';
import { UserRole } from '@shared/Enums/user.role.type';
import { Request, Response, NextFunction } from 'express';

export const neededRole = (...allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(Http_StatusCodes.UN_AUTHORIZED).json({
                success: false,
                message: 'Unauthorized user',
            });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(Http_StatusCodes.FORBIDDEN).json({
                success: false,
                message: 'Access Denied due to wrong role',
            });
        }
        next();
    };
};
