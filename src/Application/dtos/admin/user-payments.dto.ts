export interface GetUserPaymentsInputDTO {
    userId: string;
    page?: number;
    limit?: number;
}

export interface UserPaymentItemDTO {
    id: string;
    amount: number;
    status: string;
    category: string;
    dueDate: Date | null;
    paidDate: Date | null;
    createdAt: Date;
    agreement: {
        id: string;
        agreementNumber: string;
    };
}

export interface GetUserPaymentsOutputDTO {
    payments: UserPaymentItemDTO[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}
