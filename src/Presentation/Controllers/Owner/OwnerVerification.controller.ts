import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { ISubmitVerificationUseCase } from "@application/Interfaces/Owner/ISubmitVerificationUseCase";
import { Http_StatusCodes } from "@shared/Enums/Http_StatusCodes";
import { TokenTypes } from "@shared/Types/tokens";
import { uploadToCloudinary } from "@shared/Uploads/cloudinary.service";


@injectable()
export class OwnerVerificationController {
    constructor(
        @inject(TokenTypes.SubmitVerificationUseCase)
        private readonly _submitVerification: ISubmitVerificationUseCase
    ) { }

    submit = async (req: Request, res: Response): Promise<Response> => {
        const ownerId = req.user!.id;

        const { documentType } = req.body;

        if (!req.file) {
            return res.status(Http_StatusCodes.BAD_REQUEST).json({
                success:false,
                message:"Document file is required",
            })
        }

        const documentUrl = await uploadToCloudinary(
            req.file.buffer,
            req.file.mimetype
        );

        const result = await this._submitVerification.execute({
            ownerId,
            documentType,
            documentUrl,
        });
        return res.status(Http_StatusCodes.CREATED).json({
            success: true,
            message: "Document submitted successfully",
            data: result,
        });
    };
    getStatus = async (req: Request, res: Response): Promise<Response> => {
        const user = req.user!;

        return res.status(Http_StatusCodes.OK).json({
            success:true,
            message:"Verification status fetched",
            data:{
                verificationStatus: user.verificationStatus,
            }
        }
        );
    };
}