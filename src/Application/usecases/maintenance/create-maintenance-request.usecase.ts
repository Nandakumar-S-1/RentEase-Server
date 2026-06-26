import { injectable, inject } from 'tsyringe';
import { IMaintenanceRequestRepository } from '@core/interfaces/repository/maintenance-request.repository.interface';
import { IPropertyRepository } from '@core/interfaces/repository/property-repository.interface';
import { MaintenanceRequestEntity } from '@core/entities/maintenance-request.entity';
import { CreateMaintenanceRequestDTO } from '@application/dtos/maintenance/maintenance-request.dto';
import { ICreateMaintenanceRequestUseCase } from '@application/interfaces/maintenance/maintenance.usecase.interface';
import { TokenTypes } from '@shared/types/tokens';
import { NotFoundError } from '@shared/errors/common-errors';
import { MaintenanceStatus } from '@shared/enums/maintenance.enum';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class CreateMaintenanceRequestUseCase implements ICreateMaintenanceRequestUseCase {
    constructor(
        @inject(TokenTypes.IMaintenanceRequestRepository)
        private readonly _maintenanceRepository: IMaintenanceRequestRepository,
        @inject(TokenTypes.IPropertyRepository)
        private readonly _propertyRepository: IPropertyRepository,
    ) {}

    async execute(
        tenantId: string,
        data: CreateMaintenanceRequestDTO,
    ): Promise<MaintenanceRequestEntity> {
        const property = await this._propertyRepository.findById(data.propertyId);
        if (!property) {
            throw new NotFoundError('Property not found');
        }

        const requestNumber = `REQ-${Date.now()}-${uuidv4().substring(0, 4).toUpperCase()}`;

        return this._maintenanceRepository.create({
            requestNumber,
            propertyId: data.propertyId,
            tenantId,
            ownerId: property.ownerId,
            issueType: data.issueType,
            issueTitle: data.issueTitle,
            issueDescription: data.issueDescription,
            urgencyLevel: data.urgencyLevel,
            photos: data.photos,
            preferredVisitDate: data.preferredVisitDate,
            preferredVisitTimeStart: data.preferredVisitTimeStart,
            preferredVisitTimeEnd: data.preferredVisitTimeEnd,
            availableAnytime: data.availableAnytime,
            status: MaintenanceStatus.PENDING,
        });
    }
}
