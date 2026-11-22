import { injectable } from 'tsyringe';
import { Prisma } from '@prisma/client';
import { IGetAllAgreementsUseCase } from '@application/interfaces/admin/agreement-management.interface';
import {
    GetAllAgreementsInputDTO,
    GetAllAgreementsOutputDTO,
    AgreementListItemDTO,
} from '@application/dtos/admin/admin-agreements.dto';
import { logger } from '@shared/log/logger';
import { prisma } from '@infrastructure/database/prisma/prisma.client';

@injectable()
export class GetAllAgreementsUseCase implements IGetAllAgreementsUseCase {
    async execute(input: GetAllAgreementsInputDTO): Promise<GetAllAgreementsOutputDTO> {
        const page = input.page ?? 1;
        const limit = input.limit ?? 10;
        const skip = (page - 1) * limit;

        const where: Prisma.AgreementWhereInput = {};

        if (input.status) {
            where.status = input.status as Prisma.EnumAgreementStatusFilter['equals'];
        }

        if (input.search) {
            where.OR = [
                { agreementNumber: { contains: input.search, mode: 'insensitive' } },
                { owner: { fullName: { contains: input.search, mode: 'insensitive' } } },
                { tenant: { fullName: { contains: input.search, mode: 'insensitive' } } },
                { property: { title: { contains: input.search, mode: 'insensitive' } } },
            ];
        }

        const [agreements, total] = await Promise.all([
            prisma.agreement.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    owner: { select: { id: true, fullName: true, email: true } },
                    tenant: { select: { id: true, fullName: true, email: true } },
                    property: { select: { id: true, title: true, locationCity: true } },
                },
            }),
            prisma.agreement.count({ where }),
        ]);

        logger.info({ count: agreements.length, total }, 'Fetched all agreements for admin');

        const agreementList: AgreementListItemDTO[] = agreements.map((a) => ({
            id: a.id,
            agreementNumber: a.agreementNumber,
            status: a.status,
            startDate: a.startDate,
            endDate: a.endDate,
            monthlyRent: Number(a.monthlyRent),
            depositAmount: Number(a.depositAmount),
            createdAt: a.createdAt,
            owner: {
                id: a.owner.id,
                fullName: a.owner.fullName,
                email: a.owner.email,
            },
            tenant: a.tenant
                ? { id: a.tenant.id, fullName: a.tenant.fullName, email: a.tenant.email }
                : null,
            property: {
                id: a.property.id,
                title: a.property.title,
                locationCity: a.property.locationCity,
            },
        }));

        return {
            agreements: agreementList,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        };
    }
}
