export interface CreateServiceProviderDTO {
    propertyId: string;
    providerType: string;
    providerName: string;
    phone: string;
    typicalChargesMin?: number;
    typicalChargesMax?: number;
}

export interface ServiceProviderResponseDTO {
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
