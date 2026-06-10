export interface GetAllPaymentsInputDTO {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
}

export interface PaymentListItemDTO {
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
    payer: {
        id: string;
        fullName: string;
        email: string;
    };
}

export interface GetAllPaymentsOutputDTO {
    payments: PaymentListItemDTO[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}
