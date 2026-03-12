// import { prisma } from "@infrastructure/Database/prisma/prisma.client";
// import { IOwnerRepository } from "@core/Interfaces/IOwnerRepository";
// import { OwnerVerificationStatus } from "@shared/Enums/owner.verification.status";
// import { logger } from "@shared/Log/logger";

// export class OwnerRepository implements IOwnerRepository {
//     async updateVerificationStatus(ownerId: string, status: OwnerVerificationStatus, reason?: string): Promise<void> {
//         try {
//             await prisma.ownerProfile.update({
//                 where: { id: ownerId },
//                 data: {
//                     verificationStatus: status as any,
//                     rejectionReason: reason,
//                     verifiedAt: status === OwnerVerificationStatus.APPROVED ? new Date() : null
//                 }
//             });
//             logger.info(`Owner ${ownerId} verification status updated to ${status}`);
//         } catch (error) {
//             logger.error({ error }, `Failed to update verification status for owner ${ownerId}`);
//             throw new Error("Failed to update owner verification status");
//         }
//     }

//     async findByUserId(userId: string): Promise<any> {
//         return await prisma.ownerProfile.findUnique({
//             where: { user_id: userId }
//         });
//     }
// }
