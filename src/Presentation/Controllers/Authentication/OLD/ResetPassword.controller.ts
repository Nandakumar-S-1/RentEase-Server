// import { ApiResponse } from "@application/Data-Transfer-Object/ApiResponseDTO";
// import { IHashService } from "@application/Interfaces/Services/IHashService";
// import { IRedisCache } from "@application/Interfaces/Services/IRedisCacheService";
// import { IUserRepository } from "@core/Interfaces/IUserRepository";
// import { Http_StatusCodes } from "@shared/Enums/Http_StatusCodes";
// import { logger } from "@shared/Log/logger";
// import { TokenTypes } from "@shared/Types/tokens";
// import { Request, Response } from "express";
// import { inject, injectable } from "tsyringe";

// @injectable()
// export class ResetPasswordController {
//     constructor(
//         @inject(TokenTypes.IUserRepository)
//         private readonly userRepository: IUserRepository,

//         @inject(TokenTypes.IHashService)
//         private readonly hashService: IHashService,

//         @inject(TokenTypes.IRedisCache)
//         private readonly redisService: IRedisCache
//     ) { }

//     async execute(req: Request, res: Response): Promise<Response> {
//         const { email, newPassword } = req.body;
//         logger.info(`Password reset requested for: ${email}`);

//         const isVerified = await this.redisService.get(
//             `resetPassword_verified:${email}`
//         );

//         if (!isVerified) {
//             throw new Error('Should verify OTP first');
//         }

//         const user = await this.userRepository.findByEmail(email);
//         if (!user) {
//             throw new Error('User not found');
//         }

//         const hashPass = await this.hashService.hash(newPassword);
//         user.setPassword(hashPass);

//         await this.userRepository.update(user.id, user);
//         await this.redisService.delete(`resetPassword_verified:${email}`);

//         logger.info('Password reset successful');
//         const response: ApiResponse<null> = {
//             success: true,
//             message: 'Password reset successful'
//         };
//         return res.status(Http_StatusCodes.OK).json(response);
//     }
// }
