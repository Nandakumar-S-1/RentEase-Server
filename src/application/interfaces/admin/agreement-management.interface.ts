import {
    GetAllAgreementsInputDTO,
    GetAllAgreementsOutputDTO,
} from '@application/dtos/admin/admin-agreements.dto';

export interface IGetAllAgreementsUseCase {
    execute(input: GetAllAgreementsInputDTO): Promise<GetAllAgreementsOutputDTO>;
}
