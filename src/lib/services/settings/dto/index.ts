export interface UpdateWhatsAppSettingRequest {
  marketingTemplateConversationsCost: string
  serviceTemplateConversationsCost: string
  utilityTemplateConversationsCost: string
  authenticationTemplateConversationsCost: string
  conversationCostRange0To50000: string
  conversationCostRange50001To100000: string
  conversationCostRange100001To250000: string
  conversationCostRange250001To500000: string
  activeUserCost: string
  vat: string
}

export interface WhatsAppSettingDto {
  marketingTemplateConversationsCost: string
  serviceTemplateConversationsCost: string
  utilityTemplateConversationsCost: string
  authenticationTemplateConversationsCost: string
  marketingTemplateConversationsWhatsAppCost: string
  serviceTemplateConversationWhatsAppsCost: string
  utilityTemplateConversationsWhatsAppCost: string
  authenticationTemplateConversationsWhatsAppCost: string
  conversationCostRange0To50000: string
  conversationCostRange50001To100000: string
  conversationCostRange100001To250000: string
  conversationCostRange250001To500000: string
  activeUserCost: string
  vat: string
}

export interface DailyConnectTemplateParamsDto {
  name: string
  language: string
}

export interface DailyConnectTemplateDetailsDto {
  name: string
  language: string
}

export interface InvitationMessagesParamsDto {
  acceptMessageAr: string
  acceptMessageEn: string
  rejectMessageAr: string
  rejectMessageEn: string
}

export interface InvitationMessagesDetailsDto {
  acceptMessageAr: string
  acceptMessageEn: string
  rejectMessageAr: string
  rejectMessageEn: string
}

export interface InvitationQrMessagesParamsDto {
  qrCodeMessageAr: string
  qrCodeMessageEn: string
  qrCodeMessageWithCompanionsAr: string
  qrCodeMessageWithCompanionsEn: string
}

export interface InvitationQrMessagesDetailsDto {
  defaultQrCodeMessageAr: string
  defaultQrCodeMessageEn: string
  defaultQrCodeMessageWithCompanionsAr: string
  defaultQrCodeMessageWithCompanionsEn: string
  qrCodeMessageAr: string
  qrCodeMessageEn: string
  qrCodeMessageWithCompanionsAr: string
  qrCodeMessageWithCompanionsEn: string
}
