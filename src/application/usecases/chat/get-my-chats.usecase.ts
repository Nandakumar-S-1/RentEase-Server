import { inject, injectable } from 'tsyringe';
import { IChatRepository } from '@core/interfaces/repository/chat-repository.interface';
import { TokenTypes } from '@shared/types/tokens';
import { IGetMyChatsUseCase } from '@application/interfaces/chat/chat.usecase.interface';

@injectable()
export class GetMyChatsUseCase implements IGetMyChatsUseCase {
    constructor(@inject(TokenTypes.IChatRepository) private readonly _chatRepository: IChatRepository) {}

    async execute(userId: string) {
        return this._chatRepository.getChatsForUser(userId);
    }
}
