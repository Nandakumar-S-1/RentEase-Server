import { ICreateUserDTO } from '@application/Data-Transfer-Object/Authentication/ICreateUserDTO';
import { UserEntity } from '@core/Entities/user.entity';

export interface ICreateUserUseCase {
  execute(dto: ICreateUserDTO): Promise<UserEntity>;
}
