import { UpdateProfileDTO } from 'application/dtos/profile/update-profile.dto';
import { ChangePasswordDTO } from 'application/dtos/profile/change-password-request.dto';

export interface IGetProfileUseCase {
    execute(userId: string, role: string): Promise<Record<string, unknown>>;
}

export interface IUpdateProfileUseCase {
    execute(dto: UpdateProfileDTO): Promise<Record<string, unknown>>;
}

export interface IChangePasswordUseCase {
    execute(userId: string, dto: ChangePasswordDTO): Promise<void>;
}
