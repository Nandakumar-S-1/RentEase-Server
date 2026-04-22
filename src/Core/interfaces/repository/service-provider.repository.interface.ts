export interface ServiceProviderData {
    id: string;
    propertyId: string;
    providerType: string;
    providerName: string;
    phone: string;
    typicalChargesMin?: number | null;
    typicalChargesMax?: number | null;
    rating?: number | null;
    totalJobsCompleted?: number | null;
    isActive?: boolean | null;
}

export interface IServiceProviderRepository {
    create(data: Omit<ServiceProviderData, 'id'>): Promise<ServiceProviderData>;
    findByPropertyId(propertyId: string): Promise<ServiceProviderData[]>;
    delete(id: string): Promise<void>;
    updateStatus(id: string, isActive: boolean): Promise<void>;
}
