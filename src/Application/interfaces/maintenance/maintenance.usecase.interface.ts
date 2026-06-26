import { MaintenanceRequestEntity } from '@core/entities/maintenance-request.entity';
import {
    CreateMaintenanceRequestDTO,
    AssignServiceProviderDTO,
    UpdateMaintenanceStatusDTO,
} from '@application/dtos/maintenance/maintenance-request.dto';

export interface ICreateMaintenanceRequestUseCase {
    execute(tenantId: string, data: CreateMaintenanceRequestDTO): Promise<MaintenanceRequestEntity>;
}

export interface IGetMaintenanceRequestsUseCase {
    execute(userId: string, role: string): Promise<MaintenanceRequestEntity[]>;
}

export interface IAssignServiceProviderUseCase {
    execute(data: AssignServiceProviderDTO): Promise<MaintenanceRequestEntity>;
}

export interface IUpdateMaintenanceStatusUseCase {
    execute(data: UpdateMaintenanceStatusDTO): Promise<MaintenanceRequestEntity>;
}
