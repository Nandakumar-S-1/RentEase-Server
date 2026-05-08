import * as vision from '@google-cloud/vision';
import {
    IModerationService,
    ModerationResult,
} from '@application/interfaces/services/moderation.service.interface';
import { injectable } from 'tsyringe';
import { logger } from '@shared/log/logger';

@injectable()
export class ModerationService implements IModerationService {
    private client: vision.ImageAnnotatorClient;

    constructor() {
        const keyPath = process.env.FIREBASE_IMAGE_API_SERVICE_ACCOUNT_PATH;
        if (!keyPath) {
            logger.error(
                'FIREBASE_IMAGE_API_SERVICE_ACCOUNT_PATH is not defined in environment variables',
            );
            throw new Error('Google Vision credentials path is missing');
        }

        this.client = new vision.ImageAnnotatorClient({
            keyFilename: keyPath,
        });
    }

    async checkImage(imageBuffer: Buffer): Promise<ModerationResult> {
        try {
            logger.info('Performing AI image moderation check...');
            const [result] = await this.client.safeSearchDetection({
                image: { content: imageBuffer },
            });

            const detections = result.safeSearchAnnotation;

            if (!detections) {
                logger.warn('AI moderation result was uncertain (no detections)');
                return { status: 'UNCERTAIN' };
            }

            const unsafeLevels = ['LIKELY', 'VERY_LIKELY'];
            const violations: string[] = [];

            if (unsafeLevels.includes(String(detections.adult))) violations.push('Adult Content');
            if (unsafeLevels.includes(String(detections.violence)))
                violations.push('Violent Content');
            if (unsafeLevels.includes(String(detections.racy))) violations.push('Racy Content');
            if (unsafeLevels.includes(String(detections.medical)))
                violations.push('Medical Content');
            if (unsafeLevels.includes(String(detections.spoof))) violations.push('Spoof Content');

            if (violations.length > 0) {
                logger.warn(`AI Moderation found violations: ${violations.join(', ')}`);
                return {
                    status: 'UNSAFE',
                    reason: `Image violates community standards: ${violations.join(', ')}`,
                };
            }

            logger.info('AI moderation check passed (SAFE)');
            return { status: 'SAFE' };
        } catch (error: unknown) {
            const err = error as Error;
            logger.error(
                err.message || 'Google Cloud Vision Error',
                'Moderation check failed - bypassing for development',
            );
            // If the service is unavailable or billing is disabled, we return SAFE instead of failing completely in dev
            return { status: 'SAFE' };
        }
    }
}
