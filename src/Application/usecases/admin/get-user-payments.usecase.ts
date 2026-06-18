import { injectable } from 'tsyringe';
import { Prisma } from '@prisma/client';
import { IGetUserPaymentsUseCase } from '@application/interfaces/admin/user-data.interface';
import {
    GetUserPaymentsInputDTO,
    GetUserPaymentsOutputDTO,
    UserPaymentItemDTO,
} from '@application/dtos/admin/user-payments.dto';
import { logger } from '@shared/log/logger';
import { prisma } from '@infrastructure/database/prisma/prisma.client';

@injectable()
export class GetUserPaymentsUseCase implements IGetUserPaymentsUseCase {
    async execute(input: GetUserPaymentsInputDTO): Promise<GetUserPaymentsOutputDTO> {
        const page = input.page ?? 1;
        const limit = input.limit ?? 10;
        const skip = (page - 1) * limit;

        const where: Prisma.PaymentWhereInput = {
            payerId: input.userId,
        };

        const [payments, total] = await Promise.all([
            prisma.payment.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    agreement: { select: { id: true, agreementNumber: true } },
                },
            }),
            prisma.payment.count({ where }),
        ]);

        logger.info(
            { userId: input.userId, count: payments.length, total },
            'ffetched user payments',
        );

        const paymentList: UserPaymentItemDTO[] = payments.map((p) => ({
            id: p.id,
            amount: Number(p.amount),
            status: p.status,
            category: p.category,
            dueDate: p.dueDate,
            paidDate: p.paidDate,
            createdAt: p.createdAt,
            agreement: {
                id: p.agreement.id,
                agreementNumber: p.agreement.agreementNumber,
            },
        }));

        return {
            payments: paymentList,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        };
    }
}
