import { NotificationTypeData } from "@core/types/notification.types";
import { NotificationType } from "@shared/enums/notification-type.enum";


export class NotificationEntity {
    private constructor(
        private readonly _id:string,
        private readonly _userId:string,

        private readonly _notificationType:NotificationType,
        private readonly _title:string,
        private readonly _message:string,
        private readonly _notificationData:  Record<string, unknown> | null,

        private readonly _actionUrl:string|null,
        private readonly _relatedEntityType:string |null,
        private readonly _relatedEntityId:string|null,

        private  _isRead:boolean,
        private _readAt:Date|null,
        
        private readonly _sentThroughEmail:boolean,
        private readonly _sentThroughPushNote:boolean,
        private readonly _createdAt:Date
    ){}

    static create(data:NotificationTypeData):NotificationEntity{
        return new NotificationEntity(
            data.id,
            data.userId,
            data.notificationType,
            data.title,
            data.message,
            data.notificationData ??null,
            data.actionUrl??null,
            data.relatedEntityType??null,
            data.relatedEntityId??null,
            data.isRead??false,
            data.readAt??null,
            data.sentThroughEmail??false,
            data.sentThroughPushNote??false,
            data.createdAt ??new Date()
        )
    }

    get id(){
        return this._id
    }
    get userId(){
        return this._userId
    }
    get title(){
        return this._title
    }
    get message(){
        return this._message
    }
    get notificationType(){
        return this._notificationType
    }
    get isRead(){
        return this._isRead
    }
    get readAt(){
        return this._readAt
    }
    get notificationData(): Record<string, unknown> | null {
        return this._notificationData;
    }
    get actionUrl(){
        return this._actionUrl
    }
    get relatedEntityType(){
        return this._relatedEntityType
    }
    get relatedEntityId(){
        return this._relatedEntityId
    }
    get sentThroughEmail(){
        return this._sentThroughEmail
    }
    get sentThroughPush(){
        return this._sentThroughPushNote
    }
    get createdAt(){
        return this._createdAt
    }
    markAsRead():void{
        this._isRead=true
        this._readAt=new Date()
    }

}