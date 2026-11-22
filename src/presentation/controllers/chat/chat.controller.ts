import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { InitiateChatUseCase } from '@application/usecases/chat/initiate-chat.usecase';
import { GetMyChatsUseCase } from '@application/usecases/chat/get-my-chats.usecase';
import { GetChatMessagesUseCase } from '@application/usecases/chat/get-chat-messages.usecase';
import { SendMessageUseCase } from '@application/usecases/chat/send-message.usecase';
import { Http_StatusCodes } from '@shared/enums/http-status-codes.enum';
import { uploadToCloudinary } from '@shared/uploads/cloudinary.service';

@injectable()
export class ChatController {
    constructor(
        @inject(InitiateChatUseCase) private initiateChatUseCase: InitiateChatUseCase,
        @inject(GetMyChatsUseCase) private getMyChatsUseCase: GetMyChatsUseCase,
        @inject(GetChatMessagesUseCase) private getChatMessagesUseCase: GetChatMessagesUseCase,
        @inject(SendMessageUseCase) private sendMessageUseCase: SendMessageUseCase,
    ) {}

    initiateChat = async (req: Request, res: Response) => {
        try {
            const { ownerId, propertyId } = req.body;
            const tenantId = req.user?.id;

            if (!tenantId || !ownerId || !propertyId) {
                return res
                    .status(Http_StatusCodes.BAD_REQUEST)
                    .json({ success: false, message: 'Missing required fields' });
            }

            const chat = await this.initiateChatUseCase.execute(tenantId, ownerId, propertyId);
            return res.status(Http_StatusCodes.OK).json({ success: true, chat });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'An unexpected error occurred';
            return res
                .status(Http_StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ success: false, message });
        }
    };

    getMyChats = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res
                    .status(Http_StatusCodes.UN_AUTHORIZED)
                    .json({ success: false, message: 'Unauthorized' });
            }

            const chats = await this.getMyChatsUseCase.execute(userId);
            return res.status(Http_StatusCodes.OK).json({ success: true, chats });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'An unexpected error occurred';
            return res
                .status(Http_StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ success: false, message });
        }
    };

    getChatMessages = async (req: Request, res: Response) => {
        try {
            const chatId = req.params.chatId as string;
            const messages = await this.getChatMessagesUseCase.execute(chatId);
            return res.status(Http_StatusCodes.OK).json({ success: true, messages });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'An unexpected error occurred';
            return res
                .status(Http_StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ success: false, message });
        }
    };

    sendMessage = async (req: Request, res: Response) => {
        try {
            const { chatId, content, attachmentUrl, attachmentType } = req.body;
            const senderId = req.user?.id;

            if (!senderId || !chatId) {
                return res
                    .status(Http_StatusCodes.BAD_REQUEST)
                    .json({ success: false, message: 'Missing required fields' });
            }

            const savedMessage = await this.sendMessageUseCase.execute({
                chatId,
                senderId,
                content,
                attachmentUrl,
                attachmentType,
            });

            return res
                .status(Http_StatusCodes.CREATED)
                .json({ success: true, message: savedMessage });
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : 'An unexpected error occurred';
            return res
                .status(Http_StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ success: false, message: errorMessage });
        }
    };

    /**
     * POST /chat/upload-photo-urls
     * multipart/form-data, field: "file"
     * Uploads to Cloudinary, returns { fileUrl: string }
     */
    uploadChatPhotoUrls = async (req: Request, res: Response) => {
        try {
            if (!req.file) {
                return res
                    .status(Http_StatusCodes.BAD_REQUEST)
                    .json({ success: false, message: 'File required' });
            }

            const fileUrl = await uploadToCloudinary(
                req.file.buffer,
                req.file.mimetype,
                'rentease/chat',
            );

            return res.status(Http_StatusCodes.OK).json({ success: true, fileUrl });
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : 'An unexpected error occurred';
            return res
                .status(Http_StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ success: false, message: errorMessage });
        }
    };
}
