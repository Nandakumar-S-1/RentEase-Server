import { OwnerProfile } from "@prisma/client";

export interface IOwnerProfileRepository {
    findByUserId(userId:string):Promise<OwnerProfile | null>
    updateVerificatioinStatus(userId:string,status:string,reason?:string):Promise<void>
    // updateDocumentURL(userId:string,documentType:string,documentUrl:string):Promise<void>;
}