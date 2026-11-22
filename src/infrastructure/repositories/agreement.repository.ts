import { prisma } from 'infrastructure/database/prisma/prisma.client';
import { AgreementEntity } from 'core/entities/agreement.entity';
import { IAgreementRepository } from 'core/interfaces/repository/agreement-repository.interface';
import { AgreementPersistenceMapper } from 'infrastructure/mappers/agreement-persistence.mapper';
import { AgreementStatus } from 'core/types/agreement.types';
import { Prisma } from '@prisma/client';
import { injectable } from 'tsyringe';

@injectable()
export class AgreementRepository implements IAgreementRepository {
    async create(entity: AgreementEntity): Promise<AgreementEntity> {
        const data = AgreementPersistenceMapper.toPrismaCreate(entity);
        const res = await prisma.agreement.create({ data });
        return AgreementPersistenceMapper.toEntity(res);
    }

    async findById(id: string): Promise<AgreementEntity | null> {
        const res = await prisma.agreement.findUnique({
            where: { id },
            include: { property: true, owner: true, tenant: true },
        });
        return res ? AgreementPersistenceMapper.toEntity(res) : null;
    }

    async findByOwnerId(ownerId: string, status?: AgreementStatus): Promise<AgreementEntity[]> {
        const where: Prisma.AgreementWhereInput = { ownerId };
        if (status) {
            where.status = status;
        }
        const agreements = await prisma.agreement.findMany({
            where,
            include: { property: true, owner: true, tenant: true },
            orderBy: { createdAt: 'desc' },
        });
        return agreements.map((a) => AgreementPersistenceMapper.toEntity(a));
    }

    async findByStatus(status: AgreementStatus): Promise<AgreementEntity[]> {
        const agreements = await prisma.agreement.findMany({
            where: { status },
            include: { property: true, owner: true, tenant: true },
            orderBy: { createdAt: 'desc' },
        });
        return agreements.map((a) => AgreementPersistenceMapper.toEntity(a));
    }
    async findByTenantId(tenantId: string, status?: AgreementStatus): Promise<AgreementEntity[]> {
        const where: Prisma.AgreementWhereInput = { tenantId };
        if (status) {
            where.status = status;
        }
        const agreements = await prisma.agreement.findMany({
            where,
            include: { property: true, owner: true, tenant: true },
            orderBy: { createdAt: 'desc' },
        });
        return agreements.map((a) => AgreementPersistenceMapper.toEntity(a));
    }

    async findAll(filters?: {
        status?: AgreementStatus;
        propertyId?: string;
    }): Promise<AgreementEntity[]> {
        const where: Prisma.AgreementWhereInput = {};
        if (filters?.status) where.status = filters.status;
        if (filters?.propertyId) where.propertyId = filters.propertyId;

        const agreements = await prisma.agreement.findMany({
            where,
            include: { property: true, owner: true, tenant: true },
            orderBy: { createdAt: 'desc' },
        });
        return agreements.map((a) => AgreementPersistenceMapper.toEntity(a));
    }

    async update(entity: AgreementEntity): Promise<AgreementEntity> {
        const data = AgreementPersistenceMapper.toPrismaUpdate(entity);
        const res = await prisma.agreement.update({
            where: { id: entity.id },
            data,
        });
        return AgreementPersistenceMapper.toEntity(res);
    }

    async updateKyc(id: string, kycUrl: string): Promise<AgreementEntity> {
        const res = await prisma.agreement.update({
            where: { id },
            data: {
                ['tenantKycDocumentUrl' as string]: kycUrl,
            } as unknown as Prisma.AgreementUpdateInput,
        });
        return AgreementPersistenceMapper.toEntity(res);
    }
}
