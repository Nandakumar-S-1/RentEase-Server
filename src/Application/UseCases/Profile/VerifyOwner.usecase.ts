import { OwnerVerificationMapper } from "@application/Mappers/Profile/OwnerVerification.mapper";
import { IOwnerProfileRepository } from "@core/Interfaces/IOwnerRepository";
import { Owner_Verification_Staus } from "@shared/Enums/owner.verification.status";
import { OwnerProfileNotFoundError } from "@shared/Errors/Owner_Errors";
import { TokenTypes } from "@shared/Types/tokens";
import { inject, injectable } from "tsyringe";

@injectable()
export class VerifyOwnerUseCase{
    constructor(
        @inject(TokenTypes.IOwnerProfileRepository)
        private readonly _ownerRepository:IOwnerProfileRepository
    ){}
    async verifyOwner(ownerId:string){
        const ownerProfile= await this._ownerRepository.findByUserId(ownerId)
        if(!ownerProfile){
            throw new OwnerProfileNotFoundError()
        }
        ownerProfile.approve() //entity method to handle validation
        const updated = await this._ownerRepository.updateVerificatioinStatus(
            ownerId,
            Owner_Verification_Staus.VERIFIED
        )
        return OwnerVerificationMapper.toResponse(updated)
    }
    async rejectOwner(ownerId:string,reason:string){
        const ownerProfile=await this._ownerRepository.findByUserId(ownerId)
        if(!ownerProfile){
            throw new OwnerProfileNotFoundError()
        }
        ownerProfile.reject(reason)//also domaain method
        const updated=await this._ownerRepository.updateVerificatioinStatus(
            ownerId,
            Owner_Verification_Staus.REJECTED,
            reason
        )
        return OwnerVerificationMapper.toResponse(updated)
    }
    async getPendingOwners(){
        const pending=await this._ownerRepository.findAllPending()
        return OwnerVerificationMapper.toPendingListResponse(pending)
    }
}