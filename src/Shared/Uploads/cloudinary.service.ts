import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const uploadToCloudinary = (buffer: Buffer, mimetype: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const resourceType = mimetype === 'application/pdf' ? 'raw' : 'image';

        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'rentease/owner-documents',
                resource_type: resourceType,
            },
            (error, result) => {
                if (error || !result) return reject(error ?? new Error('Cloudinary upload failed'));
                resolve(result.secure_url);
            },
        );

        stream.end(buffer);
    });
};
