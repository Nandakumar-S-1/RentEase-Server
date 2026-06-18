export interface GetUserAgreementsInputDTO {
    userId: string;
    role: string;
    page?: number;
    limit?: number;
}

export interface UserAgreementItemDTO {
    id: string;
    agreementNumber: string;
    status: string;
    startDate: Date;
    endDate: Date;
    monthlyRent: number;
    property: {
        id: string;
        title: string;
        locationCity: string;
    };
    counterParty: {
        id: string;
        fullName: string;
        email: string;
    };
}

export interface GetUserAgreementsOutputDTO {
    agreements: UserAgreementItemDTO[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}
