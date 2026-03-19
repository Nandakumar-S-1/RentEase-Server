import { IBaseRepository } from "./Base/IBaseRepository";
import { OwnerProfileEntity } from "@core/Entities/OwnerProfileEntity.entity";
import { Owner_Verification_Staus } from "@shared/Enums/owner.verification.status";

export interface IOwnerProfileRepository extends IBaseRepository<OwnerProfileEntity> {
    findByUserId(userId:string):Promise<OwnerProfileEntity | null>
    submitDocument(userId:string,docType:string,docUrl:string):Promise<OwnerProfileEntity>
    updateVerificatioinStatus(userId:string,status:Owner_Verification_Staus.VERIFIED|Owner_Verification_Staus.REJECTED,rejectionReason?:string):Promise<OwnerProfileEntity>
    findAllPending():Promise<OwnerProfileEntity[]>
}