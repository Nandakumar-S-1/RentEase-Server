import { inject, injectable } from 'tsyringe';
import { IChatRepository } from '@core/interfaces/repository/chat-repository.interface';
import { ISocketService } from '@application/interfaces/services/socket.service.interface';
import { SendMessageDto } from '@application/dtos/chat/chat.dto';
import { TokenTypes } from '@shared/types/tokens';
import { ISendMessageUseCase } from '@application/interfaces/chat/chat.usecase.interface';

@injectable()
export class SendMessageUseCase implements ISendMessageUseCase {
    constructor(
        @inject(TokenTypes.IChatRepository) private readonly _chatRepository: IChatRepository,
        @inject(TokenTypes.ISocketService) private readonly _socketService: ISocketService,
    ) {}

    async execute(data: SendMessageDto) {
        const message = await this._chatRepository.saveMessage(data);

        this._socketService.emitToRoom(data.chatId, 'receive_message', message);

        return message;
    }
}
