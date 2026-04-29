import {
    IServiceProviderRepository,
    ServiceProviderData,
} from '@core/interfaces/repository/service-provider.repository.interface';
import { prisma } from '@infrastructure/database/prisma/prisma.client';
import { ServiceProvider } from '@prisma/client';
import { injectable } from 'tsyringe';

@injectable()
export class ServiceProviderRepository implements IServiceProviderRepository {
    async create(data: Omit<ServiceProviderData, 'id'>): Promise<ServiceProviderData> {



        const result = await prisma.serviceProvider.create({
            data: {
                property_id: data.propertyId,
                provider_type: data.providerType,
                provider_name: data.providerName,
                phone: data.phone,
                typical_charges_min: data.typicalChargesMin,
                typical_charges_max: data.typicalChargesMax,
                is_active: data.isActive ?? true,
            },
        });
        return this._toData(result);
    }

    async findByPropertyId(propertyId: string): Promise<ServiceProviderData[]> {
        const results = await prisma.serviceProvider.findMany({
            where: { property_id: propertyId },
            orderBy: { created_at: 'desc' },
        });
        return results.map((r) => this._toData(r));
    }

    async delete(id: string): Promise<void> {
        await prisma.serviceProvider.delete({
            where: { id },
        });
    }

    async updateStatus(id: string, isActive: boolean): Promise<void> {
        await prisma.serviceProvider.update({
            where: { id },
            data: { is_active: isActive },
        });
    }

    private _toData(p: ServiceProvider): ServiceProviderData {
        return {
            id: p.id,
            propertyId: p.property_id,
            providerType: p.provider_type,
            providerName: p.provider_name,
            phone: p.phone,
            typicalChargesMin: p.typical_charges_min ? Number(p.typical_charges_min) : null,
            typicalChargesMax: p.typical_charges_max ? Number(p.typical_charges_max) : null,
            rating: p.rating ? Number(p.rating) : 0,
            totalJobsCompleted: p.total_jobs_completed || 0,
            isActive: p.is_active ?? true,
        };
    }
}
