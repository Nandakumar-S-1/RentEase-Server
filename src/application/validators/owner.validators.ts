import { z } from 'zod';

export const submitVerificationSchema = z.object({
    documentType: z.enum(['PAN', 'AADHAAR'], {
        message: 'Document type must be PAN or AADHAAR',
    }),
});

export const reviewVerificationSchema = z
    .object({
        status: z.enum(['VERIFIED', 'REJECTED']),
        rejectionReason: z.string().min(5, 'Reason must be at least 5 characters').optional(),
    })
    .refine((data) => data.status !== 'REJECTED' || data.rejectionReason, {
        message: 'Rejection reason is required when status is REJECTED',
        path: ['rejectionReason'],
    });
