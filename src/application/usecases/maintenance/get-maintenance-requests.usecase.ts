import { injectable, inject } from 'tsyringe';
import { IMaintenanceRequestRepository } from '@core/interfaces/repository/maintenance-request.repository.interface';
import { MaintenanceRequestEntity } from '@core/entities/maintenance-request.entity';
import { IGetMaintenanceRequestsUseCase } from '@application/interfaces/maintenance/maintenance.usecase.interface';
import { TokenTypes } from '@shared/types/tokens';
import { UserRole } from '@shared/enums/user-role.enum';

@injectable()
export class GetMaintenanceRequestsUseCase implements IGetMaintenanceRequestsUseCase {
    constructor(
        @inject(TokenTypes.IMaintenanceRequestRepository)
        private readonly _maintenanceRepository: IMaintenanceRequestRepository,
    ) {}

    async execute(userId: string, role: string): Promise<MaintenanceRequestEntity[]> {
        if (role === UserRole.TENANT) {
            return this._maintenanceRepository.findByTenantId(userId);
        } else if (role === UserRole.OWNER) {
            return this._maintenanceRepository.findByOwnerId(userId);
        }
        return [];
    }
}
