import { IGetAllUsersDTO } from "@application/Data-Transfer-Object/Admin/Res/GetAllUsersDTO";
import { IUserManagement } from "@application/Interfaces/Admin/IUserManagement";
import { UserEntity } from "@core/Entities/user.entity";
import { IUserRepository } from "@core/Interfaces/IUserRepository";
import { logger } from "@shared/Log/logger";
import { TokenTypes } from "@shared/Types/tokens";
import { inject, injectable } from "tsyringe";

@injectable()
export class UserManagementUseCase implements IUserManagement {
    constructor(
        @inject(TokenTypes.IUserRepository)
        private readonly userRepository: IUserRepository
    ) { }

    async getUsers(
        page: number = 1,
        limit: number = 10,
        role?: 'TENANT' | 'OWNER'
    ): Promise<{ users: IGetAllUsersDTO[]; total: number }> {
        logger.info(`Fetching all users for page ${page} with limit ${limit}`);

        const allUsers = await this.userRepository.findAll();
        let filteredUsers = allUsers;

        if (role) {
            filteredUsers = allUsers.filter((user: UserEntity) => user.role === role);
        }

        const total = filteredUsers.length;
        const skippable = (page - 1) * limit;
        const paginated = filteredUsers.slice(skippable, skippable + limit);

        const response: IGetAllUsersDTO[] = paginated.map(user => ({
            id: user.id,
            email: user.email,
            fullname: user.fullname,
            phone: user.phone,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            isActive: user.isActive,
            isSuspended: user.isSuspended,
            createdAt: user.createdAt || new Date()
        }));

        return { users: response, total };
    }

    async suspendUser(userId: string): Promise<void> {
        logger.info(`Suspending user: ${userId}`);
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        user.suspendUser();
        await this.userRepository.update(user.id, user);
    }

    async activateUser(userId: string): Promise<void> {
        logger.info(`Activating user: ${userId}`);
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        user.activateUser();
        user.unSuspendUser(); // Ensure it's not suspended if activated
        await this.userRepository.update(user.id, user);
    }

    async deactivateUser(userId: string): Promise<void> {
        logger.info(`Deactivating user: ${userId}`);
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        user.deactivateUser();
        await this.userRepository.update(user.id, user);
    }
}