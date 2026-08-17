export interface CreateAmenityDTO {
    name: string;
    iconUrl?: string;
    isApproved?: boolean;
}

export interface UpdateAmenityDTO {
    name?: string;
    iconUrl?: string;
    isApproved?: boolean;
}
