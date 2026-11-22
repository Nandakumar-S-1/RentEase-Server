export interface GetAllAgreementsInputDTO {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
}

export interface AgreementListItemDTO {
    id: string;
    agreementNumber: string;
    status: string;
    startDate: Date;
    endDate: Date;
    monthlyRent: number;
    depositAmount: number;
    createdAt: Date;
    owner: {
        id: string;
        fullName: string;
        email: string;
    };
    tenant: {
        id: string;
        fullName: string;
        email: string;
    } | null;
    property: {
        id: string;
        title: string;
        locationCity: string;
    };
}

export interface GetAllAgreementsOutputDTO {
    agreements: AgreementListItemDTO[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}
