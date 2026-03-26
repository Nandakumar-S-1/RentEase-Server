export type documentType= 'PAN' | 'AADHAAR'
export type verificationStatus= 'VERIFIED' | 'REJECTED';
export interface SubmitVerificationDTO {
    ownerId: string;
    documentUrl: string;
    documentType: documentType
}

export interface ReviewVerificationDTO {
    ownerId: string;
    status: verificationStatus
    rejectionReason?: string;
}
