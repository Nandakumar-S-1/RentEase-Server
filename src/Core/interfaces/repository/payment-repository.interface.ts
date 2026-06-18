import { PaymentEntity } from '@core/entities/payment.entity';
import { IBaseRepository } from '../base/base-repository.interface';

export interface IPaymentRepository extends IBaseRepository<
    PaymentEntity,
    PaymentEntity,
    (entity: PaymentEntity) => Promise<PaymentEntity>
> {
    create(entity: PaymentEntity): Promise<PaymentEntity>;
    findById(id: string): Promise<PaymentEntity | null>;
    findAll(): Promise<PaymentEntity[]>;
    findByGatewayPaymentId(gatewayPaymentId: string): Promise<PaymentEntity | null>;
    findByGatewayOrderId(gatewayOrderId: string): Promise<PaymentEntity | null>;
    findByAgreementId(agreementId: string): Promise<PaymentEntity[]>;
    findByPayerId(payerId: string): Promise<PaymentEntity[]>;
    findByPayeeId(payeeId: string): Promise<PaymentEntity[]>;
    update(entity: PaymentEntity): Promise<PaymentEntity>;
}
