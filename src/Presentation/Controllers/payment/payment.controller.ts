import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import {
    IInitiatePaymentCheckoutUseCase,
    IGetAgreementPaymentsUseCase,
    IGetPaymentByIdUseCase,
    IHandleStripeWebhookUseCase,
} from '@application/interfaces/payment/payment.usecase.interface';
import { InitiateCheckoutDTO } from '@application/dtos/payment/payment.dto';
import { TokenTypes } from '@shared/types/tokens';
import { ResponseHandler } from '@presentation/utils/response-handler';
import {
    Payment_Response_Messages,
    Common_Response_Messages,
} from '@shared/types/messages/Response.messages';
import { Http_StatusCodes } from '@shared/enums/http-status-codes.enum';
import { logger } from '@shared/log/logger';
import { BadRequestError } from '@shared/errors/common-errors';

@injectable()
export class PaymentController {
    constructor(
        @inject(TokenTypes.IInitiatePaymentCheckoutUseCase)
        private readonly _initiateCheckoutUseCase: IInitiatePaymentCheckoutUseCase,
        @inject(TokenTypes.IGetAgreementPaymentsUseCase)
        private readonly _getAgreementPaymentsUseCase: IGetAgreementPaymentsUseCase,
        @inject(TokenTypes.IGetPaymentByIdUseCase)
        private readonly _getPaymentByIdUseCase: IGetPaymentByIdUseCase,
        @inject(TokenTypes.IHandleStripeWebhookUseCase)
        private readonly _handleStripeWebhookUseCase: IHandleStripeWebhookUseCase,
    ) {}

    handleWebhook = async (req: Request, res: Response): Promise<Response> => {
        const signature = req.headers['stripe-signature'];
        if (!signature || typeof signature !== 'string') {
            throw new BadRequestError('Missing Stripe signature');
        }

        await this._handleStripeWebhookUseCase.execute(req.body as Buffer, signature);

        return ResponseHandler.success(
            res,
            null,
            Payment_Response_Messages.WEBHOOK_RECEIVED,
            Http_StatusCodes.OK,
        );
    };

    initiateCheckout = async (req: Request, res: Response): Promise<Response> => {
        const paymentId = req.params.id as string;
        const userId = req.user?.id;
        const dto: InitiateCheckoutDTO = req.body;

        if (!userId) {
            return ResponseHandler.error(
                res,
                Common_Response_Messages.UNAUTHORIZED,
                Http_StatusCodes.UN_AUTHORIZED,
            );
        }

        if (!dto.successUrl || !dto.cancelUrl) {
            throw new BadRequestError('successUrl and cancelUrl are required');
        }

        logger.info({ paymentId, userId }, 'Payment checkout requested');

        const result = await this._initiateCheckoutUseCase.execute(paymentId, userId, dto);

        return ResponseHandler.success(
            res,
            result,
            Payment_Response_Messages.CHECKOUT_CREATED,
            Http_StatusCodes.OK,
        );
    };

    getPaymentById = async (req: Request, res: Response): Promise<Response> => {
        const paymentId = req.params.id as string;
        const userId = req.user?.id;

        if (!userId) {
            return ResponseHandler.error(
                res,
                Common_Response_Messages.UNAUTHORIZED,
                Http_StatusCodes.UN_AUTHORIZED,
            );
        }

        const result = await this._getPaymentByIdUseCase.execute(paymentId, userId);

        return ResponseHandler.success(
            res,
            result,
            Payment_Response_Messages.FETCHED,
            Http_StatusCodes.OK,
        );
    };

    getAgreementPayments = async (req: Request, res: Response): Promise<Response> => {
        const agreementId = req.params.agreementId as string;
        const userId = req.user?.id;

        if (!userId) {
            return ResponseHandler.error(
                res,
                Common_Response_Messages.UNAUTHORIZED,
                Http_StatusCodes.UN_AUTHORIZED,
            );
        }

        const result = await this._getAgreementPaymentsUseCase.execute(agreementId, userId);

        return ResponseHandler.success(
            res,
            result,
            Payment_Response_Messages.FETCHED,
            Http_StatusCodes.OK,
        );
    };
}
