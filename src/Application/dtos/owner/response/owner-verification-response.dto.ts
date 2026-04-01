export interface OwnerVerificationResponseDTO {
    id: string;
    ownerId: string;
    documentType: string | null;
    status: string;
    rejectionReason: string | null;
    submittedAt: Date;
}
