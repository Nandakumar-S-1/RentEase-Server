import { IHashService } from 'application/interfaces/services/hash.service.interface';
import bcrypt from 'bcrypt';

export class BcryptHashService implements IHashService {
    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }
    async compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}
