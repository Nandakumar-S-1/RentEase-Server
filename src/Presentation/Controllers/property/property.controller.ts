import { TokenTypes } from "@shared/types/tokens";
import { inject, injectable } from "tsyringe";
import { Request, Response } from 'express';
import { logger } from "@shared/log/logger";
import { Http_StatusCodes } from "@shared/enums/http-status-codes.enum";
import { ICreatePropertyUseCase } from "@application/interfaces/profile/property.usecase.interface";

@injectable()
export class PropertyController{
    constructor(
        @inject(TokenTypes.ICreatePropertyUseCase)
        private readonly _createPropertyUseCase:ICreatePropertyUseCase
    ){}
    createProperty = async(req:Request,res:Response):Promise<Response>=>{
        logger.info('initiating property creation')
        //here overriding TypeScript .Skip safety checks Assume req.user exists
        const ownerId = req.user!.id
        const dto = {
            ...req.body,
            ownerId
        }
        const property = await this._createPropertyUseCase.execute(dto)
        return res.status(Http_StatusCodes.CREATED).json({
            success:true,
            data:property
        })
    }
}