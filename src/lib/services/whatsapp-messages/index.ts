import http from '../httpService'

class WhatsAppMessagesService {
  public async sendTextMessage(chatId: number, message: string): Promise<any> {
    let result = await http.post('api/app/whats-app-messages/send-message', { chatId, message })
    return result.data
  }

  public async getByName(templateName: string): Promise<any> {
    let result = await http.get('api/app/whats-app-messages/template-by-name', {
      params: { templateName },
    })
    return result.data
  }

  public async sendMessage(payload: any): Promise<any> {
    let result = await http.post('api/app/whats-app-messages/send-text-message', payload)
    return result.data
  }

  public async getTemplate(id: string): Promise<any> {
    let result = await http.get(`api/app/whats-app-messages/${id}/template`)
    return result.data
  }

  public async sendMultiChatTemplateMessage(payload: any): Promise<any> {
    let result = await http.post(
      'api/app/whats-app-messages/send-multi-chat-template-message',
      payload
    )
    return result.data
  }

  public async sendChatTemplateMessage(input: any): Promise<any> {
    let result = await http.post('api/app/whats-app-messages/send-chat-template-message', input)
    return result.data
  }

  public async sendDailyTemplateMessage(input: any): Promise<any> {
    let result = await http.post('api/app/whats-app-messages/send-daily-template-message', input)
    return result.data
  }

  public async getJobStatus(jobId: string): Promise<any> {
    let result = await http.get(`api/app/whats-app-messages/job-status/${jobId}`)
    return result.data
  }
}

const whatsAppMessagesServiceInstance = new WhatsAppMessagesService()
export default whatsAppMessagesServiceInstance
