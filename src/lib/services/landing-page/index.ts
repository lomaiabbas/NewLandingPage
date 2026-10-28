import { ClientDto } from './dto'

export * from './dto'

/* The clients list goes through Next's fetch cache rather than the shared axios client. The landing
   page is rendered on the server and waited on this call, so whenever the API was slow or down
   every visitor got a blank page for axios's 40s timeout, and then no clients section at all.
   Cached, the page renders at once from the last list the API returned; the list is refreshed in
   the background at most every 5 minutes, and a failed refresh keeps the previous one. */
const CLIENTS_REVALIDATE_S = 300
// only waited on when there is no cached list yet (the first request after a deploy)
const CLIENTS_TIMEOUT_MS = 8000

class LandingPageService {
  private readonly baseUrl = 'api/app/landing-page'

  /**
   * Fetches the list of clients for the landing page.
   */
  public async getClients(lang?: string): Promise<ClientDto[]> {
    const url = lang ? `${this.baseUrl}/landing-page-companies?culture=${lang}` : `${this.baseUrl}/landing-page-companies`
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, {
      next: { revalidate: CLIENTS_REVALIDATE_S },
      signal: AbortSignal.timeout(CLIENTS_TIMEOUT_MS),
    })
    if (!res.ok) throw new Error(`Clients request failed with ${res.status}`)
    return res.json()
  }
}

const landingPageServiceInstance = new LandingPageService()
export default landingPageServiceInstance
