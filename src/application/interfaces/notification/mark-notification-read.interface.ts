export interface IMarkNotificationReadUseCase {
    execute(userId: string, notificationId: string): Promise<void>;
}

export interface IMarkAllNotificationsReadUseCase {
    execute(userId: string): Promise<void>;
}
