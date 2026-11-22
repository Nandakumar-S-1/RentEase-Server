import {
    GetAllPaymentsInputDTO,
    GetAllPaymentsOutputDTO,
} from '@application/dtos/admin/admin-payments.dto';

export interface IGetAllPaymentsUseCase {
    execute(input: GetAllPaymentsInputDTO): Promise<GetAllPaymentsOutputDTO>;
}
