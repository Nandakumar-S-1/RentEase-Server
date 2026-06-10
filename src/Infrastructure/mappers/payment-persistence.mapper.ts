import { PaymentEntity } from '@core/entities/payment.entity';
import { PaymentCategory, PaymentStatus, PaymentTypeData } from '@core/types/payment.types';
import { Payment, Prisma } from '@prisma/client';

export class PaymentPersistenceMapper {
    static toEntity(raw: Payment): PaymentEntity {
        const data: PaymentTypeData = {
            id: raw.id,
            transactionId: raw.transactionId ?? undefined,
            agreementId: raw.agreementId,
            propertyId: raw.propertyId,
            payerId: raw.payerId,
            payeeId: raw.payeeId,

            amount: Number(raw.amount),
            category: raw.category as PaymentCategory,
            dueDate: raw.dueDate ?? undefined,
            paidDate: raw.paidDate ?? undefined,

            paymentGateway: raw.paymentGateway ?? undefined,
            paymentMethod: raw.paymentMethod ?? undefined,

            status: raw.status as PaymentStatus,
            lateFeeApplied: Number(raw.lateFeeApplied),
            daysLate: raw.daysLate,

            gatewayOrderId: raw.gatewayOrderId ?? undefined,
            gatewayPaymentId: raw.gatewayPaymentId ?? undefined,
            failureReason: raw.failureReason ?? undefined,

            receiptUrl: raw.receiptUrl ?? undefined,

            isRefunded: raw.isRefunded,
            refundAmount: raw.refundAmount ? Number(raw.refundAmount) : undefined,
            refundDate: raw.refundDate ?? undefined,
            refundReason: raw.refundReason ?? undefined,
            gatewayRefundId: raw.gatewayRefundId ?? undefined,

            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        };
        return PaymentEntity.create(data);
    }

    static toPrismaCreate(entity: PaymentEntity): Prisma.PaymentCreateInput {
        return {
            id: entity.id,
            transactionId: entity.transactionId ?? entity.id,
            agreement: { connect: { id: entity.agreementId } },
            property: { connect: { id: entity.propertyId } },
            payer: { connect: { id: entity.payerId } },
            payee: { connect: { id: entity.payeeId } },
            amount: new Prisma.Decimal(entity.amount),
            category: entity.category,
            dueDate: entity.dueDate,
            paidDate: entity.paidDate,
            paymentGateway: entity.paymentGateway,
            paymentMethod: entity.paymentMethod,
            status: entity.status,
            lateFeeApplied: new Prisma.Decimal(entity.lateFeeApplied),
            daysLate: entity.daysLate,
            gatewayOrderId: entity.gatewayOrderId,
            gatewayPaymentId: entity.gatewayPaymentId,
            failureReason: entity.failureReason,
            receiptUrl: entity.receiptUrl,
            isRefunded: entity.isRefunded,
            refundAmount: entity.refundAmount ? new Prisma.Decimal(entity.refundAmount) : undefined,
            refundDate: entity.refundDate,
            refundReason: entity.refundReason,
            gatewayRefundId: entity.gatewayRefundId,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    static toPrismaUpdate(entity: PaymentEntity): Prisma.PaymentUpdateInput {
        return {
            transactionId: entity.transactionId ?? entity.id,
            amount: new Prisma.Decimal(entity.amount),
            category: entity.category,
            dueDate: entity.dueDate,
            paidDate: entity.paidDate,
            paymentGateway: entity.paymentGateway,
            paymentMethod: entity.paymentMethod,
            status: entity.status,
            lateFeeApplied: new Prisma.Decimal(entity.lateFeeApplied),
            daysLate: entity.daysLate,
            gatewayOrderId: entity.gatewayOrderId,
            gatewayPaymentId: entity.gatewayPaymentId,
            failureReason: entity.failureReason,
            receiptUrl: entity.receiptUrl,
            isRefunded: entity.isRefunded,
            refundAmount: entity.refundAmount ? new Prisma.Decimal(entity.refundAmount) : undefined,
            refundDate: entity.refundDate,
            refundReason: entity.refundReason,
            gatewayRefundId: entity.gatewayRefundId,
            updatedAt: entity.updatedAt,
        };
    }
}
