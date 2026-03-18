export interface IVerifyOwnerUseCase{
    verifyOwner(ownerId:string):Promise<void>
    rejectOwner(ownerId:string,reason:string):Promise<void>
    getPendingOwners()
}