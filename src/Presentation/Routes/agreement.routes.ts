import { injectable } from 'tsyringe';
import { BaseRoute } from './base/base.route';
import { AgreementController } from '../controllers/agreement/agreement.controller';
import { authMiddleware } from '@presentation/middlewares/auth.middleware';
import { asyncHandlerFunction } from '@presentation/utils/async-handler';
import { AGREEMENT_ROUTES } from '@shared/constants/routes';

@injectable()
export class AgreementRoutes extends BaseRoute {
    constructor(private readonly _controller: AgreementController) {
        super();
        this.initializeRoutes();
    }

    protected initializeRoutes(): void {
        this.router.use(authMiddleware);

        this.router.post(
            AGREEMENT_ROUTES.CREATE,
            asyncHandlerFunction(this._controller.createAgreement.bind(this._controller)),
        );
        this.router.get(
            AGREEMENT_ROUTES.GET_MY,
            asyncHandlerFunction(this._controller.getMyAgreements.bind(this._controller)),
        );

        this.router.get(
            AGREEMENT_ROUTES.GET_BY_ID,
            asyncHandlerFunction(this._controller.getAgreementById.bind(this._controller)),
        );

        this.router.post(
            AGREEMENT_ROUTES.SIGN_OWNER,
            asyncHandlerFunction(this._controller.signOwner.bind(this._controller)),
        );

        this.router.post(
            AGREEMENT_ROUTES.SIGN_TENANT,
            asyncHandlerFunction(this._controller.signTenant.bind(this._controller)),
        );

        this.router.post(
            AGREEMENT_ROUTES.GENERATE_PDF,
            asyncHandlerFunction(this._controller.generatePdf.bind(this._controller)),
        );

        this.router.post(
            AGREEMENT_ROUTES.UPLOAD_KYC,
            asyncHandlerFunction(this._controller.uploadKyc.bind(this._controller)),
        );

        this.router.post(
            AGREEMENT_ROUTES.UPLOAD_URLS,
            asyncHandlerFunction(this._controller.getUploadUrls.bind(this._controller)),
        );
    }
}
