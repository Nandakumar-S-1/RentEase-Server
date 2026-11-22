import { MaintenanceRequestEntity } from '@core/entities/maintenance-request.entity';

export interface IMaintenanceRequestRepository {
    create(data: Partial<MaintenanceRequestEntity>): Promise<MaintenanceRequestEntity>;
    findById(id: string): Promise<MaintenanceRequestEntity | null>;
    findByPropertyId(propertyId: string): Promise<MaintenanceRequestEntity[]>;
    findByTenantId(tenantId: string): Promise<MaintenanceRequestEntity[]>;
    findByOwnerId(ownerId: string): Promise<MaintenanceRequestEntity[]>;
    update(id: string, data: Partial<MaintenanceRequestEntity>): Promise<MaintenanceRequestEntity>;
}
