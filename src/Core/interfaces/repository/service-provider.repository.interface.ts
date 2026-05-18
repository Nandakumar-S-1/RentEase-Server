export interface ServiceProviderData {
    id: string;
    propertyId: string;
    providerType: string;
    providerName: string;
    phone: string;
    typicalChargesMin: number | null;
    typicalChargesMax: number | null;
    rating: number;
    totalJobsCompleted: number;
    isActive: boolean;
}

export interface IServiceProviderRepository {
    create(data: Omit<ServiceProviderData, 'id'>): Promise<ServiceProviderData>;
    findByPropertyId(
        propertyId: string,
        skip?: number,
        limit?: number,
    ): Promise<ServiceProviderData[]>;
    countByPropertyId(propertyId: string): Promise<number>;
    delete(id: string): Promise<void>;
    updateStatus(id: string, isActive: boolean): Promise<void>;
}
