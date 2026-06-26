import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { InitiateChatUseCase } from '@application/usecases/chat/initiate-chat.usecase';
import { GetMyChatsUseCase } from '@application/usecases/chat/get-my-chats.usecase';
import { GetChatMessagesUseCase } from '@application/usecases/chat/get-chat-messages.usecase';
import { SendMessageUseCase } from '@application/usecases/chat/send-message.usecase';
import { Http_StatusCodes } from '@shared/enums/http-status-codes.enum';
import { IS3Service } from '@application/interfaces/services/s3.service.interface';
import { TokenTypes } from '@shared/types/tokens';
import crypto from 'crypto';

@injectable()
export class ChatController {
    constructor(
        @inject(InitiateChatUseCase) private initiateChatUseCase: InitiateChatUseCase,
        @inject(GetMyChatsUseCase) private getMyChatsUseCase: GetMyChatsUseCase,
        @inject(GetChatMessagesUseCase) private getChatMessagesUseCase: GetChatMessagesUseCase,
        @inject(SendMessageUseCase) private sendMessageUseCase: SendMessageUseCase,
        @inject(TokenTypes.IS3Service) private _s3Service: IS3Service,
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

    uploadChatPhotoUrls = async (req: Request, res: Response) => {
        try {
            const userId = req.user!.id;
            const { files } = req.body as {
                files?: Array<{ fileName: string; contentType: string }>;
            };

            if (!Array.isArray(files) || files.length === 0) {
                return res
                    .status(Http_StatusCodes.BAD_REQUEST)
                    .json({ success: false, message: 'Files required' });
            }

            const awsBucket = process.env.AWS_BUCKET_NAME;
            const awsRegion = process.env.AWS_REGION;
            if (!awsBucket || !awsRegion) {
                return res
                    .status(Http_StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ success: false, message: 'S3 Config Error' });
            }

            const uploads = await Promise.all(
                files.map(async (file, index) => {
                    const safeFileName = (file.fileName || `chat-file-${index}`).replace(
                        /[^a-zA-Z0-9._-]/g,
                        '',
                    );

                    const key = `rentease/chat/${userId}/${crypto.randomUUID()}-${safeFileName}`;
                    const uploadUrl = await this._s3Service.getUrl(
                        key,
                        file.contentType || 'application/octet-stream',
                    );

                    const publicUrl = `https://${awsBucket}.s3.${awsRegion}.amazonaws.com/${key}`;
                    return { key, uploadUrl, publicUrl };
                }),
            );

            return res.status(Http_StatusCodes.OK).json({ success: true, uploads });
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : 'An unexpected error occurred';
            return res
                .status(Http_StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ success: false, message: errorMessage });
        }
    };
}
