import { injectable, inject } from 'tsyringe';
import { IMaintenanceRequestRepository } from '@core/interfaces/repository/maintenance-request.repository.interface';
import { MaintenanceRequestEntity } from '@core/entities/maintenance-request.entity';
import {
    AssignServiceProviderDTO,
    UpdateMaintenanceStatusDTO,
} from '@application/dtos/maintenance/maintenance-request.dto';
import {
    IAssignServiceProviderUseCase,
    IUpdateMaintenanceStatusUseCase,
} from '@application/interfaces/maintenance/maintenance.usecase.interface';
import { TokenTypes } from '@shared/types/tokens';
import { NotFoundError, ForbiddenError } from '@shared/errors/common-errors';
import { MaintenanceStatus } from '@shared/enums/maintenance.enum';

@injectable()
export class AssignServiceProviderUseCase implements IAssignServiceProviderUseCase {
    constructor(
        @inject(TokenTypes.IMaintenanceRequestRepository)
        private readonly _maintenanceRepository: IMaintenanceRequestRepository,
    ) {}

    async execute(data: AssignServiceProviderDTO): Promise<MaintenanceRequestEntity> {
        const request = await this._maintenanceRepository.findById(data.requestId);
        if (!request) {
            throw new NotFoundError('Maintenance request not found');
        }

        if (request.ownerId !== data.ownerId) {
            throw new ForbiddenError('Only the property owner can assign a service provider');
        }

        return this._maintenanceRepository.update(data.requestId, {
            assignedProviderId: data.providerId,
            status: MaintenanceStatus.ASSIGNED,
        });
    }
}

@injectable()
export class UpdateMaintenanceStatusUseCase implements IUpdateMaintenanceStatusUseCase {
    constructor(
        @inject(TokenTypes.IMaintenanceRequestRepository)
        private readonly _maintenanceRepository: IMaintenanceRequestRepository,
    ) {}

    async execute(data: UpdateMaintenanceStatusDTO): Promise<MaintenanceRequestEntity> {
        const request = await this._maintenanceRepository.findById(data.requestId);
        if (!request) {
            throw new NotFoundError('Maintenance request not found');
        }

        if (request.ownerId !== data.ownerId) {
            throw new ForbiddenError('Only the property owner can update status');
        }

        return this._maintenanceRepository.update(data.requestId, {
            status: data.status,
            ...(data.status === MaintenanceStatus.COMPLETED ? { workCompletedAt: new Date() } : {}),
            ...(data.status === MaintenanceStatus.IN_PROGRESS ? { workStartedAt: new Date() } : {}),
        });
    }
}
