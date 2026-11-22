import { injectable } from 'tsyringe';
import { BaseRoute } from './base/base.route';
import { PaymentController } from '../controllers/payment/payment.controller';
import { authMiddleware } from '@presentation/middlewares/auth.middleware';
import { asyncHandlerFunction } from '@presentation/utils/async-handler';
import { PAYMENT_ROUTES } from '@shared/constants/routes';

@injectable()
export class PaymentRoutes extends BaseRoute {
    constructor(private readonly _controller: PaymentController) {
        super();
        this.initializeRoutes();
    }

    protected initializeRoutes(): void {
        this.router.post(
            PAYMENT_ROUTES.WEBHOOK,
            asyncHandlerFunction(this._controller.handleWebhook.bind(this._controller)),
        );

        this.router.use(authMiddleware);

        this.router.post(
            PAYMENT_ROUTES.CHECKOUT,
            asyncHandlerFunction(this._controller.initiateCheckout.bind(this._controller)),
        );

        this.router.get(
            PAYMENT_ROUTES.BY_AGREEMENT,
            asyncHandlerFunction(this._controller.getAgreementPayments.bind(this._controller)),
        );

        this.router.get(
            PAYMENT_ROUTES.GET_BY_ID,
            asyncHandlerFunction(this._controller.getPaymentById.bind(this._controller)),
        );
    }
}
