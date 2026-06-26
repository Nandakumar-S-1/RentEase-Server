import { injectable, inject } from 'tsyringe';
import { TokenTypes } from '@shared/types/tokens';
import { IAgreementRepository } from '@core/interfaces/repository/agreement-repository.interface';

export interface TenantKycDocumentDTO {
    documentUrl: string | null;
    agreementNumber: string;
    agreementId: string;
}

@injectable()
export class GetTenantKycDocumentUseCase {
    constructor(
        @inject(TokenTypes.IAgreementRepository)
        private readonly _agreementRepository: IAgreementRepository,
    ) {}

    async execute(tenantId: string): Promise<TenantKycDocumentDTO | null> {
        const agreements = await this._agreementRepository.findByTenantId(tenantId);
        if (!agreements.length) return null;
        const latest = agreements.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

        return {
            documentUrl: latest.tenantKycDocumentUrl ?? null,
            agreementNumber: latest.agreementNumber,
            agreementId: latest.id,
        };
    }
}
