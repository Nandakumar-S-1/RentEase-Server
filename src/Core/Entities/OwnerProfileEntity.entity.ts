import { OwnerProfileTypeData } from '@core/Types/ownerProfile.types';
import { Owner_Verification_Staus } from '@shared/Enums/owner.verification.status';
import {OwnerVerifiedError,InvalidVerificationError,RejectionReasonError} from '../../Shared/Errors/Owner_Errors'
export class OwnerProfileEntity {
  private constructor(
    //profile fields
    private readonly _id: string,
    private readonly _userId: string,
    private _bio: string | null,
    private _occupation: string | null,
    //verification fields
    private _documentUrl: string,
    private _documentType: string,
    private _verificationStatus: Owner_Verification_Staus,
    private _rejectionReason: string | null,
    private _verifiedAt: Date | null,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
  ) {}
  static create(props: OwnerProfileTypeData): OwnerProfileEntity {
    return new OwnerProfileEntity(
      props.id,
      props.userId,
      props.occupation ?? null,
      props.bio ?? null,
      props.documentType ?? null,
      props.documentUrl ?? null,
      props.verificationStatus ?? Owner_Verification_Staus.PENDING,
      props.rejectionReason ?? null,
      props.verifiedAt ?? null,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
    );
  }
  get id() {
    return this._id;
  }
  get userId() {
    return this._userId;
  }
  get bio() {
    return this._bio;
  }
  get occupation() {
    return this._occupation;
  }
  get documentType() {
    return this._documentType;
  }
  get documentUrl() {
    return this._documentUrl;
  }
  get verificationStatus() {
    return this._verificationStatus;
  }
  get rejectionReason() {
    return this._rejectionReason;
  }
  get verifiedAt() {
    return this._verifiedAt;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }
  documentSubmit(docType:string,docUrl:string):void{
    if(this.verificationStatus===Owner_Verification_Staus.VERIFIED){
        throw new  OwnerVerifiedError()
    }
    this._documentType=docType
    this._documentUrl=docUrl
    this._verificationStatus=Owner_Verification_Staus.SUBMITTED
  }
  approve():void{
    if(this._verificationStatus!==Owner_Verification_Staus.SUBMITTED){
        throw new InvalidVerificationError(this._verificationStatus,'reject')
    }
    this._verificationStatus=Owner_Verification_Staus.VERIFIED
    this._verifiedAt=new Date()
    this._rejectionReason=null
  }
  reject(reason:string):void{
    if(this.verificationStatus!==Owner_Verification_Staus.SUBMITTED){
        throw new InvalidVerificationError(this._verificationStatus,'approve')
    }
    if(!reason){
        throw new RejectionReasonError()
    }
    this._verificationStatus=Owner_Verification_Staus.REJECTED
    this._rejectionReason=reason
  }
}
