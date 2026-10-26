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
    // latitude: number;
    // link: string;
    // longitude: number;
    latitude: number | null;
    link: string | null;
    longitude: number | null;
    bankInfo_RegularLicensingDocUrl?: string | null;
    managerInfo: {
        name: string;
        lastName?: string;
        countryCode: string;
        phoneNumber: string;
        email: string;
        password: string;
    },
    subDomainName: string;
}