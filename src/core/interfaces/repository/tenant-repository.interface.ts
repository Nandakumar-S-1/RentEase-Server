import { TenantProfileEntity } from 'core/entities/tenant-profile.entity';
import { IBaseRepository } from '../base/base-repository.interface';

export interface ITenantProfileRepository extends IBaseRepository<TenantProfileEntity> {
    findById(id: string): Promise<TenantProfileEntity | null>;
    findByUserId(userId: string): Promise<TenantProfileEntity | null>;
    save(entity: TenantProfileEntity): Promise<TenantProfileEntity>;
}
