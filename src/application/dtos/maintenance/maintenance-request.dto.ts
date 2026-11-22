import { MaintenanceUrgency } from '@shared/enums/maintenance.enum';

export interface CreateMaintenanceRequestDTO {
    propertyId: string;
    issueType: string;
    issueTitle: string;
    issueDescription: string;
    urgencyLevel: MaintenanceUrgency;
    photos: string[];
    preferredVisitDate?: Date;
    preferredVisitTimeStart?: Date;
    preferredVisitTimeEnd?: Date;
    availableAnytime?: boolean;
}

export interface AssignServiceProviderDTO {
    requestId: string;
    providerId: string;
    ownerId: string;
}

export interface UpdateMaintenanceStatusDTO {
    requestId: string;
    status: string;
    ownerId: string;
}
