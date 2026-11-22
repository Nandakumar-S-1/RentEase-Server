import { AgreementResponseDTO } from '@application/dtos/agreement/res/agreement-response.dto';
import {
    CreateAgreementDTO,
    SignAgreementDTO,
    AddTenantRemarksDTO,
    TerminateAgreementDTO,
    UpdateDepositDTO,
    GetMyAgreementsDTO,
} from '@application/dtos/agreement/agreement.dto';

export interface ICreateAgreementUseCase {
    execute(dto: CreateAgreementDTO): Promise<AgreementResponseDTO>;
}

export interface IGetAgreementUseCase {
    execute(id: string): Promise<AgreementResponseDTO>;
}

export interface IGetMyAgreementsUseCase {
    execute(dto: GetMyAgreementsDTO): Promise<AgreementResponseDTO[]>;
}

export interface IGetAllAgreementsUseCase {
    execute(filters?: { status?: string; propertyId?: string }): Promise<AgreementResponseDTO[]>;
}

export interface ISignOwnerUseCase {
    execute(id: string, dto: SignAgreementDTO): Promise<void>;
}

export interface ISignTenantUseCase {
    execute(id: string, userId: string, dto: SignAgreementDTO): Promise<string>;
}

export interface IAddTenantRemarksUseCase {
    execute(id: string, dto: AddTenantRemarksDTO): Promise<void>;
}

export interface ISendToTenantUseCase {
    execute(id: string): Promise<void>;
}

export interface IGeneratePdfUseCase {
    execute(id: string): Promise<string>;
}

export interface ITerminateAgreementUseCase {
    execute(id: string, terminatedById: string, dto: TerminateAgreementDTO): Promise<void>;
}

export interface IUpdateDepositUseCase {
    execute(id: string, dto: UpdateDepositDTO): Promise<void>;
}

export interface IUploadTenantKycUseCase {
    execute(id: string, kycUrl: string): Promise<AgreementResponseDTO>;
}
