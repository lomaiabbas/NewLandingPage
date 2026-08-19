import { LiteEntityDto, LocationType } from "../../dto";

export interface GetAllPayload {
    name?: string;
    maxResultCount?: number
    skipCount?: number;
    isActive?: boolean;
    parentId?: number;
    type?: LocationType;
}

export interface SimpleCountryDto {
    value: string;
    text: string;
    flag: string;
}

export interface LocationDto {
    id: number;
    arName: string;
    enName: string;
    name: string;
    isActive: boolean;
    parentId: number;
    parent: LiteEntityDto;
    flag: string;
    childrenCount: number;
    country: SimpleCountryDto;
}

export interface CreateOrUpdateLocationDto{
    arName: string;
    enName: string;
    parentId: number;
    flag: string;
}