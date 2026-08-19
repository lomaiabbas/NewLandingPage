import http from '../httpService'
import { ClientDto } from './dto'

export * from './dto'

class LandingPageService {
  private readonly baseUrl = 'api/app/landing-page'

  /**
   * Fetches the list of clients for the landing page.
   */
  public async getClients(lang?: string): Promise<ClientDto[]> {
    const url = lang ? `${this.baseUrl}/landing-page-companies?culture=${lang}` : `${this.baseUrl}/landing-page-companies`
    const result = await http.get(url)
    return result.data
  }
}

const landingPageServiceInstance = new LandingPageService()
export default landingPageServiceInstance
