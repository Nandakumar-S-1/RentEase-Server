import { inject, injectable } from 'tsyringe';
import { IChatRepository } from '@core/interfaces/repository/chat-repository.interface';
import { TokenTypes } from '@shared/types/tokens';
import { IInitiateChatUseCase } from '@application/interfaces/chat/chat.usecase.interface';

@injectable()
export class InitiateChatUseCase implements IInitiateChatUseCase {
    constructor(@inject(TokenTypes.IChatRepository) private readonly _chatRepository: IChatRepository) {}

    async execute(tenantId: string, ownerId: string, propertyId: string) {
        let chat = await this._chatRepository.findChatBetweenUsersForProperty(
            tenantId,
            ownerId,
            propertyId,
        );
        if (!chat) {
            chat = await this._chatRepository.create({
                participant1Id: tenantId,
                participant2Id: ownerId,
                propertyId,
            });
        }
        return chat;
    }
}
