// import { ApiResponse } from "@application/Data-Transfer-Object/ApiResponseDTO";
// import { GoogleAuthUseCase } from "@application/UseCases/Authentication/GoogleAuth.usecase";
// import { Http_StatusCodes } from "@shared/Enums/Http_StatusCodes";
// import { logger } from "@shared/Log/logger";
// import { TokenTypes } from "@shared/Types/tokens";
// import { Request, Response } from "express";
// import { inject, injectable } from "tsyringe";

// @injectable()
// export class GoogleAuthControler {
//     constructor(
//         @inject(TokenTypes.IGoogleAuthUseCase)
//         private readonly googleAuthUseCase: GoogleAuthUseCase
//     ) { }

//     async execute(req: Request, res: Response): Promise<Response> {
//         const { idToken, role } = req.body;
//         logger.info(`Authentication request on google auth for role ${role}`);

//         const result = await this.googleAuthUseCase.execute(idToken, role);
//         const response: ApiResponse<{
//             user: {
//                 id: string;
//                 email: string;
//                 fullname: string;
//                 phone: string;
//                 role: string;
//             };
//             accessToken: string;
//             refreshToken: string;
//         }> = {
//             success: true,
//             message: 'Google authentication successful',
//             data: {
//                 user: {
//                     id: result.user.id,
//                     email: result.user.email,
//                     fullname: result.user.fullname,
//                     phone: result.user.phone,
//                     role: result.user.role,
//                 },
//                 accessToken: result.accessToken,
//                 refreshToken: result.refreshToken,
//             },
//         };
//         return res.status(Http_StatusCodes.OK).json(response);
//     }
// }