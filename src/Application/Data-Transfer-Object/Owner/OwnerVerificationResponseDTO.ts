export interface OwnerVerificationResponseDTO {
    id: string
    ownerId: string
    documentType: string
    status: string
    rejectionReason: string | null
    submittedAt: Date
}