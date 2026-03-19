export interface SubmitVerificationDTO{
    ownerId:string,
    documentUrl:string,
    documentType:'PAN'|'AADHAAR'
}

export interface ReviewVerificationDTO{
    ownerId:string,
    status:'VERIFIED'|'REJECTED',
    rejectionReason?:string
}