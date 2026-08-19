import http from '../httpService'

class NotificationService {
  public async getAll(input: any): Promise<any> {
    let result = await http.get('api/app/notification', {
      params: {
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
        userId: input.userId,
      },
    })
    return result.data
  }

  public async get(id: string): Promise<any> {
    let result = await http.get(`api/app/notification/${id}`)
    return result.data
  }

  public async makeAllRead(): Promise<any> {
    let result = await http.post('api/app/notification/make-all-read')
    return result.data
  }
}

const notificationServiceInstance = new NotificationService()
export default notificationServiceInstance
