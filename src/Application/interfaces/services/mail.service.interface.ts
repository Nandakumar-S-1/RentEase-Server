export interface IMailService {
    sendMail(to: string, subject: string, html: string): Promise<void>;
}

//this can be called as the interface segregation principle.

//because we are not forcing the user to implement all the methods
// of the interface , we are only forcing the user to implement the methods that are required for the user.
