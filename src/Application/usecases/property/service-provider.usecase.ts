import { ServiceProviderData } from '@core/interfaces/repository/service-provider.repository.interface';

export interface IServiceProviderUseCase {
    addProvider(data: Omit<ServiceProviderData, 'id'>): Promise<ServiceProviderData>;
    getProvidersByProperty(propertyId: string): Promise<ServiceProviderData[]>;
    deleteProvider(id: string): Promise<void>;
    toggleProviderStatus(id: string, isActive: boolean): Promise<void>;
}

import { IServiceProviderRepository } from '@core/interfaces/repository/service-provider.repository.interface';
import { TokenTypes } from '@shared/types/tokens';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ServiceProviderUseCase implements IServiceProviderUseCase {
    constructor(
        @inject(TokenTypes.IServiceProviderRepository)
        private readonly _providerRepo: IServiceProviderRepository,
    ) {}

    async addProvider(data: Omit<ServiceProviderData, 'id'>): Promise<ServiceProviderData> {
        return await this._providerRepo.create(data);
    }

    async getProvidersByProperty(propertyId: string): Promise<ServiceProviderData[]> {
        return await this._providerRepo.findByPropertyId(propertyId);
    }

    async deleteProvider(id: string): Promise<void> {
        await this._providerRepo.delete(id);
    }

    async toggleProviderStatus(id: string, isActive: boolean): Promise<void> {
        await this._providerRepo.updateStatus(id, isActive);
    }
}
