import { ActiveStatus } from '../../dto'

export interface GetAllPayload {
  name?: string
  status?: ActiveStatus
  maxResultCount?: number
  skipCount?: number
  isActive?: boolean
}

export interface CountryCodeDto {
  id: number
  name: string
  arName: string
  enName: string
  iso2Code: string
  isActive: boolean
  dialCode: string
}
