// import { Http_StatusCodes } from "@shared/Enums/Http_StatusCodes"
// import { Owner_Verification_Status  } from "@shared/Enums/owner.verification.status"
// import { UserRole } from "@shared/Enums/user.role.type"
// import { Request, Response, NextFunction } from "express"

// export const verifyOwnerMiddleware = (
//     req:Request,res:Response,next:NextFunction
// )=>{
//     if(!req.user){
//         return res.status(Http_StatusCodes.UN_AUTHORIZED).json({
//             success:false,
//             message:'Unauthorizeed'
//         })
//     }
//     if(req.user.role!==UserRole.OWNER){
//         return res.status(Http_StatusCodes.FORBIDDEN).json({
//             success:false,
//             message:'Only Owners are allowed to perform this action'
//         })
//     }
//     if(req.user.verificationStatus!==Owner_Verification_Status .VERIFIED){
//         return res.status(Http_StatusCodes.FORBIDDEN).json({
//             success:false,
//             message:'Owner is not verified'
//         })
//     }
//     next()
// }