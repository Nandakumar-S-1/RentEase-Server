import { TenantProfileEntity } from 'core/entities/tenant-profile.entity';

export interface ITenantProfileRepository {
    findByUserId(userId: string): Promise<TenantProfileEntity | null>;
    create(entity: TenantProfileEntity): Promise<TenantProfileEntity>;
    save(entity: TenantProfileEntity): Promise<TenantProfileEntity>;
}
