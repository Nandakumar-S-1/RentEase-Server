export enum MaintenanceStatus {
    PENDING = 'PENDING',
    ASSIGNED = 'ASSIGNED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    VERIFIED = 'VERIFIED',
    DISPUTED = 'DISPUTED',
    CANCELLED = 'CANCELLED',
}

export enum MaintenanceUrgency {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL',
}
