import { IJwtService } from "@application/Interfaces/Services/IJwtService";
import { IOwnerProfileRepository } from "@core/Interfaces/IOwnerRepository";
import { IUserRepository } from "@core/Interfaces/IUserRepository";
import { Request,Response,NextFunction } from "express";

import { container } from "tsyringe";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jwtService = container.resolve<IJwtService>("IJwtService");
    const userRepo = container.resolve<IUserRepository>("IUserRepository");
    const ownerRepo = container.resolve<IOwnerProfileRepository>("IOwnerProfileRepository");

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }
    //fertching/extracting token
    const token = authHeader.split(" ")[1];
    const decoded = jwtService.verifyTheAccessToken(token);

    const user = await userRepo.findById(decoded.userId);
    //token verification
    let verificationStatus;
    //cross checking owner 
    if (user.role === "OWNER") {
      const owner = await ownerRepo.findByUserId(user.id);
      verificationStatus = owner?.verificationStatus;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      verificationStatus,
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};


// export const authMiddleware = (
//     jwtService:IJwtService,
//     userRepos:IUserRepository,
//     ownerRepos:IOwnerProfileRepository
// ) =>{
//     return async (req:Request,res:Response,next:NextFunction)=>{
//         try {
//             //fertching/extracting token
//             const authHeader= req.header.authorization
//             if(!authHeader || !authHeader.startsWith('Bearer ')){
//                 return res.status(Http_StatusCodes.UN_AUTHORIZED).json({
//                     success:false,
//                     message:'Access Token is Missing or Token is Invalid'
//                 })
//             }

//             const token = authHeader.split(' ')[1]
//             const decoded = jwtService.verifyTheAccessToken(token)
//             if(!decoded || !decoded.userId){
//                 return res.status(Http_StatusCodes.UN_AUTHORIZED).json({
//                     success:false,
//                     message:'Token is Invalid'
//                 })
//             }
//             //user fetching
//             const user = await userRepos.findById(decoded.userId)
//             if(!user){
//                 return res.status(Http_StatusCodes.NOT_FOUND).json({
//                     success:false,
//                     message:'User not found'
//                 })
//             }

//             let verificationStatus
//             if(user.role==='OWNER'){
//                 const ownerProfile = await ownerRepos.findByUserId(user.id)
//                 verificationStatus=ownerProfile?.verificationStatus
//             }

//             req.user={
//                 id:user.id,
//                 email:user.email,
//                 role:user.role,
//                 verificationStatus
//             }
//             next()

//         } catch (error) {
//             return res.status(Http_StatusCodes.UN_AUTHORIZED).json({
//                 success:false,
//                 message:'Unauthorized'
//             })
//         }
//     }
// }