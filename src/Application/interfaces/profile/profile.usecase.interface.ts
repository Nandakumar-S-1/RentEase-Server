import { UpdateProfileDTO } from 'application/dtos/profile/update-profile.dto';

export interface IGetProfileUseCase {
    execute(userId: string, role: string): Promise<Record<string, unknown>>;
}

export interface IUpdateProfileUseCase {
    execute(dto: UpdateProfileDTO): Promise<Record<string, unknown>>;
}
