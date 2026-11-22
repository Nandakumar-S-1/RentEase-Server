
import { IFirebaseService } from '@application/interfaces/services/firebase.service.interface';
import * as admin from 'firebase-admin';

export class FirebaseService implements IFirebaseService {
    constructor() {
        if (!admin.apps.length) {
            const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
            const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

            if (serviceAccountJson) {
                const serviceAccount = JSON.parse(serviceAccountJson);

                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                });
            } else if (serviceAccountPath) {
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccountPath),
                });
            } else {
                throw new Error(
                    'Firebase credentials are not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH.',
                );
            }
        }
    }

    async verifyIdToken(token: string): Promise<{ email: string; fullname: string }> {
        const decodedToken = await admin.auth().verifyIdToken(token);

        return {
            email: decodedToken.email!,
            fullname: decodedToken.name || 'Google User',
        };
    }
}


// import { IFirebaseService } from '@application/interfaces/services/firebase.service.interface';
// import * as admin from 'firebase-admin';

// export class FirebaseService implements IFirebaseService {
//     constructor() {
//         if (!admin.apps.length) {
//             admin.initializeApp({
//                 credential: admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT_PATH!),
//             });
//         }
//     }

//     async verifyIdToken(token: string): Promise<{ email: string; fullname: string }> {
//         const decoddedToken = await admin.auth().verifyIdToken(token);
//         return {
//             email: decoddedToken.email!,
//             fullname: decoddedToken.name || 'Google User',
//         };
//     }
// }
