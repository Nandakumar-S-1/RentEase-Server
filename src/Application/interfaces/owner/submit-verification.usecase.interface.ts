import { SubmitVerificationDTO } from 'application/dtos/owner/request/owner-verification-request.dto';

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
