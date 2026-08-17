export class OwnerRequestEntity {
    private constructor(
        public readonly id: string,
        public readonly ownerId: string,
        public readonly requestType: string,
        public readonly title: string,
        public readonly description: string,
        public readonly status: string,
        public readonly resolvedByAdminId: string | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {}

    static create(data: Partial<OwnerRequestEntity> & { id: string, ownerId: string, requestType: string, title: string, description: string }): OwnerRequestEntity {
        return new OwnerRequestEntity(
            data.id,
            data.ownerId,
            data.requestType,
            data.title,
            data.description,
            data.status ?? 'PENDING',
            data.resolvedByAdminId ?? null,
            data.createdAt ?? new Date(),
            data.updatedAt ?? new Date()
        );
    }
}
