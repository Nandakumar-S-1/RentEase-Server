export interface IS3Service {
    getUrl(key: string, contentType: string): Promise<string>;
}
