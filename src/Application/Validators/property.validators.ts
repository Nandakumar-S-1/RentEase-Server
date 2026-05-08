import { z } from 'zod';
import { PropertyType } from '@shared/enums/property-type-status.enum';

const SERVICE_PROVIDER_TYPES = [
    'Electrician',
    'Plumber',
    'Cleaner',
    'Painter',
    'Carpenter',
    'Pest Control',
    'AC Service',
    'Gardener',
    'Security',
    'Other',
] as const;

const title = z
    .string()
    .trim()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title cannot exceed 100 characters');

const description = z
    .string()
    .trim()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description cannot exceed 2000 characters');

const locationField = z
    .string()
    .trim()
    .min(2, 'Location field must be at least 2 characters')
    .max(100, 'Location field cannot exceed 100 characters');

export const createPropertySchema = z.object({
    title,
    description,
    propertyType: z.nativeEnum(PropertyType),
    locationDistrict: locationField,
    locationCity: locationField,
    locationPinCode: z.string().regex(/^\d{6}$/, 'Pin code must be exactly 6 digits'),
    fullAddress: z.string().min(10, 'Address is too short'),
    monthlyRent: z.number().positive('Rent must be a positive number'),
    depositAmount: z.number().positive('Deposit must be a positive number'),
    photos: z.array(z.string().url()).min(1, 'At least one photo is required'),
    areaSqft: z.number().positive('Area must be a positive number').optional().nullable(),
    latitude: z.number().optional().nullable(),
    longitude: z.number().optional().nullable(),
    nearbyLandmarks: z.string().max(200).optional().nullable(),
    primaryPhotoIndex: z.number().int().min(0).default(0),
});

export const propertyFilterSchema = z.object({
    query: z.string().trim().max(100).optional().nullable(),
    city: z.string().trim().max(100).optional().nullable(),
    propertyType: z.string().optional().nullable(),
    minRent: z.preprocess((v) => (v ? Number(v) : undefined), z.number().positive().optional()),
    maxRent: z.preprocess((v) => (v ? Number(v) : undefined), z.number().positive().optional()),
    minArea: z.preprocess((v) => (v ? Number(v) : undefined), z.number().positive().optional()),
    maxArea: z.preprocess((v) => (v ? Number(v) : undefined), z.number().positive().optional()),
    bhk: z.preprocess(
        (v) => (v ? Number(v) : undefined),
        z.number().int().min(1).max(20).optional(),
    ),
    page: z.preprocess((v) => (v ? Number(v) : 1), z.number().int().min(1).optional()),
    limit: z.preprocess((v) => (v ? Number(v) : 10), z.number().int().min(1).max(100).optional()),
});

export const createServiceProviderSchema = z
    .object({
        propertyId: z.string(),
        providerType: z.enum(SERVICE_PROVIDER_TYPES),
        providerName: z.string().trim().min(3, 'Name must be at least 3 characters').max(100, 'Name is too long'),
        phone: z.string().trim().regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone number (minimum 10 digits)'),
        typicalChargesMin: z.preprocess(
            (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
            z.coerce.number().nonnegative('Charges cannot be negative').optional(),
        ),
        typicalChargesMax: z.preprocess(
            (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
            z.coerce.number().nonnegative('Charges cannot be negative').optional(),
        ),
    })
    .refine(
        (data) => {
            if (data.typicalChargesMin !== undefined && data.typicalChargesMax !== undefined) {
                return data.typicalChargesMax > data.typicalChargesMin;
            }
            return true;
        },
        {
            message: 'Max charge must be greater than min charge',
            path: ['typicalChargesMax'],
        },
    );
