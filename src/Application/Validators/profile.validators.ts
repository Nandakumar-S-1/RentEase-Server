import { z } from 'zod';

export const updateProfileSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters').optional(),
    phone: z.string().min(10, 'Phone must be at least 10 digits').optional(),
    bio: z.string().max(500, 'Bio must be under 500 characters').optional(),
    occupation: z.string().max(100).optional(),
});
