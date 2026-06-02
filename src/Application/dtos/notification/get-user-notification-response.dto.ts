export interface INotificationResponseDTO{
    id:string,
    notificationType: string,
    title:string,
    message:string,
    isRead:boolean,
    createdAt:Date
}