import { IFirebaseService } from "@application/Interfaces/Services/IFirebaseService";
import * as admin from 'firebase-admin'

export class FirebaseService implements IFirebaseService{
    constructor(){
        if(!admin.apps.length){
            admin.initializeApp({
                credential:admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT_PATH!)
            })
        }
    }

        async verifyIdToken(token: string): Promise<{ email: string; fullname: string; }> {
            const decoddedToken = await admin.auth().verifyIdToken(token)
            return{
                email:decoddedToken.email!,
                fullname:decoddedToken.name || 'Google User'
            }
        }
}

