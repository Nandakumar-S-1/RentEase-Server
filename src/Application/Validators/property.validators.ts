import { z } from 'zod';
import { PropertyType } from '@shared/enums/property-type-status.enum';

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
