import { ServiceProviderData } from '@core/interfaces/repository/service-provider.repository.interface';
import { ServiceProvider, Prisma } from '@prisma/client';

export class ServiceProviderPersistenceMapper {
    static toData(p: ServiceProvider): ServiceProviderData {
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

    static toPrismaCreate(
        data: Omit<ServiceProviderData, 'id'>,
    ): Prisma.ServiceProviderCreateInput {
        return {
            property: { connect: { id: data.propertyId } },
            provider_type: data.providerType,
            provider_name: data.providerName,
            phone: data.phone,
            typical_charges_min: data.typicalChargesMin
                ? new Prisma.Decimal(data.typicalChargesMin)
                : null,
            typical_charges_max: data.typicalChargesMax
                ? new Prisma.Decimal(data.typicalChargesMax)
                : null,
            is_active: data.isActive ?? true,
        };
    }
}
