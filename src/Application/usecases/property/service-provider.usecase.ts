import { IServiceProviderUseCase } from '@application/interfaces/property/property.usecase.interface';
import {
    CreateServiceProviderDTO,
    ServiceProviderResponseDTO,
} from '@application/dtos/property/service-provider.dto';
import { IServiceProviderRepository } from '@core/interfaces/repository/service-provider.repository.interface';
import { TokenTypes } from '@shared/types/tokens';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ServiceProviderUseCase implements IServiceProviderUseCase {
    constructor(
        @inject(TokenTypes.IServiceProviderRepository)
        private readonly _providerRepo: IServiceProviderRepository,
    ) {}

    async addProvider(data: CreateServiceProviderDTO): Promise<ServiceProviderResponseDTO> {
        return await this._providerRepo.create({
            ...data,
            typicalChargesMin: data.typicalChargesMin ?? null,
            typicalChargesMax: data.typicalChargesMax ?? null,
            isActive: true,
            rating: 0,
            totalJobsCompleted: 0,
        });
    }

    async getProvidersByProperty(propertyId: string): Promise<ServiceProviderResponseDTO[]> {
        return await this._providerRepo.findByPropertyId(propertyId);
    }

    async deleteProvider(id: string): Promise<void> {
        await this._providerRepo.delete(id);
    }

    async toggleProviderStatus(id: string, isActive: boolean): Promise<void> {
        await this._providerRepo.updateStatus(id, isActive);
    }
}
