import { injectable } from 'tsyringe';
import { Prisma } from '@prisma/client';
import { IGetAllPaymentsUseCase } from '@application/interfaces/admin/payment-management.interface';
import {
    GetAllPaymentsInputDTO,
    GetAllPaymentsOutputDTO,
    PaymentListItemDTO,
} from '@application/dtos/admin/admin-payments.dto';
import { logger } from '@shared/log/logger';
import { prisma } from '@infrastructure/database/prisma/prisma.client';

@injectable()
export class GetAllPaymentsUseCase implements IGetAllPaymentsUseCase {
    async execute(input: GetAllPaymentsInputDTO): Promise<GetAllPaymentsOutputDTO> {
        const page = input.page ?? 1;
        const limit = input.limit ?? 10;
        const skip = (page - 1) * limit;

        const where: Prisma.PaymentWhereInput = {};

        if (input.status) {
            where.status = input.status as Prisma.EnumPaymentStatusFilter['equals'];
        }

        if (input.category) {
            where.category = input.category as Prisma.EnumPaymentCategoryFilter['equals'];
        }

        const [payments, total] = await Promise.all([
            prisma.payment.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    agreement: { select: { id: true, agreementNumber: true } },
                    payer: { select: { id: true, fullName: true, email: true } },
                },
            }),
            prisma.payment.count({ where }),
        ]);

        logger.info({ count: payments.length, total }, 'Fetched all payments for admin');

        const paymentList: PaymentListItemDTO[] = payments.map((p) => ({
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
            payer: {
                id: p.payer.id,
                fullName: p.payer.fullName,
                email: p.payer.email,
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
