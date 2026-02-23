export interface IFirebaseService{
    verifyIdToken(token:string):Promise<{email:string,fullname:string}>
}