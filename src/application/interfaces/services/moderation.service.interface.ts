export type ModerationStatus = 'SAFE' | 'UNSAFE' | 'UNCERTAIN';

export interface ModerationResult {
    status: ModerationStatus;
    reason?: string;
}

export interface IModerationService {
    checkImage(imageBuffer: Buffer): Promise<ModerationResult>;
}
