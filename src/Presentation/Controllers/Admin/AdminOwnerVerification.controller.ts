import { VerifyOwnerUseCase } from "@application/UseCases/Owner/VerifyOwner.usecase";
import { Http_StatusCodes } from "@shared/Enums/Http_StatusCodes";
import { TokenTypes } from "@shared/Types/tokens";
import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";


@injectable()
export class AdminOwnerVerificationController {
    constructor(
        @inject(TokenTypes.VerifyOwnerUseCase)
        private readonly _verifyOwner:VerifyOwnerUseCase
    ) { }

    verifyOwner = async (req:Request,res:Response):Promise<Response>=>{

            const {ownerId} = req.params
            await this._verifyOwner.verifyOwner(ownerId)
            
            return res.status(Http_StatusCodes.OK).json({
                success:true,
                message:'owner verified successfully'
            })
    }
    rejectOwner = async(req:Request,res:Response):Promise<Response>=>{
        const {ownerId}=req.params
        const {rejectionReason}=req.body

        if(!rejectionReason){
            return res.status(Http_StatusCodes.BAD_REQUEST).json({
                success:false,
                message:'Rejectio reason should be included'
            })
        }
        await this._verifyOwner.rejectOwner(ownerId,rejectionReason)
        return res.status(Http_StatusCodes.OK).json({
            success:true,
            message:'Owner rejected'
        })
    }
    listPendingOwners = async(req:Request,res:Response):Promise<Response>=>{
        const result = await this._verifyOwner.getPendingOwners()
        return res.status(Http_StatusCodes.OK).json({
            success:true,
            message:'Fetched all pending owners',
            data:result
        })
    }
}