import http from '../httpService'

async function fetchWithTimeout(url: string, options = {}, timeout = 30000) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(id)
    return response
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out')
    }
    throw error
  }
}

class TenantService {
  public async getTenantByNameVerified(name: string): Promise<any> {
    let result = await fetchWithTimeout(
      `${process.env.NEXT_PUBLIC_API_URL}/api/abp/multi-tenancy/tenants/by-name-verified/${name}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
      45000
    )
    return result
  }
  public async sendOTP(phoneNumber: string, countryCode: string): Promise<any> {
    let result = await http.post('api/app/application-requests-for-manager/send-otp', {
      phoneNumber,
      countryCode,
    })
    return result.data
  }
}

const tenantServiceInstance = new TenantService()
export default tenantServiceInstance
