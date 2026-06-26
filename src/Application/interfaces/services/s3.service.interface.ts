export interface IS3Service {
    getUrl(key: string, contentType: string): Promise<string>;
    uploadFile(key: string, buffer: Buffer, contentType: string): Promise<string>;
}
