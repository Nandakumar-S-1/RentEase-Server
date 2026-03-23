import { SubmitVerificationDTO } from '@application/Data-Transfer-Object/Owner/OwnerVerificationDTO';

export interface ISubmitVerificationUseCase {
    execute(dto: SubmitVerificationDTO): Promise<{
        id: string;
        ownerId: string;
        documentType: string | null;
        status: string;
        rejectionReason: string | null;
        submittedAt: Date;
    }>;
}
