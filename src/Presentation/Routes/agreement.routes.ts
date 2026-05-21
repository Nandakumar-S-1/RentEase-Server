import { Router } from 'express';
import { container } from 'tsyringe';
import { AgreementController } from '../controllers/agreement/agreement.controller';
import { authMiddleware } from '@presentation/middlewares/auth.middleware';
const agreementRouter = Router();
const agreementController = container.resolve(AgreementController);

// Apply auth middleware to all routes
agreementRouter.use(authMiddleware);

agreementRouter.post('/', agreementController.createAgreement.bind(agreementController));
agreementRouter.post('/:id/sign-owner', agreementController.signOwner.bind(agreementController));
agreementRouter.post('/:id/sign-tenant', agreementController.signTenant.bind(agreementController));
agreementRouter.post('/:id/generate-pdf', agreementController.generatePdf.bind(agreementController));
agreementRouter.post('/:id/kyc', agreementController.uploadKyc.bind(agreementController));
agreementRouter.post('/:id/upload-urls', agreementController.getUploadUrls.bind(agreementController));

export default agreementRouter;
