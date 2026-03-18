import { IOwnerProfileRepository } from "@core/Interfaces/IOwnerRepository";
import { prisma } from "@infrastructure/Database/prisma/prisma.client";
import { OwnerProfile,verificationStatus } from "@prisma/client";
import { logger } from "@shared/Log/logger";


export class OwnerProfileRepository implements IOwnerProfileRepository{
    async findByUserId(userId: string): Promise<OwnerProfile | null> {
        return await prisma.ownerProfile.findUnique({
            where:{
                user_id:userId
            }
        })
    }
    async updateVerificatioinStatus(userId: string, status: verificationStatus, reason?: string): Promise<void> {
        await prisma.ownerProfile.update({
            where:{
                user_id:userId
            },data:{
                verificationStatus:status,rejectionReason:reason
            }
        })
        logger.info(`Owner ${userId} verification status updated to ${status}`);
    }

    // updateDocumentURL(userId: string, documentType: string, documentUrl: string): Promise<void> {
        
    // }
}

