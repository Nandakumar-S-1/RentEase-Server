export class AmenityEntity {
    private constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly iconUrl: string | null,
        public readonly isApproved: boolean,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {}

    static create(data: Partial<AmenityEntity> & { id: string, name: string }): AmenityEntity {
        return new AmenityEntity(
            data.id,
            data.name,
            data.iconUrl ?? null,
            data.isApproved ?? true,
            data.createdAt ?? new Date(),
            data.updatedAt ?? new Date()
        );
    }
}
