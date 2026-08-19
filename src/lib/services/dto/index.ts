export interface PagedResultDto<T> {
  totalCount: number
  items: T[]
}

export enum ActiveStatus {
  Inactive = 0,
  Active = 1,
}

export enum PaymentStatus {
  Failure = 0,
  Paid = 1,
  Pending = 2,
}

export enum PaymentMethod {
  Cash = 0,
  Credit = 1,
  PayPal = 2,
  TopUp = 3,
}

export enum LocationType {
  Country = 0,
  City = 1,
}

export enum ApplicationRequestStatus {
  InReview = 0,
  Verified = 1,
  Rejected = 2,
  WaitingForApproval = 3,
}
export enum ApplicationRequestActionName {
  Created = 0,
  Verified = 1,
  CompletedInfo = 2,
  Rejected = 3,
  UpdatedInfo = 4,
}
export interface LiteEntityDto {
  value: string
  text: string
}

export enum IndustryType {
  Agriculture = 0,
  Automotive = 1,
  Banking = 2,
  Biotechnology = 3,
  Construction,
  Consulting,
  ConsumerGoods,
  Education,
  Energy,
  Entertainment,
  EnvironmentalServices,
  Finance,
  FoodBeverage,
  Government,
  Healthcare,
  Hospitality,
  InformationTechnology,
  Insurance,
  Legal,
  Logistics,
  Manufacturing,
  Media,
  Mining,
  Nonprofit,
  Pharmaceutical,
  RealEstate,
  Recruitment,
  Retail,
  ScienceResearch,
  Software,
  Telecommunications,
  Transportation,
  Utilities,
  Warehousing,
  Wholesale,
  Other,
  EventsManagementEInvitations,
}
