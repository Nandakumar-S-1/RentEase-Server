import { IGetUsersRequestDTO } from 'application/dtos/admin/request/get-users-request.dto';
import { IGetAllUsersDTO } from 'application/dtos/admin/response/get-all-users-response.dto';
import { IUserManagement } from 'application/interfaces/admin/user-management.interface';
import { UserEntity } from 'core/entities/user.entity';
import { IUserRepository } from 'core/interfaces/user-repository.interface';
import { logger } from 'shared/log/logger';
import { TokenTypes } from 'shared/types/tokens';
import { inject, injectable } from 'tsyringe';

@injectable()
export class UserManagementUseCase implements IUserManagement {
    constructor(
        @inject(TokenTypes.IUserRepository)
        private readonly _userRepository: IUserRepository,
    ) {}
    async getUsers(dto: IGetUsersRequestDTO): Promise<{ users: IGetAllUsersDTO[]; total: number }> {
        const { page = 1, limit = 10, role } = dto;

        logger.info(`Fetching users page ${page}, limit ${limit}`);

        const allUsers = await this._userRepository.findAll();

        let filteredUsers = allUsers;

        if (role) {
            filteredUsers = allUsers.filter((user: UserEntity) => user.role === role);
        }

        const total = filteredUsers.length;

        const skippable = (page - 1) * limit;

        const paginated = filteredUsers.slice(skippable, skippable + limit);

        const response: IGetAllUsersDTO[] = paginated.map((user) => ({
            id: user.id,
            email: user.email,
            fullname: user.fullname,
            phone: user.phone,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            isActive: user.isActive,
            isSuspended: user.isSuspended,
            createdAt: user.createdAt || new Date(),
        }));

        return { users: response, total };
    }

    async suspendUser(userId: string): Promise<void> {
        logger.info(`Suspending user: ${userId}`);
        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        user.suspendUser();
        await this._userRepository.update(user.id, user);
    }

    async activateUser(userId: string): Promise<void> {
        logger.info(`Activating user: ${userId}`);
        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        user.activateUser();
        user.unSuspendUser();
        await this._userRepository.update(user.id, user);
    }

    async deactivateUser(userId: string): Promise<void> {
        logger.info(`Deactivating user: ${userId}`);
        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        user.deactivateUser();
        await this._userRepository.update(user.id, user);
    }
}
