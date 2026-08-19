import http from '../httpService'

class GatekeeperService {
  public async getStats(input: any): Promise<any> {
    let result = await http.get(`api/app/e-invitation-attendees-for-gate-keeper/stats`, {
      params: input,
      skipAuth: true,
      showErrorAsMessage: true,
    } as any)
    return result.data
  }
  public async signIn(input: any): Promise<any> {
    let result = await http.post('api/app/e-invitation-attendees-for-gate-keeper/sign-in', input, {
      skipAuth: true,
    } as any)
    return result.data
  }

  public async scanQrCode(input: any): Promise<any> {
    let result = await http.post(
      'api/app/e-invitation-attendees-for-gate-keeper/scan-qr-code',
      input,
      {
        skipAuth: true,
        showErrorAsMessage: true,
        errorDisplayDuration: input?.errorDisplayDuration,
      } as any
    )
    return result.data
  }
}

const gatekeeperServiceInstance = new GatekeeperService()
export default gatekeeperServiceInstance
