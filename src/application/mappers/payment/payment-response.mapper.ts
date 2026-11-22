import { PaymentResponseDTO } from '@application/dtos/payment/res/payment-response.dto';
import { PaymentEntity } from '@core/entities/payment.entity';

export class PaymentResponseMapper {
    static toResponse(entity: PaymentEntity): PaymentResponseDTO {
        return {
            id: entity.id,
            transactionId: entity.transactionId,
            agreementId: entity.agreementId,
            propertyId: entity.propertyId,
            payerId: entity.payerId,
            payeeId: entity.payeeId,
            amount: entity.amount,
            category: entity.category,
            dueDate: entity.dueDate,
            paidDate: entity.paidDate,
            paymentGateway: entity.paymentGateway,
            paymentMethod: entity.paymentMethod,
            status: entity.status,
            gatewayOrderId: entity.gatewayOrderId,
            gatewayPaymentId: entity.gatewayPaymentId,
            failureReason: entity.failureReason,
            receiptUrl: entity.receiptUrl,
            isRefunded: entity.isRefunded,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    static toListResponse(entities: PaymentEntity[]): PaymentResponseDTO[] {
        return entities.map((entity) => this.toResponse(entity));
    }
}
