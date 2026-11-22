import { ICreateUserDTO } from 'application/dtos/authentication/create-user-response.dto';
import { UserEntity } from 'core/entities/user.entity';

export interface ICreateUserUseCase {
    execute(dto: ICreateUserDTO): Promise<UserEntity>;
}
