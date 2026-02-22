// asyncHandlerFunction (catches async errors)

import { Request,Response,NextFunction } from "express";

export const asyncHandlerFunction = (
    fun:(req:Request,res:Response,next:NextFunction)=>Promise<Response |void>
)=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        Promise.resolve(fun(req,res,next)).catch(next)
    }
}