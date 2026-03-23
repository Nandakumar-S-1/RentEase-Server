import { IJwtService } from '@application/Interfaces/Services/IJwtService';
import { IOwnerProfileRepository } from '@core/Interfaces/IOwnerRepository';
import { IUserRepository } from '@core/Interfaces/IUserRepository';
import { Request, Response, NextFunction } from 'express';

import { container } from 'tsyringe';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jwtService = container.resolve<IJwtService>('IJwtService');
        const userRepo = container.resolve<IUserRepository>('IUserRepository');
        const ownerRepo = container.resolve<IOwnerProfileRepository>('IOwnerProfileRepository');

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Token missing',
            });
        }
        //fertching/extracting token
        const token = authHeader.split(' ')[1];
        const decoded = jwtService.verifyTheAccessToken(token);

        const user = await userRepo.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        }

        if (user.isSuspended) {
            return res.status(401).json({
                success: false,
                message: 'Your account has been suspended',
                code: 'ACCOUNT_SUSPENDED',
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated',
                code: 'ACCOUNT_DEACTIVATED',
            });
        }

        let verificationStatus;
        if (user.role === 'OWNER') {
            const owner = await ownerRepo.findByUserId(user.id);
            verificationStatus = owner?.verificationStatus;
        }

        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            verificationStatus,
        };

        next();
    } catch {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
        });
    }
};
