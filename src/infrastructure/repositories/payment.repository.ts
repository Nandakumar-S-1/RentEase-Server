import { prisma } from 'infrastructure/database/prisma/prisma.client';
import { PaymentEntity } from '@core/entities/payment.entity';
import { IPaymentRepository } from '@core/interfaces/repository/payment-repository.interface';
import { PaymentPersistenceMapper } from 'infrastructure/mappers/payment-persistence.mapper';
import { injectable } from 'tsyringe';

@injectable()
export class PaymentRepository implements IPaymentRepository {
    async create(entity: PaymentEntity): Promise<PaymentEntity> {
        const data = PaymentPersistenceMapper.toPrismaCreate(entity);
        const res = await prisma.payment.create({ data });
        return PaymentPersistenceMapper.toEntity(res);
    }

    async findById(id: string): Promise<PaymentEntity | null> {
        const res = await prisma.payment.findUnique({
            where: { id },
            include: { payer: true, payee: true, property: true, agreement: true },
        });
        return res ? PaymentPersistenceMapper.toEntity(res) : null;
    }

    async findAll(): Promise<PaymentEntity[]> {
        const payments = await prisma.payment.findMany({
            include: { payer: true, payee: true, property: true, agreement: true },
            orderBy: { createdAt: 'desc' },
        });
        return payments.map((p) => PaymentPersistenceMapper.toEntity(p));
    }

    async findByGatewayPaymentId(gatewayPaymentId: string): Promise<PaymentEntity | null> {
        const res = await prisma.payment.findUnique({
            where: { gatewayPaymentId },
            include: { payer: true, payee: true, property: true, agreement: true },
        });
        return res ? PaymentPersistenceMapper.toEntity(res) : null;
    }

    async findByGatewayOrderId(gatewayOrderId: string): Promise<PaymentEntity | null> {
        const res = await prisma.payment.findFirst({
            where: { gatewayOrderId },
            include: { payer: true, payee: true, property: true, agreement: true },
        });
        return res ? PaymentPersistenceMapper.toEntity(res) : null;
    }

    async findByAgreementId(agreementId: string): Promise<PaymentEntity[]> {
        const payments = await prisma.payment.findMany({
            where: { agreementId },
            include: { payer: true, payee: true, property: true, agreement: true },
            orderBy: { createdAt: 'desc' },
        });
        return payments.map((p) => PaymentPersistenceMapper.toEntity(p));
    }

    async findByPayerId(payerId: string): Promise<PaymentEntity[]> {
        const payments = await prisma.payment.findMany({
            where: { payerId },
            include: { payer: true, payee: true, property: true, agreement: true },
            orderBy: { createdAt: 'desc' },
        });
        return payments.map((p) => PaymentPersistenceMapper.toEntity(p));
    }

    async findByPayeeId(payeeId: string): Promise<PaymentEntity[]> {
        const payments = await prisma.payment.findMany({
            where: { payeeId },
            include: { payer: true, payee: true, property: true, agreement: true },
            orderBy: { createdAt: 'desc' },
        });
        return payments.map((p) => PaymentPersistenceMapper.toEntity(p));
    }

    async update(entity: PaymentEntity): Promise<PaymentEntity> {
        const data = PaymentPersistenceMapper.toPrismaUpdate(entity);
        const res = await prisma.payment.update({
            where: { id: entity.id },
            data,
        });
        return PaymentPersistenceMapper.toEntity(res);
    }
}
