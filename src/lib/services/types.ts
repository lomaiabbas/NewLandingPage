export enum ChatUserType {
  Client = 0,
  Team,
  Company,
  ApiClient,
  ExternalClient,
}

export enum MessageStatus {
  Pending = 0,
  Sent,
  Delivered,
  Read,
  Failed,
  AwaitingReengagement,
  // Phone number related failures
  FailedInvalidPhoneNumber, // 131051, 131052
  FailedPhoneNotOnWhatsApp, // 131021, 133004

  // Template related failures
  FailedTemplateNotApproved, // 131026
  FailedTemplateParameterMismatch, // 132000, 132001
  FailedTemplateNotFound, // 132007
  FailedTemplatePaused, // 132015
  FailedTemplateDisabled, // 132016

  // Account related failures
  FailedAccountSuspended, // 131031
  FailedAccountNotVerified, // 131042
  FailedAccountRestricted, // 131045

  // Media related failures
  FailedMediaTooLarge, // 131053
  FailedMediaTypeNotSupported, // 131054

  // Session/Window related failures
  FailedSessionExpired, // 131047 (24h window expired, re-engagement required)

  // Rate limit related failures
  FailedRateLimitSpam, // 131048 (spam rate limit, requires review)
  FailedRateLimitPair, // 131056 (too many messages to same number)
}

export enum TemplateStatus {
  Pending = 0,
  Approved,
  Rejected,
  Disabled,
  Paused,
  LimitExceeded,
  Archived,
}

export enum TemplateCategories {
  Marketing = 1,
  Utility,
  Authentication,
  Service,
}

export enum TemplateTypes {
  Custom = 1,
  Flows,
  Catalog,
  Otp,
  EInvitations,
}
export enum CampaignTypes {
  Campaign = 0,
  Occasion,
}

export enum NotificationState {
  Unread = 0,
  Read = 1,
}

export enum BackgroundJobStatus {
  Processing = 0,
  Completed,
  Failed,
}

export enum TaskItemStatus {
  ToDo = 0,
  Doing = 1,
  Done = 2,
}

export enum EntityType {
  Chat = 1,
}

export enum TemplateScheduleStatus {
  None = 0,
  Scheduled = 1,
  Processing = 2,
  Released = 3,
  Failed = 4,
  Cancelled = 5,
}

export enum OutboxSendStatus {
  NotStarted = 0,
  Pending = 1,
  Sent = 2,
  Failed = 3,
  Scheduled = 4,
  Cancelled = 5,
}
