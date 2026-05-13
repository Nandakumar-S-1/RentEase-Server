import { AgreementEntity } from '@core/entities/agreement.entity';
import { AgreementStatus } from '@core/types/agreement.types';
import { IBaseRepository } from '../base/base-repository.interface';

export interface IAgreementRepository extends IBaseRepository<AgreementEntity> {
    findById(id: string): Promise<AgreementEntity | null>;
    findByOwnerId(ownerId: string, status?: AgreementStatus): Promise<AgreementEntity[]>;
    findByTenantId(tenantId: string, status?: AgreementStatus): Promise<AgreementEntity[]>;
    findAll(filters?: { status?: AgreementStatus; propertyId?: string }): Promise<AgreementEntity[]>;
    update(entity: AgreementEntity): Promise<AgreementEntity>;
}
