import http from '../httpService'

import {
  DailyConnectTemplateDetailsDto,
  DailyConnectTemplateParamsDto,
  InvitationMessagesDetailsDto,
  InvitationMessagesParamsDto,
  InvitationQrMessagesDetailsDto,
  InvitationQrMessagesParamsDto,
  UpdateWhatsAppSettingRequest,
  WhatsAppSettingDto,
} from './dto'

class SettingsService {
  public async get(): Promise<WhatsAppSettingDto> {
    let result = await http.get('api/settings/WhatsApp')
    return result.data
  }

  public async update(input: UpdateWhatsAppSettingRequest): Promise<any> {
    let result = await http.post('api/settings/WhatsApp', input)
    return result.data
  }

  public async getDailyConnectTemplate(): Promise<DailyConnectTemplateDetailsDto> {
    let result = await http.get(`api/settings/WhatsApp/DailyConnectTemplate`)
    return result.data
  }

  public async updateDailyConnectTemplate(
    input: DailyConnectTemplateParamsDto
  ): Promise<DailyConnectTemplateDetailsDto> {
    let result = await http.post(`api/settings/WhatsApp/DailyConnectTemplate`, input)
    return result.data
  }

  public async getDailyConnectTemplateForUser(): Promise<DailyConnectTemplateDetailsDto> {
    let result = await http.get(`api/settings/WhatsApp/DailyConnectTemplateForUser`)
    return result.data
  }

  public async updateDailyConnectTemplateForUser(
    input: DailyConnectTemplateParamsDto
  ): Promise<DailyConnectTemplateDetailsDto> {
    let result = await http.post(`api/settings/WhatsApp/DailyConnectTemplateForUser`, input)
    return result.data
  }

  public async getInvitationMessages(): Promise<InvitationMessagesDetailsDto> {
    let result = await http.get(`/api/settings/WhatsApp/InvitationMessages`)
    return result.data
  }

  public async updateInvitationMessages(
    input: InvitationMessagesParamsDto
  ): Promise<InvitationMessagesDetailsDto> {
    let result = await http.post(`/api/settings/WhatsApp/InvitationMessages`, input)
    return result.data
  }

  public async getInvitationQrMessages(): Promise<InvitationQrMessagesDetailsDto> {
    let result = await http.get(`/api/settings/WhatsApp/InvitationQrMessages`)
    return result.data
  }

  public async updateInvitationQrMessages(
    input: InvitationQrMessagesParamsDto
  ): Promise<InvitationQrMessagesDetailsDto> {
    let result = await http.post(`/api/settings/WhatsApp/InvitationQrMessages`, input)
    return result.data
  }

  public async updateLastSeenTourVersion(lastSeenVersion: number): Promise<any> {
    let result = await http.post(`/api/settings/SystemTour/LastSeenVersion`, {
      lastSeenVersion,
    })
    return result.data
  }
}

const settingsServiceInstance = new SettingsService()
export default settingsServiceInstance
