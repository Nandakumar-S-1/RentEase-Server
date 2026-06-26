import { inject, injectable } from 'tsyringe';
import { IChatRepository } from '@core/interfaces/repository/chat-repository.interface';
import { TokenTypes } from '@shared/types/tokens';
import { IGetChatMessagesUseCase } from '@application/interfaces/chat/chat.usecase.interface';

@injectable()
export class GetChatMessagesUseCase implements IGetChatMessagesUseCase {
    constructor(@inject(TokenTypes.IChatRepository) private readonly _chatRepository: IChatRepository) {}

    async execute(chatId: string) {
        return this._chatRepository.getMessagesForChat(chatId);
    }
}
