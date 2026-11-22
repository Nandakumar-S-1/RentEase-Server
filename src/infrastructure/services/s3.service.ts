import { IS3Service } from '@application/interfaces/services/s3.service.interface';
import { injectable } from 'tsyringe';

@injectable()
export class S3Service implements IS3Service {
    async getUrl(_key: string, _contentType: string): Promise<string> {
        throw new Error('S3Service is deprecated. Use uploadToCloudinary from shared/uploads/cloudinary.service.ts');
    }

    async uploadFile(_key: string, _buffer: Buffer, _contentType: string): Promise<string> {
        throw new Error('S3Service is deprecated. Use uploadToCloudinary from shared/uploads/cloudinary.service.ts');
    }
}
