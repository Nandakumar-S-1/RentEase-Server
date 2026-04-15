import { IS3Service } from "@application/interfaces/services/s3.service.interface";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3b = new S3Client({
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY!,
        secretAccessKey:process.env.AWS_SECRET_KEY!
    }
})

export class S3Service implements IS3Service{
    async getUrl(key: string, contentType: string): Promise<string> {
        const result = new PutObjectCommand({
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:key,
            ContentType:contentType
        })
        const uploadUrl = await getSignedUrl(s3b,result,{
            expiresIn:Number(process.env.S3_EXPIRY_TIME)
        })
        return uploadUrl
    }   
}