import { injectable } from 'tsyringe';
import { Prisma } from '@prisma/client';
import { IGetUserAgreementsUseCase } from '@application/interfaces/admin/user-data.interface';
import {
    GetUserAgreementsInputDTO,
    GetUserAgreementsOutputDTO,
    UserAgreementItemDTO,
} from '@application/dtos/admin/user-agreements.dto';
import { logger } from '@shared/log/logger';
import { prisma } from '@infrastructure/database/prisma/prisma.client';

@injectable()
export class GetUserAgreementsUseCase implements IGetUserAgreementsUseCase {
    async execute(input: GetUserAgreementsInputDTO): Promise<GetUserAgreementsOutputDTO> {
        const page = input.page ?? 1;
        const limit = input.limit ?? 10;
        const skip = (page - 1) * limit;

        const where: Prisma.AgreementWhereInput =
            input.role === 'OWNER_USER' ? { ownerId: input.userId } : { tenantId: input.userId };

        const [agreements, total] = await Promise.all([
            prisma.agreement.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    property: { select: { id: true, title: true, locationCity: true } },
                    owner: { select: { id: true, fullName: true, email: true } },
                    tenant: { select: { id: true, fullName: true, email: true } },
                },
            }),
            prisma.agreement.count({ where }),
        ]);

        logger.info(
            { userId: input.userId, count: agreements.length, total },
            'Fetched user agreements',
        );

        const agreementList: UserAgreementItemDTO[] = agreements.map((a) => ({
            id: a.id,
            agreementNumber: a.agreementNumber,
            status: a.status,
            startDate: a.startDate,
            endDate: a.endDate,
            monthlyRent: Number(a.monthlyRent),
            property: {
                id: a.property.id,
                title: a.property.title,
                locationCity: a.property.locationCity,
            },
            counterParty:
                input.role === 'OWNER_USER'
                    ? {
                          id: a.tenant?.id || '',
                          fullName: a.tenant?.fullName || 'N/A',
                          email: a.tenant?.email || 'N/A',
                      }
                    : { id: a.owner.id, fullName: a.owner.fullName, email: a.owner.email },
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
