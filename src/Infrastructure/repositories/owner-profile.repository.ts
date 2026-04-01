import { OwnerProfileEntity } from 'core/entities/owner-profile.entity';
import { IOwnerProfileRepository } from 'core/interfaces/owner-repository.interface';
import { prisma } from 'infrastructure/database/prisma/prisma.client';
import { OwnerProfilePersistenceMapper } from 'infrastructure/mappers/owner-profile-persistence.mapper';
import { Owner_Verification_Status } from 'shared/enums/owner-verification-status.enum';
import { logger } from 'shared/log/logger';
import { injectable } from 'tsyringe';

@injectable()
export class OwnerProfileRepository implements IOwnerProfileRepository {
    async create(entity: OwnerProfileEntity): Promise<OwnerProfileEntity> {
        const result = await prisma.ownerProfile.create({
            data: {
                user: { connect: { id: entity.userId } },
                bio: entity.bio,
                occupation: entity.occupation,
            },
        });
        return OwnerProfilePersistenceMapper.toEntity(result);
    }
    async findByUserId(userId: string): Promise<OwnerProfileEntity | null> {
        const result = await prisma.ownerProfile.findUnique({
            where: {
                userId: userId,
            },
        });
        if (!result) {
            return null;
        }
        return OwnerProfilePersistenceMapper.toEntity(result);
    }
    async submitDocument(
        userId: string,
        docType: string,
        docUrl: string,
    ): Promise<OwnerProfileEntity> {
        const result = await prisma.ownerProfile.update({
            where: {
                userId: userId,
            },
            data: {
                documentType: docType,
                documentUrl: docUrl,
                verificationStatus: Owner_Verification_Status.SUBMITTED,
            },
        });
        return OwnerProfilePersistenceMapper.toEntity(result);
    }

    async updateVerificationStatus(
        userId: string,
        status: Owner_Verification_Status.VERIFIED | Owner_Verification_Status.REJECTED,
        rejectionReason?: string,
    ): Promise<OwnerProfileEntity> {
        const result = await prisma.ownerProfile.update({
            where: {
                userId: userId,
            },
            data: {
                verificationStatus: status,
                rejectionReason: rejectionReason ?? null,
                verifiedAt: status == Owner_Verification_Status.VERIFIED ? new Date() : undefined,
            },
        });
        logger.info(`Owner ${userId} verification status updated to ${status}`);
        return OwnerProfilePersistenceMapper.toEntity(result);
    }

    async save(entity: OwnerProfileEntity): Promise<OwnerProfileEntity> {
        const result = await prisma.ownerProfile.update({
            where: { userId: entity.userId },
            data: {
                documentType: entity.documentType,
                documentUrl: entity.documentUrl,
                verificationStatus: entity.verificationStatus,
                rejectionReason: entity.rejectionReason,
                verifiedAt: entity.verifiedAt ?? undefined,
            },
        });

        return OwnerProfilePersistenceMapper.toEntity(result);
    }

    async findAllPending(): Promise<OwnerProfileEntity[]> {
        const result = await prisma.ownerProfile.findMany({
            where: {
                verificationStatus: Owner_Verification_Status.SUBMITTED,
            },
        });
        return result.map(OwnerProfilePersistenceMapper.toEntity);
    }
}
