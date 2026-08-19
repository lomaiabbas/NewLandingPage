import { ActiveStatus, IndustryType } from "../../dto";

export interface GetAllPayload {
    name?: string;
    code?: string;
    phoneNumber?: string;
    maxResultCount?: number
    skipCount?: number
    sorting?: string;
    status?: ActiveStatus;
    industry?: IndustryType;
}

export interface SignupDto {
    address: string;
    arName: string;
    cityId: number;
    commercialNumber: string;
    commercialNumberIssuanceDate: Date;
    enName: string;
    latitude: number;
    link: string;
    longitude: number;
    managerInfo: {
        name: string;
        countryCode: string;
        phoneNumber: string;
        email: string;
        password: string;
    },
    subDomainName: string;
}