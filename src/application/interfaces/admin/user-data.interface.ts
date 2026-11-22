import {
    GetUserAgreementsInputDTO,
    GetUserAgreementsOutputDTO,
} from '@application/dtos/admin/user-agreements.dto';
import {
    GetUserPaymentsInputDTO,
    GetUserPaymentsOutputDTO,
} from '@application/dtos/admin/user-payments.dto';

export interface IGetUserAgreementsUseCase {
    execute(input: GetUserAgreementsInputDTO): Promise<GetUserAgreementsOutputDTO>;
}

export interface IGetUserPaymentsUseCase {
    execute(input: GetUserPaymentsInputDTO): Promise<GetUserPaymentsOutputDTO>;
}
