// import { injectable } from 'tsyringe';
// import { Router } from 'express';
// import { BaseRoutes } from '../base.routes';
// import { SubscriptionController } from '@presentation/controllers/subscription/subscription.controller';
// import { authMiddleware } from '@presentation/middlewares/auth.middleware';
// import { neededRole } from '@presentation/middlewares/role.middleware';
// import { UserRole } from '@shared/enums/user-role.enum';
// import { asyncHandlerFunction } from '@presentation/utils/async-handler';

// export const SUBSCRIPTION_ROUTES = {
//     PLANS: '/plans',
//     CREATE: '/create',
//     CHECK_LIMIT: '/check-limit',
//     SUCCESS: '/success',
//     CANCEL: '/cancel',
// } as const;

// @injectable()
// export class SubscriptionRoutes extends BaseRoutes {
//     constructor(private readonly _controller: SubscriptionController) {
//         super();
//         this.initializeRoutes();
//     }

//     protected initializeRoutes(): void {
//         // Public route - get subscription plans
//         this.router.get(
//             SUBSCRIPTION_ROUTES.PLANS,
//             asyncHandlerFunction(this._controller.getSubscriptionPlans.bind(this._controller)),
//         );

//         // Protected routes - require authentication
//         this.router.use(authMiddleware);

//         // Owner-only routes
//         this.router.post(
//             SUBSCRIPTION_ROUTES.CREATE,
//             neededRole(UserRole.OWNER),
//             asyncHandlerFunction(this._controller.createSubscription.bind(this._controller)),
//         );

//         this.router.get(
//             SUBSCRIPTION_ROUTES.CHECK_LIMIT,
//             neededRole(UserRole.OWNER),
//             asyncHandlerFunction(this._controller.checkPropertyLimit.bind(this._controller)),
//         );

//         // Handle subscription success/cancel callbacks
//         this.router.post(
//             SUBSCRIPTION_ROUTES.SUCCESS,
//             neededRole(UserRole.OWNER),
//             asyncHandlerFunction(this._controller.handleSubscriptionSuccess.bind(this._controller)),
//         );
//     }
// }