export interface PendingOwnerDTO {
    id: string;
    ownerId: string;
    documentType: string | null;
    documentUrl: string | null;
    status: string;
}
